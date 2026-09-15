import HeroBlock from "@/components/blocks/heroBlock";
import EventsBlock from "@/components/blocks/eventsBlock";
import GridListBlock from "@/components/blocks/gridListBlock";
import TextBlock from "@/components/blocks/textBlock";
import QuoteBlock from "@/components/blocks/quoteBlock";
import AccordionBlock from "@/components/blocks/accordionBlock";
import BulletListBlock from "@/components/blocks/bulletListBlock";
import ListBlock from "@/components/blocks/listBlock";
import LinkBlock from "@/components/blocks/linkBlock";
import BannerBlock from "@/components/blocks/bannerBlock";
import ImageSliderBlock from "@/components/blocks/imageSliderBlock";
import MozaikServicesBlock from "@/components/blocks/mozaikServicesBlock";
import MozaikPropsHeadingBlock from "@/components/blocks/mozaikPropsHeadingBlock";
import TrustBarBlock from "@/components/blocks/trustBarBlock";
import ContactBannerBlock from "@/components/blocks/contactBannerBlock";
import GrowingListBlock from "@/components/blocks/growingListBlock";
import CasesBlock from "@/components/blocks/casesBlock";
import MozaikBlock from "@/components/blocks/mozaikBlock";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blocks: any[];
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
    case "heroBlock":
      return <HeroBlock key={block._key} block={block} />;
    case "GridList":
      return <GridListBlock key={block._key} block={block} />;
    // Legacy _type — drop once rename-sections-to-blocks has been applied.
    case "textSection":
    case "textBlock":
      return <TextBlock key={block._key} block={block} />;
    case "quoteBlock":
      return <QuoteBlock key={block._key} block={block} />;
    case "accordionBlock":
      return <AccordionBlock key={block._key} block={block} />;
    case "bulletListBlock":
      return <BulletListBlock key={block._key} block={block} />;
    case "listBlock":
      return <ListBlock key={block._key} block={block} />;
    case "linkBlock":
      return <LinkBlock key={block._key} block={block} />;
    case "bannerBlock":
      return <BannerBlock key={block._key} block={block} />;
    case "imageSliderBlock":
      return <ImageSliderBlock key={block._key} block={block} />;
    case "trustBarBlock":
      return <TrustBarBlock key={block._key} block={block} />;
    case "contactBannerBlock":
      return <ContactBannerBlock key={block._key} block={block} />;
    case "growingListBlock":
      return <GrowingListBlock key={block._key} block={block} />;
    case "casesBlock":
      return <CasesBlock key={block._key} block={block} cases={cases} />;
    case "mozaikBlock":
      return <MozaikBlock key={block._key} block={block} />;
    case "mozaikServicesBlock":
      return <MozaikServicesBlock key={block._key} block={block} />;
    case "mozaikPropsHeading":
      return <MozaikPropsHeadingBlock key={block._key} block={block} />;
    case "eventsBlock":
      return (
        <EventsBlock
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

export default function PageBlocks({
  blocks,
  cases = [],
  upcomingEvents = [],
  pastEvents = [],
}: Props) {
  return (
    <>
      {blocks.map((block) =>
        renderBlock(block, cases, upcomingEvents, pastEvents),
      )}
    </>
  );
}
