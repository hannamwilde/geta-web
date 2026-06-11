/* global React, Icon */

const BannerBlock = ({block, onOpenContact, onOpenBook}) => {
  const s = {};
  if (block.backgroundColor)             s.backgroundColor         = block.backgroundColor;
  if (block.paddingTop != null)           s.paddingTop              = block.paddingTop + 'px';
  if (block.paddingBottom != null)        s.paddingBottom           = block.paddingBottom + 'px';
  if (block.headlineColor)               s['--bb-headline']         = block.headlineColor;
  if (block.taglineColor)                s['--bb-tagline']          = block.taglineColor;
  if (block.textColor)                   s['--bb-text']             = block.textColor;
  if (block.ctaPrimaryBackground)        s['--bb-p-bg']             = block.ctaPrimaryBackground;
  if (block.ctaPrimaryTextColor)         s['--bb-p-color']          = block.ctaPrimaryTextColor;
  if (block.ctaPrimaryHoverBackground)   s['--bb-p-hover-bg']       = block.ctaPrimaryHoverBackground;
  if (block.ctaPrimaryHoverTextColor)    s['--bb-p-hover-color']    = block.ctaPrimaryHoverTextColor;
  if (block.ctaSecondaryColor)           s['--bb-s-color']          = block.ctaSecondaryColor;
  if (block.ctaSecondaryHoverBackground) s['--bb-s-hover-bg']       = block.ctaSecondaryHoverBackground;
  if (block.ctaSecondaryHoverColor)      s['--bb-s-hover-color']    = block.ctaSecondaryHoverColor;

  const bgImageUrl = block.backgroundImage && block.backgroundImage.asset && window.sanity
    ? window.sanity.imageUrl(block.backgroundImage, {width: 1600})
    : null;
  if (bgImageUrl) {
    s.backgroundImage = `url(${bgImageUrl})`;
    s.backgroundSize = 'cover';
    s.backgroundPosition = 'center';
  }

  const photoUrl = block.photo && block.photo.asset && window.sanity
    ? window.sanity.imageUrl(block.photo, {width: 800})
    : null;

  const renderCta = (cta, className) => {
    if (!cta || !cta.label) return null;
    if (cta.action === 'openContact') return <button className={`btn ${className}`} onClick={onOpenContact}>{cta.label}</button>;
    if (cta.action === 'openBook')    return <button className={`btn ${className}`} onClick={onOpenBook}>{cta.label}</button>;
    if (cta.href)                     return <a href={cta.href} className={`btn ${className}`}>{cta.label}</a>;
    return null;
  };

  const hasCtas = (block.ctaPrimary && block.ctaPrimary.label) || (block.ctaSecondary && block.ctaSecondary.label);
  const showVisual = block.visualType !== 'none' && (photoUrl || block.icon);

  return (
    <section className="sp-hero banner-block" style={s} data-align={block.alignment || 'left'} data-layout={block.contentLayout || 'stacked'}>
      <div className="container">
        <div className={showVisual ? 'sp-hero-detail-grid' : ''}>
          <div className="bb-content">
            <div className="bb-content-text">
              {block.eyebrow && (
                <div className="sp-eyebrow" style={block.eyebrowFontSize ? {fontSize: block.eyebrowFontSize + 'px'} : {}}>
                  <span className="sp-eyebrow-dot" />
                  {block.eyebrow}
                </div>
              )}
              {block.headline && <h1 className="sp-hero-title" style={block.headlineFontSize ? {fontSize: block.headlineFontSize + 'px'} : {}}>{block.headline}</h1>}
              {block.tagline && <p className="sp-hero-tagline" style={block.taglineFontSize ? {fontSize: block.taglineFontSize + 'px'} : {}}>{block.tagline}</p>}
              {block.intro && <p className="sp-hero-intro" style={block.introFontSize ? {fontSize: block.introFontSize + 'px'} : {}}>{block.intro}</p>}
            </div>
            {hasCtas && (
              <div className="sp-hero-ctas">
                {renderCta(block.ctaPrimary, 'btn-primary')}
                {renderCta(block.ctaSecondary, 'btn-outline')}
              </div>
            )}
          </div>
          {showVisual && (
            <div className={'sp-hero-mark' + (photoUrl ? ' sp-hero-mark-photo' : '')}>
              {photoUrl ? (
                <img className="sp-hero-photo" src={photoUrl} alt={(block.photo && block.photo.alt) || ''} />
              ) : (
                <React.Fragment>
                  {window.Icon && <Icon name={block.icon} size={64} stroke={1.2} />}
                  {(block.statValue || block.statLabel) && (
                    <div className="sp-hero-stat">
                      {block.statValue && <div className="sp-hero-stat-value">{block.statValue}</div>}
                      {block.statLabel && <div className="sp-hero-stat-label">{block.statLabel}</div>}
                    </div>
                  )}
                </React.Fragment>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

window.BannerBlock = BannerBlock;
