/* global React, Icon */

const EXPERTS = [
  {
    name: 'Valdis Iljuconoks',
    role: 'CTO',
    bio: '20+ års erfarenhet av e-handel. Optimizely MVP. Skriver mer open source än ärenden.',
    initials: 'VI',
    tags: ['Optimizely MVP', 'Open source'],
  },
  {
    name: 'Anna Lindgren',
    role: 'PIM-chef',
    bio: 'Har shippat fler produktattribut än de flesta detaljhandlare har produkter. Älskar en ren datamodell.',
    initials: 'AL',
    tags: ['inRiver', 'Pimcore'],
  },
  {
    name: 'Marcus Eriksson',
    role: 'E-handelsstrateg',
    bio: 'Bygger broar mellan styrelserum och kodbas. Utmanar respektfullt din roadmap.',
    initials: 'ME',
    tags: ['B2B', 'Strategi'],
  },
  {
    name: 'Lina Petersen',
    role: 'Designchef',
    bio: 'Får komplex e-handel att kännas självklar. Tror på system &gt; skärmar.',
    initials: 'LP',
    tags: ['Designsystem', 'UX-research'],
  },
];

const Team = ({ onOpenContact }) => {
  const [hover, setHover] = React.useState(null);
  return (
    <section className="section section-team" id="team">
      <div className="container">
        <div className="team-head reveal">
          <div className="section-tag">Möt experterna</div>
          <div className="team-head-row">
            <h2 className="team-title">
              Människor som hellre<br />
              <em>gör jobbet</em> än<br />
              pratar om det.
            </h2>
            <p className="team-lede">
              120+ specialister i Oslo, Stockholm, Gävle, New York, Belgrad och Riga.
              Seniora, åsiktsfulla och ovanligt villiga att stå för det skriftligt.
            </p>
          </div>
        </div>

        <div className="team-grid">
          {EXPERTS.map((e, i) => (
            <ExpertCard
              key={e.name}
              expert={e}
              index={i}
              isHover={hover === i}
              onHover={() => setHover(i)}
              onLeave={() => setHover(null)}
            />
          ))}
        </div>

        <div className="team-foot reveal">
          <div className="team-foot-text">
            Vill du träffa rätt person för ditt projekt?
          </div>
          <button className="btn btn-primary" onClick={onOpenContact}>
            Bli matchad med en expert
            <Icon name="arrow-right" size={16} stroke={2} />
          </button>
        </div>
      </div>
    </section>
  );
};

const ExpertCard = ({ expert, index, isHover, onHover, onLeave }) => {
  return (
    <article
      className="expert-card reveal"
      style={{ transitionDelay: `${index * 60}ms` }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="expert-portrait">
        <ExpertSilhouette initials={expert.initials} />
        <div className="expert-tags">
          {expert.tags.map(t => <span key={t} className="expert-tag">{t}</span>)}
        </div>
      </div>
      <div className="expert-body">
        <div className="expert-name">{expert.name}</div>
        <div className="expert-role">{expert.role}</div>
        <p className="expert-bio">{expert.bio}</p>
        <div className="expert-actions">
          <a href={`#${expert.initials}`} className="expert-link">
            <Icon name="linkedin" size={14} />
          </a>
          <a href={`#${expert.initials}`} className="expert-link">
            <Icon name="mail" size={14} stroke={2} />
          </a>
        </div>
      </div>
    </article>
  );
};

const ExpertSilhouette = ({ initials }) => (
  <svg viewBox="0 0 200 220" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden>
    <defs>
      <pattern id={`grid-${initials}`} width="12" height="12" patternUnits="userSpaceOnUse">
        <circle cx="1.5" cy="1.5" r="1" fill="rgba(255,255,255,0.14)" />
      </pattern>
    </defs>
    <rect width="200" height="220" fill={`url(#grid-${initials})`} />
    <g transform="translate(100, 120)">
      <circle r="40" fill="rgba(255,255,255,0.95)" />
      <rect x="-60" y="40" width="120" height="80" rx="32" fill="rgba(255,255,255,0.95)" />
      <text textAnchor="middle" y="6" fontSize="30" fontFamily="Montserrat, sans-serif" fontWeight="700" fill="#02423F">{initials}</text>
    </g>
  </svg>
);

window.Team = Team;
