import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.line}>
          <span className="label">COLOPHON</span>
        </p>
        <p className={styles.line}>
          Set in <em>IBM Plex Serif</em>, <em>IBM Plex Sans</em> &amp;{" "}
          <em>IBM Plex Mono</em>. Hand-coded, no templates.
        </p>
        <p className={styles.line}>
          <span className={styles.muted}>© 2026 Jeeva Krishnasamy</span>
          <span className={styles.sep}>·</span>
          <span className={styles.muted}>v3.2.1</span>
        </p>
      </div>
    </footer>
  );
}
