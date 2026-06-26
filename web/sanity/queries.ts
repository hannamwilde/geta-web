import { groq } from 'next-sanity'

const SECTIONS = `
  sections[] {
    _type, _key,
    eyebrow, headline, subheadline, tagline, intro, body,
    quote, author, companyRole,
    alignment, textAlignment, contentLayout,
    backgroundColor, backgroundGradient { type, from, to, angle, position }, textColor, iconColor,
    eyebrowStyle, eyebrowColor, eyebrowFontSize,
    headlineColor, headlineFontSize,
    paddingTop, paddingBottom, itemTextColor,
    visualType, icon, statValue, statLabel,
    backgroundImage { asset, alt },
    sideImage { asset, alt },
    sideImagePosition,
    photo { asset, alt },
    markImage { asset },
    wordImage { asset },
    hubNameImage { asset },
    ctaPrimary { label, action, href, linkType, pageRef->{ slug } },
    ctaSecondary { label, action, href, linkType, pageRef->{ slug } },
    taglineColor,
    taglineGradientFrom, taglineGradientTo, taglineGradientAngle,
    ctaPrimaryBackground, ctaPrimaryTextColor,
    ctaPrimaryHoverBackground, ctaPrimaryHoverTextColor,
    ctaSecondaryColor, ctaSecondaryHoverBackground, ctaSecondaryHoverColor,
    apps[]{ _key, name, body, icon },
    archItems[]{ _key, icon, iconBackgroundColor, title, body, backgroundColor, textColor, iconColor, points[] },
    items[]{
      _key, title, body, href, linkType, pageRef->{ slug }, linkLabel, icon,
      visualType, imageSize,
      image { asset, alt },
      width, titleFontSize,
      backgroundColor, hoverBackgroundColor, iconBackgroundColor, textColor
    },
    itemStyle,
    subheadlineColor, subheadlineFontSize, subheadlineDivider,
    title,
    links[]{ _key, label, href, linkType, pageRef->{ slug }, style, icon, image { asset, alt } },
    linksLayout, borderScope, borderTopColor, borderBottomColor,
    buttonBackgroundColor, buttonTextColor,
    ctaTextColor, buttonHoverBackground, buttonHoverTextColor, domeBackgroundColor,
    logos[]->{ _id, name, logo { asset, alt }, website },
    pillars[]{ _key, title, body, image { asset, alt } },
    lede, ctaText,
    cta { label, href },
    components[]{ _key, label, description, icon, logo { asset, alt } },
    upcomingLabel, upcomingWebinarLabel, pastLabel, pastWebinarLabel, registerLabel,
  }
`

export const homePageQuery = groq`
  *[_id == "homePage"][0] {
    _id,
    seo { title, description, noIndex, ogImage { asset, alt } },
    ${SECTIONS}
  }
`

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id, title, slug, navTheme,
    seo { title, description, noIndex, ogImage { asset, alt } },
    ${SECTIONS}
  }
`

export const allPageSlugsQuery = groq`
  *[_type == "page" && defined(slug.current)].slug.current
`

export const sitemapPagesQuery = groq`
  *[_type == "page" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt,
    "noIndex": seo.noIndex
  }
`

export const sitemapHomeQuery = groq`
  *[_id == "homePage"][0] { _updatedAt, "noIndex": seo.noIndex }
`

export const navQuery = groq`
  *[_id == "nav"][0]{
    menuItems[]{
      _key, label, href, linkType, pageRef->{ slug },
      megaColumns[]{ _key, links[]{ _key, label, href, linkType, pageRef->{ slug }, external, highlight } }
    },
    rightLinks[]{ _key, label, style, action, href, linkType, pageRef->{ slug }, external }
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

export const upcomingEventsQuery = groq`
  *[_type == "event" && date >= now()] | order(date asc) {
    _id, title, date, endDate, location, excerpt, registrationUrl, eventType,
    image { asset, alt }
  }
`

export const pastEventsQuery = groq`
  *[_type == "event" && date < now()] | order(date desc) [0...50] {
    _id, title, date, location, excerpt, eventType,
    image { asset, alt }
  }
`

export const translationsQuery = groq`
  *[_type == "translations"][0] {
    general { readMore, contact },
  }
`

export const casesQuery = groq`
  *[_type == "case"] | order(publishedAt desc)[0...3]{
    _id, client,
    "tag": coalesce(array::join(tags, " · "), ""),
    excerpt, testimonial,
    coverImage { asset, alt },
    slug
  }
`
