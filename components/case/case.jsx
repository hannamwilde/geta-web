/* global React, Icon */

const CASES = [
  {
    id: 'oob',
    company: 'ÖoB',
    quote: 'Geta har varit avgörande för att transformera vår digitala handel. Deras PIM-expertis löste flera år av flaskhalsar i produktdata — och de fortsätter leverera.',
    person: 'Digital chef, ÖoB',
    metrics: [
      { num: '+38%', label: 'försäljning YoY' },
      { num: '12 408', label: 'SKU:er synkade' },
      { num: '4', label: 'försäljningskanaler' },
    ],
    tag: 'Utvalt case',
    bg: 'var(--forest)',
    fg: 'var(--paper)',
  },
];

const CaseStudy = () => {
  return (
    <section className="section section-case" id="projects">
      <div className="container">
        <div className="case-head reveal">
          <div className="section-tag">Case &amp; kundbevis</div>
          <h2 className="case-title">
            Byggt för varumärken<br />
            som inte har råd att <em>stå still.</em>
          </h2>
        </div>

        <div className="case-grid">
          <CaseFeatured c={CASES[0]} />
          <CaseSide />
        </div>
      </div>
    </section>
  );
};

const CaseFeatured = ({ c }) => (
  <article className="case-featured reveal" style={{ background: c.bg, color: c.fg }}>
    <div className="case-featured-grid">
      <div className="case-featured-left">
        <div className="case-featured-tag">
          <span className="chip chip-light">{c.tag}</span>
          <span className="case-featured-company">{c.company}</span>
        </div>

        <svg viewBox="0 0 60 48" width="48" height="38" aria-hidden style={{ color: 'rgba(255,255,255,0.5)' }}>
          <path d="M0 28 Q0 8 18 0L22 8 Q12 12 12 22H22V48H0V28zM34 28 Q34 8 52 0L56 8 Q46 12 46 22H56V48H34V28z" fill="currentColor"/>
        </svg>

        <blockquote className="case-quote">
          {c.quote}
        </blockquote>

        <div className="case-attribution">— {c.person}</div>

        <div className="case-cta-row">
          <a href="#oob-case" className="btn btn-on-dark">
            Läs caset
            <Icon name="arrow-right" size={16} stroke={2} />
          </a>
          <a href="#all-cases" className="btn btn-outline-dark">Alla projekt</a>
        </div>
      </div>

      <div className="case-featured-right">
        <div className="case-mock">
          <CaseMockup />
        </div>
        <div className="case-metrics">
          {c.metrics.map(m => (
            <div key={m.label} className="case-metric">
              <div className="case-metric-num">{m.num}</div>
              <div className="case-metric-label">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </article>
);

const CaseMockup = () => (
  <svg viewBox="0 0 380 280" width="100%" height="100%" aria-hidden>
    <rect width="380" height="280" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
    <g transform="translate(0,0)">
      <circle cx="16" cy="16" r="4" fill="rgba(255,255,255,0.3)" />
      <circle cx="30" cy="16" r="4" fill="rgba(255,255,255,0.3)" />
      <circle cx="44" cy="16" r="4" fill="rgba(255,255,255,0.3)" />
      <rect x="64" y="9" width="200" height="14" rx="7" fill="rgba(255,255,255,0.1)" />
    </g>
    <g transform="translate(20, 44)">
      <rect width="60" height="14" rx="3" fill="var(--orange)" />
      <text x="30" y="11" textAnchor="middle" fontSize="9" fontWeight="700" fill="#151515" fontFamily="Montserrat, sans-serif">ÖoB</text>
      <rect x="220" y="2" width="50" height="10" rx="5" fill="rgba(255,255,255,0.2)" />
      <rect x="280" y="2" width="50" height="10" rx="5" fill="rgba(255,255,255,0.2)" />
    </g>
    <rect x="20" y="70" width="340" height="80" rx="8" fill="rgba(255,255,255,0.08)" />
    <text x="36" y="100" fill="#fff" fontSize="20" fontFamily="Montserrat, sans-serif" fontWeight="700">Allt för hemmet.</text>
    <text x="36" y="124" fill="rgba(255,255,255,0.7)" fontSize="11" fontFamily="Montserrat, sans-serif">12 408 produkter · 4 kanaler</text>
    {[0, 1, 2, 3].map(i => (
      <g key={i} transform={`translate(${20 + i * 88}, 168)`}>
        <rect width="76" height="92" rx="6" fill="rgba(255,255,255,0.1)" />
        <rect x="8" y="8" width="60" height="44" rx="4" fill={i === 1 ? 'var(--orange)' : 'rgba(255,255,255,0.2)'} />
        <rect x="8" y="58" width="40" height="6" rx="3" fill="rgba(255,255,255,0.4)" />
        <rect x="8" y="70" width="30" height="6" rx="3" fill="rgba(255,255,255,0.25)" />
        <rect x="8" y="82" width="20" height="6" rx="3" fill="var(--orange)" />
      </g>
    ))}
  </svg>
);

const CaseSide = () => {
  const teasers = [
    { title: 'Bygghemma', kind: 'Headless commerce + PIM', metric: 'Migrering på 14 veckor' },
    { title: 'Nordnet', kind: 'CMS · Optimizely', metric: '6 marknader, en plattform' },
    { title: 'Konfidentiell D2C', kind: 'Shopify Plus', metric: '+62% konvertering' },
  ];
  return (
    <div className="case-side reveal">
      {teasers.map((t, i) => (
        <a key={t.title} href="#case" className="case-teaser" style={{ transitionDelay: `${i * 60}ms` }}>
          <div className="case-teaser-thumb">
            <div className="case-teaser-thumb-inner">
              <svg viewBox="0 0 80 60" width="100%" height="100%" aria-hidden>
                <rect x="6" y="10" width="68" height="40" rx="3" fill="rgba(255,255,255,0.14)" />
                <rect x="12" y="16" width="22" height="28" rx="2" fill="rgba(255,255,255,0.4)" />
                <rect x="40" y="16" width="28" height="4" rx="2" fill="rgba(255,255,255,0.6)" />
                <rect x="40" y="24" width="20" height="3" rx="1.5" fill="rgba(255,255,255,0.4)" />
                <rect x="40" y="36" width="14" height="8" rx="2" fill="#fff" />
              </svg>
            </div>
          </div>
          <div className="case-teaser-body">
            <div className="case-teaser-kind">{t.kind}</div>
            <div className="case-teaser-title">{t.title}</div>
            <div className="case-teaser-metric">
              <Icon name="arrow-up-right" size={14} stroke={2} />
              {t.metric}
            </div>
          </div>
        </a>
      ))}
      <a href="#all-cases" className="case-teaser-all">
        <span>Se alla 80+ projekt</span>
        <Icon name="arrow-right" size={16} stroke={2} />
      </a>
    </div>
  );
};

window.CaseStudy = CaseStudy;
