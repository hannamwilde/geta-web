import { urlFor } from "@/sanity/client";
import { fetchTranslations } from "@/lib/translations/server";
import { resolveBackground } from "@/lib/background";
import CasesCTA from "./components/casesCta";
import styles from "./styles.module.scss";

type Testimonial = { quote?: string; person?: string; role?: string };
type CaseItem = {
  _id: string;
  client: string;
  tag?: string;
  excerpt?: string;
  testimonial?: Testimonial;
  coverImage?: { asset: unknown; alt?: string };
  slug?: { current?: string };
};

type Props = {
  block: {
    title?: string;
    lede?: string;
    ctaText?: string;
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
    ctaTextColor?: string;
    buttonBackgroundColor?: string;
    buttonTextColor?: string;
    buttonHoverBackground?: string;
    buttonHoverTextColor?: string;
    borderRadius?: number;
  };
  cases: CaseItem[];
};

function CaseCard({ item, index }: { item: CaseItem; index: number }) {
  const imgUrl = item.coverImage?.asset
    ? urlFor(item.coverImage).width(600).height(480).url()
    : null;

  return (
    <article
      className={styles.card}
      style={{ "--d": `${index * 0.09}s` } as React.CSSProperties}
    >
      <div className={styles.media}>
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={item.coverImage?.alt || item.client}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "var(--forest-tint)",
            }}
          />
        )}
        {item.tag && <span className={styles.tag}>{item.tag}</span>}
      </div>
      <div className={styles.body}>
        <h3 className={styles.client}>{item.client}</h3>
        {item.excerpt && <p className={styles.summary}>{item.excerpt}</p>}
        {item.testimonial?.quote && (
          <blockquote className={styles.quote}>
            <span className={styles.quoteMark} aria-hidden>
              &ldquo;
            </span>
            {item.testimonial.quote}
            <span className={styles.quoteMark} aria-hidden>
              &rdquo;
            </span>
          </blockquote>
        )}
        {item.testimonial?.person && (
          <div className={styles.byline}>
            <span className={styles.bylineName}>{item.testimonial.person}</span>
            {item.testimonial.role && (
              <span className={styles.bylineRole}>{item.testimonial.role}</span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default async function Cases({ block, cases }: Props) {
  const t = await fetchTranslations();
  if (!cases || cases.length === 0) return null;

  const bg = resolveBackground(block.backgroundColor, block.backgroundGradient);
  const sectionStyle: React.CSSProperties = {
    ...(Object.keys(bg).length ? bg : {}),
    ...(block.borderRadius != null
      ? ({
          "--r-lg": block.borderRadius + "px",
          "--r-xl": block.borderRadius + "px",
        } as React.CSSProperties)
      : {}),
  };
  const titleStyle: React.CSSProperties = block.headlineColor
    ? { color: block.headlineColor }
    : {};
  const ledeStyle: React.CSSProperties = block.textColor
    ? { color: block.textColor }
    : {};
  const ctaTextStyle: React.CSSProperties = block.ctaTextColor
    ? { color: block.ctaTextColor }
    : {};

  return (
    <section className={styles.section} id="cases" style={sectionStyle}>
      <div className="container">
        {(block.title || block.lede) && (
          <div className={styles.head}>
            {block.title && (
              <h2 className={styles.title} style={titleStyle}>
                {block.title}
              </h2>
            )}
            {block.lede && (
              <p className={styles.lede} style={ledeStyle}>
                {block.lede}
              </p>
            )}
          </div>
        )}
        <div className={styles.grid}>
          {cases.map((c, i) => (
            <CaseCard key={c._id} item={c} index={i} />
          ))}
        </div>
        <div className={styles.cta}>
          {block.ctaText && (
            <p className={styles.ctaText} style={ctaTextStyle}>
              {block.ctaText}
            </p>
          )}
          <CasesCTA
            label={t.general.contact}
            bgColor={block.buttonBackgroundColor}
            textColor={block.buttonTextColor}
            hoverBgColor={block.buttonHoverBackground}
            hoverTextColor={block.buttonHoverTextColor}
          />
        </div>
      </div>
    </section>
  );
}
