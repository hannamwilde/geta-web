import { NextResponse } from "next/server";
import { client } from "@/sanity/client";
import { contactRecipientQuery } from "@/sanity/queries";

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
const META_FIELDS = new Set(["modalType"]);

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
  const body = (await req.json()) as Record<string, unknown>;
  const { name, email, message, modalType } = body as Record<string, string>;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
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
      reply_to: { email, name },
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
