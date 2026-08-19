"use client";

import { resolveHref } from "@/lib/resolveHref";
import { normalizeHref } from "@/lib/href";
import { useContactModal } from "@/context/ContactModalContext";

type PageRef = { slug?: { current?: string } } | null;
export type CTA = {
  label?: string;
  action?: string;
  href?: string;
  linkType?: string;
  pageRef?: PageRef;
};

type Props = {
  cta?: CTA | null;
  className: string;
};

export default function ImageSliderCta({ cta, className }: Props) {
  const { open } = useContactModal();

  if (!cta?.label?.trim()) return null;

  if (cta.action === "openContact")
    return (
      <button className={`btn ${className}`} onClick={() => open("contact")}>
        {cta.label}
      </button>
    );
  if (cta.action === "openBook")
    return (
      <button className={`btn ${className}`} onClick={() => open("book")}>
        {cta.label}
      </button>
    );

  const href = normalizeHref(resolveHref(cta.linkType, cta.href, cta.pageRef));
  if (href && href !== "/")
    return (
      <a href={href} className={`btn ${className}`}>
        {cta.label}
      </a>
    );
  return null;
}
