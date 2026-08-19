import MozaikAssembledMark from "@/components/mozaikAssembledMark";
import { resolveBackground } from "@/lib/background";
import styles from "./styles.module.scss";

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
    backgroundColor?: string;
    backgroundGradient?: Gradient;
    headlineColor?: string;
    headlineFontSize?: number;
    textColor?: string;
    paddingTop?: number;
    paddingBottom?: number;
  };
};

/**
 * Properties heading whose first letter is drawn by the assembled Mozaik mark —
 * the pieces fly in from the services tiles above as the heading scrolls into view.
 */
export default function MozaikPropsHeading({ block }: Props) {
  const headline = block.headline?.trim();
  if (!headline) return null;

  // The mark stands in for the first letter, which stays in the DOM for screen readers.
  const initial = headline.slice(0, 1);
  const rest = headline.slice(1);

  const sectionStyle: React.CSSProperties = {
    ...resolveBackground(block.backgroundColor, block.backgroundGradient),
    ...(block.paddingTop != null ? { paddingTop: block.paddingTop + "px" } : {}),
    ...(block.paddingBottom != null ? { paddingBottom: block.paddingBottom + "px" } : {}),
  };

  const headlineStyle: React.CSSProperties = {
    ...(block.headlineColor ? { color: block.headlineColor } : {}),
    ...(block.headlineFontSize ? { fontSize: block.headlineFontSize + "px" } : {}),
  };

  const subStyle: React.CSSProperties = block.textColor ? { color: block.textColor } : {};

  return (
    <section className={styles.section} style={sectionStyle}>
      <div className={styles.container}>
        <div className={styles.head}>
          <h2 className={styles.headline} style={headlineStyle}>
            <MozaikAssembledMark />
            <span className={styles.text}>
              <span className={styles.srOnly}>{initial}</span>
              {rest}
            </span>
          </h2>
          {block.subheadline && (
            <p className={styles.sub} style={subStyle}>
              {block.subheadline}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
