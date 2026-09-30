"use client";

import Reveal from "./Reveal";
import { useLanguage } from "../context/LanguageContext";
import {
  CERTIFICATIONS,
  RECOMMENDATIONS,
  VOLUNTEERING,
  formatMonth,
  yearsOfExperience,
  numberWord,
} from "../data/site";
import styles from "../app/record/record.module.css";

function duration(start, end, lang) {
  const [sy, sm] = start.split("-").map(Number);
  const now = new Date();
  const [ey, em] = end ? end.split("-").map(Number) : [now.getFullYear(), now.getMonth() + 1];
  const months = Math.max(1, (ey - sy) * 12 + (em - sm));
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (lang === "fr") {
    return [y && `${y} AN${y > 1 ? "S" : ""}`, m && `${m} MOIS`].filter(Boolean).join(" ");
  }
  return [y && `${y} YR`, m && `${m} MO`].filter(Boolean).join(" ");
}

export default function RecordView() {
  const { t, lang } = useLanguage();
  const years = yearsOfExperience();

  return (
    <div className={styles.page}>
      <Reveal>
        <span className="label">// {lang === "fr" ? "PARCOURS" : "RECORD"}</span>
        <h1 className={styles.title}>
          {lang === "fr" ? (
            <>
              {years} ans d'ingénierie, {t.experience.length}{" "}
              <em className="accent-italic">chapitres</em>.
            </>
          ) : (
            <>
              {numberWord(years)} years, {numberWord(t.experience.length).toLowerCase()}{" "}
              <em className="accent-italic">chapters</em>.
            </>
          )}
        </h1>
        <p className={styles.intro}>
          {lang === "fr"
            ? "De l'automatisation en usine à Coimbatore jusqu'aux modèles de vision satellite et systèmes LLM à l'Université de Pittsburgh."
            : "From plant-floor automation in Coimbatore to satellite-imagery models and production data and LLM systems at the University of Pittsburgh."}
        </p>
      </Reveal>

      <ol className={styles.timeline}>
        {t.experience.map((job, i) => (
          <Reveal
            as="li"
            key={`${job.org}-${job.start}`}
            delay={Math.min(i * 0.05, 0.25)}
            className={`${styles.entry} ${job.end ? "" : styles.current}`}
          >
            <div className={styles.when}>
              <span className={styles.dates}>
                {formatMonth(job.start)} — {formatMonth(job.end)}
              </span>
              <span className={styles.duration}>{duration(job.start, job.end, lang)}</span>
            </div>
            <span className={styles.node} aria-hidden="true" />
            <div className={styles.what}>
              <h2 className={styles.role}>{job.role}</h2>
              <p className={styles.org}>
                {job.org}
                <span className={styles.place}>{job.place}</span>
              </p>
              <p className={styles.summary}>{job.summary}</p>
              <ul className={styles.tags} aria-label="Skills used">
                {job.tags.map((techTag) => (
                  <li key={techTag} className={styles.stamp}>{techTag}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </ol>

      {RECOMMENDATIONS.length > 0 && (
        <section className={styles.section} aria-labelledby="recommendations">
          <Reveal>
            <h2 id="recommendations" className={styles.sectionTitle}>
              {lang === "fr" ? (
                <>
                  Selon un <em className="accent-italic">collaborateur</em>.
                </>
              ) : (
                <>
                  In a <em className="accent-italic">teammate&apos;s</em> words.
                </>
              )}
            </h2>
          </Reveal>
          {RECOMMENDATIONS.map((r) => (
            <Reveal key={r.name} delay={0.05}>
              <figure className={styles.rec}>
                <blockquote className={styles.recQuote}>
                  <p>{r.quote}</p>
                </blockquote>
                <figcaption className={styles.recBy}>
                  <span className={styles.recName}>{r.name}</span>
                  <span className={styles.recContext}>{r.context}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </section>
      )}

      <section className={styles.section} aria-labelledby="education">
        <Reveal>
          <h2 id="education" className={styles.sectionTitle}>
            {lang === "fr" ? (
              <>
                Formation &amp; <em className="accent-italic">Diplômes</em>.
              </>
            ) : (
              <>
                Where I <em className="accent-italic">trained</em>.
              </>
            )}
          </h2>
        </Reveal>
        <dl className={styles.degrees}>
          {t.education.map((ed, i) => (
            <Reveal key={ed.degree} delay={Math.min(i * 0.05, 0.2)} className={styles.degree}>
              <dt>
                <span className={styles.degreeName}>{ed.degree}</span>
                <span className={styles.school}>
                  {ed.school}, {ed.place}
                </span>
              </dt>
              <dd>
                <span className={styles.years}>{ed.years}</span>
                <span className={styles.gpa}>GPA {ed.gpa}</span>
                {ed.note && <span className={styles.honor}>{ed.note}</span>}
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>

      <section className={styles.section} aria-labelledby="certifications">
        <Reveal>
          <h2 id="certifications" className={styles.sectionTitle}>
            {lang === "fr" ? (
              <>
                Certifications <em className="accent-italic">officielles</em>.
              </>
            ) : (
              <>
                Certified, <em className="accent-italic">on paper</em> too.
              </>
            )}
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <ul className={styles.certs}>
            {CERTIFICATIONS.map((c) => (
              <li key={c.name} className={styles.cert}>
                <span className={styles.issuer}>{c.issuer}</span>
                <span className={styles.certName}>{c.name}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        {VOLUNTEERING.map((v) => (
          <p key={v.org} className={styles.volunteer}>
            <span className={styles.issuer}>{v.role}</span> {v.org}, {v.area.toLowerCase()}.
          </p>
        ))}
      </section>
    </div>
  );
}
