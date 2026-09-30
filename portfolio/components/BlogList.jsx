"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "./Reveal";
import { useLanguage } from "../context/LanguageContext";
import { POSTS } from "../data/posts";
import styles from "./BlogList.module.css";

const CATEGORIES = [
  { id: "all", en: "All", fr: "Tous" },
  { id: "vision", en: "Computer Vision", fr: "Vision par Ordinateur" },
  { id: "llm", en: "LLM & RAG", fr: "LLM & RAG" },
  { id: "systems", en: "Systems & Reliability", fr: "Systèmes & Fiabilité" },
];

export default function BlogList() {
  const { t, lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");
  const [livePosts, setLivePosts] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check admin
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((d) => setIsAdmin(Boolean(d?.isAdmin)))
      .catch(() => {});

    // Fetch live posts
    fetch("/api/posts")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.posts)) {
          setLivePosts(d.posts);
        }
      })
      .catch(() => {});
  }, []);

  const basePosts = livePosts || t.posts || POSTS;
  const posts = basePosts;

  const filteredPosts =
    activeCategory === "all"
      ? posts
      : posts.filter((p) => p.domains.includes(activeCategory));

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <Reveal>
          <span className="label">// {lang === "fr" ? "PUBLICATIONS" : "DISPATCHES"}</span>
          <h1 className={styles.title}>{t.ui.blogTitle}</h1>
          <p className={styles.subtitle}>{t.ui.blogSubtitle}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className={styles.filters} role="group" aria-label="Filter blog posts by topic">
            {CATEGORIES.map((cat) => {
              const label = lang === "fr" ? cat.fr : cat.en;
              const count =
                cat.id === "all"
                  ? posts.length
                  : posts.filter((p) => p.domains.includes(cat.id)).length;

              return (
                <button
                  key={cat.id}
                  className={`${styles.filter} ${activeCategory === cat.id ? styles.filterOn : ""}`}
                  aria-pressed={activeCategory === cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {label}
                  <span className={styles.filterCount}>({count})</span>
                </button>
              );
            })}
          </div>
        </Reveal>
      </header>

      {isAdmin && (
        <Reveal>
          <Link href="/admin" className={styles.adminNotice}>
            <span>● ADMIN CLEARANCE ACTIVE — You have authorization to compose and edit posts.</span>
            <span>OPEN CONSOLE →</span>
          </Link>
        </Reveal>
      )}

      <div className={styles.feed}>
        {filteredPosts.map((post, idx) => (
          <Reveal key={post.slug} delay={Math.min(idx * 0.05, 0.25)}>
            <article className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.date}>{post.date}</span>
                <div className={styles.cardStats}>
                  {typeof post.upvotes === "number" && (
                    <span>▲ {post.upvotes}</span>
                  )}
                  {typeof post.commentCount === "number" && post.commentCount > 0 && (
                    <span>💬 {post.commentCount}</span>
                  )}
                  <span className={styles.readTime}>⏱ {post.readTime}</span>
                </div>
              </div>

              <h2 className={styles.cardTitle}>
                <Link href={`/blog/${post.slug}`} className={styles.cardLink}>
                  {post.title}
                </Link>
              </h2>

              <p className={styles.blurb}>{post.blurb}</p>

              <div className={styles.footerRow}>
                <div className={styles.tags}>
                  {post.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      #{tag}
                    </span>
                  ))}
                </div>

                <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                  {t.ui.readArticleBtn}
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
