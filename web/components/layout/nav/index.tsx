"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";
import { normalizeHref } from "@/lib/href";
import { useNavTheme } from "@/context/NavThemeContext";
import { useContactModal } from "@/context/ContactModalContext";
import type { Translations } from "@/lib/translations";
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

type Props = { data: NavData | null; t: Translations["a11y"] };

export default function Nav({ data, t }: Props) {
  const { theme } = useNavTheme();
  const [overMozaik, setOverMozaik] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Tracked separately from `openMenu`: that one is closed by an outside-click
  // listener, which would fire on taps inside the mobile panel.
  const [openMobileItem, setOpenMobileItem] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

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

  // Desktop and mobile render the action links identically — same icons, same
  // markup — so they can't drift. `onDone` lets the mobile panel close itself.
  const renderAction = (link: RightLink, i: number, onDone?: () => void) => {
    const key = link._key || i;
    if (link.action === "openContact" || link.action === "openBook") {
      const open = link.action === "openContact" ? openContact : openBook;
      return (
        <button
          key={key}
          className={styles.cta}
          onClick={() => {
            onDone?.();
            open();
          }}
        >
          {link.label}
          <Icon name="arrow-right" size={14} stroke={2} />
        </button>
      );
    }
    return (
      <a
        key={key}
        href={normalizeHref(resolveHref(link.linkType, link.href, link.pageRef))}
        className={link.style === "cta" ? styles.cta : styles.shop}
        {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
        onClick={onDone}
      >
        {link.style !== "cta" && (
          <Image
            src="/assets/shopify-icon.png"
            alt=""
            className={styles.shopIcon}
            aria-hidden
            width={20}
            height={20}
          />
        )}
        <span>{link.label}</span>
        {link.style === "cta" && (
          <Icon name="arrow-right" size={14} stroke={2} />
        )}
      </a>
    );
  };

  const closeMobile = () => {
    setMobileOpen(false);
    setOpenMobileItem(null);
  };

  const isPurple = theme === "purple" || overMozaik;

  return (
    <header
      className={`${styles.nav}${isPurple ? " " + styles.overMozaik : ""}`}
    >
      <div className={`container ${styles.inner}`}>
        {/* Desktop bar */}
        <div className={`${styles.bar} hide-mobile`} ref={barRef}>
          <a href="/" className={styles.logo} aria-label={t.homeLink}>
            <Image
              src="/assets/geta-logo-white.webp"
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
            {rightLinks.map((link, i) => renderAction(link, i))}
          </div>
        </div>

        {/* Mobile — same bar treatment as the desktop nav */}
        <div className={`${styles.mobileBar} show-mobile`}>
          <a href="/" className={styles.logo} aria-label={t.homeLink}>
            <Image
              src="/assets/geta-logo-white.webp"
              alt="Geta"
              width={512}
              height={157}
              style={{ display: "block", height: 22, width: "auto" }}
            />
          </a>
          <button
            className={styles.burger}
            onClick={() => {
              setMobileOpen((o) => !o);
              setOpenMobileItem(null);
            }}
            aria-label={t.menu}
          >
            <Icon name={mobileOpen ? "close" : "menu"} size={24} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className={`${styles.mobile} show-mobile`}>
          {items.map((it) => {
            // Mobile flattens the desktop mega columns into one stacked list.
            const subLinks = (it.megaColumns || []).flatMap((c) => c.links || []);
            if (!subLinks.length) {
              return (
                <a
                  key={it._key}
                  href={normalizeHref(resolveHref(it.linkType, it.href, it.pageRef))}
                  className={styles.mobileLink}
                  onClick={closeMobile}
                >
                  {it.label}
                </a>
              );
            }
            const open = openMobileItem === it._key;
            return (
              <div key={it._key} className={styles.mobileGroup}>
                <button
                  className={`${styles.mobileLink} ${styles.mobileParent}${open ? " " + styles.mobileParentOpen : ""}`}
                  onClick={() => setOpenMobileItem(open ? null : it._key)}
                  aria-expanded={open}
                >
                  {it.label}
                  <Icon name="chevron-down" size={18} stroke={1.8} />
                </button>
                {open && (
                  <div className={styles.mobileSub}>
                    {subLinks.map((link) => (
                      <a
                        key={link._key}
                        href={normalizeHref(resolveHref(link.linkType, link.href, link.pageRef))}
                        className={styles.mobileSubLink}
                        onClick={closeMobile}
                        {...(link.external
                          ? { target: "_blank", rel: "noreferrer" }
                          : {})}
                      >
                        <span>{link.label}</span>
                        {link.external && (
                          <Icon name="arrow-up-right" size={14} stroke={1.6} />
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div className={styles.mobileActions}>
            {rightLinks.map((link, i) =>
              renderAction(link, i, closeMobile),
            )}
          </div>
        </div>
      )}
    </header>
  );
}
