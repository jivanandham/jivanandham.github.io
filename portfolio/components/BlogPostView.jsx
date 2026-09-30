"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "./Reveal";
import BlogPostVotes from "./BlogPostVotes";
import BlogPostComments from "./BlogPostComments";
import { useLanguage } from "../context/LanguageContext";
import { POSTS } from "../data/posts";
import { CHAT_OPEN_EVENT } from "./AgentChatbot";
import styles from "./BlogPostView.module.css";

export default function BlogPostView({ slug, initialPost = null }) {
  const { t, lang } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const posts = t.posts || POSTS;

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((d) => setIsAdmin(Boolean(d?.isAdmin)))
      .catch(() => {});
  }, []);

  const postIndex = posts.findIndex((p) => p.slug === slug);
  const post = initialPost || (postIndex !== -1 ? posts[postIndex] : null);
  if (!post) {
    notFound();
  }

  const prevPost = postIndex > 0 ? posts[postIndex - 1] : null;
  const nextPost = postIndex !== -1 && postIndex < posts.length - 1 ? posts[postIndex + 1] : null;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleOpenAgent = () => {
    window.dispatchEvent(new Event(CHAT_OPEN_EVENT));
  };

  // Helper to format section body paragraphs and markdown bold/bullets
  const renderBodyText = (text) => {
    const paragraphs = text.split("\n\n");
    return paragraphs.map((para, pIdx) => {
      const isBulletList = para.split("\n").every((line) => line.trim().startsWith("- ") || line.trim() === "");
      if (isBulletList) {
        const items = para.split("\n").filter((line) => line.trim().startsWith("- "));
        return (
          <ul key={pIdx}>
            {items.map((item, iIdx) => {
              const content = item.replace(/^-\s*/, "");
              const parts = content.split(/(\*\*.*?\*\*)/g);
              return (
                <li key={iIdx}>
                  {parts.map((part, sIdx) => {
                    if (part.startsWith("**") && part.endsWith("**")) {
                      return <strong key={sIdx}>{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  })}
                </li>
              );
            })}
          </ul>
        );
      }

      const lines = para.split("\n");
      return (
        <p key={pIdx}>
          {lines.map((line, lIdx) => {
            const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
            return (
              <span key={lIdx}>
                {parts.map((part, sIdx) => {
                  if (part.startsWith("**") && part.endsWith("**")) {
                    return <strong key={sIdx}>{part.slice(2, -2)}</strong>;
                  }
                  if (part.startsWith("`") && part.endsWith("`")) {
                    return <code key={sIdx}>{part.slice(1, -1)}</code>;
                  }
                  return part;
                })}
                {lIdx < lines.length - 1 && <br />}
              </span>
            );
          })}
        </p>
      );
    });
  };

  return (
    <article className={styles.articleWrap}>
      <div className={styles.backRow}>
        <Link href="/blog" className={styles.backLink}>
          {t.ui.backToBlog}
        </Link>
      </div>

      <header className={styles.header}>
        <div className={styles.breadcrumbs}>
          // BLOG &gt; {post.date} &gt; {post.slug}
        </div>

        <h1 className={styles.title}>{post.title}</h1>

        <div className={styles.metaRow}>
          <span className={styles.date}>📅 {post.date}</span>
          <span className={styles.readTime}>⏱ {post.readTime}</span>
          <span>✍ {t.ui.writtenBy} Jeeva Krishnasamy</span>
          {isAdmin && (
            <Link href={`/admin?edit=${post.slug}`} className={styles.adminEditBadge}>
              [✎ EDIT ARTICLE IN ADMIN]
            </Link>
          )}
        </div>

        <div className={styles.tags}>
          {post.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>
      </header>

      {post.lead && (
        <Reveal>
          <div className={styles.lead}>
            <p>{post.lead}</p>
          </div>
        </Reveal>
      )}

      {post.sections && post.sections.length > 1 && (
        <nav className={styles.toc} aria-label="Table of Contents">
          <div className={styles.tocTitle}>// {t.ui.tableOfContents}</div>
          <ol className={styles.tocList}>
            {post.sections.map((sec, idx) => (
              <li key={idx}>
                <a href={`#section-${idx}`} className={styles.tocLink}>
                  {idx + 1}. {sec.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className={styles.content}>
        {post.sections.map((sec, idx) => (
          <section
            key={idx}
            id={`section-${idx}`}
            className={styles.section}
          >
            <Reveal>
              <h2 className={styles.sectionHeading}>{sec.heading}</h2>
            </Reveal>

            <Reveal delay={0.05}>
              <div className={styles.sectionBody}>
                {renderBodyText(sec.body)}
              </div>
            </Reveal>

            {sec.code && (
              <Reveal delay={0.1}>
                <pre className={styles.codeBlock}>
                  <code>{sec.code}</code>
                </pre>
              </Reveal>
            )}
          </section>
        ))}
      </div>

      <div className={styles.actionsBar}>
        <BlogPostVotes slug={post.slug} />

        <button
          className={styles.btnAgent}
          onClick={handleOpenAgent}
          title="Open interactive AI Agent"
        >
          ⌬ {t.ui.discussWithAgent}
        </button>

        <button className={styles.btnShare} onClick={handleShare}>
          {copied ? t.ui.copiedLink : `⎘ ${t.ui.shareArticle}`}
        </button>
      </div>

      <BlogPostComments slug={post.slug} />

      <nav className={styles.pagination} aria-label="Article navigation">
        {prevPost ? (
          <Link href={`/blog/${prevPost.slug}`} className={styles.pagCard}>
            <span className={styles.pagDirection}>← {lang === "fr" ? "Article Précédent" : "Previous Article"}</span>
            <span className={styles.pagTitle}>{prevPost.title}</span>
          </Link>
        ) : (
          <div />
        )}

        {nextPost && (
          <Link href={`/blog/${nextPost.slug}`} className={styles.pagCard} style={{ textAlign: "right" }}>
            <span className={styles.pagDirection}>{lang === "fr" ? "Article Suivant" : "Next Article"} →</span>
            <span className={styles.pagTitle}>{nextPost.title}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
