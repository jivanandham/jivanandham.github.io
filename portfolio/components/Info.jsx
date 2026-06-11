"use client";

import Reveal from "./Reveal";
import { SITE, STACK } from "../data/site";
import styles from "./Info.module.css";

function Skill({ children, years }) {
  return (
    <span className={styles.skill} tabIndex={0}>
      {children}
      <span className={styles.tooltip} role="tooltip">{years}</span>
    </span>
  );
}

export default function Info() {
  return (
    <div className={styles.page}>
      <aside className={styles.left}>
        <div className={styles.portrait} aria-label="Portrait placeholder">
          <span className={styles.portraitMono}>JK / DOSSIER</span>
        </div>
        <dl className={styles.dossier}>
          <div className={styles.row}>
            <dt>LOCATION</dt>
            <dd>{SITE.location}</dd>
          </div>
          <div className={styles.row}>
            <dt>FOCUS</dt>
            <dd>{SITE.focus}</dd>
          </div>
          <div className={styles.row}>
            <dt>STATUS</dt>
            <dd>{SITE.status}</dd>
          </div>
        </dl>
      </aside>

      <div className={styles.right}>
        <Reveal>
          <span className="label">// INFO</span>
          <h1 className={styles.title}>
            The <em className="accent-italic">short</em> version.
          </h1>
        </Reveal>

        <Reveal delay={0.05}>
          <p>
            I build AI systems that spend more time in production than in demos.
            My work lives at the intersection of{" "}
            <Skill years="8 yrs">computer vision</Skill>,{" "}
            <Skill years="7 yrs">deep learning</Skill>, and the less glamorous
            engineering that keeps either one actually useful —{" "}
            <Skill years="5 yrs">FastAPI</Skill> services,{" "}
            <Skill years="5 yrs">Docker</Skill> pipelines, plant-floor PLCs, HPC
            job schedulers. The boring parts. The parts that don&apos;t show up in a
            Medium article.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <p>
            Currently I coordinate the Data Science &amp; LLM curriculum at the
            University of Pittsburgh, where I mentor master&apos;s students on{" "}
            <Skill years="3 yrs">RAG architectures</Skill>,{" "}
            <Skill years="3 yrs">fine-tuning</Skill>, and the art of debugging a
            model that <em>should</em> be working. Before Pitt, years in the
            field: automating fifteen manufacturing facilities, building
            predictive-maintenance pipelines for HVAC equipment, and training
            satellite-imagery detectors that cut a pilot client&apos;s manual survey
            cost by ninety percent.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <p>
            I hold an M.S. in Information Science (AI specialization) from the
            University of Pittsburgh. My French Talent Passport Famille visa
            means I&apos;m work-authorized from day one in Paris. I&apos;m pragmatic,
            measured, and mildly allergic to ML pitches that won&apos;t survive
            contact with real data.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <section className={styles.stackSection}>
            <span className="label">CURRENT STACK</span>
            <div className={styles.periodic}>
              {STACK.map((s) => (
                <div key={s.abbr} className={styles.element} title={s.name}>
                  <span className={styles.abbr}>{s.abbr}</span>
                  <span className={styles.elName}>{s.name}</span>
                  <span
                    className={styles.bar}
                    style={{ width: `${s.level * 100}%` }}
                  />
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
