/* global React */

const GridList = ({ block }) => {
  const eyebrow = block.eyebrow || 'Centrala applikationer';
  const title = block.headline || 'Din grund för komplex handel.';
  const apps = block.apps || [];

  if (apps.length === 0) return null;

  const sectionStyle = {
    ...(block.backgroundColor ? {backgroundColor: block.backgroundColor} : {}),
    ...(block.paddingTop != null ? {paddingTop: block.paddingTop + 'px'} : {}),
    ...(block.paddingBottom != null ? {paddingBottom: block.paddingBottom + 'px'} : {}),
  };
  const eyebrowStyle = {
    ...(block.eyebrowColor ? {color: block.eyebrowColor} : {}),
    ...(block.eyebrowFontSize ? {fontSize: block.eyebrowFontSize + 'px'} : {}),
  };
  const headlineStyle = {
    ...(block.headlineColor ? {color: block.headlineColor} : {}),
    ...(block.headlineFontSize ? {fontSize: block.headlineFontSize + 'px'} : {}),
  };
  const nameStyle = block.itemTextColor ? {color: block.itemTextColor} : {};

  return (
    <section className="section mzs-section" style={sectionStyle}>
      <div className="container">
        <div className="mzs-sec-head">
          <span className="mzs-eyebrow" style={eyebrowStyle}>{eyebrow}</span>
          <h2 className="mzs-sec-title" style={headlineStyle}>{title}</h2>
        </div>
        <div className="mzs-app-list">
          {apps.map((a, i) => (
            <article key={a._key || i} className="mzs-app-row">
              <h3 className="mzs-app-name" style={nameStyle}>{a.name}</h3>
              {a.body && <p className="mzs-app-body">{a.body}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

window.GridList = GridList;
