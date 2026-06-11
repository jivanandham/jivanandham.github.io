"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "../data/site";
import styles from "./WorkList.module.css";

const EASE = [0.16, 1, 0.3, 1];

export default function WorkList() {
  const [open, setOpen] = useState(null);
  const reduce = useReducedMotion();
  const rootRef = useRef(null);

  useEffect(() => {
    if (reduce) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray(`.${styles.band}`).forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <div className={styles.page} ref={rootRef}>
      <header className={styles.head}>
        <span className="label">// WORK</span>
        <h1 className={styles.title}>
          Five projects that <em className="accent-italic">shipped</em>.
        </h1>
      </header>

      {PROJECTS.map((p, i) => {
        const expanded = open === p.slug;
        return (
          <article
            key={p.slug}
            className={`${styles.band} ${i % 2 ? styles.alt : ""} ${expanded ? styles.expanded : ""}`}
          >
            <button
              className={styles.bandBtn}
              onClick={() => setOpen(expanded ? null : p.slug)}
              aria-expanded={expanded}
            >
              <div className={styles.num}>
                <span className={styles.bigNum}>{p.num}</span>
                <span className="label">PROJECT</span>
              </div>

              <div className={styles.meta}>
                <h2 className={styles.projTitle}>{p.title}</h2>
                <p className={styles.blurb}>{p.blurb}</p>
                <div className={styles.tags}>
                  {p.tech.map((t) => (
                    <span key={t} className={styles.stamp}>{t}</span>
                  ))}
                </div>
              </div>

              <div className={styles.crt} aria-hidden="true">
                <div className={styles.crtScreen}>
                  <span className={styles.crtText}>{p.num} / {p.slug.toUpperCase()}</span>
                </div>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  className={styles.caseStudy}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, height: "auto" }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <div className={styles.caseInner}>
                    <div>
                      <h3 className="label">PROBLEM</h3>
                      <p>{p.caseStudy.problem}</p>
                    </div>
                    <div>
                      <h3 className="label">APPROACH</h3>
                      <p>{p.caseStudy.approach}</p>
                    </div>
                    <div>
                      <h3 className="label">RESULT</h3>
                      <p>{p.caseStudy.result}</p>
                    </div>
                    <pre className={styles.code}><code>{p.caseStudy.snippet}</code></pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </article>
        );
      })}
    </div>
  );
}
