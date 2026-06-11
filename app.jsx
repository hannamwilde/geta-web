/* global React, ReactDOM, Nav, Hero, TrustBar, Mozaik, Services, Kundcase, ContactBanner, Trust, CaseStudy, PimSection, NewsEvents, Team, Newsletter, Footer, Modals, TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakSelect, TweakSlider, TweakToggle, TweakColor, PageSections */

const SEO_QUERIES = {
  home: `*[_id == "homePage"][0].seo{ title, description, ogImage{ asset } }`,
};

const MODALS_QUERY = `*[_type == "modals"][0]{
  bookTitle, bookSubtitle, bookFooterNote, bookSuccessTitle, bookSuccessMessage, bookTopics,
  contactTitle, contactSubtitle, contactFooterNote, contactSuccessTitle, contactSuccessMessage, contactTopics
}`;

const SEO_DEFAULTS = {
  title: 'Geta Digital — E-handel som håller.',
  description: 'Geta Digital är en nordisk e-handelskonsult. Strategi, design, PIM, integrationer och kontinuerlig utveckling — byggt för att skala, sedan 2010.',
};

function setMetaTag(attr, name, content) {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
  el.setAttribute('content', content);
}

function applySeo(data) {
  const title = (data && data.title) || SEO_DEFAULTS.title;
  const description = (data && data.description) || SEO_DEFAULTS.description;
  const image = data && data.ogImage && window.sanity
    ? window.sanity.imageUrl(data.ogImage, { width: 1200, height: 630 })
    : null;

  document.title = title;
  setMetaTag('name', 'description', description);
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:type', 'website');
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', description);
  if (image) {
    setMetaTag('property', 'og:image', image);
    setMetaTag('name', 'twitter:image', image);
  }
}

const PAGES_QUERY = `*[_type == "page"]{ _id, "slug": slug.current }`;

// Resolves the current hash against hardcoded routes first, then Sanity pages.
// pages=null means the page list hasn't loaded yet.
function resolveRoute(hash, pages) {
  const h = (hash || '').replace(/^#/, '');
  if (!h.startsWith('/')) return { name: 'home' };
  const parts = h.split('/').filter(Boolean);

  if (pages === null) return { name: 'loading' };
  const slug = parts.join('/');
  const match = pages.find(p => p.slug === slug);
  if (match) return { name: 'page', id: match._id, slug };

  return { name: 'home' };
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#F6AF00",
  "density": "comfortable",
  "heroVariant": "cards",
  "darkMode": false
}/*EDITMODE-END*/;

const App = () => {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [modal, setModal] = React.useState(null); // 'book' | 'contact' | null
  const [modalsCms, setModalsCms] = React.useState({});
  const [pages, setPages] = React.useState(null); // null = not yet loaded
  const [route, setRoute] = React.useState(() => resolveRoute(location.hash, null));

  // Load all Sanity page slugs once on mount
  React.useEffect(() => {
    if (!window.sanity) { setPages([]); return; }
    window.sanity.query(PAGES_QUERY)
      .then(data => setPages(data || []))
      .catch(() => setPages([]));
    window.sanity.query(MODALS_QUERY)
      .then(data => { if (data) setModalsCms(data); })
      .catch(() => {});
  }, []);

  // Re-resolve route whenever the page list loads or the hash changes
  React.useEffect(() => {
    setRoute(resolveRoute(location.hash, pages));
  }, [pages]);

  React.useEffect(() => {
    const onHash = () => {
      const next = resolveRoute(location.hash, pages);
      setRoute(next);
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [pages]);

  // Apply tweaks as CSS vars on :root
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--orange', tweaks.accent);
    root.dataset.density = tweaks.density;
    root.dataset.theme = tweaks.darkMode ? 'dark' : 'light';
  }, [tweaks]);

  // Scroll-reveal observer — re-armed on every route change so newly
  // mounted '.reveal' elements on sub-pages get observed too.
  React.useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    // useEffect already runs after the DOM is committed, so the elements
    // exist now. (Avoid rAF here — it can be throttled in hidden iframes.)
    document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [route]);

  // Update <head> meta on every route change
  React.useEffect(() => {
    if (!window.sanity) { applySeo(null); return; }
    const query = route.name === 'page'
      ? `*[_id == "${route.id}"][0].seo{ title, description, ogImage{ asset } }`
      : SEO_QUERIES[route.name];
    if (!query) { applySeo(null); return; }
    window.sanity.query(query)
      .then(data => applySeo(data))
      .catch(() => applySeo(null));
  }, [route]);

  const openContact = () => setModal('contact');
  const openBook = () => setModal('book');
  const close = () => setModal(null);

  return (
    <React.Fragment>
      <Nav onOpenContact={openContact} onOpenBook={openBook} />

      <main>
        {route.name === 'home' && (
          <React.Fragment>
            {window.PageSections && <PageSections documentId="homePage" onOpenBook={openBook} onOpenContact={openContact} />}
            {window.Footer && <Footer onOpenContact={openContact} />}
          </React.Fragment>
        )}
        {route.name === 'page' && (
          <React.Fragment>
            {window.PageSections && <PageSections documentId={route.id} onOpenBook={openBook} onOpenContact={openContact} />}
            {window.Footer && <Footer onOpenContact={openContact} />}
          </React.Fragment>
        )}
      </main>

      {window.Modals && <Modals mode={modal} onClose={close} cms={modalsCms} />}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Brand">
          <TweakColor
            label="Accent"
            value={tweaks.accent}
            onChange={v => setTweak('accent', v)}
            options={['#F6AF00', '#302AC1', '#A8DADB', '#CBB4AC', '#02423F']}
          />
        </TweakSection>
        <TweakSection label="Layout">
          <TweakRadio
            label="Density"
            value={tweaks.density}
            onChange={v => setTweak('density', v)}
            options={[{value:'comfortable', label:'Comfortable'}, {value:'compact', label:'Compact'}]}
          />
        </TweakSection>
      </TweaksPanel>
    </React.Fragment>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
