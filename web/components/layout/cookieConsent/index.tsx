"use client";

import { useEffect, useRef } from "react";
import { useCookieConsent } from "@/context/CookieConsentContext";
import type { Translations } from "@/lib/translations";
import { normalizeHref } from "@/lib/href";
import styles from "./styles.module.scss";

export default function CookieConsent({
  t,
}: {
  t: Translations["cookieConsent"];
}) {
  const { consent, ready, accept, reject } = useCookieConsent();
  const bannerRef = useRef<HTMLDivElement>(null);

  const show = ready && !consent;

  useEffect(() => {
    if (show) bannerRef.current?.focus();
  }, [show]);

  if (!show) return null;

  return (
    <div
      ref={bannerRef}
      className={styles.banner}
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-body"
      tabIndex={-1}
    >
      <div className={styles.text}>
        <p className={styles.title} id="cookie-consent-title">
          {t.title}
        </p>
        <p className={styles.body} id="cookie-consent-body">
          {t.body}
          {t.policyHref && (
            <>
              {" "}
              <a
                className={styles.policyLink}
                href={normalizeHref(t.policyHref)}
              >
                {t.policyLabel}
              </a>
            </>
          )}
        </p>
      </div>

      <div className={styles.actions}>
        <button className={styles.btn} type="button" onClick={reject}>
          {t.reject}
        </button>
        <button className={styles.btn} type="button" onClick={accept}>
          {t.accept}
        </button>
      </div>
    </div>
  );
}
