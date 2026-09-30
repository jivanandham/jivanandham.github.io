import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.wrap}>
      <p className={styles.line}>
        <span className={styles.cursor}>█</span> LOADING...
      </p>
    </div>
  );
}
