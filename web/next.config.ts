import type { NextConfig } from "next";

const SANITY_CDN = "https://cdn.sanity.io";
const GOOGLE_CALENDAR = "https://calendar.google.com";
const ENFORCE_CSP = false;

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  `img-src 'self' data: blob: ${SANITY_CDN}`,
  `media-src 'self' ${SANITY_CDN}`,
  `connect-src 'self' ${SANITY_CDN}`,
  `frame-src ${GOOGLE_CALENDAR}`,
  // Browsers ignore this one in a report-only policy and log an error for it,
  // so it only ships once the policy is actually enforced.
  ...(ENFORCE_CSP ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: ENFORCE_CSP
      ? "Content-Security-Policy"
      : "Content-Security-Policy-Report-Only",
    value: csp,
  },
];

const nextConfig: NextConfig = {
  // The repo root and studio-geta-web each carry their own package-lock, so
  // Next's root detection walks up and guesses the monorepo root. This app is
  // self-contained, so pin it here — otherwise module resolution and file
  // tracing are scoped to the wrong directory.
  turbopack: { root: __dirname },
  images: {
    // Sanity's CDN does the resizing; see lib/sanityImageLoader.ts.
    loader: "custom",
    loaderFile: "./lib/sanityImageLoader.ts",
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
