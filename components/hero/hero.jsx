/* global React, Icon */

const HERO_QUERY = `*[_id == "homePage"][0].sections[_type == "heroSection"][0]{
  eyebrow,
  headline,
  subheadline,
  ctaPrimary,
  ctaSecondary
}`;

const Hero = ({ onOpenBook, onOpenContact, block }) => {
  const [fetched, setFetched] = React.useState(null);

  React.useEffect(() => {
    if (block || !window.sanity) return;
    window.sanity.query(HERO_QUERY)
      .then(function (data) { if (data) setFetched(data); })
      .catch(function () {});
  }, [block]);

  const hero = block || fetched || {};

  return (
    <section className="hero" id="top">
      <div className="container">
        <div className="hero-copy">
          {hero.eyebrow && (
            <div className="hero-eyebrow">
              <span>{hero.eyebrow}</span>
            </div>
          )}

          {hero.headline && <h1 className="hero-headline">{hero.headline}</h1>}

          {hero.subheadline && (
            <p className="hero-sub">{hero.subheadline}</p>
          )}

          <div className="hero-ctas">
            <button className="btn btn-primary" onClick={onOpenBook}>
              <Icon name="calendar" size={16} stroke={2} />
              {hero.ctaPrimary && hero.ctaPrimary.label || 'Boka möte'}
            </button>
            <button className="btn btn-outline" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
              {hero.ctaSecondary && hero.ctaSecondary.label || 'Utforska tjänster'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

window.Hero = Hero;
