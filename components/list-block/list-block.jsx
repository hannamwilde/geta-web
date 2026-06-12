/* global React, Icon */

const ListBlock = ({block}) => {
  const sectionStyle = {};
  if (block.backgroundColor) sectionStyle.backgroundColor = block.backgroundColor;

  const headlineStyle = {};
  block.headlineColor ? headlineStyle.color = block.headlineColor : headlineStyle.color = "#ffffff";
  if (block.headlineFontSize) headlineStyle.fontSize = block.headlineFontSize + 'px';

  const subheadlineStyle = {};
  block.subheadlineColor  ?  subheadlineStyle.color  = block.subheadlineColor : subheadlineStyle.color  = "#ffffff";
  if (block.subheadlineFontSize) subheadlineStyle.fontSize = block.subheadlineFontSize + 'px';

  return (
    <section className="page-section list-block" data-item-style={block.itemStyle || 'large'} style={sectionStyle}>
      <div className="container">
        {(block.eyebrow || block.headline || block.subheadline) && (
          <div className="list-block-header">
            {block.eyebrow && (
              <p className="eyebrow" style={{
                ...(block.eyebrowColor ? {color: block.eyebrowColor} : {}),
                ...(block.eyebrowFontSize ? {fontSize: block.eyebrowFontSize + 'px'} : {}),
              }}>{block.eyebrow}</p>
            )}
            {block.headline && <h2 className="list-block-headline" style={headlineStyle}>{block.headline}</h2>}
            {block.subheadline && (
              <p className={`list-block-subheadline${block.subheadlineDivider ? ' list-block-subheadline--divider' : ''}`} style={subheadlineStyle}>
                {block.subheadline}
              </p>
            )}
          </div>
        )}
        <div className="list-block-grid">
          {(block.items || []).map((item, i) => {
            const cardStyle = {
              ...(item.textColor ? {color: item.textColor} : {}),
              gridColumn: `span ${item.width || '4'}`,
              '--item-bg': item.backgroundColor || '#ffffff',
              ...(item.hoverBackgroundColor && item.href ? {'--item-hover-bg': item.hoverBackgroundColor} : {}),
              ...(item.iconBackgroundColor ? {'--item-icon-bg': item.iconBackgroundColor} : {}),
            };
            const itemImageUrl = item.visualType === 'image' && item.image && item.image.asset && window.sanity
              ? item.imageSize === 'small'
                ? window.sanity.imageUrl(item.image, {height: 80})
                : window.sanity.imageUrl(item.image, {width: 800, height: 360})
              : null;

            const inner = (
              <React.Fragment>
                {item.visualType === 'image' && itemImageUrl ? (
                  <span className="list-block-item-image" data-size={item.imageSize || 'large'}>
                    <img src={itemImageUrl} alt={(item.image && item.image.alt) || ''} />
                  </span>
                ) : item.visualType !== 'image' && item.icon && window.Icon ? (
                  <span className="list-block-item-icon">
                    <Icon name={item.icon} size={24} stroke={1.7} />
                  </span>
                ) : null}
                <span className="list-block-item-text">
                  {item.title && <h3 className="list-block-item-title" style={item.titleFontSize ? {fontSize: item.titleFontSize + 'px'} : {}}>{item.title}</h3>}
                  {item.body && <p className="list-block-item-body">{item.body}</p>}
                  {item.href && (
                    <span className="list-block-item-link">
                      {item.linkLabel || 'Läs mer'}
                      {window.Icon && <Icon name="arrow-up-right" size={14} stroke={2} />}
                    </span>
                  )}
                </span>
              </React.Fragment>
            );
            return item.href
              ? <a key={item._key || i} href={item.href} className="list-block-item" style={cardStyle}>{inner}</a>
              : <div key={item._key || i} className="list-block-item" style={cardStyle}>{inner}</div>;
          })}
        </div>
      </div>
    </section>
  );
};

window.ListBlock = ListBlock;
