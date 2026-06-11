/* global React, Icon */

// ===================================================================
// KONTAKT-BANNER — full-bleed image with a cream "dome" rising from
// the bottom holding the headline + CTA.
// ===================================================================

const CONTACT_BANNER_QUERY = `*[_id == "homePage"][0].sections[_type == "contactBannerSection"][0]{
  headline,
  subheadline,
  cta,
  backgroundImage { asset, alt }
}`;

const ContactBanner = ({ onOpenContact }) => {
  const sectionRef = React.useRef(null);
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    if (!window.sanity) return;
    window.sanity.query(CONTACT_BANNER_QUERY)
      .then(function (d) { if (d) setData(d); })
      .catch(function () {});
  }, []);

  React.useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    sec.dataset.anim = '';
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { sec.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });
    io.observe(sec);
    return () => io.disconnect();
  }, []);

  if (!data) return null;

  return (
    <section className="bcta" aria-labelledby="bcta-title" ref={sectionRef}>
      <div className="container">
        <div className="bcta-frame">
          {data.backgroundImage && data.backgroundImage.asset && (
            <img
              className="bcta-bg"
              src={window.sanity.imageUrl(data.backgroundImage, { width: 1400 })}
              alt={data.backgroundImage.alt || ''}
            />
          )}

          <div className="bcta-dome">
            <div className="bcta-dome-inner">
              {data.headline && (
                <h2 className="bcta-title" id="bcta-title">{data.headline}</h2>
              )}
              {data.subheadline && (
                <p className="bcta-sub">{data.subheadline}</p>
              )}
              <button className="btn bcta-btn" onClick={onOpenContact}>
                {data.cta && data.cta.label ? data.cta.label : 'Kontakta oss'}
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

window.ContactBanner = ContactBanner;
