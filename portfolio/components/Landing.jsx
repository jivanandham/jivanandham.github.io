"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTypewriter } from "../hooks/useTypewriter";
import { SITE, BOOT_LINES } from "../data/site";
import styles from "./Landing.module.css";

const EASE = [0.16, 1, 0.3, 1];

// pseudo-random vertical offsets for letterpress misalignment
const OFFSETS = [2, -3, 1, -1, 3, -2, 0, 2, -1, 1, -3, 2, 0, -2, 1, 3, -1, 0, 2, -2, 1];

export default function Landing() {
  const reduce = useReducedMotion();
  const { rendered, done } = useTypewriter(BOOT_LINES, { charDelay: [12, 28], lineDelay: 80 });

  const [first, last] = SITE.name.split(" ");

  return (
    <section className={styles.hero}>
      <div className={styles.scanlines} aria-hidden="true" />

      <div className={styles.boot} aria-label="System boot log">
        {rendered.map((line, i) => {
          const complete = line.length >= BOOT_LINES[i].length;
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
      </div>

      {done && (
        <motion.div
          className={styles.identity}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <h1 className={styles.name} aria-label={SITE.name}>
            <span className={styles.word}>
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
            <span className={styles.word}>
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

          <p className={`accent-italic ${styles.tagline}`}>{SITE.tagline}</p>

          <div className={styles.scrollHint} aria-hidden="true">
            <span className="label">scroll</span>
            <span className={styles.scrollLine} />
          </div>
        </motion.div>
      )}
    </section>
  );
}
