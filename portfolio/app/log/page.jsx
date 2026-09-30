import Reveal from "../../components/Reveal";
import { INFLUENCES } from "../../data/site";
import styles from "./log.module.css";

import { SITE } from "../../data/site";

export const metadata = {
  title: "Engineering Log & Influences",
  description:
    "Annotated ledger of books, tools, and technical principles that shaped Jeeva Krishnasamy's engineering philosophy across deep learning, distributed systems, and real-world reliability.",
  keywords: [
    "AI engineering books",
    "Deep learning influences",
    "Designing Data-Intensive Applications",
    "Goodfellow Bengio Courville",
    "Unix philosophy",
    "Jeeva Krishnasamy log",
  ],
  alternates: {
    canonical: "/log",
    languages: {
      "en-US": "/log?lang=en",
      "fr-FR": "/log?lang=fr",
    },
  },
  openGraph: {
    title: "Engineering Log & Influences — Jeeva Krishnasamy",
    description:
      "Annotated ledger of books, tools, and principles shaping Jeeva Krishnasamy's engineering philosophy.",
    url: `${SITE.url}/log`,
  },
};

export default function LogPage() {
  return (
    <div className={styles.page}>
      <Reveal>
        <span className="label">// LOG</span>
        <h1 className={styles.title}>
          Influences, <em className="accent-italic">annotated</em>.
        </h1>
        <p className={styles.intro}>
          The books, papers, and architectural principles that shaped how I build production systems. Looking for technical essays and system deep-dives? Explore the new <a href="/blog" style={{ color: "var(--accent)", textDecoration: "underline", textUnderlineOffset: "3px" }}>Technical Blog →</a>
        </p>
      </Reveal>

      <ol className={styles.ledger}>
        {INFLUENCES.map((item, i) => (
          <Reveal key={item.title} as="li" delay={Math.min(i * 0.04, 0.3)} className={styles.row}>
            <span className={styles.index}>{String(i + 1).padStart(2, "0")}</span>
            <span className={styles.entryTitle}>{item.title}</span>
            <span className={styles.note}>{item.note}</span>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
