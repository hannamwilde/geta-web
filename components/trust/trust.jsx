/* global React */

const LOGOS_QUERY = `*[_id == "homePage"][0].sections[_type == "trustBarSection"][0].logos[]->{
  _id,
  name,
  logo { asset, alt },
  website
}`;

const LOGOS_FALLBACK = [
  { _id: 'oob',       name: 'ÖoB',       src: 'assets/logos/oob.png' },
  { _id: 'kpenergy',  name: 'KP Energy',  src: 'assets/logos/kp-energy.png' },
  { _id: 'alleima',   name: 'Alleima',    src: 'assets/logos/alleima.png' },
  { _id: 'cibes',     name: 'Cibes',      src: 'assets/logos/cibes.png' },
  { _id: 'aleris',    name: 'Aleris',     src: 'assets/logos/aleris.png' },
  { _id: 'ewheels',   name: 'E-Wheels',   src: 'assets/logos/e-wheels.png' },
  { _id: 'hoie',      name: 'Høie',       src: 'assets/logos/hoie.png' },
  { _id: 'nille',     name: 'Nille',      src: 'assets/logos/nille.png' },
  { _id: 'abk',       name: 'ABK',        src: 'assets/logos/abk.png' },
  { _id: 'norengros', name: 'NorEngros',  src: 'assets/logos/norengros.png' },
  { _id: 'besafe',    name: 'BeSafe',     src: 'assets/logos/besafe.png' },
];

function getLogoSrc(item) {
  if (item.logo && item.logo.asset && window.sanity) {
    return window.sanity.imageUrl(item.logo, { height: 68 });
  }
  return item.src || '';
}

const TrustBar = ({block}) => {
  const [logos, setLogos] = React.useState(LOGOS_FALLBACK);

  React.useEffect(() => {
    if (block && block.logos && block.logos.length > 0) {
      setLogos(block.logos);
      return;
    }
    if (!window.sanity) return;
    window.sanity.query(LOGOS_QUERY)
      .then(function (data) {
        if (data && data.length > 0) setLogos(data);
      })
      .catch(function () {});
  }, [block]);

  const row = [...logos, ...logos];

  return (
    <section className="marquee" aria-label="Kunder som litar på Geta">
      <div className="marquee-track">
        {row.map((logo, i) => (
          <div className="marquee-logo" key={logo._id + '-' + i} aria-hidden={i >= logos.length}>
            {logo.website
              ? <a href={logo.website} target="_blank" rel="noopener noreferrer" tabIndex={i >= logos.length ? -1 : 0}>
                  <img src={getLogoSrc(logo)} alt={logo.name} loading="lazy" draggable="false" />
                </a>
              : <img src={getLogoSrc(logo)} alt={logo.name} loading="lazy" draggable="false" />
            }
          </div>
        ))}
      </div>
    </section>
  );
};

const Trust = () => null;

window.Trust = Trust;
window.TrustBar = TrustBar;
