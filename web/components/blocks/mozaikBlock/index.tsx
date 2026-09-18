"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";
import { urlFor } from "@/sanity/client";
import Icon from "@/components/ui/icon";
import styles from "./styles.module.scss";
import { resolveBorder, type Border } from "@/lib/border";
import { resolveHref } from "@/lib/resolveHref";
import { normalizeHref } from "@/lib/href";
import { useContactModal } from "@/context/ContactModalContext";

type Item = {
  _key: string;
  label: string;
};

type Group = {
  label?: string;
  items?: Item[];
};

type CTA = {
  label?: string;
  action?: string;
  href?: string;
  linkType?: string;
  pageRef?: { slug?: { current?: string } } | null;
};

type Props = {
  block: {
    border?: Border;
    headline?: string;
    subheadline?: string;
    backgroundImage?: { asset: unknown; alt?: string };
    markImage?: { asset: unknown };
    wordImage?: { asset: unknown };
    hubNameImage?: { asset: unknown };
    topGroup?: Group;
    leftGroup?: Group;
    rightGroup?: Group;
    bottomGroup?: Group;
    cta?: CTA;
  };
};

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

// Design-space geometry. The diagram is authored at a fixed 1200×540 and scaled
// to fit the stage, so every number below is design px — never viewport px.
const W = 1200,
  H = 540;
const CX = 600,
  CY = 270,
  R = 108;
// Side columns stack on a fixed pitch, centred on the hub.
const ROW_STEP = 76;
const COL_X_L = 300,
  COL_X_R = 900;
// Connector anchors sit just inside the card edge so the line tucks under it.
const ANCHOR_X_L = 305,
  ANCHOR_X_R = 895;
const TOP_Y = 40,
  TOP_ANCHOR_Y = 68;
const BOTTOM_Y = 500,
  BOTTOM_ANCHOR_Y = 472;
// Top/bottom rows are single-node in the reference design; extra nodes fan out.
const AXIS_STEP = 300;

type GroupKey = "top" | "left" | "right" | "bottom";

const GROUP_COLOR: Record<GroupKey, string> = {
  top: "#83A494",
  left: "#6386A4",
  right: "#DB7550",
  bottom: "#A87897",
};

/** Lets us set the `--c` custom property without widening every style object. */
type NodeStyle = React.CSSProperties & { "--c": string };

/**
 * Editors write the headline as plain text; every occurrence of "Mozaik" is swapped
 * for the wordmark image. Splitting on a capture group keeps the surrounding text
 * intact, and the alt carries the original casing so the line still reads correctly
 * to screen readers.
 */
const MOZAIK_WORD = /(mozaik)/i;
const HEADLINE_FALLBACK = "Mozaik är här, AI-driven digital handel";
const CTA_LABEL_FALLBACK = "Upptäck Mozaik";
const CTA_HREF_FALLBACK = "/losningar/mozaik";

type Node = {
  item: Item;
  group: GroupKey;
  x: number;
  y: number;
  anchorX: number;
  anchorY: number;
  slot: number;
};

/** Centres `n` positions on `center`, stepping by `step`. */
const spreadAxis = (center: number, i: number, n: number, step: number) =>
  center + (i - (n - 1) / 2) * step;

export default function MozaikBlock({ block }: Props) {
  const { open } = useContactModal();
  const trackRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [fit, setFit] = useState(0.8);

  const markSrc = block.markImage?.asset
    ? urlFor(block.markImage).height(160).url()
    : "/assets/mozaik-mark.png";
  const wordSrc = block.wordImage?.asset
    ? urlFor(block.wordImage).height(80).url()
    : "/assets/mozaik-word.png";
  const hubNameSrc = block.hubNameImage?.asset
    ? urlFor(block.hubNameImage).height(80).url()
    : "/assets/mozaik-word.png";
  const photoSrc = block.backgroundImage?.asset
    ? urlFor(block.backgroundImage).width(1800).url()
    : null;

  useEffect(() => {
    let ticking = false;
    const compute = () => {
      ticking = false;
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = clamp(-rect.top, 0, total);
      setP(total > 0 ? scrolled / total : 0);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(compute);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    compute();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // The diagram is drawn at design size and scaled down to whatever the stage
  // leaves it, so the layout never reflows — it only gets smaller.
  useEffect(() => {
    const el = boxRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      setFit(Math.min(r.width / W, r.height / H));
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

  const groups: { key: GroupKey; group: Group }[] = [
    { key: "top", group: block.topGroup || {} },
    { key: "left", group: block.leftGroup || {} },
    { key: "right", group: block.rightGroup || {} },
    { key: "bottom", group: block.bottomGroup || {} },
  ];

  // Nodes are laid out in reveal order: storefront, then each side column top to
  // bottom, then the add-ons row — the same order the reference design builds in.
  const nodes: Node[] = [];
  for (const { key, group } of groups) {
    const items = group.items || [];
    items.forEach((item, i) => {
      const slot = nodes.length;
      if (key === "left" || key === "right") {
        const isLeft = key === "left";
        const y = spreadAxis(CY, i, items.length, ROW_STEP);
        nodes.push({
          item,
          group: key,
          x: isLeft ? COL_X_L : COL_X_R,
          y,
          anchorX: isLeft ? ANCHOR_X_L : ANCHOR_X_R,
          anchorY: y,
          slot,
        });
      } else {
        const x = spreadAxis(CX, i, items.length, AXIS_STEP);
        const isTop = key === "top";
        nodes.push({
          item,
          group: key,
          x,
          y: isTop ? TOP_Y : BOTTOM_Y,
          anchorX: x,
          anchorY: isTop ? TOP_ANCHOR_Y : BOTTOM_ANCHOR_Y,
          slot,
        });
      }
    });
  }

  const revealAt = (slot: number) =>
    easeOut(clamp((p - (0.1 + slot * 0.042)) / 0.14, 0, 1));

  // Zoom-out: starts pushed in on the hub, settles to fit as the build completes.
  const build = easeInOut(clamp(p / 0.7, 0, 1));
  const zoom = 1.3 - build * 0.3;
  const drift = (1 - build) * 26;
  const glowScale = 1 + p * 0.5;

  // Outro — the diagram dissolves outward while the CTA scales up out of the hub.
  const q = easeInOut(clamp((p - 0.86) / 0.14, 0, 1));
  const outroExpand = 1 + q * 0.55;
  const outroFade = 1 - clamp(q * 1.35, 0, 1);
  const ctaProg = easeOut(clamp((q - 0.25) / 0.6, 0, 1));
  const hubOpacity =
    clamp((p - 0.02) * 12, 0, 1) * (1 - clamp(ctaProg * 1.25, 0, 1));
  const hubShrink = 1 - ctaProg * 0.3;

  const spread = (x: number, y: number) => ({
    x: CX + (x - CX) * outroExpand,
    y: CY + (y - CY) * outroExpand,
  });

  const pathFor = (n: Node) => {
    const a = spread(n.anchorX, n.anchorY);
    if (n.group === "left") {
      const b = spread(CX - R - 6, CY);
      return `M${a.x},${a.y} C${a.x + 140},${a.y} ${b.x - 120},${b.y} ${b.x},${b.y}`;
    }
    if (n.group === "right") {
      const b = spread(CX + R + 6, CY);
      return `M${a.x},${a.y} C${a.x - 140},${a.y} ${b.x + 120},${b.y} ${b.x},${b.y}`;
    }
    if (n.group === "top") {
      const b = spread(CX, CY - R - 6);
      return `M${a.x},${a.y} C${a.x},${a.y + 50} ${b.x},${b.y - 50} ${b.x},${b.y}`;
    }
    const b = spread(CX, CY + R + 6);
    return `M${a.x},${a.y} C${a.x},${a.y - 50} ${b.x},${b.y + 50} ${b.x},${b.y}`;
  };

  const cta = block.cta;
  const ctaLabel = cta?.label || CTA_LABEL_FALLBACK;
  const ctaAction = cta?.action;
  const ctaStyle: React.CSSProperties = {
    opacity: ctaProg,
    pointerEvents: ctaProg > 0.6 ? "auto" : "none",
    transform: `translate(-50%, -50%) scale(${0.5 + ctaProg * 0.5})`,
  };
  const ctaInner = (
    <>
      <span>{ctaLabel}</span>
      <Icon name="arrow-right" size={17} stroke={2} />
    </>
  );

  return (
    <section
      className={styles.mz}
      id="mozaik"
      style={resolveBorder(block.border)}
    >
      {/* 300vh scroll track (desktop) */}
      <div className={styles.track} ref={trackRef}>
        <div className={styles.stage}>
          {/* Background */}
          <div className={styles.bg} aria-hidden>
            {photoSrc ? (
              <Image
                className={styles.photo}
                src={photoSrc}
                alt=""
                width={1800}
                height={1200}
                sizes="100vw"
                priority
              />
            ) : (
              <div className={styles.fallback} />
            )}
            <div
              className={styles.glow}
              style={{
                transform: `translate(-50%, -50%) scale(${glowScale})`,
                opacity: 0.4 + p * 0.35,
              }}
            />
          </div>

          {/* Header — drifts up as scroll begins */}
          <div
            className={styles.header}
            style={{ transform: `translateY(${-clamp(p * 4, 0, 1) * 10}px)` }}
          >
            <h2 className={styles.headerTitle}>
              {(block.headline || HEADLINE_FALLBACK)
                .split(MOZAIK_WORD)
                .filter(Boolean)
                .map((part, i) =>
                  part.toLowerCase() === "mozaik" ? (
                    <Image
                      key={i}
                      className={styles.word}
                      src={wordSrc}
                      alt={part}
                      width={240}
                      height={80}
                    />
                  ) : (
                    <Fragment key={i}>{part}</Fragment>
                  ),
                )}
            </h2>
            {block.subheadline && (
              <p className={styles.headerText}>{block.subheadline}</p>
            )}
          </div>

          {/* Diagram area */}
          <div className={styles.inner}>
            <div className={styles.diagramCol} ref={boxRef}>
              {/* Mobile stack — grouped lists, hidden on desktop */}
              <div className={styles.mobileGrid}>
                {groups.map(({ key, group }) =>
                  group.items?.length ? (
                    <div
                      key={key}
                      className={styles.mgroup}
                      style={{ "--c": GROUP_COLOR[key] } as NodeStyle}
                    >
                      {/* A one-node arm often repeats its own name as the group
                          label — print the heading only when it adds something. */}
                      {group.label &&
                        !(
                          group.items.length === 1 &&
                          group.items[0].label?.toLowerCase() ===
                            group.label.toLowerCase()
                        ) && (
                          <div className={styles.mgroupLabel}>
                            {group.label}
                          </div>
                        )}
                      {group.items.map((item) => (
                        <div
                          key={item._key}
                          className={`${styles.card} ${styles.cardStatic} ${styles.cardOn}`}
                        >
                          <span className={styles.cardTitle}>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  ) : null,
                )}
              </div>

              {/* Desktop hub-and-spoke diagram */}
              <div
                className={styles.diagram}
                style={{
                  width: `${W}px`,
                  height: `${H}px`,
                  transform: `translate(-50%, -50%) scale(${fit * zoom}) translateY(${drift}px)`,
                }}
              >
                <svg
                  className={styles.links}
                  viewBox={`0 0 ${W} ${H}`}
                  aria-hidden
                >
                  {nodes.map((n) => {
                    const r = revealAt(n.slot);
                    return (
                      <path
                        key={n.item._key}
                        className={styles.link}
                        pathLength="1"
                        d={pathFor(n)}
                        style={
                          {
                            "--c": GROUP_COLOR[n.group],
                            opacity: r * 0.85 * outroFade,
                            strokeDasharray: 1,
                            strokeDashoffset: 1 - r,
                          } as NodeStyle
                        }
                      />
                    );
                  })}
                </svg>

                {/* Hub */}
                <div
                  className={styles.hub}
                  style={{
                    left: `${CX}px`,
                    top: `${CY}px`,
                    width: `${R * 2}px`,
                    height: `${R * 2}px`,
                    opacity: hubOpacity,
                    transform: `translate(-50%, -50%) scale(${hubShrink})`,
                  }}
                >
                  <div className={styles.hubGlow} />
                  <div className={styles.hubDisc}>
                    <Image
                      className={styles.mark}
                      src={markSrc}
                      alt=""
                      aria-hidden
                      width={116}
                      height={116}
                    />
                    <Image
                      className={styles.hubName}
                      src={hubNameSrc}
                      alt="Mozaik"
                      width={264}
                      height={88}
                    />
                  </div>
                </div>

                {/* Nodes */}
                {nodes.map((n) => {
                  const r = revealAt(n.slot);
                  const pos = spread(n.x, n.y);
                  const tx =
                    n.group === "left"
                      ? "-100%"
                      : n.group === "right"
                        ? "0%"
                        : "-50%";
                  const origin =
                    n.group === "left"
                      ? "right center"
                      : n.group === "right"
                        ? "left center"
                        : "center";
                  return (
                    <div
                      key={n.item._key}
                      className={`${styles.card} ${r > 0.5 ? styles.cardOn : ""}`}
                      style={
                        {
                          "--c": GROUP_COLOR[n.group],
                          left: `${pos.x}px`,
                          top: `${pos.y}px`,
                          opacity: clamp(r * 1.6, 0, 1) * outroFade,
                          transform: `translate(${tx}, -50%) scale(${0.86 + r * 0.14})`,
                          transformOrigin: origin,
                        } as NodeStyle
                      }
                    >
                      <span className={styles.cardTitle}>{n.item.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* CTA — fades in at end of scroll */}
              {ctaAction === "openContact" || ctaAction === "openBook" ? (
                <button
                  type="button"
                  className={styles.cta}
                  style={ctaStyle}
                  onClick={() =>
                    open(ctaAction === "openBook" ? "book" : "contact")
                  }
                >
                  {ctaInner}
                </button>
              ) : (
                <a
                  className={styles.cta}
                  href={normalizeHref(
                    resolveHref(cta?.linkType, cta?.href, cta?.pageRef) ||
                      CTA_HREF_FALLBACK,
                  )}
                  style={ctaStyle}
                >
                  {ctaInner}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
