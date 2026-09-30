"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { VERSION } from "../data/site";
import { OPEN_EVENT } from "./CommandLine";
import { useLanguage } from "../context/LanguageContext";
import styles from "./Sidebar.module.css";

const ASCII_LOGO = ` __ __ __
|  |  |/ /
|__|__|_\\ `;

const isActive = (pathname, href) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

export default function Sidebar() {
  const pathname = usePathname();
  const { lang, setLang, toggleLang, t } = useLanguage();
  const openCommandLine = () => window.dispatchEvent(new Event(OPEN_EVENT));
  const openAgentChat = () => window.dispatchEvent(new Event("jk:open-agent-chat"));

  return (
    <>
      <nav className={styles.rail} aria-label="Primary">
        <pre className={styles.logo} aria-hidden="true">{ASCII_LOGO}</pre>
        <ul className={styles.list}>
          {t.nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href} className={styles.item}>
                <Link
                  href={item.href}
                  className={`${styles.link} ${active ? styles.active : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  <span className={styles.dot} aria-hidden="true" />
                  <span className={styles.rotated}>{item.label}</span>
                  <span className={styles.full}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Language Switcher */}
        <button
          className={styles.cmd}
          onClick={toggleLang}
          aria-label="Toggle language (English / Français)"
          title="Switch language between English and French"
          style={{ marginBottom: "0.5rem" }}
        >
          <span className={styles.cmdKey} aria-hidden="true" style={{ fontSize: "0.65rem", color: "var(--terminal-green)" }}>
            {lang.toUpperCase()}
          </span>
          <span className={styles.full}>
            {lang === "fr" ? "LANG: FR (FRANÇAIS)" : "LANG: EN (ENGLISH)"}
          </span>
        </button>

        <button className={styles.cmd} onClick={openAgentChat} aria-label="Open AI Agent" style={{ marginBottom: "0.5rem" }}>
          <span className={styles.cmdKey} aria-hidden="true">⌬</span>
          <span className={styles.full}>AI AGENT</span>
        </button>
        <button className={styles.cmd} onClick={openCommandLine} aria-label="Open command line">
          <span className={styles.cmdKey} aria-hidden="true">/</span>
          <span className={styles.full}>COMMAND</span>
        </button>
        <span className={styles.foot}>v{VERSION}</span>
      </nav>

      <nav className={styles.tabbar} aria-label="Primary mobile">
        {t.nav.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.tab} ${active ? styles.tabActive : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <span className={styles.tabGlyph} aria-hidden="true">{item.glyph}</span>
              <span className={styles.tabLabel}>{item.label}</span>
            </Link>
          );
        })}
        <button
          className={styles.tab}
          onClick={toggleLang}
          aria-label="Toggle language"
          style={{ cursor: "pointer" }}
        >
          <span className={styles.tabGlyph} aria-hidden="true" style={{ fontSize: "0.75rem", color: "var(--terminal-green)", fontWeight: "bold" }}>
            {lang.toUpperCase()}
          </span>
          <span className={styles.tabLabel}>{lang === "fr" ? "FR" : "EN"}</span>
        </button>
      </nav>
    </>
  );
}
