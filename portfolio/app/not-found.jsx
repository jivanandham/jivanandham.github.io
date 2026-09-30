import Link from "next/link";
import styles from "./not-found.module.css";

export const metadata = { title: "404 — NOT FOUND" };

export default function NotFound() {
  return (
    <div className={styles.page}>
      <pre className={styles.glitch} aria-hidden="true">
{`  ██████╗  █████╗  ██████╗ ███████╗    ██╗  
  ██╔══██╗██╔══██╗██╔════╝ ██╔════╝    ██║  
  ██████╔╝███████║██║  ███╗█████╗      ██║  
  ██╔═══╝ ██╔══██║██║   ██║██╔══╝      ╚═╝  
  ██║     ██║  ██║╚██████╔╝███████╗    ██╗  
  ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝    ╚═╝  `}
      </pre>
      <p className={styles.msg}>
        <span className="label">ERROR 404</span>
      </p>
      <p className={styles.sub}>
        The requested sector does not exist or has been relocated.
      </p>
      <Link href="/" className={styles.home}>
        &gt; RETURN TO INDEX
      </Link>
    </div>
  );
}
