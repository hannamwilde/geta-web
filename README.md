# Geta Web

The Geta Digital marketing website. Built with Next.js 16 (App Router, React 19) and content managed through Sanity CMS.

## Structure

| Directory          | Purpose           |
| ------------------ | ----------------- |
| `web/`             | Next.js front-end |
| `studio-geta-web/` | Sanity Studio     |

---

## Front-end (`web/`)

### Prerequisites

- Node.js 20+
- A Sanity account with access to project `a8gycbga`

### Environment

Copy `web/.env.example` to `web/.env.local` and fill it in:

| Variable               | Purpose                                                            |
| ---------------------- | ------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL` | Public base URL — canonical URLs, sitemap, og:image                |
| `SANITY_API_TOKEN`     | Sanity read token                                                  |
| `SENDGRID_API_KEY`     | Contact form delivery (`app/api/contact/route.ts`)                 |
| `CONTACT_FROM_EMAIL`   | Verified SendGrid sender. The _recipient_ lives in Sanity → Modals |

### Run locally

```bash
cd web
npm install
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000).

### Build

```bash
cd web
npm run build
npm run start
```

> **Note:** this is Next.js 16 — APIs and conventions differ from older versions. See `web/AGENTS.md`; the bundled docs live in `web/node_modules/next/dist/docs/`.

### Project layout

```
web/
  app/
    layout.tsx              Root layout — nav, footer, modals, cookie consent, metadata
    page.tsx                Home page (homePage document)
    [...slug]/page.tsx      All CMS pages, fetched by slug
    blog/                   Blog list + /blog/[slug] post pages
    events/                 /events/[slug] event pages
    api/contact/route.ts    Contact form endpoint (SendGrid)
    sitemap.ts, robots.ts   Generated from Sanity
    error.tsx, global-error.tsx, not-found.tsx
    globals.css             Design tokens and base styles
  components/
    blocks/                 Sanity page blocks, one folder per block
      pageBlocks/           Renders a page's blocks by _type
    layout/                 App chrome — nav, footer, contactModal, cookieConsent
    ui/                     Shared primitives — icon, backgroundMedia
  context/
    NavThemeContext.tsx     Nav colour theme per page
    ContactModalContext.tsx Opens the contact/booking modal from anywhere
    CookieConsentContext.tsx
  lib/
    translations/           Swedish UI strings, sourced from Sanity
    background.ts, border.ts, href.ts, resolveHref.ts,
    seo.ts, siteUrl.ts, imageDimensions.ts, sanityImageLoader.ts,
    contactForm.ts, googleCalendar.ts, cookieConsent.ts
  sanity/
    client.ts               Sanity client + image URL builder
    queries.ts              All GROQ queries
  public/assets/            Static images and logos
```

Component conventions (where a component goes, folder shape, sub-components) are documented in `web/CLAUDE.md`.

### Adding a new block type

1. Create `web/components/blocks/<name>Block/` with `index.tsx` and `styles.module.scss`.
2. Add a `case "<name>Block"` to `web/components/blocks/pageBlocks/index.tsx`.
3. Add a matching schema object in `studio-geta-web/schemaTypes/objects/` and register it in `schemaTypes/index.ts`.
4. Add the block to the `blocks` array in `studio-geta-web/schemaTypes/documents/page.ts` (and `homePage.ts` if it belongs there).
5. Add the new fields to the `BLOCKS` projection in `web/sanity/queries.ts`.

---

## Sanity Studio (`studio-geta-web/`)

### First-time setup

```bash
cd studio-geta-web
npm install
npx sanity login
```

### Run locally

```bash
cd studio-geta-web
npm run dev
```

Opens at [http://localhost:3333](http://localhost:3333).

### Deploy

```bash
cd studio-geta-web
npm run deploy
```

Publishes to `https://geta-web.sanity.studio`.

### Project details

| Setting    | Value                            |
| ---------- | -------------------------------- |
| Project ID | `a8gycbga`                       |
| Dataset    | `production`                     |
| Studio URL | `https://geta-web.sanity.studio` |

The Studio sidebar is a custom structure (`studio-geta-web/structure.ts`): singletons first, then Pages, then the content collections.

---

## Content model

### Singleton documents

| Document       | Purpose                                                   |
| -------------- | --------------------------------------------------------- |
| `homePage`     | Home page blocks                                          |
| `nav`          | Navigation links and logo                                 |
| `footer`       | Footer links and copy                                     |
| `siteSettings` | Default SEO title/description, locale, noindex            |
| `translations` | UI strings (labels, a11y text) used by `lib/translations` |
| `modals`       | Contact and booking modal copy, contact recipient         |

### Page documents (`page` type)

Pages are identified by their slug (e.g. `losningar/mozaik` → `/losningar/mozaik`). Each page has:

- **Title** and **URL** slug (required)
- **SEO** — meta title, description, og:image
- **Nav theme** — `default` (dark green) or `purple` (Mozaik) — forces the nav bar colour on that page
- **Page Blocks** — ordered list of content blocks

### Collection documents

| Type         | Description                            |
| ------------ | -------------------------------------- |
| `post`       | Blog post — rendered at `/blog/[slug]` |
| `event`      | Event — rendered at `/events/[slug]`   |
| `case`       | Case study — surfaced by `casesBlock`  |
| `clientLogo` | Client logo — used by `trustBarBlock`  |

### Available block types

| Type                  | Studio title                | Description                                  |
| --------------------- | --------------------------- | -------------------------------------------- |
| `heroBlock`           | Hero                        | Page hero                                    |
| `trustBarBlock`       | Trust Bar                   | Client logo bar                              |
| `textBlock`           | Text Block                  | Rich text / prose                            |
| `listBlock`           | List Block                  | Grid of cards — icon, image or text items    |
| `gridListBlock`¹      | Grid list                   | Grid list                                    |
| `bulletListBlock`     | Bullet List Block           | Bullet list                                  |
| `growingListBlock`    | Growing list                | List that expands on scroll                  |
| `linkBlock`           | Link Block                  | Grid of links                                |
| `quoteBlock`          | Quote Block                 | Pull quote                                   |
| `accordionBlock`      | Accordion Block             | Expandable Q&A / detail list                 |
| `bannerBlock`         | Banner                      | Flexible CTA banner with full colour control |
| `contactBannerBlock`  | Contact Banner              | Contact CTA strip                            |
| `imageSliderBlock`    | Image slider                | Full-bleed image carousel with copy and CTA  |
| `casesBlock`          | Cases                       | Case study carousel                          |
| `eventsBlock`         | Events                      | Upcoming and past events                     |
| `mozaikBlock`         | Mozaik — Ecosystem          | Mozaik parallax ecosystem                    |
| `mozaikServicesBlock` | Mozaik — twelve services    | Mozaik services grid                         |
| `mozaikPropsHeading`  | Mozaik — properties heading | Mozaik section heading                       |

¹ Registered under the `_type` `GridList` for historical reasons; the component folder is `gridListBlock`.

### Nav mega menu links

Each mega menu link has:

- **Label** and **URL** (required)
- **Open in new tab** — shows the external arrow icon and opens in a new tab
- **Highlight (purple gradient)** — renders the label with a purple gradient text style

---

## Adding a new page

1. In Sanity Studio, go to **Pages → New**.
2. Set a **Title** and **URL** slug (e.g. `om-oss`). The page becomes available at `/om-oss`.
3. Optionally set **Nav theme** if the page has a dark background.
4. Add blocks in the **Page Blocks** array.
5. Publish.

No code changes required — `[...slug]/page.tsx` handles all slugs automatically.
