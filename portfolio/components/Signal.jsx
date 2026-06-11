"use client";

import { useEffect, useRef, useState } from "react";
import { useTypewriter } from "../hooks/useTypewriter";
import { SITE } from "../data/site";
import styles from "./Signal.module.css";

const LINES = [
  "> ESTABLISH CONNECTION",
  `> EMAIL: ${SITE.email}`,
  "> GITHUB: github.com/jivanandham",
  "> LINKEDIN: linkedin.com/in/jivanandham",
];

export default function Signal() {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const blockRef = useRef(null);

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

  const { rendered, done } = useTypewriter(LINES, {
    enabled: visible,
    charDelay: [18, 40],
    lineDelay: 100,
  });

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${SITE.email}`;
    }
  };

  return (
    <div className={styles.page}>
      <span className="label">// SIGNAL</span>
      <h1 className={styles.title}>
        Open a <em className="accent-italic">channel</em>.
      </h1>

      <div className={styles.terminal} ref={blockRef} aria-label="Contact terminal">
        <div className={styles.termBar} aria-hidden="true">
          <span /><span /><span />
          <span className={styles.termTitle}>signal — 80×24</span>
        </div>
        <div className={styles.termBody}>
          <p className={styles.line}>{rendered[0]}</p>
          <p className={styles.line}>
            {rendered[1]}
            {done && (
              <button className={styles.action} onClick={copyEmail}>
                {copied ? "COPIED ✓" : "[COPY]"}
              </button>
            )}
          </p>
          <p className={styles.line}>
            {rendered[2]}
            {done && (
              <a className={styles.action} href={SITE.github} target="_blank" rel="noopener noreferrer">
                [OPEN]
              </a>
            )}
          </p>
          <p className={styles.line}>
            {rendered[3]}
            {done && (
              <a className={styles.action} href={SITE.linkedin} target="_blank" rel="noopener noreferrer">
                [OPEN]
              </a>
            )}
          </p>
          {done && <p className={styles.line}>&gt; CONNECTION READY <span className={styles.cursor}>█</span></p>}
        </div>
      </div>

      <p className={`accent-italic ${styles.note}`}>
        Response time: usually &lt; 24h. Preferred channel: email.
      </p>
    </div>
  );
}
