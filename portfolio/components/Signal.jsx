"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useTypewriter } from "../hooks/useTypewriter";
import { useLanguage } from "../context/LanguageContext";
import styles from "./Signal.module.css";

const strip = (url) => url.replace(/^https?:\/\//, "");

export default function Signal() {
  const { t, lang } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const blockRef = useRef(null);

  const lines = useMemo(() => [
    lang === "fr" ? "> ÉTABLIR LA CONNEXION" : "> ESTABLISH CONNECTION",
    `> EMAIL: ${t.site.email}`,
    `> GITHUB: ${strip(t.site.github)}`,
    `> LINKEDIN: ${strip(t.site.linkedin)}`,
    `> LOCATION: ${t.site.location}`,
  ], [lang, t.site]);

  useEffect(() => {
    const el = blockRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const { rendered, done, skip } = useTypewriter(lines, {
    enabled: visible,
    charDelay: [18, 40],
    lineDelay: 100,
  });

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(t.site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${t.site.email}`;
    }
  };

  return (
    <div className={styles.page}>
      <span className="label">// {lang === "fr" ? "CONTACT" : "SIGNAL"}</span>
      <h1 className={styles.title}>
        {lang === "fr" ? (
          <>
            Ouvrir un <em className="accent-italic">canal</em>.
          </>
        ) : (
          <>
            Open a <em className="accent-italic">channel</em>.
          </>
        )}
      </h1>

      <p className={styles.pitch}>
        {t.ui.signalPitch}
      </p>

      <div
        className={styles.terminal}
        ref={blockRef}
        aria-label="Contact terminal"
        onClick={() => !done && skip()}
      >
        <div className={styles.termBar} aria-hidden="true">
          <span /><span /><span />
          <span className={styles.termTitle}>signal — 80×24</span>
        </div>
        <div className={styles.termBody}>
          <p className={styles.line}>{rendered[0]}</p>
          <p className={styles.line}>
            {rendered[1]}
            {done && (
              <>
                <button className={styles.action} onClick={copyEmail}>
                  {copied ? t.ui.copiedBtn : t.ui.copyBtn}
                </button>
                <a className={styles.action} href={`mailto:${t.site.email}`}>
                  {t.ui.writeBtn}
                </a>
              </>
            )}
          </p>
          <p className={styles.line}>
            {rendered[2]}
            {done && (
              <a className={styles.action} href={t.site.github} target="_blank" rel="noopener noreferrer">
                {t.ui.openBtn}
              </a>
            )}
          </p>
          <p className={styles.line}>
            {rendered[3]}
            {done && (
              <a className={styles.action} href={t.site.linkedin} target="_blank" rel="noopener noreferrer">
                {t.ui.openBtn}
              </a>
            )}
          </p>
          <p className={styles.line}>{rendered[4]}</p>
          {done && <p className={styles.line}>&gt; {lang === "fr" ? "CONNEXION ÉTABLIE" : "CONNECTION READY"} <span className={styles.cursor}>█</span></p>}
        </div>
      </div>

      <p className={`accent-italic ${styles.note}`}>
        {t.ui.signalNote}
      </p>
    </div>
  );
}
