import { groq } from 'next-sanity'

const SECTIONS = `
  sections[] {
    _type, _key,
    eyebrow, headline, subheadline, tagline, intro, body,
    quote, author, companyRole,
    alignment, textAlignment, contentLayout,
    backgroundColor, textColor,
    eyebrowColor, eyebrowFontSize,
    headlineColor, headlineFontSize,
    paddingTop, paddingBottom, itemTextColor,
    visualType, icon, statValue, statLabel,
    backgroundImage { asset, alt },
    photo { asset, alt },
    markImage { asset },
    wordImage { asset },
    hubNameImage { asset },
    ctaPrimary,
    ctaSecondary,
    taglineColor,
    ctaPrimaryBackground, ctaPrimaryTextColor,
    ctaPrimaryHoverBackground, ctaPrimaryHoverTextColor,
    ctaSecondaryColor, ctaSecondaryHoverBackground, ctaSecondaryHoverColor,
    apps[]{ _key, name, body },
    archItems[]{ _key, icon, iconBackgroundColor, title, body, backgroundColor, textColor, points[] },
    items[]{
      _key, title, body, href, linkLabel, icon,
      visualType, imageSize,
      image { asset, alt },
      width, titleFontSize,
      backgroundColor, hoverBackgroundColor, iconBackgroundColor, textColor
    },
    itemStyle,
    subheadlineColor, subheadlineFontSize, subheadlineDivider,
    title,
    links[]{ _key, label, href, style, icon, image { asset, alt } },
    linksLayout, borderScope, borderTopColor, borderBottomColor,
    buttonBackgroundColor, buttonTextColor,
    logos[]->{ _id, name, logo { asset, alt }, website },
    pillars[]{ _key, title, body },
    stripText,
    lede, ctaText,
    cta { label, href },
    components[]{ _key, label, description, icon, logo { asset, alt } },
  }
`

export const homePageQuery = groq`
  *[_id == "homePage"][0] {
    _id,
    seo { title, description, image { asset, alt } },
    ${SECTIONS}
  }
`

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id, title, slug, navTheme,
    seo { title, description, image { asset, alt } },
    ${SECTIONS}
  }
`

export const allPageSlugsQuery = groq`
  *[_type == "page" && defined(slug.current)].slug.current
`

export const navQuery = groq`
  *[_id == "nav"][0]{
    menuItems[]{ _key, label, href, megaColumns[]{ _key, links[]{ _key, label, href } } },
    rightLinks[]{ _key, label, style, action, href, external }
  }
`

export const footerQuery = groq`
  *[_id == "footer"][0]{
    tagline, email, phone,
    socialLinks[]{ _key, platform, url },
    columns[]{ _key, title, links[]{ _key, label, href, external } },
    orgLine
  }
`

export const kundcasesQuery = groq`
  *[_type == "kundcase"] | order(publishedAt desc)[0...3]{
    _id, client,
    "tag": coalesce(array::join(tags, " · "), ""),
    excerpt, testimonial,
    coverImage { asset, alt },
    slug
  }
`
