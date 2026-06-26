import { urlFor } from "@/sanity/client";
import styles from "./Events.module.css";

type EventItem = {
  _id: string;
  title: string;
  date: string;
  endDate?: string;
  location?: string;
  excerpt?: string;
  registrationUrl?: string;
  eventType?: "event" | "webinar";
  image?: { asset?: { _ref?: string }; alt?: string };
};

type Props = {
  block: {
    upcomingLabel?: string;
    upcomingWebinarLabel?: string;
    upcomingSub?: string;
    pastLabel?: string;
    pastWebinarLabel?: string;
    pastSub?: string;
    registerLabel?: string;
    borderRadius?: number;
  };
  upcoming: EventItem[];
  past: EventItem[];
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function IconCalendar() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path d="M8 5v14l11-7z" fill="currentColor" />
    </svg>
  );
}

function UpcomingCard({
  item,
  registerLabel,
}: {
  item: EventItem;
  registerLabel: string;
}) {
  const imgUrl = item.image?.asset
    ? urlFor(item.image).width(900).height(600).url()
    : null;

  return (
    <article
      className={`${styles.upcomingCard}${imgUrl ? ` ${styles.upcomingCardWithImage}` : ""}`}
    >
      {imgUrl && (
        <div className={styles.cardImageWrap}>
          <img
            src={imgUrl}
            alt={item.image?.alt || item.title}
            className={styles.cardImage}
          />
        </div>
      )}
      <div className={styles.cardContent}>
        <div className={styles.cardMeta}>
          <span className={styles.metaDate}>
            <IconCalendar />
            {formatDate(item.date)}
          </span>
          <span className={styles.metaItem}>
            <IconClock />
            {formatTime(item.date)}
            {item.endDate ? `–${formatTime(item.endDate)}` : ""}
          </span>
          {item.location && (
            <span className={styles.metaItem}>
              <IconPin />
              {item.location}
            </span>
          )}
        </div>
        <h3 className={styles.cardTitle}>{item.title}</h3>
        {item.excerpt && <p className={styles.cardExcerpt}>{item.excerpt}</p>}
        {item.registrationUrl && (
          <a
            href={item.registrationUrl}
            className={styles.registerBtn}
            target="_blank"
            rel="noreferrer"
          >
            {registerLabel}
            <IconArrowRight />
          </a>
        )}
      </div>
    </article>
  );
}

function PastCard({ item }: { item: EventItem }) {
  const imgUrl = item.image?.asset
    ? urlFor(item.image).width(600).height(400).url()
    : null;

  return (
    <article className={styles.pastCard}>
      {imgUrl && (
        <div
          className={
            item.eventType === "webinar"
              ? styles.webinarThumb
              : styles.pastImageWrap
          }
        >
          <img
            src={imgUrl}
            alt={item.image?.alt || item.title}
            className={styles.pastImage}
          />
          {item.eventType === "webinar" && (
            <span className={styles.playBtn} aria-hidden>
              <IconPlay />
            </span>
          )}
        </div>
      )}
      {item.location && (
        <span className={styles.pastPill}>{item.location}</span>
      )}
      <h3 className={styles.pastCardTitle}>{item.title}</h3>
      {item.excerpt && <p className={styles.pastCardText}>{item.excerpt}</p>}
      <span className={styles.pastCardDate}>{formatDate(item.date)}</span>
    </article>
  );
}

function EventSection({
  title,
  sub,
  items,
  registerLabel,
}: {
  title: string;
  sub?: string;
  items: EventItem[];
  registerLabel: string;
}) {
  if (items.length === 0) return null;
  return (
    <section className={styles.evSection}>
      <div className="container">
        <div className={styles.secHead}>
          <h2 className={styles.secTitle}>{title}</h2>
          {sub && <p className={styles.secSub}>{sub}</p>}
        </div>
        <div className={styles.upcomingList}>
          {items.map((item) => (
            <UpcomingCard
              key={item._id}
              item={item}
              registerLabel={registerLabel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PastSection({
  title,
  sub,
  items,
}: {
  title: string;
  sub?: string;
  items: EventItem[];
}) {
  if (items.length === 0) return null;
  return (
    <section className={styles.evSection}>
      <div className="container">
        <div className={styles.secHead}>
          <h2 className={styles.secTitle}>{title}</h2>
          {sub && <p className={styles.secSub}>{sub}</p>}
        </div>
        <div className={styles.pastGrid}>
          {items.map((item) => (
            <PastCard key={item._id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Events({ block, upcoming, past }: Props) {
  const upcomingEvents = upcoming.filter((e) => e.eventType !== "webinar");
  const upcomingWebinars = upcoming.filter((e) => e.eventType === "webinar");
  const pastEvents = past.filter((e) => e.eventType !== "webinar");
  const pastWebinars = past.filter((e) => e.eventType === "webinar");

  const registerLabel = block.registerLabel || "";

  const evStyle = block.borderRadius != null
    ? { '--r-lg': block.borderRadius + 'px', '--r-xl': block.borderRadius + 'px' } as React.CSSProperties
    : undefined

  return (
    <div className={styles.evPage} style={evStyle}>
      <EventSection
        title={block.upcomingLabel || ""}
        sub={block.upcomingSub}
        items={upcomingEvents}
        registerLabel={registerLabel}
      />
      <EventSection
        title={block.upcomingWebinarLabel || ""}
        items={upcomingWebinars}
        registerLabel={registerLabel}
      />
      <PastSection
        title={block.pastLabel || ""}
        sub={block.pastSub}
        items={pastEvents}
      />
      <PastSection
        title={block.pastWebinarLabel || ""}
        items={pastWebinars}
      />
    </div>
  );
}
