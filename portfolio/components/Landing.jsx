"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useTypewriter } from "../hooks/useTypewriter";
import { useLanguage } from "../context/LanguageContext";
import styles from "./Landing.module.css";

const EASE = [0.16, 1, 0.3, 1];
const BOOT_KEY = "jk-booted";

// pseudo-random vertical offsets for letterpress misalignment
const OFFSETS = [2, -3, 1, -1, 3, -2, 0, 2, -1, 1, -3, 2, 0, -2, 1, 3, -1, 0, 2, -2, 1];

export default function Landing() {
  const { t } = useLanguage();
  const current = t.experience.find((e) => !e.end);
  const recent = current ?? t.experience[0];
  const latest = t.projects[0];
  const reduce = useReducedMotion();
  const { rendered, done, skip } = useTypewriter(t.bootLines, { charDelay: [12, 28], lineDelay: 80 });

  // Returning visitors (same tab session) skip straight to the interface.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(BOOT_KEY)) skip();
    } catch {
      /* storage unavailable — just play the boot */
    }
  }, [skip]);

  // Any key, click, or tap skips the boot sequence.
  useEffect(() => {
    if (done) {
      try {
        sessionStorage.setItem(BOOT_KEY, "1");
      } catch {}
      return;
    }
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.key === "Tab") return;
      if (e.key === " ") e.preventDefault(); // don't scroll the page while skipping
      skip();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", skip);
    };
  }, [done, skip]);

  const [first, last] = t.site.name.split(" ");

  return (
    <section className={styles.hero}>
      <div className={styles.scanlines} aria-hidden="true" />

      <div className={styles.boot} aria-label="System boot log">
        {rendered.map((line, i) => {
          const complete = line.length >= t.bootLines[i].length;
          return (
            <p key={i} className={styles.bootLine}>
              {line}
              {!done && line.length > 0 && !complete && (
                <span className={styles.cursor}>█</span>
              )}
              {complete && (
                <span className={styles.ok} aria-hidden="true"> [OK]</span>
              )}
            </p>
          );
        })}
        {!done && <p className={styles.skipHint}>{t.ui.skipHint}</p>}
      </div>

      {/* Always in the markup (so the h1 is in the static HTML); hidden until the boot finishes. */}
      <motion.div
        className={styles.identity}
        style={{ visibility: done ? "visible" : "hidden" }}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
        animate={done ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.4, ease: EASE }}
      >
          <h1 className={styles.name} aria-label={t.site.name}>
            <span className={styles.word} aria-hidden="true">
              {first.split("").map((ch, i) => (
                <span
                  key={i}
                  className={styles.letter}
                  style={{ transform: `translateY(${OFFSETS[i % OFFSETS.length]}px)` }}
                >
                  {ch}
                </span>
              ))}
            </span>
            <span className={styles.word} aria-hidden="true">
              {last.split("").map((ch, i) => (
                <span
                  key={i}
                  className={styles.letter}
                  style={{ transform: `translateY(${OFFSETS[(i + 7) % OFFSETS.length]}px)` }}
                >
                  {ch}
                </span>
              ))}
            </span>
          </h1>

          <p className={`accent-italic ${styles.tagline}`}>{t.site.tagline}</p>

          <dl className={styles.now}>
            <div>
              <dt className="label">{current ? t.ui.nowLabel : t.ui.recentlyLabel}</dt>
              <dd>
                {recent.role}, {recent.org}
              </dd>
            </div>
            <div>
              <dt className="label">{t.ui.latestLabel}</dt>
              <dd>
                <Link href={`/work#${latest.slug}`}>{latest.title}</Link>
              </dd>
            </div>
            <div>
              <dt className="label">{t.ui.statusLabel}</dt>
              <dd className={styles.status}>
                <span className={styles.statusDot} aria-hidden="true" />
                {t.site.status} ({t.site.location})
              </dd>
            </div>
          </dl>

          <nav className={styles.actions} aria-label="Start here">
            <Link href="/work" className={styles.primary}>{t.ui.viewWorkBtn}</Link>
            <Link href="/record" className={styles.secondary}>{t.ui.readRecordBtn}</Link>
            <Link href="/signal" className={styles.secondary}>{t.ui.contactBtn}</Link>
          </nav>

          <p className={styles.kbd} aria-hidden="true">
            {t.ui.tipCmd}
          </p>
      </motion.div>
    </section>
  );
}
