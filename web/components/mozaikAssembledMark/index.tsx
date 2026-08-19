"use client";

import { useEffect, useRef } from "react";
import styles from "./styles.module.scss";

/** Bounding boxes of the twelve mark pieces, in % of the mark box (ratio 1.122). */
const PIECES = [
  { l: -0.604, t: -0.678, w: 24.371, h: 35.254 },
  { l: -0.504, t: 42.147, w: 27.392, h: 32.881 },
  { l: -0.201, t: 21.695, w: 28.197, h: 35.593 },
  { l: -0.504, t: 62.486, w: 30.916, h: 38.192 },
  { l: 23.666, t: 19.435, w: 26.284, h: 37.74 },
  { l: 30.514, t: 44.746, w: 19.436, h: 36.949 },
  { l: 50.151, t: 44.746, w: 19.537, h: 36.836 },
  { l: 50.352, t: 19.435, w: 26.183, h: 37.74 },
  { l: 69.587, t: 62.599, w: 31.017, h: 37.853 },
  { l: 72.004, t: 21.695, w: 28.399, h: 35.593 },
  { l: 73.212, t: 42.034, w: 27.392, h: 32.881 },
  { l: 76.737, t: -0.678, w: 23.867, h: 35.141 },
];

const STAGGER = 0.028;

/** The source grid has to be this far into the viewport before the pieces set off. */
const ENTER = 0.4;

/** ...and they are home once the mark has risen to this point in the viewport. */
const REST = 0.5;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

// Alternating tilt, so the pieces don't all rotate the same way on the way in.
const tiltOf = (i: number) => (i % 2 ? 1 : -1) * (10 + (i % 5) * 5);

type Props = {
  /**
   * Elements the pieces fly in from — one per piece, in order. With no matches
   * the pieces assemble in place instead.
   */
  sourceSelector?: string;
  /**
   * How far the source grid must be into the viewport before the pieces start
   * moving, as a fraction of the viewport height.
   */
  enterAt?: number;
  /**
   * Where the mark has to reach for the assembly to be finished, as a fraction of
   * the viewport height. 0.5 is mid-screen; lower values stretch the run out.
   */
  restAt?: number;
};

/**
 * The twelve Mozaik pieces fall into place and form the M that opens a heading.
 * Decorative: the heading itself has to supply the letter for screen readers.
 */
export default function MozaikAssembledMark({
  sourceSelector = "[data-mozaik-piece] img",
  enterAt = ENTER,
  restAt = REST,
}: Props) {
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const pieces = Array.from(wrap.querySelectorAll<HTMLImageElement>("img"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sources = () =>
      Array.from(document.querySelectorAll<HTMLElement>(sourceSelector));
    let frame = 0;

    const draw = () => {
      frame = 0;
      const box = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const tiles = sources();
      const from = tiles.map((tile) => tile.getBoundingClientRect());

      // Progress is measured off the source grid, not the mark: 0 until the grid is
      // `enterAt` into the viewport, 1 once the mark has risen to `restAt`.
      const gridTop = from.length ? Math.min(...from.map((r) => r.top)) : box.top;
      const lead = box.top - gridTop;
      const start = vh * (1 - enterAt) + lead;
      const end = vh * restAt - box.height / 2;
      const p = clamp01((start - box.top) / Math.max(1, start - end));

      pieces.forEach((el, i) => {
        const r = PIECES[i];
        const q = clamp01((p - i * STAGGER) / (1 - STAGGER * (PIECES.length - 1)));
        const eased = 1 - Math.pow(1 - q, 3);
        const left = 1 - eased;

        // Where this piece rests, in viewport coordinates
        const w = (box.width * r.w) / 100;
        const h = (box.height * r.h) / 100;
        const x = box.left + (box.width * r.l) / 100 + w / 2;
        const y = box.top + (box.height * r.t) / 100 + h / 2;

        // Where it starts out: on top of its source tile, at the tile's size
        const tile = from[i];
        let dx = 0;
        let dy = 0;
        let scale = 1;
        if (tile?.width) {
          dx = tile.left + tile.width / 2 - x;
          dy = tile.top + tile.height / 2 - y;
          scale = tile.width / Math.max(1, w);
        }

        el.style.transform =
          `translate3d(${(dx * left).toFixed(2)}px, ${(dy * left).toFixed(2)}px, 0)` +
          ` rotate(${(tiltOf(i) * left * left).toFixed(2)}deg)` +
          ` scale(${(1 + (scale - 1) * left).toFixed(3)})`;
        el.style.opacity = (0.06 + 0.94 * Math.min(1, eased * 1.5)).toFixed(3);
        // The tile fades out as its piece takes off, so the two never read as duplicates.
        if (tiles[i]) tiles[i].style.opacity = (1 - Math.min(1, eased * 1.25)).toFixed(3);
      });
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      sources().forEach((tile) => {
        tile.style.opacity = "";
      });
      pieces.forEach((el) => {
        el.style.transform = "none";
        el.style.opacity = "1";
      });
    };
  }, [sourceSelector, enterAt, restAt]);

  return (
    <span className={styles.mark} ref={wrapRef} aria-hidden>
      {PIECES.map((r, i) => (
        <img
          key={i}
          className={styles.piece}
          src={`/assets/mozaik-piece-${String(i + 1).padStart(2, "0")}.png`}
          alt=""
          style={{
            left: r.l + "%",
            top: r.t + "%",
            width: r.w + "%",
            height: r.h + "%",
          }}
        />
      ))}
    </span>
  );
}
