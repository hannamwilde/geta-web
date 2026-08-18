import { urlFor } from "@/sanity/client";
import BackButton from "./components/backButton";
import styles from "./styles.module.scss";

type Speaker = {
  _key: string;
  name: string;
  role?: string;
  bio?: string;
  photo?: { asset?: { _ref?: string }; alt?: string };
};

type AgendaItem = {
  _key: string;
  title: string;
  sub?: string;
};

type EventPageData = {
  _id: string;
  title: string;
  slug: string;
  eventType?: "event" | "webinar";
  date: string;
  endDate?: string;
  location?: string;
  registrationUrl?: string;
  excerpt?: string;
  image?: { asset?: { _ref?: string }; alt?: string };
  subtitle?: string;
  lead?: string;
  heroImage?: { asset?: { _ref?: string }; alt?: string };
  heroCtaLabel?: string;
  takeawaysEyebrow?: string;
  takeawaysHeadline?: string;
  takeawaysBody?: string;
  takeaways?: string[];
  agendaTitle?: string;
  agendaSub?: string;
  agenda?: AgendaItem[];
  speakersTitle?: string;
  speakers?: Speaker[];
  ctaTitle?: string;
  ctaBody?: string;
  ctaButtonLabel?: string;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("sv-SE", {
    weekday: "long",
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

function IconCheck() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
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

export default function EventPage({ event }: { event: EventPageData }) {
  const typeLabel = event.eventType === "webinar" ? "Webinar" : "Evenemang";
  const hasTakeaways =
    (event.takeaways && event.takeaways.length > 0) ||
    event.takeawaysHeadline ||
    event.takeawaysBody;
  const hasAgenda = event.agenda && event.agenda.length > 0;
  const hasSpeakers = event.speakers && event.speakers.length > 0;

  const heroImageUrl = event.heroImage?.asset
    ? urlFor(event.heroImage).width(1600).height(800).url()
    : null;

  return (
    <div className={styles.page}>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <header className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <nav className={styles.breadcrumb} aria-label="Brödsmulor">
            <BackButton label="← Tillbaka" className={styles.backLink} />
            <span aria-hidden>/</span>
            <span>{event.title}</span>
          </nav>

          <div className={styles.heroGrid}>
            <div className={styles.heroMain}>
              <span className={styles.pill}>{typeLabel}</span>
              <h1 className={styles.heroTitle}>{event.title}</h1>
              {event.subtitle && (
                <p className={styles.heroSub}>{event.subtitle}</p>
              )}
              {event.lead && (
                <p className={styles.heroLead}>{event.lead}</p>
              )}
              <div className={styles.heroCtas}>
                {event.registrationUrl && (
                  <a
                    href={event.registrationUrl}
                    className={styles.btnPrimary}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {event.heroCtaLabel || "Anmäl dig nu"}
                    <IconArrowRight />
                  </a>
                )}
                <BackButton label="Alla evenemang" className={styles.btnOutline} />
              </div>
            </div>

            <aside className={styles.facts}>
              <div className={styles.fact}>
                <span className={styles.factLabel}>Datum</span>
                <span className={styles.factValue}>{formatDate(event.date)}</span>
              </div>
              <div className={styles.fact}>
                <span className={styles.factLabel}>Tid</span>
                <span className={styles.factValue}>
                  {formatTime(event.date)}
                  {event.endDate ? `–${formatTime(event.endDate)}` : ""}
                </span>
              </div>
              {event.location && (
                <div className={styles.fact}>
                  <span className={styles.factLabel}>Plats</span>
                  <span className={styles.factValue}>{event.location}</span>
                </div>
              )}
            </aside>
          </div>
        </div>
      </header>

      {/* ── Banner image ──────────────────────────────────────────── */}
      {heroImageUrl && (
        <section className={styles.band}>
          <div className="container">
            <img
              src={heroImageUrl}
              alt={event.heroImage?.alt || event.title}
              className={styles.bandImage}
            />
          </div>
        </section>
      )}

      {/* ── Takeaways ─────────────────────────────────────────────── */}
      {hasTakeaways && (
        <section className={styles.section}>
          <div className="container">
            <div className={styles.twoCol}>
              <div className={styles.twoColHead}>
                {(event.takeawaysEyebrow || event.takeawaysHeadline) && (
                  <span className={styles.eyebrow}>
                    {event.takeawaysEyebrow || "Vad du får med dig"}
                  </span>
                )}
                {event.takeawaysHeadline && (
                  <h2 className={styles.secTitle}>{event.takeawaysHeadline}</h2>
                )}
                {event.takeawaysBody && (
                  <p className={styles.secBody}>{event.takeawaysBody}</p>
                )}
              </div>
              {event.takeaways && event.takeaways.length > 0 && (
                <ul className={styles.takeaways}>
                  {event.takeaways.map((t, i) => (
                    <li key={i} className={styles.takeaway}>
                      <span className={styles.check}>
                        <IconCheck />
                      </span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Agenda ────────────────────────────────────────────────── */}
      {hasAgenda && (
        <section className={styles.section}>
          <div className="container">
            <div className={styles.secHead}>
              <h2 className={styles.secTitle}>
                {event.agendaTitle || "Agenda"}
              </h2>
              {event.agendaSub && (
                <p className={styles.secSub}>{event.agendaSub}</p>
              )}
            </div>
            <div className={styles.agenda}>
              {event.agenda!.map((item, i) => (
                <article key={item._key} className={styles.agendaItem}>
                  <span className={styles.agendaNum}>{String(i + 1).padStart(2, "0")}.</span>
                  <div>
                    <h3 className={styles.agendaTitle}>{item.title}</h3>
                    {item.sub && <p className={styles.agendaSub}>{item.sub}</p>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Speakers ──────────────────────────────────────────────── */}
      {hasSpeakers && (
        <section className={styles.section}>
          <div className="container">
            <div className={styles.secHead}>
              <h2 className={styles.secTitle}>
                {event.speakersTitle || "Medverkande"}
              </h2>
            </div>
            <div className={styles.speakers}>
              {event.speakers!.map((speaker) => {
                const photoUrl = speaker.photo?.asset
                  ? urlFor(speaker.photo).width(560).height(560).url()
                  : null;
                return (
                  <article key={speaker._key} className={photoUrl ? styles.speaker : styles.speakerNoPhoto}>
                    {photoUrl && (
                      <div className={styles.speakerMedia}>
                        <img
                          src={photoUrl}
                          alt={speaker.photo?.alt || speaker.name}
                          className={styles.speakerPhoto}
                        />
                      </div>
                    )}
                    <div className={styles.speakerBody}>
                      <h3 className={styles.speakerName}>{speaker.name}</h3>
                      {speaker.role && (
                        <span className={styles.speakerRole}>{speaker.role}</span>
                      )}
                      {speaker.bio && (
                        <p className={styles.speakerBio}>{speaker.bio}</p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA band ──────────────────────────────────────────────── */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div>
              <h2 className={styles.ctaTitle}>
                {event.ctaTitle || "Anmäl dig nu"}
              </h2>
              {event.ctaBody && (
                <p className={styles.ctaBody}>{event.ctaBody}</p>
              )}
            </div>
            <div className={styles.ctaActions}>
              {event.registrationUrl && (
                <a
                  href={event.registrationUrl}
                  className={styles.btnLight}
                  target="_blank"
                  rel="noreferrer"
                >
                  {event.ctaButtonLabel || "Anmäl dig nu"}
                </a>
              )}
              <BackButton label="Alla evenemang" className={styles.btnGhost} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
