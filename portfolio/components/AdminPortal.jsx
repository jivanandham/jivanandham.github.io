"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "./Reveal";
import styles from "./AdminPortal.module.css";

const DOMAINS = [
  { id: "vision", label: "Computer Vision & Edge" },
  { id: "rag", label: "LLM & RAG Systems" },
  { id: "systems", label: "Systems Architecture & Reliability" },
  { id: "data", label: "Data Engineering & Automation" },
];

export default function AdminPortal() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState("posts"); // 'posts' | 'editor' | 'comments'

  // Data states
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // Editor states
  const [isEditing, setIsEditing] = useState(false);
  const [originalSlug, setOriginalSlug] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10).replace(/-/g, "."));
  const [readTime, setReadTime] = useState("5 min read");
  const [domain, setDomain] = useState("vision");
  const [tags, setTags] = useState("");
  const [blurb, setBlurb] = useState("");
  const [lead, setLead] = useState("");
  const [sections, setSections] = useState([
    { heading: "Architecture & Context", body: "", code: "" },
  ]);
  const [savingPost, setSavingPost] = useState(false);

  // Check auth on load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setCheckingAuth(true);
      const res = await fetch("/api/admin/me");
      const data = await res.json();
      if (data.isAdmin) {
        setIsAdmin(true);
        loadPosts();
        loadComments();
      } else {
        setIsAdmin(false);
      }
    } catch {
      setIsAdmin(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success) {
        setIsAdmin(true);
        setPassword("");
        loadPosts();
        loadComments();
      } else {
        setAuthError(data.error || "Authentication failed. Invalid key.");
      }
    } catch {
      setAuthError("Network connection error. Server unreachable.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      setIsAdmin(false);
      resetEditor();
    } catch {}
  };

  const loadPosts = async () => {
    try {
      setLoadingPosts(true);
      const res = await fetch("/api/posts");
      const data = await res.json();
      if (data.success && Array.isArray(data.posts)) {
        setPosts(data.posts);
      }
    } catch {
    } finally {
      setLoadingPosts(false);
    }
  };

  const loadComments = async () => {
    try {
      const res = await fetch("/api/admin/comments");
      const data = await res.json();
      if (data.success && Array.isArray(data.comments)) {
        setComments(data.comments);
      }
    } catch {}
  };

  // Helper to auto-generate slug
  const generateSlug = () => {
    const s = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(s);
  };

  const resetEditor = () => {
    setIsEditing(false);
    setOriginalSlug("");
    setTitle("");
    setSlug("");
    setDate(new Date().toISOString().slice(0, 10).replace(/-/g, "."));
    setReadTime("5 min read");
    setDomain("vision");
    setTags("");
    setBlurb("");
    setLead("");
    setSections([{ heading: "Architecture & Context", body: "", code: "" }]);
    setStatusMsg("");
  };

  const startEditPost = (post) => {
    setIsEditing(true);
    setOriginalSlug(post.slug);
    setTitle(post.title || "");
    setSlug(post.slug || "");
    setDate(post.date || "");
    setReadTime(post.readTime || "5 min read");
    setDomain(post.domains?.[0] || "vision");
    setTags(Array.isArray(post.tags) ? post.tags.join(", ") : "");
    setBlurb(post.blurb || "");
    setLead(post.lead || "");
    setSections(
      post.sections && post.sections.length > 0
        ? post.sections
        : [{ heading: "Section 1", body: "", code: "" }]
    );
    setActiveTab("editor");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletePost = async (postSlug) => {
    if (!confirm(`Permanently delete post '${postSlug}' and its data?`)) return;

    try {
      const res = await fetch(`/api/posts/${postSlug}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showStatus(`✓ Post '${postSlug}' purged from storage.`);
        loadPosts();
      } else {
        showStatus(`✕ Error: ${data.error}`);
      }
    } catch {
      showStatus("✕ Delete request failed.");
    }
  };

  const handleDeleteComment = async (postSlug, commentId) => {
    if (!confirm("Permanently purge this transmission?")) return;

    try {
      const res = await fetch(`/api/posts/${postSlug}/comments/${commentId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        showStatus("✓ Comment removed.");
      }
    } catch {
      showStatus("✕ Error removing comment.");
    }
  };

  const addSection = () => {
    setSections([
      ...sections,
      { heading: `Section ${sections.length + 1}`, body: "", code: "" },
    ]);
  };

  const removeSection = (idx) => {
    if (sections.length <= 1) return;
    setSections(sections.filter((_, i) => i !== idx));
  };

  const updateSection = (idx, field, val) => {
    const next = [...sections];
    next[idx] = { ...next[idx], [field]: val };
    setSections(next);
  };

  const showStatus = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(""), 5000);
  };

  const handleSavePost = async (e) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      showStatus("✕ Title and Slug are required.");
      return;
    }

    setSavingPost(true);

    const postPayload = {
      title: title.trim(),
      slug: slug.trim(),
      date,
      readTime,
      domains: [domain],
      tags: tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      blurb: blurb.trim(),
      lead: lead.trim(),
      sections,
    };

    try {
      const url = isEditing ? `/api/posts/${originalSlug}` : "/api/posts";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postPayload),
      });

      const data = await res.json();
      if (data.success) {
        showStatus(
          isEditing
            ? `✓ Post '${slug}' updated successfully.`
            : `✓ New post '${slug}' published to live blog!`
        );
        loadPosts();
        if (!isEditing) resetEditor();
        setActiveTab("posts");
      } else {
        showStatus(`✕ Error: ${data.error || "Failed to save"}`);
      }
    } catch {
      showStatus("✕ Network transmission error while saving.");
    } finally {
      setSavingPost(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.loadingScan}>// INITIALIZING SECURITY GATEWAY...</div>
      </div>
    );
  }

  // ─── LOGIN SCREEN ──────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div className={styles.loginPage}>
        <Reveal>
          <div className={styles.loginCard}>
            <div className={styles.terminalHeader}>
              <span className={styles.termDot} />
              <span className={styles.termTitle}>
                AUTH GATEWAY // SECURITY ACCESS LEVEL 4
              </span>
            </div>

            <div className={styles.loginContent}>
              <div className={styles.promptText}>
                &gt; SYSTEM RESTRICTED: AUTHORIZED PERSONNEL ONLY.<br />
                &gt; ENTER ADMIN MASTER KEY TO UNLOCK BLOG WRITING &amp; MODERATION CONTROLS.
              </div>

              <form onSubmit={handleLogin} className={styles.loginForm}>
                <div className={styles.inputGroup}>
                  <label htmlFor="adminKey" className={styles.label}>
                    // ADMIN SECURITY KEY:
                  </label>
                  <input
                    id="adminKey"
                    type="password"
                    className={styles.keyInput}
                    placeholder="Enter security key..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                {authError && (
                  <div className={styles.errorBanner}>
                    ✕ {authError}
                  </div>
                )}

                <div className={styles.actionRow}>
                  <button type="submit" className={styles.loginBtn}>
                    AUTHENTICATE CREDENTIALS ↵
                  </button>
                  <Link href="/blog" className={styles.returnLink}>
                    ← Return to Public Blog
                  </Link>
                </div>
              </form>

              <div className={styles.loginNote}>
                // Note: Default key is configured in <code>.env.local</code> (e.g. <code>admin123</code>).
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    );
  }

  // ─── AUTHENTICATED ADMIN CONSOLE ───────────────────────────
  return (
    <div className={styles.adminConsole}>
      {/* Top Banner */}
      <header className={styles.consoleHeader}>
        <div className={styles.operatorBadge}>
          <span className={styles.statusGlow} />
          <span>ROOT ADMIN LOGGED IN: JEEVA KRISHNASAMY</span>
        </div>

        <div className={styles.headerActions}>
          <Link href="/blog" target="_blank" className={styles.btnSecondary}>
            ⎘ Open Live Blog
          </Link>
          <button onClick={handleLogout} className={styles.btnLogout}>
            [✕ TERMINATE SESSION]
          </button>
        </div>
      </header>

      {/* Status Alert */}
      {statusMsg && (
        <div className={styles.statusBanner}>
          <span>{statusMsg}</span>
          <button onClick={() => setStatusMsg("")} className={styles.closeStatus}>✕</button>
        </div>
      )}

      {/* Tabs */}
      <nav className={styles.navTabs}>
        <button
          className={`${styles.tabBtn} ${activeTab === "posts" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          [01. ARTICLES REGISTRY ({posts.length})]
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "editor" ? styles.tabActive : ""}`}
          onClick={() => {
            if (!isEditing) resetEditor();
            setActiveTab("editor");
          }}
        >
          {isEditing ? "[02. EDITING ARTICLE ✎]" : "[02. + COMPOSE NEW ARTICLE]"}
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "comments" ? styles.tabActive : ""}`}
          onClick={() => {
            loadComments();
            setActiveTab("comments");
          }}
        >
          [03. MODERATE COMMENTS ({comments.length})]
        </button>
      </nav>

      {/* TAB 1: POSTS REGISTRY */}
      {activeTab === "posts" && (
        <section className={styles.sectionWrap}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>// PUBLISHED ARTICLES REPOSITORY</h2>
            <button
              onClick={() => {
                resetEditor();
                setActiveTab("editor");
              }}
              className={styles.btnPrimary}
            >
              + COMPOSE NEW ESSAY
            </button>
          </div>

          {loadingPosts ? (
            <div className={styles.emptyNotice}>// Loading repository entries...</div>
          ) : posts.length === 0 ? (
            <div className={styles.emptyNotice}>// No articles in registry. Create your first one.</div>
          ) : (
            <div className={styles.postsGrid}>
              {posts.map((p) => (
                <div key={p.slug} className={styles.postCard}>
                  <div className={styles.cardTop}>
                    <span className={styles.postDate}>{p.date}</span>
                    <span className={styles.postSlug}>slug: /{p.slug}</span>
                  </div>

                  <h3 className={styles.postTitle}>{p.title}</h3>
                  <p className={styles.postBlurb}>{p.blurb}</p>

                  <div className={styles.postStats}>
                    <span>▲ {p.upvotes || 0} Up</span>
                    <span>▼ {p.downvotes || 0} Down</span>
                    <span>💬 {p.commentCount || 0} Transmissions</span>
                    <span>⏱ {p.readTime}</span>
                  </div>

                  <div className={styles.cardActions}>
                    <button
                      className={styles.cardEditBtn}
                      onClick={() => startEditPost(p)}
                    >
                      ✎ Edit Post
                    </button>
                    <Link
                      href={`/blog/${p.slug}`}
                      target="_blank"
                      className={styles.cardViewBtn}
                    >
                      ⎘ View Live
                    </Link>
                    <button
                      className={styles.cardDeleteBtn}
                      onClick={() => handleDeletePost(p.slug)}
                    >
                      ✕ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 2: ARTICLE COMPOSER / EDITOR */}
      {activeTab === "editor" && (
        <section className={styles.sectionWrap}>
          <div className={styles.editorHeader}>
            <h2 className={styles.tableTitle}>
              {isEditing ? `// EDITING: ${originalSlug}` : "// COMPOSE NEW TECHNICAL ESSAY"}
            </h2>
            {isEditing && (
              <button onClick={resetEditor} className={styles.btnSecondary}>
                ✕ Cancel Edit Mode
              </button>
            )}
          </div>

          <form onSubmit={handleSavePost} className={styles.editorForm}>
            {/* Title & Slug */}
            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ flex: 2 }}>
                <label className={styles.inputLabel}>ARTICLE TITLE *</label>
                <input
                  type="text"
                  className={styles.textInput}
                  placeholder="e.g. Real-Time Defect Detection in High-Speed Steel Rolling"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup} style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label className={styles.inputLabel}>URL SLUG *</label>
                  <button
                    type="button"
                    onClick={generateSlug}
                    className={styles.slugGenBtn}
                  >
                    Auto Generate
                  </button>
                </div>
                <input
                  type="text"
                  className={styles.textInput}
                  placeholder="e.g. real-time-defect-detection"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Date, ReadTime, Domain */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>PUBLICATION DATE</label>
                <input
                  type="text"
                  className={styles.textInput}
                  placeholder="YYYY.MM.DD"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>READING TIME</label>
                <input
                  type="text"
                  className={styles.textInput}
                  placeholder="6 min read"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>DOMAIN / CATEGORY</label>
                <select
                  className={styles.selectInput}
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                >
                  {DOMAINS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup} style={{ flex: 1.5 }}>
                <label className={styles.inputLabel}>TAGS (comma separated)</label>
                <input
                  type="text"
                  className={styles.textInput}
                  placeholder="YOLOv8, Edge AI, PyTorch, Real-Time"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </div>

            {/* Blurb */}
            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>
                SUMMARY BLURB (Shown on cards in blog index)
              </label>
              <textarea
                className={styles.textArea}
                rows={2}
                placeholder="High-level engineering takeaway for visitors browsing articles..."
                value={blurb}
                onChange={(e) => setBlurb(e.target.value)}
              />
            </div>

            {/* Lead Abstract */}
            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>
                LEAD / KEY ABSTRACT (Highlighted box at beginning of article)
              </label>
              <textarea
                className={styles.textArea}
                rows={3}
                placeholder="The bold, provocative thesis or core lesson..."
                value={lead}
                onChange={(e) => setLead(e.target.value)}
              />
            </div>

            {/* Sections Builder */}
            <div className={styles.sectionsContainer}>
              <div className={styles.sectionsHeader}>
                <label className={styles.inputLabel}>
                  ARTICLE BODY SECTIONS ({sections.length})
                </label>
                <button
                  type="button"
                  onClick={addSection}
                  className={styles.btnAddSection}
                >
                  + Add Section
                </button>
              </div>

              {sections.map((sec, idx) => (
                <div key={idx} className={styles.sectionCard}>
                  <div className={styles.sectionTop}>
                    <span className={styles.sectionIndex}>SECTION #{idx + 1}</span>
                    {sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSection(idx)}
                        className={styles.btnRemoveSection}
                      >
                        [✕ Remove Section]
                      </button>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <input
                      type="text"
                      className={styles.textInput}
                      placeholder="Section Heading (e.g. Why One Detector Is Never Enough)"
                      value={sec.heading}
                      onChange={(e) => updateSection(idx, "heading", e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <textarea
                      className={styles.textArea}
                      rows={6}
                      placeholder="Section content (supports **bold**, - bullet points, paragraphs)..."
                      value={sec.body}
                      onChange={(e) => updateSection(idx, "body", e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.codeLabel}>OPTIONAL CODE BLOCK SNIPPET</label>
                    <textarea
                      className={`${styles.textArea} ${styles.codeArea}`}
                      rows={4}
                      placeholder="def ensemble_boxes(boxes, iou_thresh=0.55): ..."
                      value={sec.code || ""}
                      onChange={(e) => updateSection(idx, "code", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Form Footer Submit */}
            <div className={styles.editorFooter}>
              <button
                type="submit"
                className={styles.btnPublish}
                disabled={savingPost}
              >
                {savingPost
                  ? "TRANSMITTING TO STORAGE..."
                  : isEditing
                  ? "SAVE & UPDATE ARTICLE ↵"
                  : "PUBLISH ARTICLE TO PRODUCTION ↵"}
              </button>

              <button
                type="button"
                onClick={resetEditor}
                className={styles.btnSecondary}
              >
                Reset Fields
              </button>
            </div>
          </form>
        </section>
      )}

      {/* TAB 3: COMMENTS MODERATION */}
      {activeTab === "comments" && (
        <section className={styles.sectionWrap}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>// VISITOR TRANSMISSIONS &amp; MODERATION</h2>
            <button onClick={loadComments} className={styles.btnSecondary}>
              ↻ Refresh Transmissions
            </button>
          </div>

          {comments.length === 0 ? (
            <div className={styles.emptyNotice}>// No transmissions logged across any articles.</div>
          ) : (
            <div className={styles.commentsList}>
              {comments.map((cmt) => (
                <div key={cmt.id} className={styles.commentItem}>
                  <div className={styles.commentMeta}>
                    <span className={styles.commentAuthor}>&gt; {cmt.author}</span>
                    <span className={styles.commentDate}>
                      {new Date(cmt.createdAt).toISOString().replace("T", " ").slice(0, 16)} UTC
                    </span>
                    <Link
                      href={`/blog/${cmt.postSlug}`}
                      target="_blank"
                      className={styles.commentPostLink}
                    >
                      Article: /{cmt.postSlug}
                    </Link>
                    <button
                      onClick={() => handleDeleteComment(cmt.postSlug, cmt.id)}
                      className={styles.purgeBtn}
                    >
                      [PURGE TRANSMISSION ✕]
                    </button>
                  </div>
                  <p className={styles.commentText}>{cmt.text}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
