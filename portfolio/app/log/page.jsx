import Reveal from "../../components/Reveal";
import { INFLUENCES } from "../../data/site";
import styles from "./log.module.css";

export const metadata = { title: "LOG — Jeeva Krishnasamy" };

export default function LogPage() {
  return (
    <div className={styles.page}>
      <Reveal>
        <span className="label">// LOG</span>
        <h1 className={styles.title}>
          Influences, <em className="accent-italic">annotated</em>.
        </h1>
        <p className={styles.intro}>
          No blog yet. Instead: the books, tools, and people that shaped how I
          think about building things.
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
