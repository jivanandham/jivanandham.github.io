"use client";

import { useLanguage } from "../context/LanguageContext";
import { VERSION } from "../data/site";
import styles from "./Footer.module.css";

export default function Footer() {
  const { t, lang } = useLanguage();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.line}>
          <span className="label">{t.ui.colophon}</span>
        </p>
        <p className={styles.line}>
          {lang === "fr" ? (
            <>
              Composé en <em>IBM Plex Serif</em>, <em>IBM Plex Sans</em> &amp;{" "}
              <em>IBM Plex Mono</em>. Fait main, sans modèles.
            </>
          ) : (
            <>
              Set in <em>IBM Plex Serif</em>, <em>IBM Plex Sans</em> &amp;{" "}
              <em>IBM Plex Mono</em>. Hand-coded, no templates.
            </>
          )}
        </p>
        <p className={styles.line}>
          <span className={styles.muted}>© {t.site.lastUpdated.slice(0, 4)} {t.site.name}</span>
          <span className={styles.sep}>·</span>
          <span className={styles.muted}>v{VERSION}</span>
          <span className={styles.sep}>·</span>
          <span className={styles.muted}>{t.ui.updatedOn} {t.site.lastUpdated}</span>
        </p>
      </div>
    </footer>
  );
}
