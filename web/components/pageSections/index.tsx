import Hero from "@/components/hero";
import Events from "@/components/events";
import GridList from "@/components/gridList";
import TextBlock from "@/components/textBlock";
import QuoteBlock from "@/components/quoteBlock";
import BulletListBlock from "@/components/bulletListBlock";
import ListBlock from "@/components/listBlock";
import LinkBlock from "@/components/linkBlock";
import BannerBlock from "@/components/bannerBlock";
import ImageSlider from "@/components/imageSlider";
import TrustBar from "@/components/trustBar";
import ContactBanner from "@/components/contactBanner";
import Services from "@/components/services";
import Cases from "@/components/cases";
import Mozaik from "@/components/mozaik";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sections: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cases?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  upcomingEvents?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pastEvents?: any[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderBlock(
  block: any,
  cases: any[],
  upcomingEvents: any[],
  pastEvents: any[],
) {
  switch (block._type) {
    case "heroSection":
      return <Hero key={block._key} block={block} />;
    case "GridList":
      return <GridList key={block._key} block={block} />;
    case "textSection":
    case "textBlock":
      return <TextBlock key={block._key} block={block} />;
    case "quoteBlock":
      return <QuoteBlock key={block._key} block={block} />;
    case "bulletListBlock":
      return <BulletListBlock key={block._key} block={block} />;
    case "listBlock":
      return <ListBlock key={block._key} block={block} />;
    case "linkBlock":
      return <LinkBlock key={block._key} block={block} />;
    case "bannerBlock":
      return <BannerBlock key={block._key} block={block} />;
    case "imageSliderBlock":
      return <ImageSlider key={block._key} block={block} />;
    case "trustBarSection":
      return <TrustBar key={block._key} block={block} />;
    case "contactBannerSection":
      return <ContactBanner key={block._key} block={block} />;
    case "servicesSection":
      return <Services key={block._key} block={block} />;
    case "casesSection":
      return <Cases key={block._key} block={block} cases={cases} />;
    case "mozaikSection":
      return <Mozaik key={block._key} block={block} />;
    case "eventsSection":
      return (
        <Events
          key={block._key}
          block={block}
          upcoming={upcomingEvents}
          past={pastEvents}
        />
      );
    default:
      return null;
  }
}

export default function PageSections({
  sections,
  cases = [],
  upcomingEvents = [],
  pastEvents = [],
}: Props) {
  return (
    <>
      {sections.map((block) =>
        renderBlock(block, cases, upcomingEvents, pastEvents),
      )}
    </>
  );
}
