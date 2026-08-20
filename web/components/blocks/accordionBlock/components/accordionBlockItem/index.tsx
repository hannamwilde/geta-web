"use client";

import Icon from "@/components/ui/icon";
import { normalizeHref } from "@/lib/href";
import { resolveHref } from "@/lib/resolveHref";
import { useContactModal } from "@/context/ContactModalContext";
import styles from "./styles.module.scss";

type PageRef = { slug?: { current?: string } } | null;

export type AccordionItem = {
  _key: string;
  question?: string;
  answer?: string;
  cta?: {
    label?: string;
    action?: string;
    href?: string;
    linkType?: string;
    pageRef?: PageRef;
  } | null;
};

type Props = {
  item: AccordionItem;
  number: number;
  showNumber: boolean;
  toggleIcon: "plusMinus" | "chevron";
  isOpen: boolean;
  onToggle: () => void;
  headingLevel: "h2" | "h3";
};

export default function AccordionBlockItem({
  item,
  number,
  showNumber,
  toggleIcon,
  isOpen,
  onToggle,
  headingLevel,
}: Props) {
  const { open } = useContactModal();
  const Heading = headingLevel;
  const panelId = `accordion-panel-${item._key}`;
  const buttonId = `accordion-button-${item._key}`;

  const cta = item.cta;
  const ctaHref = cta
    ? normalizeHref(resolveHref(cta.linkType, cta.href, cta.pageRef))
    : "";
  const ctaLabel = cta?.label?.trim();
  const modalAction =
    cta?.action === "openContact" || cta?.action === "openBook"
      ? cta.action
      : null;
  const showCta = Boolean(
    ctaLabel && (modalAction || (ctaHref && ctaHref !== "/")),
  );

  return (
    <div className={styles.item} data-open={isOpen} data-numbered={showNumber}>
      <Heading className={styles.heading}>
        <button
          type="button"
          id={buttonId}
          className={styles.trigger}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
        >
          {showNumber && <span className={styles.number}>{number}</span>}
          <span className={styles.question}>{item.question}</span>
          <span className={styles.toggle} aria-hidden>
            {toggleIcon === "chevron" ? (
              <Icon name="chevron-down" size={22} stroke={2} />
            ) : (
              <Icon name={isOpen ? "minus" : "plus"} size={22} stroke={2} />
            )}
          </span>
        </button>
      </Heading>
      <div
        id={panelId}
        className={styles.panel}
        role="region"
        aria-labelledby={buttonId}
        inert={!isOpen}
      >
        <div className={styles.panelInner}>
          {item.answer && <p className={styles.answer}>{item.answer}</p>}
          {showCta &&
            (modalAction ? (
              <button
                type="button"
                className={styles.cta}
                onClick={() => open(modalAction === "openBook" ? "book" : "contact")}
              >
                {ctaLabel}
                <Icon name="arrow-right" size={16} stroke={2} />
              </button>
            ) : (
              <a href={ctaHref} className={styles.cta}>
                {ctaLabel}
                <Icon name="arrow-right" size={16} stroke={2} />
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}
