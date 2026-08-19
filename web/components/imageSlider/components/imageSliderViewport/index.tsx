"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Icon from "@/components/icon";
import styles from "./styles.module.scss";

type Props = {
  children: ReactNode;
  count: number;
  autoplay: boolean;
  intervalMs: number;
  showArrows: boolean;
  showDots: boolean;
};

/**
 * Scroll-snap track: the slides are plain markup rendered on the server, so they
 * are swipeable and readable without this component's JavaScript. Arrows, dots
 * and autoplay are layered on top and drive the same scroll position.
 */
export default function ImageSliderViewport({
  children,
  count,
  autoplay,
  intervalMs,
  showArrows,
  showDots,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // Autoplay reads the index from a ref so a slide change doesn't restart the timer.
  const activeRef = useRef(0);

  const setIndex = (index: number) => {
    activeRef.current = index;
    setActive(index);
  };

  // Scroll positions come off the slide elements themselves rather than being
  // computed from the track width, so padding or a rounded width can't drift.
  const slideAt = (track: HTMLDivElement, index: number) =>
    track.children[index] as HTMLElement | undefined;

  const goTo = useCallback((index: number, smooth = true) => {
    const track = trackRef.current;
    const slide = track && slideAt(track, index);
    if (!track || !slide) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIndex(index);
    track.scrollTo({
      left: slide.offsetLeft - track.offsetLeft,
      behavior: smooth && !reduced ? "smooth" : "auto",
    });
  }, []);

  // Keep the dots in sync when the visitor swipes the track directly.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const sync = () => {
      frame = 0;
      const target = track.scrollLeft + track.offsetLeft;
      let nearest = 0;
      let shortest = Infinity;
      for (let i = 0; i < track.children.length; i++) {
        const distance = Math.abs((slideAt(track, i)?.offsetLeft ?? 0) - target);
        if (distance < shortest) {
          shortest = distance;
          nearest = i;
        }
      }
      setIndex(nearest);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!autoplay || paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      const next = (activeRef.current + 1) % count;
      // Rewinding to the first slide jumps instead of scrolling back past every slide.
      goTo(next, next !== 0);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [autoplay, paused, count, intervalMs, goTo]);

  const step = (delta: number) => {
    const next = (active + delta + count) % count;
    goTo(next, Math.abs(next - active) === 1);
  };

  return (
    <div
      className={styles.viewport}
      role="group"
      aria-roledescription="bildspel"
      aria-label="Bildspel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onPointerDown={() => setPaused(true)}
      onPointerUp={() => setPaused(false)}
    >
      <div ref={trackRef} className={`${styles.track} hide-scrollbar`}>
        {children}
      </div>

      {showArrows && count > 1 && (
        <>
          <button
            type="button"
            className={`${styles.arrow} ${styles.prev}`}
            onClick={() => step(-1)}
            aria-label="Föregående bild"
          >
            <Icon name="chevron-left" size={26} stroke={2} />
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.next}`}
            onClick={() => step(1)}
            aria-label="Nästa bild"
          >
            <Icon name="chevron-right" size={26} stroke={2} />
          </button>
        </>
      )}

      {showDots && count > 1 && (
        <div className={styles.dots}>
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              className={styles.dot}
              onClick={() => goTo(i)}
              aria-label={`Gå till bild ${i + 1}`}
              aria-current={i === active || undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
