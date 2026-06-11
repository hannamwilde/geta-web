/* global React, Hero, TrustBar, Mozaik, Services, Kundcase, ContactBanner, TextBlock, ListBlock, BannerBlock, LinkBlock, QuoteBlock */

const sectionsQuery = (id) => `*[_id == "${id}"][0].sections[]{
  _type,
  _key,
  eyebrow,
  ctaPrimary,
  ctaSecondary,
  title,
  headline,
  subheadline,
  tagline,
  intro,
  body,
  alignment,
  contentLayout,
  backgroundColor,
  subheadlineDivider,
  textColor,
  eyebrowFontSize,
  headlineColor,
  headlineFontSize,
  taglineFontSize,
  introFontSize,
  subheadlineColor,
  subheadlineFontSize,
  logos[]->{ _id, name, logo { asset, alt, hotspot, crop }, website },
  backgroundImage { asset, alt, hotspot, crop },
  itemTextColor,
  items[]{ _key, title, titleFontSize, body, visualType, icon, image { asset, alt, hotspot, crop }, imageSize, width, href, linkLabel, textColor, backgroundColor, hoverBackgroundColor },
  links[]{ _key, label, href, style, icon, image { asset, alt, hotspot, crop } },
  linksLayout,
  buttonBackgroundColor,
  buttonTextColor,
  borderTopColor,
  borderBottomColor,
  borderScope,
  quote,
  author,
  companyRole,
  visualType,
  photo { asset, alt },
  icon,
  statValue,
  statLabel,
  headlineColor,
  taglineColor,
  ctaPrimaryBackground,
  ctaPrimaryTextColor,
  ctaPrimaryHoverBackground,
  ctaPrimaryHoverTextColor,
  ctaSecondaryColor,
  ctaSecondaryHoverBackground,
  ctaSecondaryHoverColor,
  paddingTop,
  paddingBottom
}`;

const PageSections = ({onOpenContact, onOpenBook, documentId}) => {
  const [sections, setSections] = React.useState(null);

  React.useEffect(() => {
    if (!window.sanity || !documentId) return;
    setSections(null);
    window.sanity.query(sectionsQuery(documentId))
      .then(data => { if (Array.isArray(data)) setSections(data); })
      .catch(() => {});
  }, [documentId]);

  const list = Array.isArray(sections) ? sections : [];

  return list.map((block, i) => {
    const key = block._key || i;
    switch (block._type) {
      case 'heroSection':
        return window.Hero
          ? <Hero key={key} block={block} onOpenBook={onOpenBook} onOpenContact={onOpenContact} />
          : null;
      case 'trustBarSection':
        return window.TrustBar ? <TrustBar key={key} block={block} /> : null;
      case 'mozaikSection':
        return window.Mozaik ? <Mozaik key={key} onOpenContact={onOpenContact} /> : null;
      case 'servicesSection':
        return window.Services ? <Services key={key} /> : null;
      case 'kundcaseSection':
        return window.Kundcase ? <Kundcase key={key} onOpenContact={onOpenContact} /> : null;
      case 'contactBannerSection':
        return window.ContactBanner ? <ContactBanner key={key} onOpenContact={onOpenContact} /> : null;
      case 'textBlock':
        return window.TextBlock ? <TextBlock key={key} block={block} /> : null;
      case 'listBlock':
        return window.ListBlock ? <ListBlock key={key} block={block} /> : null;
      case 'bannerBlock':
        return window.BannerBlock
          ? <BannerBlock key={key} block={block} onOpenContact={onOpenContact} onOpenBook={onOpenBook} />
          : null;
      case 'linkBlock':
        return window.LinkBlock ? <LinkBlock key={key} block={block} /> : null;
      case 'quoteBlock':
        return window.QuoteBlock ? <QuoteBlock key={key} block={block} /> : null;
      default:
        return null;
    }
  });
};

window.PageSections = PageSections;
