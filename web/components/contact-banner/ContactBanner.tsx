import { urlFor } from "@/sanity/client";
import { fetchTranslations } from "@/lib/translations/server";
import { resolveBackground } from "@/lib/background";
import ContactBannerCTA from "./ContactBannerCTA";
import styles from "./ContactBanner.module.css";

type Props = {
  block: {
    headline?: string;
    subheadline?: string;
    cta?: { label?: string; href?: string };
    backgroundImage?: { asset: unknown; alt?: string };
    backgroundColor?: string;
    backgroundGradient?: {
      type?: string;
      from?: string;
      to?: string;
      angle?: number;
      position?: string;
    } | null;
    headlineColor?: string;
    textColor?: string;
    buttonBackgroundColor?: string;
    buttonTextColor?: string;
    buttonHoverBackground?: string;
    buttonHoverTextColor?: string;
    domeBackgroundColor?: string;
  };
};

export default async function ContactBanner({ block }: Props) {
  const bgUrl = block.backgroundImage?.asset
    ? urlFor(block.backgroundImage).width(1400).url()
    : null;

  const t = await fetchTranslations();
  const ctaLabel = block.cta?.label || t.general.contact;

  const sectionStyle = resolveBackground(
    block.backgroundColor,
    block.backgroundGradient,
  );
  const titleStyle: React.CSSProperties = block.headlineColor
    ? { color: block.headlineColor }
    : {};
  const subStyle: React.CSSProperties = block.textColor
    ? { color: block.textColor }
    : {};
  const domeStyle: React.CSSProperties = block.domeBackgroundColor
    ? { background: block.domeBackgroundColor }
    : {};

  return (
    <section
      className={styles.section}
      aria-labelledby="bcta-title"
      style={sectionStyle}
    >
      <div className="container">
        <div className={styles.frame}>
          {bgUrl && (
            <img
              className={styles.bg}
              src={bgUrl}
              alt={block.backgroundImage?.alt || ""}
            />
          )}
          <div className={styles.dome} style={domeStyle}>
            <div className={styles.domeInner}>
              {block.headline && (
                <h2 className={styles.title} id="bcta-title" style={titleStyle}>
                  {block.headline}
                </h2>
              )}
              {block.subheadline && (
                <p className={styles.sub} style={subStyle}>
                  {block.subheadline}
                </p>
              )}
              <ContactBannerCTA
                label={ctaLabel}
                bgColor={block.buttonBackgroundColor}
                textColor={block.buttonTextColor}
                hoverBgColor={block.buttonHoverBackground}
                hoverTextColor={block.buttonHoverTextColor}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
