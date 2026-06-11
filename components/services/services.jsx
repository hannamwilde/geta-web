/* global React */

// Services — three capability cards + experts strip, on deep forest.
// The Geta line-art mountain sits behind everything and reacts to scroll
// (parallax) with a slow continuous float + glow pulse.

const TLEV_QUERY = `*[_id == "homePage"][0].sections[_type == "servicesSection"][0]{
  headline,
  pillars[]{ _key, title, body },
  stripText
}`;

// Icons are decorative — kept in code, mapped by pillar index.
const TLEV_ICONS = [
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="24" cy="24" r="13" />
    <circle cx="24" cy="24" r="7.5" />
    <circle cx="24" cy="24" r="2" fill="currentColor" stroke="none" />
    <path d="M24 11V5M24 43v-6M11 24H5M43 24h-6" opacity="0.55" />
    <path d="M24 24l9-9" />
  </svg>,
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 17l-7 7 7 7" />
    <path d="M29 17l7 7-7 7" />
  </svg>,
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M13 21v6a2 2 0 0 0 2 2h2l2.5 5a1.5 1.5 0 0 0 2.8-.8V29" />
    <path d="M13 21l16-7v20l-16-7z" />
    <path d="M13 21H11a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2" />
    <path d="M33 19a5 5 0 0 1 0 10" opacity="0.7" />
  </svg>,
];

const Services = () => {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    if (!window.sanity) return;
    window.sanity.query(TLEV_QUERY)
      .then(function (d) { if (d) setData(d); })
      .catch(function () {});
  }, []);
  const sectionRef = React.useRef(null);
  const mountainRef = React.useRef(null);

  React.useEffect(() => {
    const sec = sectionRef.current;
    const mtn = mountainRef.current;
    if (!sec || !mtn) return;

    // Reveal-on-scroll: arm the section (hide children) only once JS is
    // running, then add `in` when it scrolls into view. If JS never runs the
    // content stays visible — no dependence on global observer timing.
    sec.dataset.anim = '';
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { sec.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    io.observe(sec);

    const vhNow = () => window.innerHeight || document.documentElement.clientHeight || 1;
    const update = () => {
      const r = sec.getBoundingClientRect();
      const vh = vhNow();
      const prog = (vh - r.top) / (vh + r.height) * 2 - 1;
      const shift = Math.max(-1, Math.min(1, prog));
      // One normalised value drives several aurora layers at different
      // speeds (multipliers live in CSS) for a parallax depth effect.
      mtn.style.setProperty('--veil-p', shift.toFixed(3));
    };
    // Compute synchronously on every scroll/resize. We deliberately avoid a
    // requestAnimationFrame gate: getBoundingClientRect for one element is
    // cheap, and a direct write keeps the parallax in sync even in contexts
    // where rAF callbacks are throttled (background/offscreen frames).
    const onScroll = () => update();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  if (!data) return null;

  return (
    <section className="tlev" id="services" ref={sectionRef}>
      <div className="container tlev-inner">
        {data.headline && (
          <h2 className="tlev-title">{data.headline}</h2>
        )}

        {data.pillars && data.pillars.length > 0 && (
          <div className="tlev-grid">
            {data.pillars.map((pillar, i) => (
              <article className="tlev-card" key={pillar._key}>
                <div className="tlev-card-icon">{TLEV_ICONS[i] || TLEV_ICONS[0]}</div>
                <h3 className="tlev-card-title">{pillar.title}</h3>
                {pillar.body && <p className="tlev-card-body">{pillar.body}</p>}
              </article>
            ))}
          </div>
        )}

        {data.stripText && (
          <div className="tlev-strip">
            <div className="tlev-strip-icon">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="9" cy="8" r="3.2" />
                <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
                <path d="M16 5.4a3 3 0 0 1 0 5.4" />
                <path d="M17.5 14.7c2.1.7 3.5 2.5 3.5 5.3" />
              </svg>
            </div>
            <p className="tlev-strip-text">{data.stripText}</p>
          </div>
        )}
      </div>
    </section>
  );
};

window.Services = Services;
