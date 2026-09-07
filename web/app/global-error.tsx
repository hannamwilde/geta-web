"use client";

import { useEffect } from "react";
import { getT } from "@/lib/translations";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = getT().errorPages;

  useEffect(() => {
    console.error("[global error]", error);
  }, [error]);

  return (
    <html lang="sv">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          background: "#02423f",
          color: "#ffffff",
          fontFamily:
            'Montserrat, system-ui, -apple-system, "Segoe UI", sans-serif',
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "520px" }}>
          <h1
            style={{
              margin: "0 0 16px",
              fontSize: "32px",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
            }}
          >
            {t.errorTitle}
          </h1>
          <p
            style={{
              margin: "0 0 32px",
              fontSize: "17px",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.78)",
            }}
          >
            {t.errorBody}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              font: "inherit",
              fontWeight: 600,
              fontSize: "15px",
              padding: "14px 24px",
              borderRadius: "999px",
              border: 0,
              cursor: "pointer",
              background: "#ffffff",
              color: "#151515",
            }}
          >
            {t.errorRetry}
          </button>
        </div>
      </body>
    </html>
  );
}
