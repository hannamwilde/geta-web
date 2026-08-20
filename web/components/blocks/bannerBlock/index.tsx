import { urlFor } from "@/sanity/client";
import Icon from "@/components/ui/icon";
import BackgroundMedia, {
  type BackgroundVideo,
} from "@/components/ui/backgroundMedia";
import type { Gradient } from "@/lib/background";
import BannerBlockCTAs from "./components/bannerBlockCtas";
import styles from "./styles.module.scss";
import { resolveBorder, type Border } from "@/lib/border";

type CTA = { label?: string; action?: string; href?: string };

type Props = {
  block: {
    border?: Border;
    eyebrow?: string;
    headline?: string;
    tagline?: string;
    intro?: string;
    eyebrowFontSize?: number;
    headlineFontSize?: number;
    taglineFontSize?: number;
    introFontSize?: number;
    ctaPrimary?: CTA;
    ctaSecondary?: CTA;
    backgroundColor?: string;
    backgroundGradient?: {
      type?: string;
      from?: string;
      to?: string;
      angle?: number;
      position?: string;
    } | null;
    paddingTop?: number;
    paddingBottom?: number;
    headlineColor?: string;
    taglineColor?: string;
    textColor?: string;
    ctaPrimaryBackground?: string;
    ctaPrimaryTextColor?: string;
    ctaPrimaryHoverBackground?: string;
    ctaPrimaryHoverTextColor?: string;
    ctaSecondaryColor?: string;
    ctaSecondaryHoverBackground?: string;
    ctaSecondaryHoverColor?: string;
    backgroundImage?: { asset: unknown; alt?: string };
    backgroundVideo?: BackgroundVideo;
    overlayColor?: string;
    overlayGradient?: Gradient;
    overlayOpacity?: number;
    visualType?: string;
    photo?: { asset: unknown; alt?: string };
    icon?: string;
    statValue?: string;
    statLabel?: string;
    alignment?: string;
    textAlignment?: string;
    contentLayout?: string;
    borderRadius?: number;
  };
};

export default function BannerBlock({ block }: Props) {
  const s: Record<string, string> = {};
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
  if (block.borderRadius != null) {
    s["--r-lg"] = block.borderRadius + "px";
    s["--r-xl"] = block.borderRadius + "px";
  }
  if (block.headlineColor) s["--bb-headline"] = block.headlineColor;
  if (block.taglineColor) s["--bb-tagline"] = block.taglineColor;
  if (block.textColor) s["--bb-text"] = block.textColor;
  if (block.ctaPrimaryBackground) s["--bb-p-bg"] = block.ctaPrimaryBackground;
  if (block.ctaPrimaryTextColor) s["--bb-p-color"] = block.ctaPrimaryTextColor;
  if (block.ctaPrimaryHoverBackground)
    s["--bb-p-hover-bg"] = block.ctaPrimaryHoverBackground;
  if (block.ctaPrimaryHoverTextColor)
    s["--bb-p-hover-color"] = block.ctaPrimaryHoverTextColor;
  if (block.ctaSecondaryColor) s["--bb-s-color"] = block.ctaSecondaryColor;
  if (block.ctaSecondaryHoverBackground)
    s["--bb-s-hover-bg"] = block.ctaSecondaryHoverBackground;
  if (block.ctaSecondaryHoverColor)
    s["--bb-s-hover-color"] = block.ctaSecondaryHoverColor;

  const backgroundUrl = block.backgroundImage?.asset
    ? urlFor(block.backgroundImage).width(1600).url()
    : null;

  if (backgroundUrl) {
    s.backgroundImage = `url(${backgroundUrl})`;
    s.backgroundSize = "cover";
    s.backgroundPosition = "center";
  }

  const photoUrl = block.photo?.asset
    ? urlFor(block.photo).width(800).url()
    : null;
  const showVisual = block.visualType !== "none" && (photoUrl || block.icon);

  // ctaPrimary may be string or object — handle both
  const primary =
    typeof block.ctaPrimary === "string"
      ? { label: block.ctaPrimary }
      : block.ctaPrimary;
  const secondary =
    typeof block.ctaSecondary === "string"
      ? { label: block.ctaSecondary }
      : block.ctaSecondary;

  return (
    <section
      className={`${styles.hero} banner-block`}
      style={{ ...(s as React.CSSProperties), ...resolveBorder(block.border) }}
      data-align={block.alignment || "left"}
      data-text-align={block.textAlignment || block.alignment || "left"}
      data-layout={block.contentLayout || "stacked"}
    >
      <BackgroundMedia
        video={block.backgroundVideo}
        posterUrl={backgroundUrl}
        overlayColor={block.overlayColor}
        overlayGradient={block.overlayGradient}
        overlayOpacity={block.overlayOpacity}
      />
      <div className="container">
        <div className={showVisual ? styles.detailGrid : ""}>
          <div className={`${styles.content} bb-content`}>
            <div className={`${styles.contentText} bb-content-text`}>
              {block.eyebrow && (
                <div
                  className={styles.eyebrow}
                  style={
                    block.eyebrowFontSize
                      ? { fontSize: block.eyebrowFontSize + "px" }
                      : {}
                  }
                >
                  <span className={styles.eyebrowDot} />
                  {block.eyebrow}
                </div>
              )}
              {block.headline && (
                <h1
                  className={styles.title}
                  style={
                    block.headlineFontSize
                      ? { fontSize: block.headlineFontSize + "px" }
                      : {}
                  }
                >
                  {block.headline}
                </h1>
              )}
              {block.tagline && (
                <p
                  className={styles.tagline}
                  style={
                    block.taglineFontSize
                      ? { fontSize: block.taglineFontSize + "px" }
                      : {}
                  }
                >
                  {block.tagline}
                </p>
              )}
              {block.intro && (
                <p
                  className={styles.intro}
                  style={
                    block.introFontSize
                      ? { fontSize: block.introFontSize + "px" }
                      : {}
                  }
                >
                  {block.intro}
                </p>
              )}
            </div>
            <BannerBlockCTAs primary={primary} secondary={secondary} />
          </div>
          {showVisual && (
            <div
              className={`${styles.mark}${photoUrl ? " " + styles.markPhoto : ""}`}
            >
              {photoUrl ? (
                <img
                  className={styles.photo}
                  src={photoUrl}
                  alt={block.photo?.alt || ""}
                />
              ) : (
                <>
                  {block.icon && (
                    <Icon name={block.icon} size={64} stroke={1.2} />
                  )}
                  {(block.statValue || block.statLabel) && (
                    <div className={styles.stat}>
                      {block.statValue && (
                        <div className={styles.statValue}>
                          {block.statValue}
                        </div>
                      )}
                      {block.statLabel && (
                        <div className={styles.statLabel}>
                          {block.statLabel}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
