import Image from "next/image";
import { urlFor } from "@/sanity/client";
import {
  resolveBackground,
  type BackgroundImage,
  type Gradient,
} from "@/lib/background";
import { resolveBorder, type Border } from "@/lib/border";
import styles from "./styles.module.scss";

// Matches the aspect-ratio of .media in styles.module.scss, so the crop the
// CDN returns is the shape the column renders and the hotspot holds.
const IMAGE = { width: 640, height: 672 };

// The quote marks are drawn by the block, so a stored quote that already
// carries its own doesn't end up double-wrapped.
function stripQuotes(text?: string) {
  return (text || "").trim().replace(/^["'‘’“”«»\s]+|["'‘’“”«»\s]+$/g, "");
}

type Props = {
  block: {
    backgroundImage?: BackgroundImage;
    border?: Border;
    title?: string;
    body?: string;
    image?: { asset?: unknown; alt?: string };
    borderRadius?: number;
    quote?: string;
    author?: string;
    role?: string;
    // Legacy field name — drop once rename-quote-company-role has been applied.
    companyRole?: string;
    backgroundColor?: string;
    backgroundGradient?: Gradient;
    textColor?: string;
    paddingTop?: number;
    paddingBottom?: number;
  };
};

export default function QuoteBlock({ block }: Props) {
  const style: React.CSSProperties = {
    ...resolveBackground(
      block.backgroundColor,
      block.backgroundGradient,
      block.backgroundImage,
    ),
    ...resolveBorder(block.border),
  };
  if (block.textColor) style.color = block.textColor;
  if (block.paddingTop != null) style.paddingTop = block.paddingTop + "px";
  if (block.paddingBottom != null)
    style.paddingBottom = block.paddingBottom + "px";

  // No image set — the column is dropped rather than filled with a
  // placeholder, so quote blocks written before the rework still read right.
  const imageUrl = block.image?.asset
    ? urlFor(block.image).width(IMAGE.width).height(IMAGE.height).url()
    : null;
  const role = block.role || block.companyRole;
  const quote = stripQuotes(block.quote);
  const hasIntro = Boolean(block.title || block.body);

  return (
    <section
      className={styles.section}
      style={style}
      data-has-intro={hasIntro || undefined}
      data-has-image={imageUrl ? true : undefined}
    >
      <div className={styles.container}>
        {hasIntro && (
          <div className={styles.intro}>
            {block.title && <h2 className={styles.title}>{block.title}</h2>}
            {block.body && <p className={styles.body}>{block.body}</p>}
          </div>
        )}
        {imageUrl && (
          <div
            className={styles.media}
            style={
              block.borderRadius != null
                ? { borderRadius: block.borderRadius + "px" }
                : undefined
            }
          >
            <Image
              src={imageUrl}
              alt={block.image?.alt || ""}
              width={IMAGE.width}
              height={IMAGE.height}
              sizes="(max-width: 900px) 100vw, 25vw"
            />
          </div>
        )}
        <figure className={styles.figure}>
          {quote && (
            <blockquote className={styles.quote}>{`“${quote}”`}</blockquote>
          )}
          {(block.author || role) && (
            <figcaption className={styles.attribution}>
              {block.author && (
                <span className={styles.author}>{block.author}</span>
              )}
              {role && <span className={styles.role}>{role}</span>}
            </figcaption>
          )}
        </figure>
      </div>
    </section>
  );
}
