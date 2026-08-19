import { urlFor } from "@/sanity/client";
import ImageSliderViewport from "./components/imageSliderViewport";
import ImageSliderCta, { type CTA } from "./components/imageSliderCta";
import styles from "./styles.module.scss";

type SanityImage = { asset: unknown; alt?: string };

type Slide = {
  _key: string;
  title?: string;
  text?: string;
  backgroundImage?: SanityImage;
  cta?: CTA;
};

type Props = {
  block: {
    slides?: Slide[];
    overlayColor?: string;
    overlayOpacity?: number;
    headlineColor?: string;
    headlineFontSize?: number;
    textColor?: string;
    ctaBackground?: string;
    ctaTextColor?: string;
    ctaHoverBackground?: string;
    ctaHoverTextColor?: string;
    autoplay?: boolean;
    autoplayInterval?: number;
    showArrows?: boolean;
    showDots?: boolean;
    alignment?: string;
    textAlignment?: string;
    minHeight?: number;
    paddingTop?: number;
    paddingBottom?: number;
  };
};

export default function ImageSlider({ block }: Props) {
  const slides = (block.slides ?? []).filter((slide) => slide.backgroundImage?.asset);
  if (!slides.length) return null;

  const s: Record<string, string> = {};
  if (block.headlineColor) s["--slider-title"] = block.headlineColor;
  if (block.headlineFontSize) s["--slider-title-size"] = block.headlineFontSize + "px";
  if (block.textColor) s["--slider-text"] = block.textColor;
  if (block.ctaBackground) s["--slider-cta-bg"] = block.ctaBackground;
  if (block.ctaTextColor) s["--slider-cta-color"] = block.ctaTextColor;
  if (block.ctaHoverBackground) s["--slider-cta-bg-hover"] = block.ctaHoverBackground;
  if (block.ctaHoverTextColor) s["--slider-cta-color-hover"] = block.ctaHoverTextColor;
  if (block.minHeight) s["--slider-h"] = block.minHeight + "px";
  if (block.paddingTop != null) s["--slider-pt"] = block.paddingTop + "px";
  if (block.paddingBottom != null) s["--slider-pb"] = block.paddingBottom + "px";

  const overlayOpacity = block.overlayColor ? (block.overlayOpacity ?? 45) / 100 : 0;

  return (
    <section
      className={styles.slider}
      style={s as React.CSSProperties}
      data-align={block.alignment || "left"}
      data-text-align={block.textAlignment || block.alignment || "left"}
    >
      <ImageSliderViewport
        count={slides.length}
        autoplay={block.autoplay !== false}
        intervalMs={(block.autoplayInterval ?? 6) * 1000}
        showArrows={block.showArrows !== false}
        showDots={block.showDots !== false}
      >
        {slides.map((slide, i) => (
          <div
            key={slide._key}
            className={styles.slide}
            role="group"
            aria-roledescription="bild"
            aria-label={`${i + 1} av ${slides.length}`}
          >
            <img
              className={styles.image}
              src={urlFor(slide.backgroundImage).width(1920).url()}
              alt={slide.backgroundImage?.alt || ""}
              // The first slide is above the fold and often the LCP element; the rest
              // only load once the visitor scrolls the track to them.
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "low"}
            />
            {overlayOpacity > 0 && (
              <div
                className={styles.overlay}
                style={{ background: block.overlayColor, opacity: overlayOpacity }}
                aria-hidden
              />
            )}
            <div className={styles.container}>
              <div className={styles.copy}>
                {slide.title && <h2 className={styles.title}>{slide.title}</h2>}
                {slide.text && <p className={styles.text}>{slide.text}</p>}
                <ImageSliderCta cta={slide.cta} className={styles.cta} />
              </div>
            </div>
          </div>
        ))}
      </ImageSliderViewport>
    </section>
  );
}
