"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";

const NAV = [
  { label: "INDEX", href: "/", glyph: "▣" },
  { label: "WORK", href: "/work", glyph: "⌬" },
  { label: "INFO", href: "/info", glyph: "◉" },
  { label: "LOG", href: "/log", glyph: "≣" },
  { label: "SIGNAL", href: "/signal", glyph: "⌁" },
];

const ASCII_LOGO = ` __ __ __
|  |  |/ /
|__|__|_\\ `;

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <nav className={styles.rail} aria-label="Primary">
        <pre className={styles.logo} aria-hidden="true">{ASCII_LOGO}</pre>
        <ul className={styles.list}>
          {NAV.map((item) => {
            const active = pathname === item.href;
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
        <span className={styles.foot}>v3.2.1</span>
      </nav>

      <nav className={styles.tabbar} aria-label="Primary mobile">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.tab} ${active ? styles.tabActive : ""}`}
            >
              <span className={styles.tabGlyph} aria-hidden="true">{item.glyph}</span>
              <span className={styles.tabLabel}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
