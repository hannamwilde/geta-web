import { urlFor } from "@/sanity/client";
import { normalizeHref } from "@/lib/href";
import { resolveHref } from "@/lib/resolveHref";
import Icon from "@/components/ui/icon";
import styles from "./styles.module.scss";
import { resolveBorder, type Border } from "@/lib/border";

type PageRef = { slug?: { current?: string } } | null
type LinkItem = {
  _key: string;
  label?: string;
  href?: string;
  linkType?: string;
  pageRef?: PageRef;
  style?: string;
  icon?: string;
  image?: { asset: unknown; alt?: string };
};

type Props = {
  block: {
    border?: Border;
    title?: string;
    links?: LinkItem[];
    backgroundColor?: string;
    backgroundGradient?: {
      type?: string;
      from?: string;
      to?: string;
      angle?: number;
      position?: string;
    } | null;
    textColor?: string;
    buttonBackgroundColor?: string;
    buttonTextColor?: string;
    borderScope?: string;
    borderTopColor?: string;
    borderBottomColor?: string;
    alignment?: string;
    linksLayout?: string;
    paddingTop?: number;
    paddingBottom?: number;
  };
};

export default function LinkBlock({ block }: Props) {
  const s: React.CSSProperties = {};
  if (block.backgroundGradient?.from && block.backgroundGradient?.to) {
    const g = block.backgroundGradient;
    s.background =
      g.type === "radial"
        ? `radial-gradient(circle at ${g.position ?? "center"}, ${g.from}, ${g.to})`
        : `linear-gradient(${g.angle ?? 135}deg, ${g.from}, ${g.to})`;
  } else if (block.backgroundColor) {
    s.backgroundColor = block.backgroundColor;
  }
  if (block.paddingTop != null) s.paddingTop = block.paddingTop + "px";
  if (block.paddingBottom != null) s.paddingBottom = block.paddingBottom + "px";
  if (block.textColor)
    (s as Record<string, string>)["--lb-text"] = block.textColor;
  if (block.buttonBackgroundColor)
    (s as Record<string, string>)["--lb-btn-bg"] = block.buttonBackgroundColor;
  if (block.buttonTextColor)
    (s as Record<string, string>)["--lb-btn-text"] = block.buttonTextColor;

  const links = block.links || [];
  const fullWidth = block.borderScope === "full";
  const borderStyle: React.CSSProperties = {};
  if (block.borderTopColor)
    borderStyle.borderTop = `1px solid ${block.borderTopColor}`;
  if (block.borderBottomColor)
    borderStyle.borderBottom = `1px solid ${block.borderBottomColor}`;

  const hasImages = links.some((l) => l.style === "image");

  return (
    <section
      className={styles.section}
      style={{ ...resolveBorder(block.border), ...(fullWidth ? { ...s, ...borderStyle } : s) }}
      data-align={block.alignment || "left"}
    >
      <div className={styles.container}>
        <div style={fullWidth ? {} : borderStyle}>
          {block.title && <h2 className={styles.title}>{block.title}</h2>}
          {links.length > 0 && (
            <div
              className={styles.links}
              data-layout={block.linksLayout || "inline"}
              data-has-images={hasImages || undefined}
            >
              {links.map((item, i) => {
                const imgUrl =
                  item.style === "image" && item.image?.asset
                    ? urlFor(item.image).height(80).url()
                    : null;
                return (
                  <a
                    key={item._key || i}
                    href={normalizeHref(resolveHref(item.linkType, item.href, item.pageRef))}
                    className={`${styles.item} ${styles["item--" + (item.style || "link")]}`}
                  >
                    {item.style === "image" && imgUrl ? (
                      <img
                        className={styles.itemImage}
                        src={imgUrl}
                        alt={item.image?.alt || item.label || ""}
                      />
                    ) : item.icon ? (
                      <Icon name={item.icon} size={16} stroke={1.8} />
                    ) : null}
                    {item.style !== "image" && item.label}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
