/* global React, Icon */

// Mozaik ecosystem — dark, premium parallax.
// Central hub on a sticky stage; components reveal in a ring, flying outward
// from the core as the user scrolls. Layered depth: glow + grid (slow),
// orbit rings (medium), connection lines + cards (fast), hub (anchored).

const MOZAIK_QUERY = `*[_id == "homePage"][0].sections[_type == "mozaikSection"][0]{
  headline,
  subheadline,
  wordImage { asset },
  markImage { asset },
  hubNameImage { asset },
  components[]{ _key, label, description, icon, logo { asset, alt } }
}`;

function resolveNodes(sanityComponents) {
  if (!sanityComponents || sanityComponents.length === 0) return null;
  return sanityComponents.map(function (comp) {
    return {
      key: comp._key,
      title: comp.label,
      icon: comp.icon,
      blurb: comp.description,
      logo: comp.logo || null,
    };
  });
}

// Reveal order: top first, then fan out symmetrically — filtered to actual count.
const FULL_REVEAL_ORDER = [0, 11, 1, 10, 2, 9, 3, 8, 4, 7, 5, 6];

const clampM = (v, a, b) => Math.max(a, Math.min(b, v));
const easeOutM = (t) => 1 - Math.pow(1 - t, 3);
const easeInOutM = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

const Mozaik = ({ onOpenContact }) => {
  const trackRef = React.useRef(null);
  const [p, setP] = React.useState(0);
  const [content, setContent] = React.useState();
  const [nodes, setNodes] = React.useState();

  React.useEffect(() => {
    if (!window.sanity) return;
    window.sanity.query(MOZAIK_QUERY)
      .then(function (data) {
        if (!data) return;
        setContent({
          headline: data.headline,
          subheadline: data.subheadline,
          wordSrc: data.wordImage && window.sanity ? window.sanity.imageUrl(data.wordImage, {height: 80}) : null,
          markSrc: data.markImage && window.sanity ? window.sanity.imageUrl(data.markImage, {height: 104}) : null,
          hubNameSrc: data.hubNameImage && window.sanity ? window.sanity.imageUrl(data.hubNameImage, {height: 60}) : null,
        });
        setNodes(resolveNodes(data.components));
      })
      .catch(function () {});
  }, []);

  React.useEffect(() => {
    let ticking = false;
    const compute = () => {
      ticking = false;
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = clampM(-rect.top, 0, total);
      setP(total > 0 ? scrolled / total : 0);
    };
    const onScroll = () => {
      compute();
      if (!ticking) { ticking = true; requestAnimationFrame(compute); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    compute();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  if (!content || !nodes || nodes.length === 0) return null;

  // geometry — ellipse in a 1000x1000 orbit square
  const CX = 500, CY = 500, RX = 405, RY = 388;
  const angleOf = (i) => (-90 + i * (360 / nodes.length)) * Math.PI / 180;
  const nodePos = (i) => ({ x: CX + RX * Math.cos(angleOf(i)), y: CY + RY * Math.sin(angleOf(i)) });

  const revealOrder = FULL_REVEAL_ORDER.filter(i => i < nodes.length);

  const revealOf = (i) => {
    const pos = revealOrder.indexOf(i);
    if (pos === -1) return 0;
    const start = 0.12 + pos * 0.045;
    const dur = 0.16;
    return easeOutM(clampM((p - start) / dur, 0, 1));
  };

  // parallax depth transforms
  const gridY = (p - 0.5) * 70;
  const glowScale = 1 + p * 0.5;
  const ringRot = (p - 0.5) * 16;
  const ringScale = 0.9 + p * 0.12;
  const hubScale = 0.92 + clampM(p * 2.2, 0, 1) * 0.08;
  const radiusFactor = 0.94 + easeInOutM(clampM(p * 1.15, 0, 1)) * 0.06;

  const introOpacity = clampM(1 - p * 8, 0, 1);
  const introScale = 1 - clampM(p * 6, 0, 1) * 0.16;
  const introY = -clampM(p * 6, 0, 1) * 22;
  const hubOpacity = clampM((p - 0.05) * 9, 0, 1);

  const radiusAt = (r) => radiusFactor * (0.93 + 0.07 * r);

  const q = easeInOutM(clampM((p - 0.78) / 0.22, 0, 1));
  const outroExpand = 1 + q * 1.9;
  const outroFade = 1 - clampM(q * 1.25, 0, 1);
  const ringExtraScale = 1 + q * 0.95;
  const ringOutro = 1 - clampM(q * 1.3, 0, 1);
  const ctaProg = easeOutM(clampM((q - 0.28) / 0.55, 0, 1));
  const hubCoreOpacity = hubOpacity * (1 - clampM(ctaProg * 1.2, 0, 1));
  const hubShrink = 1 - ctaProg * 0.32;

  return (
    <section className="mz" id="mozaik">
      <div className="mz-track" ref={trackRef}>
        <div className="mz-stage">
          <div className="mz-bg" aria-hidden>
            <div className="mz-glow" style={{ transform: `translate(-50%, -50%) scale(${glowScale})`, opacity: 0.4 + p * 0.35 }} />
          </div>

          <div className="mz-header" style={{ transform: `translateY(${-clampM(p * 4, 0, 1) * 10}px)`, padding: '86px 33px 0px' }}>
            <h2 className="mz-header-title">
              <em><img className="mz-word" src={content.wordSrc || 'assets/mozaik-wordmark-white.png'} alt="Mozaik" /> är här,</em><br />AI-driven digital handel
            </h2>
            <p className="mz-header-text">{content.subheadline}</p>
          </div>

          <div className="mz-inner">
            <div className="mz-orbit-col">
              <div className="mz-mobile-grid" aria-hidden>
                {nodes.map(n => (
                  <div className="mz-card mz-card--static is-on" key={n.key}>
                    <div className="mz-card-icon">{n.logo && window.sanity ? <img src={window.sanity.imageUrl(n.logo, {width: 40, height: 40})} alt={n.logo.alt || n.title} /> : <Icon name={n.icon} size={20} stroke={1.7} />}</div>
                    <div className="mz-card-body">
                      <div className="mz-card-title">{n.title}</div>
                      <div className="mz-card-blurb">{n.blurb}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mz-orbit" style={{ transform: `scale(${ringScale})` }}>
                <svg className="mz-rings" viewBox="0 0 1000 1000" aria-hidden style={{ transform: `rotate(${ringRot}deg) scale(${ringExtraScale})`, opacity: ringOutro }}>
                  <defs>
                    <radialGradient id="mz-ring-grad" cx="50%" cy="50%" r="50%">
                      <stop offset="60%" stopColor="rgba(255,255,255,0)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.06)" />
                    </radialGradient>
                  </defs>
                  <ellipse cx="500" cy="500" rx="405" ry="388" className="mz-ring" />
                  <ellipse cx="500" cy="500" rx="300" ry="288" className="mz-ring mz-ring-mid" />
                  <ellipse cx="500" cy="500" rx="195" ry="188" className="mz-ring mz-ring-inner" />
                </svg>

                <svg className="mz-lines" viewBox="0 0 1000 1000" aria-hidden>
                  {nodes.map((n, i) => {
                    const r = revealOf(i);
                    if (r <= 0.01) return null;
                    const full = nodePos(i);
                    const f = radiusAt(r) * outroExpand;
                    const x = CX + (full.x - CX) * f;
                    const y = CY + (full.y - CY) * f;
                    return (
                      <line key={n.key} x1={CX} y1={CY} x2={x} y2={y}
                        className="mz-line" pathLength="1"
                        style={{ strokeDasharray: 1, strokeDashoffset: 1 - r, opacity: r * outroFade }} />
                    );
                  })}
                </svg>

                <svg className="mz-dots" viewBox="0 0 1000 1000" aria-hidden>
                  {nodes.map((n, i) => {
                    const r = revealOf(i);
                    if (r <= 0.2) return null;
                    const full = nodePos(i);
                    const f = radiusAt(r) * outroExpand;
                    const x = CX + (full.x - CX) * f;
                    const y = CY + (full.y - CY) * f;
                    return <circle key={n.key} cx={x} cy={y} r="5" className="mz-node-dot" style={{ opacity: r * outroFade }} />;
                  })}
                </svg>

                <div className="mz-hub" style={{ transform: `translate(-50%, -50%) scale(${hubScale * hubShrink})`, opacity: hubCoreOpacity }}>
                  <div className="mz-hub-glow" />
                  <div className="mz-hub-disc">
                    <img className="mz-mark" src={content.markSrc || 'assets/mozaik-mark.png'} alt="" />
                    <img className="mz-hub-name" src={content.hubNameSrc || 'assets/mozaik-wordmark-white.png'} alt="Mozaik" />
                  </div>
                </div>

                {nodes.map((n, i) => {
                  const r = revealOf(i);
                  const full = nodePos(i);
                  const f = radiusAt(r) * outroExpand;
                  const x = CX + (full.x - CX) * f;
                  const y = CY + (full.y - CY) * f;
                  const side = Math.cos(angleOf(i)) < -0.2 ? 'l' : Math.cos(angleOf(i)) > 0.2 ? 'r' : 'c';
                  return (
                    <div
                      key={n.key}
                      className={`mz-card mz-card--${side} ${r > 0.5 ? 'is-on' : ''}`}
                      style={{
                        left: `${(x / 1000) * 100}%`,
                        top: `${(y / 1000) * 100}%`,
                        opacity: clampM(r * 1.5, 0, 1) * outroFade,
                        transform: `translate(-50%, -50%) scale(${0.7 + r * 0.3})`,
                      }}
                    >
                      <div className="mz-card-icon">
                        <Icon name={n.icon} size={20} stroke={1.7} />
                      </div>
                      <div className="mz-card-body">
                        <div className="mz-card-title">{n.title}</div>
                        <div className="mz-card-blurb">{n.blurb}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <a
                className="mz-cta"
                href="#/losningar/mozaik"
                style={{
                  opacity: ctaProg,
                  pointerEvents: ctaProg > 0.6 ? 'auto' : 'none',
                  transform: `translate(-50%, -50%) scale(${0.5 + ctaProg * 0.5})`,
                }}
              >
                <span>Upptäck Mozaik</span>
                <Icon name="arrow-right" size={17} stroke={2} />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

window.Mozaik = Mozaik;
