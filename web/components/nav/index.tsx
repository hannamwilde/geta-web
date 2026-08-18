"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/icon";
import { normalizeHref } from "@/lib/href";
import { useNavTheme } from "@/context/NavThemeContext";
import { useContactModal } from "@/context/ContactModalContext";
import styles from "./styles.module.scss";

type PageRef = { slug?: { current?: string } } | null;

type NavLink = {
  _key: string;
  label: string;
  href?: string;
  linkType?: string;
  pageRef?: PageRef;
  external?: boolean;
  highlight?: boolean;
};
type MegaColumn = { _key: string; links: NavLink[] };
type MenuItem = {
  _key: string;
  label: string;
  href?: string;
  linkType?: string;
  pageRef?: PageRef;
  megaColumns?: MegaColumn[];
};
type RightLink = {
  _key: string;
  label: string;
  style?: string;
  action?: string;
  href?: string;
  linkType?: string;
  pageRef?: PageRef;
  external?: boolean;
};

function resolveHref(linkType?: string, href?: string, pageRef?: PageRef): string {
  if (linkType === "internal" && pageRef?.slug?.current) return `/${pageRef.slug.current}`;
  return href || "";
}

export type NavData = {
  menuItems?: MenuItem[];
  rightLinks?: RightLink[];
};

type Props = { data: NavData | null };

export default function Nav({ data }: Props) {
  const { theme } = useNavTheme();
  const [scrolled, setScrolled] = useState(false);
  const [overMozaik, setOverMozaik] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (theme === "purple") {
      setOverMozaik(false);
      return;
    }
    const onScroll = () => {
      const bar = barRef.current;
      if (!bar) {
        setOverMozaik(false);
        return;
      }
      const b = bar.getBoundingClientRect();
      const darkSections = document.querySelectorAll<HTMLElement>(
        "#mozaik, .mzs-hero, .mzs-section",
      );
      let over = false;
      darkSections.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= b.top && r.bottom >= b.bottom) over = true;
      });
      setOverMozaik(over);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [theme]);

  useEffect(() => {
    if (!openMenu) return;
    const handler = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node))
        setOpenMenu(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openMenu]);

  const { open } = useContactModal();
  const openContact = () => open('contact');
  const openBook = () => open('book');

  const items = data?.menuItems || [];
  const rightLinks = data?.rightLinks || [];

  const isPurple = theme === "purple" || overMozaik;

  return (
    <header
      className={`${styles.nav}${scrolled ? " " + styles.scrolled : ""}${isPurple ? " " + styles.overMozaik : ""}`}
    >
      <div className={`container ${styles.inner}`}>
        {/* Desktop bar */}
        <div className={`${styles.bar} hide-mobile`} ref={barRef}>
          <a href="/" className={styles.logo} aria-label="Geta Digital home">
            <img
              src="/assets/geta-logo-white.png"
              alt="Geta"
              width={512}
              height={157}
              style={{ display: "block", height: 22, width: "auto" }}
            />
          </a>

          <nav className={styles.links}>
            {items.map((item) => {
              const hasMega = item.megaColumns && item.megaColumns.length > 0;
              const itemHref = resolveHref(item.linkType, item.href, item.pageRef);
              return (
                <div key={item._key} className={styles.linkWrap}>
                  {itemHref && !hasMega ? (
                    <a
                      className={`${styles.link}${openMenu === item._key ? " " + styles.linkOpen : ""}`}
                      href={normalizeHref(itemHref)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <button
                      className={`${styles.link}${openMenu === item._key ? " " + styles.linkOpen : ""}`}
                      onClick={() =>
                        setOpenMenu(openMenu === item._key ? null : item._key)
                      }
                    >
                      {item.label}
                      {hasMega && (
                        <Icon name="chevron-down" size={14} stroke={1.8} />
                      )}
                    </button>
                  )}
                  {hasMega && openMenu === item._key && (
                    <div
                      className={styles.mega}
                      style={
                        {
                          "--mega-cols": item.megaColumns!.length,
                        } as React.CSSProperties
                      }
                    >
                      <div className={styles.megaGrid}>
                        {item.megaColumns!.map((col) => (
                          <div key={col._key} className={styles.megaCol}>
                            {(col.links || []).map((link) => (
                              <a
                                key={link._key}
                                className={`${styles.megaItem}${link.highlight ? " " + styles.megaItemHighlight : ""}`}
                                href={normalizeHref(resolveHref(link.linkType, link.href, link.pageRef))}
                                onClick={() => setOpenMenu(null)}
                                {...(link.external
                                  ? { target: "_blank", rel: "noreferrer" }
                                  : {})}
                              >
                                <span>{link.label}</span>
                                {link.external && (
                                  <Icon
                                    name="arrow-up-right"
                                    size={14}
                                    stroke={1.6}
                                  />
                                )}
                              </a>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className={styles.actions}>
            {rightLinks.map((link, i) => {
              if (link.action === "openContact")
                return (
                  <button
                    key={link._key || i}
                    className={styles.cta}
                    onClick={openContact}
                  >
                    {link.label}
                    <Icon name="arrow-right" size={14} stroke={2} />
                  </button>
                );
              if (link.action === "openBook")
                return (
                  <button
                    key={link._key || i}
                    className={styles.cta}
                    onClick={openBook}
                  >
                    {link.label}
                    <Icon name="arrow-right" size={14} stroke={2} />
                  </button>
                );
              return (
                <a
                  key={link._key || i}
                  href={normalizeHref(resolveHref(link.linkType, link.href, link.pageRef))}
                  className={link.style === "cta" ? styles.cta : styles.shop}
                  {...(link.external
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                >
                  {link.style !== "cta" && (
                    <img
                      src="/assets/shopify-icon.png"
                      alt=""
                      className={styles.shopIcon}
                      aria-hidden
                    />
                  )}
                  <span>{link.label}</span>
                  {link.style === "cta" && (
                    <Icon name="arrow-right" size={14} stroke={2} />
                  )}
                </a>
              );
            })}
          </div>
        </div>

        {/* Mobile */}
        <a
          href="/"
          className={`${styles.logo} show-mobile`}
          aria-label="Geta Digital home"
        >
          <img
            src="/assets/geta-logo-white.png"
            alt="Geta"
            width={512}
            height={157}
            style={{ display: "block", height: 22, width: "auto" }}
          />
        </a>
        <button
          className={`${styles.burger} show-mobile`}
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Menu"
        >
          <Icon name={mobileOpen ? "close" : "menu"} size={24} />
        </button>
      </div>

      {mobileOpen && (
        <div className={`${styles.mobile} show-mobile`}>
          {items.map((it) => (
            <a
              key={it._key}
              href={normalizeHref(resolveHref(it.linkType, it.href, it.pageRef))}
              className={styles.mobileLink}
              onClick={() => setMobileOpen(false)}
            >
              {it.label}
            </a>
          ))}
          {rightLinks.map((link, i) => {
            if (link.action === "openContact")
              return (
                <button
                  key={link._key || i}
                  className="btn btn-primary"
                  onClick={() => {
                    setMobileOpen(false);
                    openContact();
                  }}
                >
                  {link.label}
                </button>
              );
            if (link.action === "openBook")
              return (
                <button
                  key={link._key || i}
                  className="btn btn-primary"
                  onClick={() => {
                    setMobileOpen(false);
                    openBook();
                  }}
                >
                  {link.label}
                </button>
              );
            return (
              <a
                key={link._key || i}
                href={normalizeHref(resolveHref(link.linkType, link.href, link.pageRef))}
                className={styles.mobileLink}
                {...(link.external
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
}
