/* global React, Icon */

const LinkBlock = ({block}) => {
  const s = {};
  if (block.backgroundColor)       s.backgroundColor       = block.backgroundColor;
  if (block.paddingTop != null)     s.paddingTop            = block.paddingTop + 'px';
  if (block.paddingBottom != null)  s.paddingBottom         = block.paddingBottom + 'px';
  block.textColor ? s['--lb-text'] = block.textColor : s['--lb-text'] = "#ffffff";
  if (block.buttonBackgroundColor)  s['--lb-btn-bg']        = block.buttonBackgroundColor;
  if (block.buttonTextColor)        s['--lb-btn-text']      = block.buttonTextColor;

  const links = block.links || [];

  const fullWidth = block.borderScope === 'full';
  const borderStyle = {};
  if (block.borderTopColor)    borderStyle.borderTop    = `1px solid ${block.borderTopColor}`;
  if (block.borderBottomColor) borderStyle.borderBottom = `1px solid ${block.borderBottomColor}`;

  return (
    <section className="page-section link-block" style={fullWidth ? {...s, ...borderStyle} : s} data-align={block.alignment || 'left'}>
      <div className="container">
        <div style={fullWidth ? {} : borderStyle}>
            {block.title && <h2 className="link-block-title">{block.title}</h2>}
            {links.length > 0 && (
            <div className="link-block-links" data-layout={block.linksLayout || 'inline'} data-has-images={links.some(l => l.style === 'image') || undefined}>
                {links.map((item, i) => (
                <a
                    key={item._key || i}
                    href={item.href || '#'}
                    className={`link-block-item link-block-item--${item.style || 'link'}`}
                >
                    {item.style === 'image' ? (
                      item.image && item.image.asset && window.sanity
                        ? <img
                            src={window.sanity.imageUrl(item.image, {width: 400})}
                            alt={(item.image && item.image.alt) || item.label || ''}
                            className="link-block-item-image"
                          />
                        : null
                    ) : (
                      <React.Fragment>
                        {item.icon && window.Icon && <Icon name={item.icon} size={16} stroke={2} />}
                        {item.label}
                      </React.Fragment>
                    )}
                </a>
                ))}
                
            </div>
            )}
        </div>
      </div>
    </section>
  );
};

window.LinkBlock = LinkBlock;
