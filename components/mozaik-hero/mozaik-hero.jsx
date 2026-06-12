/* global React, Icon */

const MozaikHeroBlock = ({ block, onOpenContact, onOpenBook }) => {
  const markSrc = block.markImage && window.sanity
    ? window.sanity.imageUrl(block.markImage, { height: 92 })
    : 'assets/mozaik-mark.png';

  const headline = block.headline || 'Frigör din';
  const tagline = block.tagline || 'potential.';
  const kicker = block.eyebrow || 'AI-driven digital handel';
  const lead = block.intro || 'Den flexibla e-handelsplattformen byggd för att lösa komplex affärslogik och integrera sömlöst med vilken motor som helst.';
  const ctaPrimary = block.ctaPrimary || 'Kontakta oss';
  const ctaSecondary = block.ctaSecondary || 'Boka en demo';

  return (
    <header className="mzs-hero">
      <div className="mzs-hero-glow" aria-hidden />
      <div className="container mzs-hero-inner">
        <img className="mzs-hero-mark" src={markSrc} alt="Mozaik" />
        <span className="mzs-kicker">{kicker}</span>
        <h1 className="mzs-hero-title">
          {headline} <span className="mzs-grad">{tagline}</span>
        </h1>
        <p className="mzs-hero-lead">{lead}</p>
        <div className="mzs-hero-ctas">
          {onOpenContact && (
            <button className="btn mzs-btn-primary" onClick={onOpenContact}>
              {ctaPrimary} <Icon name="arrow-right" size={16} stroke={2} />
            </button>
          )}
          {onOpenBook && (
            <button className="btn mzs-btn-ghost" onClick={onOpenBook}>{ctaSecondary}</button>
          )}
        </div>
      </div>
    </header>
  );
};

window.MozaikHeroBlock = MozaikHeroBlock;
