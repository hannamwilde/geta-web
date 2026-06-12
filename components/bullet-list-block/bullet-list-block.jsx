/* global React, Icon */

const BulletListBlock = ({ block }) => {
  const eyebrow = block.eyebrow || '';
  const title = block.headline || '';
  const items = block.archItems || [];

  if (items.length === 0) return null;

  const sectionStyle = block.backgroundColor ? {backgroundColor: block.backgroundColor} : {};
  const eyebrowStyle = {
    ...(block.eyebrowColor ? {color: block.eyebrowColor} : {}),
    ...(block.eyebrowFontSize ? {fontSize: block.eyebrowFontSize + 'px'} : {}),
  };
  const headlineStyle = {
    ...(block.headlineColor ? {color: block.headlineColor} : {}),
    ...(block.headlineFontSize ? {fontSize: block.headlineFontSize + 'px'} : {}),
  };

  return (
    <section className="section mzs-section" style={sectionStyle}>
      <div className="container">
        {(eyebrow || title) && (
          <div className="mzs-sec-head">
            {eyebrow && <span className="mzs-eyebrow" style={eyebrowStyle}>{eyebrow}</span>}
            {title && <h2 className="mzs-sec-title" style={headlineStyle}>{title}</h2>}
          </div>
        )}
        <div className="mzs-arch-grid">
          {items.map((a, i) => {
            const cardStyle = {
              ...(a.backgroundColor ? {'--card-bg': a.backgroundColor} : {}),
              ...(a.iconBackgroundColor ? {'--icon-bg': a.iconBackgroundColor} : {}),
              ...(a.textColor ? {color: a.textColor} : {}),
            };
            return (
            <article key={a._key || i} className="mzs-arch-card" style={cardStyle}>
              {a.icon && (
                <span className="mzs-arch-icon">
                  <Icon name={a.icon} size={26} stroke={1.7} />
                </span>
              )}
              <h3 className="mzs-arch-title">{a.title}</h3>
              {a.body && <p className="mzs-arch-body">{a.body}</p>}
              {Array.isArray(a.points) && a.points.length > 0 && (
                <ul className="mzs-arch-points">
                  {a.points.map((p, j) => {
                    const colonIdx = p.indexOf(':');
                    const lead = colonIdx !== -1 ? p.slice(0, colonIdx) : p;
                    const rest = colonIdx !== -1 ? p.slice(colonIdx + 1) : '';
                    return (
                      <li key={j}>
                        <Icon name="check" size={15} stroke={2.4} />
                        <span><strong>{lead}:</strong>{rest}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

window.BulletListBlock = BulletListBlock;
