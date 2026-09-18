import Image from "next/image";
import { normalizeHref } from "@/lib/href";
import { resolveHref } from "@/lib/resolveHref";
import Icon from "@/components/ui/icon";
import { resolveBackground, type BackgroundImage, type Gradient } from "@/lib/background";
import {
  fetchSiteSettings,
  withPlaceholder,
  resolvedImageUrl,
} from "@/lib/seo";
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
  imageHeight?: string;
  image?: { asset: unknown; alt?: string };
  width?: number;
  titleFontSize?: number;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  iconBackgroundColor?: string;
  textColor?: string;
};

// Large-image heights. Ratios must match the aspect-ratio per data-height in
// styles.module.scss — the fetch is cropped to the same shape, so the hotspot holds.
const IMAGE_HEIGHTS: Record<string, { width: number; height: number }> = {
  short: { width: 800, height: 200 }, // 4 / 1
  medium: { width: 800, height: 267 }, // 3 / 1
  tall: { width: 800, height: 400 }, // 2 / 1
  xtall: { width: 800, height: 533 }, // 3 / 2
};
const SMALL_IMAGE = { width: 80, height: 80 };

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
    backgroundGradient?: Gradient;
    borderRadius?: number;
    itemStyle?: string;
    items?: Item[];
  };
};

export default async function ListBlock({ block }: Props) {
  const site = await fetchSiteSettings();

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
            // Picking "image" as the visual and uploading none falls back to
            // the Site settings placeholder.
            const itemImage =
              item.visualType === "image"
                ? withPlaceholder(item.image, site)
                : null;
            const isSmallImage = item.imageSize === "small";
            const imageHeight =
              item.imageHeight && item.imageHeight in IMAGE_HEIGHTS
                ? item.imageHeight
                : "medium";
            const imageDims = isSmallImage
              ? SMALL_IMAGE
              : IMAGE_HEIGHTS[imageHeight];
            const itemImageUrl = itemImage
              ? resolvedImageUrl(
                  itemImage,
                  isSmallImage ? { height: 80 } : imageDims,
                )
              : null;

            const resolved = resolveHref(item.linkType, item.href, item.pageRef);
            const itemHref = resolved ? normalizeHref(resolved) : "";
            const hasLink = Boolean(itemHref && item.linkLabel);

            const cardStyle: React.CSSProperties = {
              ...(item.textColor ? { color: item.textColor } : {}),
              gridColumn: `span ${item.width || 4}`,
              ...(item.backgroundColor
                ? { "--item-bg": item.backgroundColor }
                : {}),
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
                    data-height={imageHeight}
                  >
                    <Image
                      src={itemImageUrl}
                      alt={itemImage?.alt || ""}
                      width={imageDims.width}
                      height={imageDims.height}
                      sizes="(max-width: 860px) 100vw, 33vw"
                    />
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
