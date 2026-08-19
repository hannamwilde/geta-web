import { resolveBackground } from "@/lib/background";
import styles from "./styles.module.scss";

type Item = {
  _key: string;
  piece?: number;
  title?: string;
  body?: string;
};

type Gradient = {
  type?: string;
  from?: string;
  to?: string;
  angle?: number;
  position?: string;
} | null;

type Props = {
  block: {
    headline?: string;
    subheadline?: string;
    items?: Item[];
    backgroundColor?: string;
    backgroundGradient?: Gradient;
    headlineColor?: string;
    headlineFontSize?: number;
    textColor?: string;
    itemTextColor?: string;
    paddingTop?: number;
    paddingBottom?: number;
  };
};

/**
 * The twelve Mozaik services, each carrying one piece of the mark. The pieces are
 * marked with data-mozaik-piece so a following properties heading can fly them in.
 */
export default function MozaikServices({ block }: Props) {
  const items = (block.items ?? []).filter((item) => item.title);
  if (!items.length) return null;

  const sectionStyle: React.CSSProperties = {
    ...resolveBackground(block.backgroundColor, block.backgroundGradient),
    ...(block.paddingTop != null ? { paddingTop: block.paddingTop + "px" } : {}),
    ...(block.paddingBottom != null ? { paddingBottom: block.paddingBottom + "px" } : {}),
    ...(block.textColor ? { "--mzs-text": block.textColor } : {}),
    ...(block.itemTextColor ? { "--mzs-name": block.itemTextColor } : {}),
  } as React.CSSProperties;

  const headlineStyle: React.CSSProperties = {
    ...(block.headlineColor ? { color: block.headlineColor } : {}),
    ...(block.headlineFontSize ? { fontSize: block.headlineFontSize + "px" } : {}),
  };

  return (
    <section className={styles.section} style={sectionStyle}>
      <div className={styles.container}>
        <div className={styles.head}>
          {block.headline && (
            <h2 className={styles.headline} style={headlineStyle}>
              {block.headline}
            </h2>
          )}
          {block.subheadline && <p className={styles.sub}>{block.subheadline}</p>}
        </div>
        <div className={styles.grid}>
          {items.map((item, i) => (
            <div key={item._key} className={styles.card}>
              <span className={styles.piece} data-mozaik-piece>
                <img
                  src={`/assets/mozaik-piece-${String(item.piece ?? i + 1).padStart(2, "0")}.png`}
                  alt=""
                  aria-hidden
                />
              </span>
              <span className={styles.name}>{item.title}</span>
              {item.body && <span className={styles.body}>{item.body}</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
