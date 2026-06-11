/* global React, Icon */

const NAV_QUERY = `*[_id == "nav"][0]{
  logo { asset },
  menuItems[]{ _key, label, href, megaColumns[]{ _key, links[]{ _key, label, href } } },
  rightLinks[]{ _key, label, style, action, href, external }
}`;


function mapItems(menuItems) {
  return menuItems.map(item => ({
    label: item.label,
    key: item._key,
    href: item.href || null,
    mega: item.megaColumns && item.megaColumns.length > 0
      ? item.megaColumns.map(col => (col.links || []).map(l => [l.label, l.href]))
      : null,
  }));
}

// =================== NAV ===================
const Nav = ({ onOpenContact, onOpenBook }) => {
  const [scrolled, setScrolled] = React.useState(false);
  const [overMozaik, setOverMozaik] = React.useState(false);
  const [openMenu, setOpenMenu] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [navData, setNavData] = React.useState(null);
  const barRef = React.useRef(null);
  const wrapRefs = React.useRef({});

  React.useEffect(() => {
    if (!window.sanity) return;
    window.sanity.query(NAV_QUERY)
      .then(d => { if (d) setNavData(d); })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      // Turn the bar purple only while it is FULLY enveloped by the Mozaik
      // section — i.e. the section spans above the bar's top and below its bottom.
      const mz = document.getElementById('mozaik');
      const bar = barRef.current;
      if (mz && bar) {
        const m = mz.getBoundingClientRect();
        const b = bar.getBoundingClientRect();
        setOverMozaik(m.top <= b.top && m.bottom >= b.bottom);
      } else {
        setOverMozaik(false);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Close on outside click
  React.useEffect(() => {
    if (!openMenu) return;
    const handler = (e) => {
      if (barRef.current && !barRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openMenu]);

  const logoUrl = navData && navData.logo && navData.logo.asset && window.sanity
    ? window.sanity.imageUrl(navData.logo, { height: 44 })
    : null;

  const items = navData && navData.menuItems ? mapItems(navData.menuItems) : [];
  const rightLinks = navData && navData.rightLinks ? navData.rightLinks : [];

  return (
    <header className={`gnav ${scrolled ? 'gnav-scrolled' : ''} ${overMozaik ? 'gnav-over-mozaik' : ''}`}>
      <div className="container gnav-inner">
        <div className="gnav-bar hide-mobile" ref={barRef}>
          <a href="#/" className="gnav-logo" aria-label="Geta Digital home">
            <GetaWordmark src={logoUrl} />
          </a>

          <nav className="gnav-links">
            {items.map(it => (
              <div
                key={it.key}
                className="gnav-link-wrap"
                ref={el => wrapRefs.current[it.key] = el}
              >
                {it.href && !it.mega ? (
                  <a className={`gnav-link ${openMenu === it.key ? 'is-open' : ''}`} href={it.href}>
                    {it.label}
                  </a>
                ) : (
                  <button
                    className={`gnav-link ${openMenu === it.key ? 'is-open' : ''}`}
                    onClick={() => setOpenMenu(openMenu === it.key ? null : it.key)}
                  >
                    {it.label}
                    {it.mega && <Icon name="chevron-down" size={14} stroke={1.8} />}
                  </button>
                )}
                {it.mega && openMenu === it.key && (
                  <div className="gnav-mega" style={{ left: 0, '--mega-cols': it.mega.length }}>
                    <div className="gnav-mega-grid">
                      {it.mega.map((col, ci) => (
                        <div key={ci} className="col gap-2">
                          {col.map(([label, href]) => (
                            <a key={label} className="gnav-mega-item" href={href} onClick={() => setOpenMenu(null)}>
                              <span>{label}</span>
                              <Icon name="arrow-up-right" size={14} stroke={1.6} />
                            </a>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="gnav-actions">
            {rightLinks.map((link, i) => {
              if (link.action === 'openContact') return (
                <button key={link._key || i} className="gnav-cta" onClick={onOpenContact}>
                  {link.label}<Icon name="arrow-right" size={14} stroke={2} />
                </button>
              );
              if (link.action === 'openBook') return (
                <button key={link._key || i} className="gnav-cta" onClick={onOpenBook}>
                  {link.label}<Icon name="arrow-right" size={14} stroke={2} />
                </button>
              );
              return (
                <a key={link._key || i} href={link.href} className={link.style === 'cta' ? 'gnav-cta' : 'gnav-shop'}
                  {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
                  {link.style !== 'cta' && <Icon name="shop" size={15} stroke={1.8} />}
                  <span>{link.label}</span>
                  {link.style === 'cta' && <Icon name="arrow-right" size={14} stroke={2} />}
                </a>
              );
            })}
          </div>
        </div>

        <a href="#/" className="gnav-logo gnav-logo-mobile show-mobile" aria-label="Geta Digital home">
          <GetaWordmark src={logoUrl} />
        </a>
        <button
          className="gnav-burger show-mobile"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Menu"
        >
          <Icon name={mobileOpen ? 'close' : 'menu'} size={24} />
        </button>
      </div>

      {mobileOpen && (
        <div className="gnav-mobile show-mobile">
          {items.map(it => (
            <a key={it.key} href={it.href || ('#' + it.key)} className="gnav-mobile-link" onClick={() => setMobileOpen(false)}>{it.label}</a>
          ))}
          {rightLinks.map((link, i) => {
            if (link.action === 'openContact') return (
              <button key={link._key || i} className="btn btn-primary" onClick={() => { setMobileOpen(false); onOpenContact(); }}>{link.label}</button>
            );
            if (link.action === 'openBook') return (
              <button key={link._key || i} className="btn btn-primary" onClick={() => { setMobileOpen(false); onOpenBook(); }}>{link.label}</button>
            );
            return (
              <a key={link._key || i} href={link.href} className="gnav-mobile-link"
                {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                onClick={() => setMobileOpen(false)}>
                {link.label}{link.external ? ' ↗' : ''}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
};

const GetaWordmark = ({ src }) => (
  <img src={src || 'assets/geta-logo-white.png'} alt="Geta" style={{display:'block', height:'22px', width:'auto'}} />
);

window.Nav = Nav;
window.GetaWordmark = GetaWordmark;
