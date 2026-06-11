/* global React */

// ===================================================================
// KUNDCASE — three success stories on warm cream w/ forest-green accents.
// ===================================================================

const KUNDCASE_QUERY = `*[_type == "kundcase"] | order(publishedAt desc)[0...3]{
  _id,
  client,
  "tag": coalesce(array::join(tags, " · "), ""),
  excerpt,
  testimonial,
  coverImage { asset, alt },
  slug
}`;

const KUNDCASE_SECTION_QUERY = `*[_id == "homePage"][0].sections[_type == "kundcaseSection"][0]{ title, lede, ctaText }`;

const KundcaseCard = ({ item, index }) => (
  <article className="kc-card reveal" key={item._id} style={{ '--d': `${index * 0.09}s` }}>
    <div className="kc-media">
      {item.coverImage && item.coverImage.asset
        ? (
          <img
            src={window.sanity.imageUrl(item.coverImage, { width: 600, height: 480 })}
            alt={item.coverImage.alt || item.client}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )
        : (
          <image-slot
            id={item.slot || ('kundcase-' + item._id)}
            shape="rect"
            fit="cover"
            placeholder={item.placeholder || item.client}
            style={{ width: '100%', height: '100%' }}
          ></image-slot>
        )
      }
    </div>

    <div className="kc-body">
      <h3 className="kc-client">{item.client}</h3>
      {item.tag && <span className="kc-tag">{item.tag}</span>}
      <p className="kc-summary">{item.excerpt}</p>

      {item.testimonial && item.testimonial.quote && (
        <blockquote className="kc-quote">
          <span className="kc-quote-mark" aria-hidden>&ldquo;</span>
          {item.testimonial.quote}
          <span className="kc-quote-mark" aria-hidden>&rdquo;</span>
        </blockquote>
      )}

      {item.testimonial && item.testimonial.person && (
        <div className="kc-byline">
          <span className="kc-byline-name">{item.testimonial.person}</span>
          <span className="kc-byline-role">{item.testimonial.role}</span>
        </div>
      )}

      <a href="#kundcase" className="kc-link" onClick={(e) => e.preventDefault()}>
        Läs kundcaset
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </a>
    </div>
  </article>
);

const Kundcase = ({ onOpenContact }) => {
  const sectionRef = React.useRef(null);
  const [cases, setCases] = React.useState(null);
  const [section, setSection] = React.useState(null);

  React.useEffect(() => {
    if (!window.sanity) return;
    Promise.all([
      window.sanity.query(KUNDCASE_QUERY),
      window.sanity.query(KUNDCASE_SECTION_QUERY),
    ]).then(function (results) {
      var data = results[0];
      var sec = results[1];
      if (data && data.length > 0) setCases(data);
      if (sec) setSection(sec);
    }).catch(function () {});
  }, []);

  React.useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    sec.dataset.anim = '';
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { sec.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    io.observe(sec);
    return () => io.disconnect();
  }, [cases]);

  if (!cases) return null;

  return (
    <section className="kc" id="kundcase" ref={sectionRef}>
      <div className="container">
        {(section && (section.title || section.lede)) && (
          <div className="kc-head">
            {section.title && <h2 className="kc-title">{section.title}</h2>}
            {section.lede && <p className="kc-lede">{section.lede}</p>}
          </div>
        )}

        <div className="kc-grid">
          {cases.map((c, i) => (
            <KundcaseCard key={c._id} item={c} index={i} />
          ))}
        </div>

        <div className="kc-cta reveal">
          {section && section.ctaText && <p className="kc-cta-text">{section.ctaText}</p>}
          <button className="btn btn-primary" onClick={onOpenContact}>
            Kontakta oss
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

window.Kundcase = Kundcase;
