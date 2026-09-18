import { groq } from 'next-sanity'

const BLOCKS = `
  blocks[] {
    _type, _key,
    eyebrow, headline, subheadline, tagline, intro, body,
    quote, author, role, companyRole,
    image { asset, alt, crop, hotspot },
    alignment, textAlignment, contentLayout,
    backgroundColor, backgroundGradient { type, from, to, angle, start, position }, textColor, iconColor, iconBackgroundColor,
    eyebrowStyle, eyebrowColor, eyebrowFontSize,
    headlineColor, headlineFontSize,
    paddingTop, paddingBottom, maxWidth, borderRadius, itemTextColor,
    contentBackgroundColor, contentBorderRadius, contentPadding,
    border { top, bottom, color, width },
    visualType, visualPosition, icon, statValue, statLabel,
    backgroundImage { asset, alt, crop, hotspot },
    backgroundVideo { asset->{ url, mimeType } },
    overlayColor, overlayOpacity, overlayGradient { type, from, to, angle, start, position },
    sideImage { asset, alt, crop, hotspot },
    sideImagePosition,
    photo { asset, alt, crop, hotspot },
    markImage { asset }, markWidth,
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
    introColor, introFontSize,
    itemBackgroundColor, itemOpenBackgroundColor, itemBorderColor, itemOpenBorderColor,
    numberBackgroundColor, numberColor,
    questionColor, questionFontSize, answerColor, answerFontSize,
    toggleColor, linkColor,
    showNumbers, toggleIcon, openFirstItem, allowMultipleOpen,
    accordionItems[]{
      _key, question, answer,
      cta { label, action, href, linkType, pageRef->{ slug } }
    },
    items[]{
      _key, title, body, href, linkType, pageRef->{ slug }, linkLabel, icon, piece,
      visualType, imageSize, imageHeight,
      image { asset, alt, crop, hotspot },
      width, titleFontSize,
      backgroundColor, hoverBackgroundColor, iconBackgroundColor, textColor
    },
    itemStyle,
    subheadlineColor, subheadlineFontSize, subheadlineDivider,
    title,
    links[]{ _key, label, href, linkType, pageRef->{ slug }, style, icon, image { asset, alt, crop, hotspot } },
    linksLayout, borderScope, borderTopColor, borderBottomColor,
    buttonBackgroundColor, buttonTextColor,
    ctaTextColor, buttonHoverBackground, buttonHoverTextColor, domeBackgroundColor,
    logos[]->{ _id, name, logo { asset, alt }, website },
    pillars[]{ _key, title, body, image { asset, alt, crop, hotspot }, linkLabel, linkType, href, pageRef->{ slug } },
    lede, ctaText,
    cta { label, action, href, linkType, pageRef->{ slug } },
    topGroup { label, items[]{ _key, label } },
    leftGroup { label, items[]{ _key, label } },
    rightGroup { label, items[]{ _key, label } },
    bottomGroup { label, items[]{ _key, label } },
    upcomingLabel, upcomingWebinarLabel, pastLabel, pastWebinarLabel, registerLabel,
    autoplay, autoplayInterval, showArrows, showDots, minHeight,
    ctaBackground, ctaTextColor, ctaHoverBackground, ctaHoverTextColor,
    slides[]{
      _key, title, text,
      backgroundImage { asset, alt, crop, hotspot },
      cta { label, action, href, linkType, pageRef->{ slug } }
    },
  }
`

export const homePageQuery = groq`
  *[_id == "homePage"][0] {
    _id,
    seo { title, description, noIndex, ogImage { asset, alt, crop, hotspot } },
    ${BLOCKS}
  }
`

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id, title, slug, navTheme,
    seo { title, description, noIndex, ogImage { asset, alt, crop, hotspot } },
    ${BLOCKS}
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

export const sitemapPostsQuery = groq`
  *[_type == "post" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
`

export const sitemapEventsQuery = groq`
  *[_type == "event" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
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
    _id, title, "slug": slug.current, date, endDate, location, excerpt, registrationUrl, eventType,
    image { asset, alt, crop, hotspot }
  }
`

export const pastEventsQuery = groq`
  *[_type == "event" && date < now()] | order(date desc) [0...50] {
    _id, title, "slug": slug.current, date, location, excerpt, eventType,
    image { asset, alt, crop, hotspot }
  }
`

export const allEventSlugsQuery = groq`
  *[_type == "event" && defined(slug.current)].slug.current
`

export const eventBySlugQuery = groq`
  *[_type == "event" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, eventType,
    date, endDate, location, registrationUrl,
    excerpt, image { asset, alt, crop, hotspot },
    subtitle, lead,
    heroImage { asset, alt, crop, hotspot },
    takeawaysHeadline, takeawaysBody,
    takeaways,
    agendaTitle, agendaSub,
    agenda[] { _key, title, sub },
    speakersTitle,
    speakers[] {
      _key, name, role, bio,
      photo { asset, alt, crop, hotspot }
    },
    heroCtaLabel, takeawaysEyebrow,
    ctaTitle, ctaBody, ctaButtonLabel
  }
`

export const modalsQuery = groq`
  *[_id == "modals"][0] {
    bookEyebrow, bookTitle, bookSubtitle, bookFooterNote, bookSuccessTitle, bookSuccessMessage,
    bookCalendarUrl,
    contactEyebrow, contactTitle, contactSubtitle, contactFooterNote, contactSuccessTitle, contactSuccessMessage, contactTopics
  }
`

/**
 * Server-only. Deliberately not part of modalsQuery: that result is passed to a
 * client component, and the recipient address must not reach the browser.
 */
export const contactRecipientQuery = groq`
  *[_id == "modals"][0].contactRecipientEmail
`

export const siteSettingsQuery = groq`
  *[_id == "siteSettings"][0] {
    siteName, locale, defaultTitle, titleTemplate, description,
    favicon { asset },
    placeholderImage { asset, alt, crop, hotspot },
    ogImage { asset, alt, crop, hotspot },
    twitterSite, noIndex
  }
`

export const translationsQuery = groq`
  *[_id == "translations"][0] {
    general { readMore, contact },
    errorPages {
      notFoundTitle, notFoundBody, notFoundCta,
      errorTitle, errorBody, errorRetry
    },
    modal {
      close, errorMsg, sending, successFallback,
      submit,
      fieldName, fieldEmail, fieldCompany, fieldTopic, fieldMessage,
      topicPlaceholder, phName, phEmail, phCompany, phMessageContact, phMessageBook
    },
    cookieConsent {
      title, body, accept, reject, policyLabel, policyHref
    },
    blogList {
      title, lead, empty, metaTitle, backToList,
      paginationLabel, prevPage, nextPage
    },
    eventPage {
      typeWebinar, typeEvent, factDate, factTime, factLocation, back
    },
    a11y {
      homeLink, menu, toTop, breadcrumb, trustBar,
      slider, sliderRole, sliderPrev, sliderNext, sliderGoTo, sliderPosition
    }
  }
`

export const allPostSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)].slug.current
`

export const blogCountQuery = groq`
  count(*[_type == "post"])
`

export const blogListQuery = groq`
  *[_type == "post"] | order(publishedAt desc) [$start...$end] {
    _id, title, "slug": slug.current, publishedAt, author, excerpt, tags,
    coverImage { asset, alt, crop, hotspot }
  }
`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, publishedAt, author, excerpt, tags,
    coverImage { asset, alt, crop, hotspot },
    body
  }
`

export const casesQuery = groq`
  *[_type == "case"] | order(publishedAt desc)[0...3]{
    _id, client,
    "tag": coalesce(array::join(tags, " · "), ""),
    excerpt, testimonial,
    coverImage { asset, alt, crop, hotspot },
    slug
  }
`
