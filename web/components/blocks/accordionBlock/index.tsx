import { resolveBackground, type BackgroundImage } from "@/lib/background";
import AccordionBlockList, {
  type AccordionItem,
} from "./components/accordionBlockList";
import styles from "./styles.module.scss";
import { resolveBorder, type Border } from "@/lib/border";

type Gradient = {
  type?: string;
  from?: string;
  to?: string;
  angle?: number;
  position?: string;
} | null;

type Props = {
  block: {
    backgroundImage?: BackgroundImage;
    border?: Border;
    eyebrow?: string;
    headline?: string;
    intro?: string;
    accordionItems?: AccordionItem[];
    backgroundColor?: string;
    backgroundGradient?: Gradient;
    eyebrowColor?: string;
    eyebrowFontSize?: number;
    headlineColor?: string;
    headlineFontSize?: number;
    introColor?: string;
    introFontSize?: number;
    itemBackgroundColor?: string;
    itemOpenBackgroundColor?: string;
    itemBorderColor?: string;
    itemOpenBorderColor?: string;
    numberBackgroundColor?: string;
    numberColor?: string;
    questionColor?: string;
    questionFontSize?: number;
    answerColor?: string;
    answerFontSize?: number;
    toggleColor?: string;
    linkColor?: string;
    showNumbers?: boolean;
    toggleIcon?: string;
    openFirstItem?: boolean;
    allowMultipleOpen?: boolean;
    borderRadius?: number;
    paddingTop?: number;
    paddingBottom?: number;
  };
};

// Every editable color is passed down as a custom property so the item styles can
// use them in :hover / open states without duplicating inline styles per element.
const vars: Record<string, keyof Props["block"]> = {
  "--acc-item-bg": "itemBackgroundColor",
  "--acc-item-open-bg": "itemOpenBackgroundColor",
  "--acc-item-border": "itemBorderColor",
  "--acc-item-open-border": "itemOpenBorderColor",
  "--acc-number-bg": "numberBackgroundColor",
  "--acc-number-color": "numberColor",
  "--acc-question-color": "questionColor",
  "--acc-answer-color": "answerColor",
  "--acc-toggle-color": "toggleColor",
  "--acc-link-color": "linkColor",
};

export default function AccordionBlock({ block }: Props) {
  const items = block.accordionItems ?? [];

  if (items.length === 0) return null;

  const sectionStyle: React.CSSProperties = {
    ...resolveBackground(block.backgroundColor, block.backgroundGradient, block.backgroundImage),
    ...resolveBorder(block.border),
    ...(block.paddingTop != null ? { paddingTop: block.paddingTop + "px" } : {}),
    ...(block.paddingBottom != null
      ? { paddingBottom: block.paddingBottom + "px" }
      : {}),
    ...(block.borderRadius != null
      ? { "--acc-radius": block.borderRadius + "px" }
      : {}),
    ...(block.questionFontSize
      ? { "--acc-question-size": block.questionFontSize + "px" }
      : {}),
    ...(block.answerFontSize
      ? { "--acc-answer-size": block.answerFontSize + "px" }
      : {}),
    ...Object.fromEntries(
      Object.entries(vars)
        .map(([cssVar, field]) => [cssVar, block[field]])
        .filter(([, value]) => Boolean(value)),
    ),
  } as React.CSSProperties;

  const eyebrowStyle: React.CSSProperties = {
    ...(block.eyebrowColor ? { color: block.eyebrowColor } : {}),
    ...(block.eyebrowFontSize
      ? { fontSize: block.eyebrowFontSize + "px" }
      : {}),
  };
  const headlineStyle: React.CSSProperties = {
    ...(block.headlineColor ? { color: block.headlineColor } : {}),
    ...(block.headlineFontSize
      ? { fontSize: block.headlineFontSize + "px" }
      : {}),
  };
  const introStyle: React.CSSProperties = {
    ...(block.introColor ? { color: block.introColor } : {}),
    ...(block.introFontSize ? { fontSize: block.introFontSize + "px" } : {}),
  };

  return (
    <section className={styles.section} style={sectionStyle}>
      <div className={styles.container}>
        {(block.eyebrow || block.headline || block.intro) && (
          <div className={styles.header}>
            {block.eyebrow && (
              <span className={styles.eyebrow} style={eyebrowStyle}>
                {block.eyebrow}
              </span>
            )}
            {block.headline && (
              <h2 className={styles.headline} style={headlineStyle}>
                {block.headline}
              </h2>
            )}
            {block.intro && (
              <p className={styles.intro} style={introStyle}>
                {block.intro}
              </p>
            )}
          </div>
        )}
        <AccordionBlockList
          items={items}
          showNumbers={block.showNumbers !== false}
          toggleIcon={block.toggleIcon === "chevron" ? "chevron" : "plusMinus"}
          openFirstItem={block.openFirstItem !== false}
          allowMultipleOpen={Boolean(block.allowMultipleOpen)}
          headingLevel={block.headline ? "h3" : "h2"}
        />
      </div>
    </section>
  );
}
