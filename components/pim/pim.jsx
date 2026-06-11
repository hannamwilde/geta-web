/* global React, Icon */

const PimSection = ({ onOpenContact }) => {
  return (
    <section className="section section-pim" id="pim">
      <div className="container">
        <div className="pim-grid">
          <div className="pim-left">
            <div className="section-tag" style={{ color: 'var(--paper)', opacity: 0.7 }}>PIM by Geta</div>
            <h2 className="pim-title">
              Den nordiska <em>PIM</em>-<br />
              praktiken som skrev<br />
              spelboken.
            </h2>
            <p className="pim-lede">
              Femton år innan &quot;PIM&quot; var ett modeord höll vi redan på att implementera det.
              Idag får vår produktifierade approach kunder live på tre månader — inte arton.
            </p>

            <div className="pim-stats">
              <div className="pim-stat">
                <div className="pim-stat-num"><span>15</span><sup>+</sup></div>
                <div className="pim-stat-label">år av PIM, i produktion</div>
              </div>
              <div className="pim-stat">
                <div className="pim-stat-num"><span>60</span><sup>+</sup></div>
                <div className="pim-stat-label">framgångsrika nordiska lanseringar</div>
              </div>
              <div className="pim-stat">
                <div className="pim-stat-num"><span>3</span><sub>mån</sub></div>
                <div className="pim-stat-label">till implementation, produktifierat</div>
              </div>
            </div>

            <div className="pim-cta-row">
              <button className="btn btn-on-dark" onClick={onOpenContact}>
                Prata med en PIM-expert
                <Icon name="arrow-right" size={16} stroke={2} />
              </button>
              <a href="#pim-detail" className="btn btn-outline-dark">
                Läs mer om PIM
              </a>
            </div>

            <div className="pim-platforms">
              <span className="pim-platforms-label">Plattformar vi kan utan och innan:</span>
              <div className="pim-platforms-list">
                <PlatformChip name="inRiver" />
                <PlatformChip name="Pimcore" />
                <PlatformChip name="Akeneo" />
                <PlatformChip name="Optimizely PIM" />
              </div>
            </div>
          </div>

          <div className="pim-right">
            <PimFlow />
          </div>
        </div>
      </div>
    </section>
  );
};

const PlatformChip = ({ name }) => (
  <span className="pim-platform-chip">{name}</span>
);

const PimFlow = () => (
  <div className="pim-flow">
    <div className="pim-flow-header">
      <div className="pim-flow-title">
        <span className="dot pulse" style={{ background: 'var(--blue)' }} />
        <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Live · ÖoB-flödet
        </span>
      </div>
      <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
        12 408 SKU:er
      </div>
    </div>

    <div className="pim-flow-stages">
      <PimStage title="Källor" subtitle="ERP · leverantörer · Excel" icon="database" count={3} />
      <PimArrow label="importera" />
      <PimStage title="PIM" subtitle="Berika · styra · översätta" icon="box" count={1} highlight />
      <PimArrow label="publicera" />
      <PimStage title="Kanaler" subtitle="Web · marknadsplats · print · app" icon="layers" count={4} />
    </div>

    <div className="pim-flow-footer">
      <div className="pim-flow-row">
        <span style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'ui-monospace, monospace', fontSize: 11 }}>drifttid</span>
        <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11 }}>99,98%</span>
      </div>
      <div className="pim-flow-bar">
        <div className="pim-flow-bar-fill" style={{ width: '78%', background: 'var(--blue)' }}>
          <span className="pim-flow-bar-label">berikade 9 678 / 12 408</span>
        </div>
      </div>
      <div className="pim-flow-row">
        <span style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'ui-monospace, monospace', fontSize: 11 }}>till lansering</span>
        <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: 'var(--blue)' }}>3 månader ✓</span>
      </div>
    </div>
  </div>
);

const PimStage = ({ title, subtitle, icon, count, highlight }) => (
  <div className={`pim-stage ${highlight ? 'is-highlight' : ''}`}>
    <div className="pim-stage-icon">
      <Icon name={icon} size={18} stroke={1.8} />
    </div>
    <div className="pim-stage-title">{title}</div>
    <div className="pim-stage-sub">{subtitle}</div>
    <div className="pim-stage-count">{count}</div>
  </div>
);

const PimArrow = ({ label }) => (
  <div className="pim-arrow">
    <div className="pim-arrow-line">
      <span className="pim-arrow-dot" style={{ animationDelay: '0s' }} />
      <span className="pim-arrow-dot" style={{ animationDelay: '0.3s' }} />
      <span className="pim-arrow-dot" style={{ animationDelay: '0.6s' }} />
    </div>
    <div className="pim-arrow-label">{label}</div>
  </div>
);

window.PimSection = PimSection;
