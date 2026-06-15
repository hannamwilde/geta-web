# Geta Web

The Geta Digital marketing website. Built with Next.js 16 (App Router) and content managed through Sanity CMS.

## Structure

| Directory | Purpose |
|---|---|
| `web/` | Next.js front-end |
| `studio-geta-web/` | Sanity Studio |

---

## Front-end (`web/`)

### Prerequisites

- Node.js 18+
- A Sanity account with access to project `a8gycbga`

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

### Project layout

```
web/
  app/
    layout.tsx            Root layout — fetches nav + footer, wraps NavThemeProvider
    page.tsx              Home page (fetches homePage document)
    [...slug]/page.tsx    All other pages (fetched by slug)
    globals.css           Global design tokens and base styles
  components/
    nav/                  Nav bar (Nav.tsx + Nav.module.css)
    footer/               Footer
    hero/                 Page hero
    mozaik/               Mozaik parallax ecosystem section
    mozaik-hero/          Mozaik solution page hero block
    banner-block/         Flexible CTA banner
    list-block/           Grid of cards/items
    bullet-list-block/    Bullet list section
    text-block/           Rich text section
    link-block/           Link grid
    quote-block/          Pull quote
    grid-list/            Grid list
    services/             Services section
    kundcase/             Case studies section
    contact-banner/       Contact CTA section
    trust-bar/            Logo trust bar
    icons/                Icon component
    page-sections/        Renders Sanity page sections by _type
  context/
    NavThemeContext.tsx    Provides navTheme to the Nav from any page
  lib/
    href.ts               normalizeHref utility
  sanity/
    client.ts             Sanity client (next-sanity)
    queries.ts            All GROQ queries
  public/assets/          Static images and logos
```

### Adding a new section type

1. Create `components/<name>/<Name>.tsx` and `<Name>.module.css`.
2. Add a `case` for it in `components/page-sections/PageSections.tsx`.
3. Add a matching schema object in `studio-geta-web/schemaTypes/objects/` and register it in `schemaTypes/index.ts`.
4. Add any new fields to the `SECTIONS` projection in `sanity/queries.ts`.

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

| Setting | Value |
|---|---|
| Project ID | `a8gycbga` |
| Dataset | `production` |
| Studio URL | `https://geta-web.sanity.studio` |

---

## Content model

### Singleton documents

| Document | Purpose |
|---|---|
| `homePage` | Home page sections |
| `nav` | Navigation links and logo |
| `footer` | Footer links and copy |
| `modals` | Contact and booking modal copy |

### Page documents (`page` type)

Pages are identified by their slug (e.g. `losningar/mozaik` → `/losningar/mozaik`). Each page has:

- **Title** and **slug** (required)
- **SEO** — meta title, description, og:image
- **Nav theme** — `default` (dark green) or `purple` (Mozaik) — forces the nav bar colour on that page
- **Sections** — ordered list of content blocks

### Available section types

| Type | Description |
|---|---|
| `heroSection` | Full-height homepage hero |
| `trustBarSection` | Logo trust bar |
| `mozaikSection` | Mozaik parallax ecosystem |
| `servicesSection` | Services grid |
| `kundcaseSection` | Case studies carousel |
| `contactBannerSection` | Contact CTA strip |
| `bannerBlock` | Flexible CTA banner with full colour control |
| `listBlock` | Grid of cards — icon, image or text items |
| `bulletListBlock` | Bullet list section |
| `textBlock` | Rich text / prose section |
| `linkBlock` | Grid of links |
| `quoteBlock` | Pull quote |
| `mozaikHeroBlock` | Mozaik solution page hero |
| `GridList` | Grid list |

### Nav mega menu links

Each mega menu link has:

- **Label** and **URL** (required)
- **Open in new tab** — shows the external arrow icon and opens in a new tab
- **Highlight (purple gradient)** — renders the label with a purple gradient text style

### Other document types

| Type | Description |
|---|---|
| `kundcase` | Individual case study |
| `clientLogo` | Client logo (used in trust bar) |

---

## Adding a new page

1. In Sanity Studio, go to **Pages → New**.
2. Set a **Title** and **Slug** (e.g. `om-oss`). The page becomes available at `/om-oss`.
3. Optionally set **Nav theme** if the page has a dark background.
4. Add sections in the **Page Sections** array.
5. Publish.

No code changes required — `[...slug]/page.tsx` handles all slugs automatically.
