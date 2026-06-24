import Hero from '@/components/hero/Hero'
import Events from '@/components/events/Events'
import GridList from '@/components/grid-list/GridList'
import TextBlock from '@/components/text-block/TextBlock'
import QuoteBlock from '@/components/quote-block/QuoteBlock'
import BulletListBlock from '@/components/bullet-list-block/BulletListBlock'
import ListBlock from '@/components/list-block/ListBlock'
import LinkBlock from '@/components/link-block/LinkBlock'
import BannerBlock from '@/components/banner-block/BannerBlock'
import MozaikHero from '@/components/mozaik-hero/MozaikHero'
import TrustBar from '@/components/trust-bar/TrustBar'
import ContactBanner from '@/components/contact-banner/ContactBanner'
import Services from '@/components/services/Services'
import Kundcase from '@/components/kundcase/Kundcase'
import Mozaik from '@/components/mozaik/Mozaik'

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sections: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  kundcases?: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  upcomingEvents?: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pastEvents?: any[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderBlock(block: any, kundcases: any[], upcomingEvents: any[], pastEvents: any[]) {
  switch (block._type) {
    case 'heroSection':
      return <Hero key={block._key} block={block} />
    case 'GridList':
      return <GridList key={block._key} block={block} />
    case 'textSection':
    case 'textBlock':
      return <TextBlock key={block._key} block={block} />
    case 'quoteBlock':
      return <QuoteBlock key={block._key} block={block} />
    case 'bulletListBlock':
      return <BulletListBlock key={block._key} block={block} />
    case 'listBlock':
      return <ListBlock key={block._key} block={block} />
    case 'linkBlock':
      return <LinkBlock key={block._key} block={block} />
    case 'bannerBlock':
      return <BannerBlock key={block._key} block={block} />
    case 'mozaikHeroBlock':
      return <MozaikHero key={block._key} block={block} />
    case 'trustBarSection':
      return <TrustBar key={block._key} block={block} />
    case 'contactBannerSection':
      return <ContactBanner key={block._key} block={block} />
    case 'servicesSection':
      return <Services key={block._key} block={block} />
    case 'kundcaseSection':
      return <Kundcase key={block._key} block={block} cases={kundcases} />
    case 'mozaikSection':
      return <Mozaik key={block._key} block={block} />
    case 'eventsSection':
      return <Events key={block._key} block={block} upcoming={upcomingEvents} past={pastEvents} />
    default:
      return null
  }
}

export default function PageSections({ sections, kundcases = [], upcomingEvents = [], pastEvents = [] }: Props) {
  return <>{sections.map(block => renderBlock(block, kundcases, upcomingEvents, pastEvents))}</>
}
