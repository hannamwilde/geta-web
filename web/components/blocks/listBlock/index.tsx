import { urlFor } from "@/sanity/client";
import { normalizeHref } from "@/lib/href";
import { resolveHref } from "@/lib/resolveHref";
import Icon from "@/components/ui/icon";
import { resolveBackground, type BackgroundImage } from "@/lib/background";
import styles from "./styles.module.scss";
import { resolveBorder, type Border } from "@/lib/border";

type PageRef = { slug?: { current?: string } } | null
type Item = {
  _key: string;
  title?: string;
  body?: string;
  href?: string;
  linkType?: string;
  pageRef?: PageRef;
  linkLabel?: string;
  icon?: string;
  visualType?: string;
  imageSize?: string;
  image?: { asset: unknown; alt?: string };
  width?: number;
  titleFontSize?: number;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  iconBackgroundColor?: string;
  textColor?: string;
};

type Props = {
  block: {
    backgroundImage?: BackgroundImage;
    border?: Border;
    eyebrow?: string;
    headline?: string;
    subheadline?: string;
    eyebrowColor?: string;
    eyebrowFontSize?: number;
    headlineColor?: string;
    headlineFontSize?: number;
    subheadlineColor?: string;
    subheadlineFontSize?: number;
    subheadlineDivider?: boolean;
    backgroundColor?: string;
    backgroundGradient?: { type?: string; from?: string; to?: string; angle?: number; position?: string } | null;
    borderRadius?: number;
    itemStyle?: string;
    items?: Item[];
  };
};

export default function ListBlock({ block }: Props) {
  const sectionStyle: React.CSSProperties = {
    ...resolveBackground(block.backgroundColor, block.backgroundGradient, block.backgroundImage),
    ...resolveBorder(block.border),
    ...(block.borderRadius != null ? { '--r-lg': block.borderRadius + 'px', '--r-xl': block.borderRadius + 'px' } as React.CSSProperties : {}),
  };

  const headlineStyle: React.CSSProperties = {
    color: block.headlineColor || "#ffffff",
    ...(block.headlineFontSize
      ? { fontSize: block.headlineFontSize + "px" }
      : {}),
  };
  const subheadlineStyle: React.CSSProperties = {
    color: block.subheadlineColor || "#ffffff",
    ...(block.subheadlineFontSize
      ? { fontSize: block.subheadlineFontSize + "px" }
      : {}),
  };

  // The section only renders its own <h2> when an editor filled in a headline, so
  // items step down to <h3> only in that case — otherwise they'd skip a heading level.
  const ItemHeading = block.headline ? "h3" : "h2";

  return (
    <section
      className={styles.section}
      data-item-style={block.itemStyle || "large"}
      style={sectionStyle}
    >
      <div className={styles.container}>
        {(block.eyebrow || block.headline || block.subheadline) && (
          <div className={styles.header}>
            {block.eyebrow && (
              <p
                className={styles.eyebrow}
                style={{
                  ...(block.eyebrowColor ? { color: block.eyebrowColor } : {}),
                  ...(block.eyebrowFontSize
                    ? { fontSize: block.eyebrowFontSize + "px" }
                    : {}),
                }}
              >
                {block.eyebrow}
              </p>
            )}
            {block.headline && (
              <h2 className={styles.headline} style={headlineStyle}>
                {block.headline}
              </h2>
            )}
            {block.subheadline && (
              <p
                className={`${styles.subheadline}${block.subheadlineDivider ? " " + styles.subheadlineDivider : ""}`}
                style={subheadlineStyle}
              >
                {block.subheadline}
              </p>
            )}
          </div>
        )}
        <div className={styles.grid}>
          {(block.items || []).map((item, i) => {
            const itemImageUrl =
              item.visualType === "image" && item.image?.asset
                ? item.imageSize === "small"
                  ? urlFor(item.image).height(80).url()
                  : urlFor(item.image).width(800).height(360).url()
                : null;

            const resolved = resolveHref(item.linkType, item.href, item.pageRef);
            const itemHref = resolved ? normalizeHref(resolved) : "";
            const hasLink = Boolean(itemHref && item.linkLabel);

            const cardStyle: React.CSSProperties = {
              ...(item.textColor ? { color: item.textColor } : {}),
              gridColumn: `span ${item.width || 4}`,
              "--item-bg": item.backgroundColor || "#ffffff",
              ...(item.hoverBackgroundColor && hasLink
                ? { "--item-hover-bg": item.hoverBackgroundColor }
                : {}),
              ...(item.iconBackgroundColor
                ? { "--item-icon-bg": item.iconBackgroundColor }
                : {}),
            } as React.CSSProperties;

            const inner = (
              <>
                {item.visualType === "image" && itemImageUrl ? (
                  <span
                    className={styles.itemImage}
                    data-size={item.imageSize || "large"}
                  >
                    <img src={itemImageUrl} alt={item.image?.alt || ""} />
                  </span>
                ) : item.visualType !== "image" && item.icon ? (
                  <span className={styles.itemIcon}>
                    <Icon name={item.icon} size={24} stroke={1.7} />
                  </span>
                ) : null}
                <span className={styles.itemText}>
                  {item.title && (
                    <ItemHeading
                      className={styles.itemTitle}
                      style={
                        item.titleFontSize
                          ? { fontSize: item.titleFontSize + "px" }
                          : {}
                      }
                    >
                      {item.title}
                    </ItemHeading>
                  )}
                  {item.body && <p className={styles.itemBody}>{item.body}</p>}
                  {hasLink && (
                    <span className={styles.itemLink}>
                      {item.linkLabel}
                      <Icon name="arrow-up-right" size={14} stroke={2} />
                    </span>
                  )}
                </span>
              </>
            );

            return hasLink ? (
              <a
                key={item._key || i}
                href={itemHref}
                className={styles.item}
                style={cardStyle}
              >
                {inner}
              </a>
            ) : (
              <div
                key={item._key || i}
                className={styles.item}
                style={cardStyle}
              >
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
