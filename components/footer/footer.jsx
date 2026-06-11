/* global React, Icon */

const FOOTER_QUERY = `*[_id == "footer"][0]{
  tagline,
  email,
  phone,
  socialLinks[]{ platform, url },
  columns[]{ _key, title, links[]{ _key, label, href, external } },
  orgLine
}`;

const Footer = ({ onOpenContact }) => {
  const [data, setData] = React.useState(null);
  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  React.useEffect(() => {
    if (!window.sanity) return;
    window.sanity.query(FOOTER_QUERY)
      .then(d => { if (d) setData(d); })
      .catch(() => {});
  }, []);

  const tagline  = data && data.tagline  ? data.tagline  : 'Nordisk e-handel som håller — sedan 2010.';
  const email    = data && data.email    ? data.email    : 'post@getadigital.com';
  const phone    = data && data.phone    ? data.phone    : '026 390 13';
  const orgLine  = data && data.orgLine  ? data.orgLine  : 'Geta Digital AB — Org.nr: 556660-1149';
  const socials  = data && data.socialLinks && data.socialLinks.length > 0 ? data.socialLinks : [
    { platform: 'linkedin',  url: 'https://www.linkedin.com/company/86458297/' },
    { platform: 'facebook',  url: 'https://www.facebook.com/profile.php?id=61558806761375&locale=sv_SE' },
    { platform: 'instagram', url: 'https://www.instagram.com/getadigitalsverige/' },
  ];
  const columns  = data && data.columns  && data.columns.length  > 0 ? data.columns  : null;

  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-top reveal">
          <div className="footer-identity">
            <a href="#/" className="footer-wordmark-lg" aria-label="Geta Digital">
              <FooterWordmark />
            </a>
            <p className="footer-tagline">{tagline}</p>
          </div>

          <div className="footer-top-right">
            <div className="footer-contact">
              <a className="footer-contact-link" href={`mailto:${email}`}>
                <Icon name="mail" size={20} stroke={1.7} />
                <span>{email}</span>
              </a>
              <a className="footer-contact-link" href={`tel:${phone.replace(/\s/g, '')}`}>
                <PhoneIcon />
                <span>{phone}</span>
              </a>
            </div>

            <div className="footer-social">
              {socials.map((s, i) => {
                const SocialIcon = SOCIAL_ICONS[s.platform];
                if (!SocialIcon) return null;
                return (
                  <a key={s.platform + i} className="footer-social-link" href={s.url} target="_blank" rel="noreferrer" aria-label={s.platform}>
                    <SocialIcon />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {columns && (
          <>
            <hr className="footer-rule" />
            <div className="footer-cols" style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
              {columns.map(col => (
                <FooterColGroup key={col._key || col.title} title={col.title} links={col.links} />
              ))}
            </div>
          </>
        )}

        <div className="footer-foot">
          <div className="footer-org">{orgLine}</div>
          <button className="footer-totop" onClick={toTop} aria-label="Till toppen">
            <UpArrow />
          </button>
        </div>
      </div>
    </footer>
  );
};

const FooterColGroup = ({ title, links }) => (
  <div className="footer-colgroup">
    <h3 className="footer-colgroup-title">{title}</h3>
    <ul>
      {(links || []).map((link, i) => {
        const label = link.label || link[0];
        const href  = link.href  || link[1] || '#';
        return (
          <li key={link._key || i}>
            <a href={href} {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}>{label}</a>
          </li>
        );
      })}
    </ul>
  </div>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 3h3l2 5-2.5 1.5a12 12 0 0 0 5 5L16 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
    <path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.25 8.25h4.5V24H.25V8.25zM8.5 8.25h4.31v2.15h.06c.6-1.13 2.07-2.32 4.26-2.32 4.56 0 5.4 3 5.4 6.9V24h-4.5v-6.92c0-1.65-.03-3.77-2.3-3.77-2.3 0-2.65 1.8-2.65 3.65V24H8.5V8.25z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
    <path d="M14 13.5h2.5l1-4H14V7.5c0-1.03 0-2 2-2h1.5V2.14c-.33-.04-1.56-.14-2.86-.14C11.93 2 10 3.66 10 6.7v2.8H7v4h3V22h4v-8.5z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/>
  </svg>
);

const SOCIAL_ICONS = {
  linkedin: LinkedInIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
};

const UpArrow = () => (  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
);

const FooterWordmark = () => (
  <img src="assets/geta-logo-white.png" alt="Geta" style={{display:'block', height:'44px', width:'auto'}} />
);

window.Footer = Footer;
