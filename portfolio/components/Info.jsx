"use client";

import Link from "next/link";
import Reveal from "./Reveal";
import { STACK, TOOLS, yearsOfExperience } from "../data/site";
import { useLanguage } from "../context/LanguageContext";
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
  const { t, lang } = useLanguage();
  const years = yearsOfExperience();

  return (
    <div className={styles.page}>
      <aside className={styles.left}>
        <div className={styles.portrait} aria-label="Portrait placeholder">
          <span className={styles.portraitMono}>JK / DOSSIER</span>
        </div>
        <dl className={styles.dossier}>
          <div className={styles.row}>
            <dt>{lang === "fr" ? "LOCALISATION" : "LOCATION"}</dt>
            <dd>{t.site.location}</dd>
          </div>
          <div className={styles.row}>
            <dt>{lang === "fr" ? "SPÉCIALITÉ" : "FOCUS"}</dt>
            <dd>{t.site.focus}</dd>
          </div>
          <div className={styles.row}>
            <dt>{lang === "fr" ? "EXPÉRIENCE" : "EXPERIENCE"}</dt>
            <dd>{years}+ {lang === "fr" ? "ans" : "years"}</dd>
          </div>
          <div className={styles.row}>
            <dt>{lang === "fr" ? "CERTIFIÉ" : "CERTIFIED"}</dt>
            <dd>AWS Solutions Architect</dd>
          </div>
          <div className={styles.row}>
            <dt>VISA</dt>
            <dd>{t.site.visa}</dd>
          </div>
          <div className={styles.row}>
            <dt>{lang === "fr" ? "LANGUES" : "LANGUAGES"}</dt>
            <dd>{t.site.languages}</dd>
          </div>
          <div className={styles.row}>
            <dt>{lang === "fr" ? "STATUT" : "STATUS"}</dt>
            <dd>{t.site.status}</dd>
          </div>
        </dl>
      </aside>

      <div className={styles.right}>
        <Reveal>
          <span className="label">// {lang === "fr" ? "BIO" : "INFO"}</span>
          <h1 className={styles.title}>
            {lang === "fr" ? (
              <>
                La version <em className="accent-italic">essentielle</em>.
              </>
            ) : (
              <>
                The <em className="accent-italic">short</em> version.
              </>
            )}
          </h1>
        </Reveal>

        <Reveal delay={0.05}>
          {lang === "fr" ? (
            <p>
              Je conçois des systèmes d'intelligence artificielle qui passent plus de temps en production que dans des démonstrations. Mon travail se situe au carrefour de la{" "}
              <Skill years="8 ans">vision par ordinateur</Skill>, du{" "}
              <Skill years="7 ans">deep learning</Skill>, et de l'ingénierie rigoureuse qui rend ces modèles réellement exploitables — services{" "}
              <Skill years="5 ans">FastAPI</Skill>, pipelines{" "}
              <Skill years="5 ans">Docker</Skill>, automates programmables d'usines et planificateurs HPC. Les composantes critiques et robustes indispensables au monde réel.
            </p>
          ) : (
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
          )}
        </Reveal>

        <Reveal delay={0.1}>
          {lang === "fr" ? (
            <p>
              Dernièrement, j'étais ingénieur données à l'Université de Pittsburgh, supervisant plus de 10 pipelines Airflow en production et déployant un assistant Slack basé sur le{" "}
              <Skill years="3 ans">RAG</Skill> qui a réduit de 30% les demandes répétitives des étudiants, tout en formant plus de 300 étudiants. Parallèlement, j'ai développé une plateforme de détection satellite d'équipements CVC pour Airoverse. Auparavant, des années sur le terrain : automatisation de 15 usines de fabrication et conception de pipelines de maintenance prédictive. L'historique complet est disponible dans le{" "}
              <Link href="/record">parcours</Link>.
            </p>
          ) : (
            <p>
              Most recently I was a data engineer at the University of
              Pittsburgh, running 10+ production Airflow pipelines and shipping a{" "}
              <Skill years="3 yrs">RAG</Skill> Slack assistant that cut repetitive
              student support requests by 30%, while facilitating courses for 300+
              students. Alongside that, I built a satellite-imagery detection
              platform for Airoverse. Before Pitt, years in the field: automating
              fifteen manufacturing facilities and building predictive-maintenance
              pipelines for HVAC equipment. The
              full history is in the{" "}
              <Link href="/record">record</Link>.
            </p>
          )}
        </Reveal>

        <Reveal delay={0.15}>
          {lang === "fr" ? (
            <p>
              Je suis titulaire d'un Master of Science en Sciences de l'Information (spécialisation IA) de l'Université de Pittsburgh. Mon visa Passeport Talent me confère une pleine autorisation de travail en France dès le premier jour. Mon approche est pragmatique, mesurée et axée sur des résultats vérifiables face à des données réelles.
            </p>
          ) : (
            <p>
              I hold an M.S. in Information Science (AI specialization) from the
              University of Pittsburgh. My French Talent Passport Famille visa
              means I&apos;m work-authorized from day one in Paris. I&apos;m pragmatic,
              measured, and mildly allergic to ML pitches that won&apos;t survive
              contact with real data.
            </p>
          )}
        </Reveal>

        <Reveal delay={0.2}>
          {lang === "fr" ? (
            <p>
              Si vous recrutez pour un rôle où le modèle doit impérativement fonctionner en production — sur du matériel réel, pour des utilisateurs réels et avec des exigences de coût maîtrisées — nous devrions{" "}
              <Link href="/signal">échanger</Link>.
            </p>
          ) : (
            <p>
              If you&apos;re hiring for a role where the model has to actually ship —
              on real hardware, to real users, under real budgets — we should
              probably <Link href="/signal">talk</Link>.
            </p>
          )}
        </Reveal>

        <Reveal delay={0.2}>
          <section className={styles.stackSection}>
            <span className="label">
              {lang === "fr" ? "STACK TECHNIQUE" : "CURRENT STACK"}
            </span>
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

        <section className={styles.tools} aria-labelledby="tools-title">
          <Reveal>
            <h2 id="tools-title" className={styles.toolsTitle}>
              What I <em className="accent-italic">reach</em> for.
            </h2>
          </Reveal>
          <dl>
            {TOOLS.map((t, i) => (
              <Reveal key={t.area} delay={Math.min(i * 0.04, 0.2)} className={styles.tool}>
                <dt className={styles.toolArea}>{t.area}</dt>
                <dd>{t.text}</dd>
              </Reveal>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
