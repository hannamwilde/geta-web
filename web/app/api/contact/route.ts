import { NextResponse } from "next/server";
import { client } from "@/sanity/client";
import { contactRecipientQuery } from "@/sanity/queries";
import { HONEYPOT_FIELD } from "@/lib/contactForm";

/** Labels for the fields the modal submits. Anything not listed still gets
 *  included in the email under its raw key, so a new form field can't go
 *  missing just because this map wasn't updated. */
const FIELD_LABELS: Record<string, string> = {
  name: "Namn",
  email: "E-post",
  company: "Företag",
  topic: "Ämne",
  message: "Meddelande",
};

/** Submitted keys that describe the request rather than being user input. */
const META_FIELDS = new Set(["modalType", HONEYPOT_FIELD]);

/** Longest accepted value per field. Anything not listed falls back to SHORT. */
const MAX_LENGTHS: Record<string, number> = {
  name: 120,
  email: 200,
  company: 160,
  topic: 120,
  message: 5000,
};
const MAX_LENGTH_FALLBACK = 500;

/** Guards against a single submission carrying a huge number of keys. */
const MAX_FIELDS = 25;

/**
 * Deliberately loose — the aim is to reject obvious junk before it reaches
 * SendGrid's `reply_to`, not to adjudicate what a valid address looks like.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Per-IP sliding window.
 *
 * This lives in module memory, so it only holds for one server instance and
 * resets on redeploy. On a single long-lived Node server that is a real limit;
 * on serverless it is a speed bump across however many instances are warm.
 * Move to a shared store (Upstash, Redis) if the form is ever seriously
 * targeted — the honeypot below is the load-bearing defence.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 10_000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  // Left-most entry is the original client; the rest are proxies.
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function labelFor(key: string): string {
  return FIELD_LABELS[key] ?? key;
}

/** Every non-empty value the visitor submitted, in a stable order: known
 *  fields first in form order, then anything unexpected. */
function collectEntries(body: Record<string, unknown>): [string, string][] {
  const known = Object.keys(FIELD_LABELS);
  const keys = [
    ...known.filter((k) => k in body),
    ...Object.keys(body).filter(
      (k) => !known.includes(k) && !META_FIELDS.has(k),
    ),
  ];
  return keys
    .map((key): [string, string] => [key, String(body[key] ?? "").trim()])
    .filter(([, value]) => value !== "");
}

function renderHtml(entries: [string, string][], modalType: string): string {
  const rows = entries
    .map(
      ([key, value]) => `
        <tr>
          <td style="padding:8px 16px 8px 0;vertical-align:top;color:#5c5c5c;white-space:nowrap">
            ${escapeHtml(labelFor(key))}
          </td>
          <td style="padding:8px 0;vertical-align:top;color:#151515">
            ${escapeHtml(value).replace(/\n/g, "<br>")}
          </td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="sv">
  <body style="margin:0;padding:24px;background:#faf6ec;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
    <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:16px;padding:32px">
      <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#5c5c5c">
        getadigital.com
      </p>
      <h1 style="margin:0 0 24px;font-size:22px;color:#02423f">
        ${escapeHtml(modalType === "book" ? "Ny bokningsförfrågan" : "Nytt meddelande från kontaktformuläret")}
      </h1>
      <table style="border-collapse:collapse;font-size:15px;line-height:1.6">${rows}</table>
    </div>
  </body>
</html>`;
}

function renderText(entries: [string, string][]): string {
  return entries.map(([key, value]) => `${labelFor(key)}: ${value}`).join("\n");
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    const parsed = await req.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("not an object");
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Malformed request" }, { status: 400 });
  }

  if (Object.keys(body).length > MAX_FIELDS) {
    return NextResponse.json({ error: "Too many fields" }, { status: 400 });
  }

  const ip = clientIp(req);

  // Throttle before anything else, so a bot that keeps tripping the decoy below
  // still can't spin the endpoint for free.
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(WINDOW_MS / 1000) } },
    );
  }

  // Answer the bot exactly as we answer a person, so a filled decoy doesn't
  // teach it what tripped the filter. Nothing is sent.
  if (String(body[HONEYPOT_FIELD] ?? "").trim() !== "") {
    console.warn("[contact form] honeypot tripped", { ip });
    return NextResponse.json({ ok: true });
  }

  const { name, email, message, modalType } = body as Record<string, string>;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  for (const [key, value] of Object.entries(body)) {
    if (typeof value !== "string") continue;
    if (value.length > (MAX_LENGTHS[key] ?? MAX_LENGTH_FALLBACK)) {
      return NextResponse.json(
        { error: `Field "${key}" is too long` },
        { status: 400 },
      );
    }
  }

  if (!EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  // no-store: a recipient change in Sanity must take effect on the next submission.
  const to = await client.fetch<string | null>(
    contactRecipientQuery,
    {},
    { cache: "no-store" },
  );

  if (!apiKey || !from || !to) {
    // Surface the misconfiguration in the server log rather than to the visitor.
    console.error("[contact form] not configured", {
      hasApiKey: Boolean(apiKey),
      hasFrom: Boolean(from),
      hasRecipient: Boolean(to),
    });
    return NextResponse.json(
      { error: "Email is not configured" },
      { status: 500 },
    );
  }

  const entries = collectEntries(body);
  const type = typeof modalType === "string" ? modalType : "contact";

  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: from, name: "getadigital.com" },
      // Replying in the mail client goes straight back to the visitor.
      reply_to: { email: email.trim(), name: name.trim() },
      subject: `${type === "book" ? "Bokningsförfrågan" : "Kontaktformulär"} — ${name}`,
      // SendGrid requires the plain-text part before the HTML part.
      content: [
        { type: "text/plain", value: renderText(entries) },
        { type: "text/html", value: renderHtml(entries, type) },
      ],
    }),
  });

  // SendGrid answers a successful send with 202 Accepted.
  if (!res.ok) {
    console.error("[contact form] send failed", res.status, await res.text());
    return NextResponse.json(
      { error: "Could not send message" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
