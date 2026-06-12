# Geta Web

The Geta Digital marketing website. No build step — vanilla HTML + React 18 (UMD) + Babel Standalone, content managed through Sanity CMS.

## Repos

| Repo | Purpose |
|---|---|
| `geta-web` | Front-end (this repo) |
| `studio-geta-web` | Sanity Studio (lives inside `studio-geta-web/`) |

---

## Prerequisites

- Node.js 18+ (for the Studio only)
- A Sanity account with access to project `a8gycbga`
- Python 3 (to serve the front-end locally — any static file server works)

---

## Front-end

The site is a single `index.html` file. There is no bundler or build step.

### Run locally

```bash
cd geta-web
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080).

The bootstrap script in `index.html` fetches each JSX and CSS file sequentially, compiles them with Babel Standalone, and mounts a React app. Sanity data is fetched at runtime via the plain HTTP API in `sanity-client.js` — no token required for published content.

### Project layout

```
index.html              Entry point + bootstrap loader
sanity-client.js        Lightweight Sanity HTTP client (window.sanity)
styles.css              Global design tokens and base styles
app.jsx                 Root React component and hash router
tweaks-panel.jsx        Dev-only live tweak panel (CSS vars)
assets/                 Static images and logos
components/
  nav/                  Global navigation bar
  hero/                 Page hero (homepage)
  mozaik/               Mozaik parallax ecosystem section
  mozaik-page/          Mozaik solution page blocks
  banner-block/         Flexible CTA banner block
  list-block/           Grid of cards/items block
  text-block/           Rich text block
  link-block/           Link grid block
  quote-block/          Pull-quote block
  services/             Services section
  kundcase/             Case studies section
  contact-banner/       Contact CTA section
  trust/                Trust bar (logos)
  footer/               Global footer
  modals/               Contact and booking modals
  page-sections/        Renders Sanity page sections by type
  ... (other sections)
```

### Adding a new component

1. Create `components/<name>/<name>.jsx` and `components/<name>/<name>.css`.
2. Register it globally at the bottom of the JSX file: `window.ComponentName = ComponentName`.
3. Add the CSS path to the `cssFiles` array in `index.html`.
4. Add the JSX path to the `files` array in `index.html` (before `page-sections.jsx`).
5. If it's a page section, add a `case` in `page-sections.jsx` and create a schema in `studio-geta-web/schemaTypes/objects/`.

---

## Sanity Studio

The Studio is a standard Sanity v3 project located in `studio-geta-web/`.

### First-time setup

```bash
cd studio-geta-web
npm install
```

Log in to Sanity (only needed once per machine):

```bash
npx sanity login
```

### Run the Studio locally

```bash
cd studio-geta-web
npm run dev
```

Opens at [http://localhost:3333](http://localhost:3333).

### Deploy the Studio

```bash
cd studio-geta-web
npm run deploy
```

This publishes the Studio to `https://geta-web.sanity.studio`.

### Project details

| Setting | Value |
|---|---|
| Project ID | `a8gycbga` |
| Dataset | `production` |
| Studio URL | `https://geta-web.sanity.studio` |

---

## Content model

All pages share the same `page` document type. Content is composed by adding sections in any order.

### Singleton documents

| Document | Purpose |
|---|---|
| `homePage` | Home page sections |
| `nav` | Navigation links and logo |
| `footer` | Footer links |
| `modals` | Contact and booking modal copy |

### Page documents (`page` type)

Pages are identified by their slug (e.g. `losningar/mozaik` → `#/losningar/mozaik`). Each page has:

- **Title** and **slug** (required)
- **SEO** — meta title, description, og:image
- **Nav theme** — `default` (dark green) or `purple` (Mozaik) — forces the nav bar colour on that page
- **Sections** — ordered list of content blocks (see below)

### Available section/block types

| Type | Description |
|---|---|
| `heroSection` | Full-height homepage hero |
| `trustBarSection` | Logo trust bar |
| `mozaikSection` | Mozaik parallax ecosystem |
| `servicesSection` | Services grid |
| `kundcaseSection` | Case studies carousel |
| `contactBannerSection` | Contact CTA strip |
| `bannerBlock` | Flexible CTA banner with optional visual, full colour control |
| `listBlock` | Grid of cards — icon, image or text items |
| `textBlock` | Rich text / prose section |
| `linkBlock` | Grid of links |
| `quoteBlock` | Pull quote |
| `mozaikHeroBlock` | Mozaik solution page hero |
| `mozaikFeaturesBlock` | Feature card grid (Mozaik page) |
| `mozaikArchBlock` | Architecture card grid with bullet points |
| `mozaikServicesBlock` | 12-service tile grid |
| `gridList` | Grid list |
| `mozaikGetaBandBlock` | "Geta & Mozaik" text band |
| `mozaikCtaBandBlock` | Dark CTA section (Mozaik page) |

### Other document types

| Type | Description |
|---|---|
| `kundcase` | Individual case study |
| `clientLogo` | Client logo (used in trust bar) |

---

## Adding a new page

1. In Sanity Studio, go to **Pages → New**.
2. Set a **Title** and **Slug** (e.g. `om-oss`). The page becomes available at `#/om-oss`.
3. Optionally set **Nav theme** if the page has a dark background.
4. Add sections in the **Page Sections** array.
5. Publish.

The front-end fetches all page slugs on load, so the new page is live immediately after publishing — no code changes required.

---

## Sanity image helper

`sanity-client.js` exposes `window.sanity.imageUrl(imageObj, opts)` for resolving Sanity image references with optional resizing and hotspot support:

```js
window.sanity.imageUrl(image, { width: 800 })          // resize to 800px wide
window.sanity.imageUrl(image, { height: 400 })          // resize to 400px tall
window.sanity.imageUrl(image, { width: 800, height: 400 }) // crop with hotspot
```

The helper applies crop and hotspot metadata automatically when present on the image object.
