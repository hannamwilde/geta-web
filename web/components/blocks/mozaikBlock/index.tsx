"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";
import { urlFor } from "@/sanity/client";
import Icon from "@/components/ui/icon";
import styles from "./styles.module.scss";
import { resolveBorder, type Border } from "@/lib/border";

type Component = {
  _key: string;
  label: string;
  description?: string;
  icon?: string;
  logo?: { asset: unknown; alt?: string };
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
    components?: Component[];
  };
};

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

// Reveal order: top first, fan out symmetrically
const FULL_REVEAL_ORDER = [0, 11, 1, 10, 2, 9, 3, 8, 4, 7, 5, 6];

// Stained-glass palette — nodes take a colour in turn, and it drives that node's
// card accent, connector line and endpoint dot via the `--c` custom property.
const GLASS = [
  "#2E9BD6",
  "#2A4FC4",
  "#8B3FBF",
  "#C44FA8",
  "#D32036",
  "#F08A24",
];
const colorOf = (i: number) => GLASS[i % GLASS.length];

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

const CX = 500,
  CY = 500,
  RX = 405,
  RY = 388;

export default function MozaikBlock({ block }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);
  const [p, setP] = useState(0);

  const markSrc = block.markImage?.asset
    ? urlFor(block.markImage).height(104).url()
    : "/assets/mozaik-mark.png";
  const wordSrc = block.wordImage?.asset
    ? urlFor(block.wordImage).height(80).url()
    : "/assets/mozaik-word.png";
  const hubNameSrc = block.hubNameImage?.asset
    ? urlFor(block.hubNameImage).height(60).url()
    : "/assets/mozaik-word.png";
  const photoSrc = block.backgroundImage?.asset
    ? urlFor(block.backgroundImage).width(1800).url()
    : null;
  const nodes = block.components || [];

  useEffect(() => {
    setMounted(true);
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
    window.addEventListener("resize", compute);
    compute();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
    };
  }, []);

  // Mobile cards slide up as they scroll into view. The desktop orbit has its own
  // scroll-driven reveal, so this only ever drives the stacked grid.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>("[data-card]"));
    if (!cards.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(cards.map((_, i) => i));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const hits: number[] = [];
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.unobserve(entry.target);
          hits.push(Number((entry.target as HTMLElement).dataset.card));
        }
        if (hits.length) {
          setRevealed((prev) =>
            prev.concat(hits.filter((h) => !prev.includes(h))),
          );
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [nodes.length]);

  // geometry — ellipse in a 1000×1000 orbit square
  const angleOf = (i: number) =>
    ((-90 + i * (360 / Math.max(nodes.length, 1))) * Math.PI) / 180;
  const nodePos = (i: number) => ({
    x: CX + RX * Math.cos(angleOf(i)),
    y: CY + RY * Math.sin(angleOf(i)),
  });

  const revealOrder = FULL_REVEAL_ORDER.filter((i) => i < nodes.length);
  const revealOf = (i: number) => {
    const pos = revealOrder.indexOf(i);
    if (pos === -1) return 0;
    const start = 0.12 + pos * 0.045;
    return easeOut(clamp((p - start) / 0.16, 0, 1));
  };

  // parallax depth transforms
  const glowScale = 1 + p * 0.5;
  const ringRot = (p - 0.5) * 16;
  const ringScale = 0.9 + p * 0.12;
  const hubScale = 0.92 + clamp(p * 2.2, 0, 1) * 0.08;
  const radiusFactor = 0.94 + easeInOut(clamp(p * 1.15, 0, 1)) * 0.06;

  const introY = -clamp(p * 4, 0, 1) * 10;
  const hubOpacity = clamp((p - 0.05) * 9, 0, 1);

  const radiusAt = (r: number) => radiusFactor * (0.93 + 0.07 * r);

  // outro sequence
  const q = easeInOut(clamp((p - 0.78) / 0.22, 0, 1));
  const outroExpand = 1 + q * 1.9;
  const outroFade = 1 - clamp(q * 1.25, 0, 1);
  const ringExtraScale = 1 + q * 0.95;
  const ringOutro = 1 - clamp(q * 1.3, 0, 1);
  const ctaProg = easeOut(clamp((q - 0.28) / 0.55, 0, 1));
  const hubCoreOpacity = hubOpacity * (1 - clamp(ctaProg * 1.2, 0, 1));
  const hubShrink = 1 - ctaProg * 0.32;

  return (
    <section className={styles.mz} id="mozaik" style={resolveBorder(block.border)}>
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
              <div className={styles.grid} />
            )}
            <div
              className={styles.glow}
              style={
                mounted
                  ? {
                      transform: `translate(-50%, -50%) scale(${glowScale})`,
                      opacity: 0.4 + p * 0.35,
                    }
                  : undefined
              }
            />
          </div>

          {/* Header — fades out as scroll begins */}
          <div
            className={styles.header}
            style={
              mounted ? { transform: `translateY(${introY}px)` } : undefined
            }
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

          {/* Orbit area */}
          <div className={styles.inner}>
            <div className={styles.orbitCol}>
              {/* Mobile static grid — hidden on desktop */}
              <div
                ref={gridRef}
                className={`${styles.mobileGrid}${mounted ? " " + styles.gridArmed : ""}`}
              >
                {nodes.map((n, i) => {
                  const logoUrl = n.logo?.asset
                    ? urlFor(n.logo).width(40).height(40).url()
                    : null;
                  return (
                    <div
                      key={n._key}
                      data-card={i}
                      className={`${styles.card} ${styles.cardStatic} ${styles.cardOn}${revealed.includes(i) ? " " + styles.cardIn : ""}`}
                      style={
                        {
                          "--c": colorOf(i),
                          transitionDelay: `${(i % 2) * 90}ms`,
                        } as NodeStyle
                      }
                    >
                      <div className={styles.cardIcon}>
                        {logoUrl ? (
                          <Image
                            src={logoUrl}
                            alt={n.logo?.alt || n.label}
                            width={40}
                            height={40}
                          />
                        ) : (
                          <Icon name={n.icon || ""} size={20} stroke={1.7} />
                        )}
                      </div>
                      <div className={styles.cardBody}>
                        <div className={styles.cardTitle}>{n.label}</div>
                        {n.description && (
                          <div className={styles.cardBlurb}>
                            {n.description}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop orbit */}
              <div
                className={styles.orbit}
                style={
                  mounted ? { transform: `scale(${ringScale})` } : undefined
                }
              >
                {/* Ellipse rings */}
                <svg
                  className={styles.rings}
                  viewBox="0 0 1000 1000"
                  aria-hidden
                  style={
                    mounted
                      ? {
                          transform: `rotate(${ringRot}deg) scale(${ringExtraScale})`,
                          opacity: ringOutro,
                        }
                      : undefined
                  }
                >
                  <defs>
                    <radialGradient id="mz-ring-grad" cx="50%" cy="50%" r="50%">
                      <stop offset="60%" stopColor="rgba(255,255,255,0)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.06)" />
                    </radialGradient>
                  </defs>
                  <ellipse
                    cx="500"
                    cy="500"
                    rx="405"
                    ry="388"
                    className={styles.ring}
                  />
                  <ellipse
                    cx="500"
                    cy="500"
                    rx="300"
                    ry="288"
                    className={`${styles.ring} ${styles.ringMid}`}
                  />
                  <ellipse
                    cx="500"
                    cy="500"
                    rx="195"
                    ry="188"
                    className={`${styles.ring} ${styles.ringInner}`}
                  />
                </svg>

                {/* Connection lines */}
                <svg
                  className={styles.lines}
                  viewBox="0 0 1000 1000"
                  aria-hidden
                >
                  {mounted &&
                    nodes.map((n, i) => {
                      const r = revealOf(i);
                      if (r <= 0.01) return null;
                      const full = nodePos(i);
                      const f = radiusAt(r) * outroExpand;
                      const x = CX + (full.x - CX) * f;
                      const y = CY + (full.y - CY) * f;
                      return (
                        <line
                          key={n._key}
                          x1={CX}
                          y1={CY}
                          x2={x}
                          y2={y}
                          className={styles.line}
                          pathLength="1"
                          style={
                            {
                              "--c": colorOf(i),
                              strokeDasharray: 1,
                              strokeDashoffset: 1 - r,
                              opacity: r * outroFade,
                            } as NodeStyle
                          }
                        />
                      );
                    })}
                </svg>

                {/* Node dots */}
                <svg
                  className={styles.dots}
                  viewBox="0 0 1000 1000"
                  aria-hidden
                >
                  {mounted &&
                    nodes.map((n, i) => {
                      const r = revealOf(i);
                      if (r <= 0.2) return null;
                      const full = nodePos(i);
                      const f = radiusAt(r) * outroExpand;
                      const x = CX + (full.x - CX) * f;
                      const y = CY + (full.y - CY) * f;
                      return (
                        <circle
                          key={n._key}
                          cx={x}
                          cy={y}
                          r="5"
                          className={styles.nodeDot}
                          style={
                            {
                              "--c": colorOf(i),
                              opacity: r * outroFade,
                            } as NodeStyle
                          }
                        />
                      );
                    })}
                </svg>

                {/* Hub */}
                <div
                  className={styles.hub}
                  style={
                    mounted
                      ? {
                          transform: `translate(-50%, -50%) scale(${hubScale * hubShrink})`,
                          opacity: hubCoreOpacity,
                        }
                      : { transform: "translate(-50%, -50%)", opacity: 0 }
                  }
                >
                  <div className={styles.hubGlow} />
                  <div className={styles.hubDisc}>
                    <Image
                      className={styles.mark}
                      src={markSrc}
                      alt=""
                      aria-hidden
                      width={104}
                      height={104}
                    />
                    <Image
                      className={styles.hubName}
                      src={hubNameSrc}
                      alt="Mozaik"
                      width={180}
                      height={60}
                    />
                  </div>
                </div>

                {/* Orbit cards — only rendered client-side to avoid hydration mismatch */}
                {mounted &&
                  nodes.map((n, i) => {
                    const r = revealOf(i);
                    const full = nodePos(i);
                    const f = radiusAt(r) * outroExpand;
                    const x = CX + (full.x - CX) * f;
                    const y = CY + (full.y - CY) * f;
                    const cos = Math.cos(angleOf(i));
                    const side =
                      cos < -0.2
                        ? styles.cardL
                        : cos > 0.2
                          ? styles.cardR
                          : styles.cardC;
                    const logoUrl = n.logo?.asset
                      ? urlFor(n.logo).width(40).height(40).url()
                      : null;
                    return (
                      <div
                        key={n._key}
                        className={`${styles.card} ${side}${r > 0.5 ? " " + styles.cardOn : ""}`}
                        style={
                          {
                            "--c": colorOf(i),
                            left: `${(x / 1000) * 100}%`,
                            top: `${(y / 1000) * 100}%`,
                            opacity: clamp(r * 1.5, 0, 1) * outroFade,
                            transform: `translate(-50%, -50%) scale(${0.7 + r * 0.3})`,
                          } as NodeStyle
                        }
                      >
                        <div className={styles.cardIcon}>
                          {logoUrl ? (
                            <Image
                            src={logoUrl}
                            alt={n.logo?.alt || n.label}
                            width={40}
                            height={40}
                          />
                          ) : (
                            <Icon name={n.icon || ""} size={20} stroke={1.7} />
                          )}
                        </div>
                        <div className={styles.cardBody}>
                          <div className={styles.cardTitle}>{n.label}</div>
                          {n.description && (
                            <div className={styles.cardBlurb}>
                              {n.description}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* CTA — fades in at end of scroll */}
              <a
                className={styles.cta}
                href="/losningar/mozaik"
                style={
                  mounted
                    ? {
                        opacity: ctaProg,
                        pointerEvents: ctaProg > 0.6 ? "auto" : "none",
                        transform: `translate(-50%, -50%) scale(${0.5 + ctaProg * 0.5})`,
                      }
                    : {
                        opacity: 0,
                        pointerEvents: "none",
                        transform: "translate(-50%, -50%) scale(0.5)",
                      }
                }
              >
                <span>Upptäck Mozaik</span>
                <Icon name="arrow-right" size={17} stroke={2} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
