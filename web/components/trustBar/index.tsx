import { urlFor } from '@/sanity/client'
import { resolveBackground } from '@/lib/background'
import styles from './styles.module.scss'

type Logo = {
  _id: string
  name: string
  logo?: { asset: unknown; alt?: string }
  website?: string
  src?: string
}

type Props = {
  block?: {
    logos?: Logo[]
    backgroundColor?: string
    backgroundGradient?: { type?: string; from?: string; to?: string; angle?: number; position?: string } | null
  }
}

const FALLBACK: Logo[] = [
  { _id: 'oob', name: 'ÖoB', src: '/assets/logos/oob.png' },
  { _id: 'kpenergy', name: 'KP Energy', src: '/assets/logos/kp-energy.png' },
  { _id: 'alleima', name: 'Alleima', src: '/assets/logos/alleima.png' },
  { _id: 'cibes', name: 'Cibes', src: '/assets/logos/cibes.png' },
  { _id: 'aleris', name: 'Aleris', src: '/assets/logos/aleris.png' },
  { _id: 'ewheels', name: 'E-Wheels', src: '/assets/logos/e-wheels.png' },
  { _id: 'hoie', name: 'Høie', src: '/assets/logos/hoie.png' },
  { _id: 'nille', name: 'Nille', src: '/assets/logos/nille.png' },
  { _id: 'abk', name: 'ABK', src: '/assets/logos/abk.png' },
  { _id: 'norengros', name: 'NorEngros', src: '/assets/logos/norengros.png' },
  { _id: 'besafe', name: 'BeSafe', src: '/assets/logos/besafe.png' },
]

function getLogoSrc(item: Logo) {
  if (item.logo?.asset) return urlFor(item.logo).height(68).url()
  return item.src || ''
}

export default function TrustBar({ block }: Props) {
  const logos = (block?.logos && block.logos.length > 0) ? block.logos : FALLBACK
  const row = [...logos, ...logos]
  const bg = resolveBackground(block?.backgroundColor, block?.backgroundGradient)

  return (
    <section className={styles.marquee} style={Object.keys(bg).length ? bg : undefined} aria-label="Kunder som litar på Geta">
      <div className={styles.track}>
        {row.map((logo, i) => (
          <div className={styles.logo} key={logo._id + '-' + i} aria-hidden={i >= logos.length}>
            {logo.website
              ? <a href={logo.website} target="_blank" rel="noopener noreferrer" tabIndex={i >= logos.length ? -1 : 0}>
                  <img src={getLogoSrc(logo)} alt={logo.name} loading="lazy" draggable={false} />
                </a>
              : <img src={getLogoSrc(logo)} alt={logo.name} loading="lazy" draggable={false} />
            }
          </div>
        ))}
      </div>
    </section>
  )
}
