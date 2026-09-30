"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../context/LanguageContext";
import { PROJECTS, numberWord } from "../data/site";
import styles from "./WorkList.module.css";

const EASE = [0.16, 1, 0.3, 1];

export default function WorkList() {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(null);
  const [domain, setDomain] = useState("all");
  const reduce = useReducedMotion();
  const rootRef = useRef(null);

  const projects = t.projects || PROJECTS;
  const visible = domain === "all" ? projects : projects.filter((p) => p.domains.includes(domain));

  // Deep links: /work#slug opens that case study.
  useEffect(() => {
    const fromHash = () => {
      const slug = window.location.hash.slice(1);
      if (projects.some((p) => p.slug === slug)) {
        setDomain("all");
        setOpen(slug);
        requestAnimationFrame(() =>
          document.getElementById(slug)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" })
        );
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [reduce, projects]);


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

  const toggle = (slug) => {
    const next = open === slug ? null : slug;
    setOpen(next);
    // keep the URL shareable without adding history entries
    const url = next ? `#${next}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  };

  const count = (id) => (id === "all" ? projects.length : projects.filter((p) => p.domains.includes(id)).length);

  return (
    <div className={styles.page} ref={rootRef}>
      <header className={styles.head}>
        <span className="label">// {lang === "fr" ? "PROJETS" : "WORK"}</span>
        <h1 className={styles.title}>
          {lang === "fr"
            ? `${projects.length} projets menés en production.`
            : `${numberWord(projects.length)} projects that shipped.`}
        </h1>

        <div className={styles.filters} role="group" aria-label="Filter projects by domain">
          {t.domains.map((d) => (
            <button
              key={d.id}
              className={`${styles.filter} ${domain === d.id ? styles.filterOn : ""}`}
              aria-pressed={domain === d.id}
              onClick={() => setDomain(d.id)}
            >
              {d.label}
              <span className={styles.filterCount}>{count(d.id)}</span>
            </button>
          ))}
        </div>
      </header>

      {visible.map((p, i) => {
        const expanded = open === p.slug;
        const num = String(projects.indexOf(p) + 1).padStart(2, "0");
        return (
          <article
            key={p.slug}
            id={p.slug}
            className={`${styles.band} ${i % 2 ? styles.alt : ""} ${expanded ? styles.expanded : ""}`}
          >
            <button
              className={styles.bandBtn}
              onClick={() => toggle(p.slug)}
              aria-expanded={expanded}
              aria-controls={`${p.slug}-case`}
            >
              <div className={styles.num}>
                <span className={styles.bigNum}>{num}</span>
                <span className="label">{p.year}</span>
              </div>

              <div className={styles.meta}>
                <h2 className={styles.projTitle}>{p.title}</h2>
                <p className={styles.blurb}>{p.blurb}</p>
                <div className={styles.tags}>
                  {p.tech.map((techItem) => (
                    <span key={techItem} className={styles.stamp}>{techItem}</span>
                  ))}
                </div>
              </div>

              <div className={styles.crt} aria-hidden="true">
                <div className={styles.crtScreen}>
                  <span className={styles.crtText}>
                    {num} / {p.slug.toUpperCase()}
                  </span>
                  <span className={styles.crtHint}>
                    {expanded
                      ? (lang === "fr" ? "[ FERMER ]" : "[ CLOSE ]")
                      : (lang === "fr" ? "[ ÉTUDE DE CAS ]" : "[ READ CASE ]")}
                  </span>
                </div>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  id={`${p.slug}-case`}
                  className={styles.caseStudy}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, height: "auto" }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <div className={styles.caseInner}>
                    <div>
                      <h3 className="label">{t.ui.caseStudyProblem.toUpperCase()}</h3>
                      <p>{p.caseStudy.problem}</p>
                    </div>
                    <div>
                      <h3 className="label">{t.ui.caseStudyApproach.toUpperCase()}</h3>
                      <p>{p.caseStudy.approach}</p>
                    </div>
                    <div>
                      <h3 className="label">{t.ui.caseStudyResult.toUpperCase()}</h3>
                      <p>{p.caseStudy.result}</p>
                    </div>
                    <pre className={styles.code}><code>{p.caseStudy.snippet}</code></pre>
                    {p.link && (
                      <a className={styles.extLink} href={p.link.href} target="_blank" rel="noopener noreferrer">
                        &gt; {p.link.label} ↗
                      </a>
                    )}
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
