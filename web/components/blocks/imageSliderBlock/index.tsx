import Image from "next/image";
import { urlFor } from "@/sanity/client";
import ImageSliderBlockViewport from "./components/imageSliderBlockViewport";
import ImageSliderBlockCta, { type CTA } from "./components/imageSliderBlockCta";
import styles from "./styles.module.scss";
import { resolveBorder, type Border } from "@/lib/border";
import { fetchTranslations } from "@/lib/translations/server";
import { fill } from "@/lib/translations";

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
    border?: Border;
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

export default async function ImageSliderBlock({ block }: Props) {
  const { a11y } = await fetchTranslations();
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
      style={{ ...(s as React.CSSProperties), ...resolveBorder(block.border) }}
      data-align={block.alignment || "left"}
      data-text-align={block.textAlignment || block.alignment || "left"}
    >
      <ImageSliderBlockViewport
        t={a11y}
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
            aria-roledescription={a11y.sliderRole}
            aria-label={fill(a11y.sliderPosition, {
              n: i + 1,
              total: slides.length,
            })}
          >
            <Image
              className={styles.image}
              src={urlFor(slide.backgroundImage).width(1920).url()}
              alt={slide.backgroundImage?.alt || ""}
              width={1920}
              height={1080}
              sizes="100vw"
              // The first slide is above the fold and often the LCP element; the
              // rest stay lazy until the visitor scrolls the track to them.
              priority={i === 0}
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
                <ImageSliderBlockCta cta={slide.cta} className={styles.cta} />
              </div>
            </div>
          </div>
        ))}
      </ImageSliderBlockViewport>
    </section>
  );
}
