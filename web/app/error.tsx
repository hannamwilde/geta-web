"use client";

import { useEffect } from "react";
import Link from "next/link";
import MessagePage from "@/components/layout/messagePage";
import { getT } from "@/lib/translations";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = getT().errorPages;

  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <MessagePage title={t.errorTitle} body={t.errorBody}>
      <button type="button" onClick={reset} className="btn btn-on-dark">
        {t.errorRetry}
      </button>
      <Link href="/" className="btn btn-outline-dark">
        {t.notFoundCta}
      </Link>
    </MessagePage>
  );
}
