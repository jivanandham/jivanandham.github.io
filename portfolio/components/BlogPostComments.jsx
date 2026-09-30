"use client";

import { useEffect, useState } from "react";
import styles from "./BlogPostComments.module.css";

export default function BlogPostComments({ slug }) {
  const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin privileges and load comments
  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((data) => setIsAdmin(Boolean(data?.isAdmin)))
      .catch(() => {});

    loadComments();
  }, [slug]);

  const loadComments = async () => {
    try {
      const res = await fetch(`/api/posts/${slug}/comments`);
      const data = await res.json();
      if (data.success && Array.isArray(data.comments)) {
        setComments(data.comments);
      }
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || submitting) return;

    setSubmitting(true);
    setStatusMsg("");

    try {
      const res = await fetch(`/api/posts/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: author.trim() || "Anonymous Engineer",
          text: text.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setText("");
        setStatusMsg("✓ Transmission logged to system buffer.");
        loadComments();
        setTimeout(() => setStatusMsg(""), 4000);
      } else {
        setStatusMsg(`✕ Error: ${data.error || "Failed to submit"}`);
      }
    } catch {
      setStatusMsg("✕ Network transmission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm("Confirm purging this comment from storage?")) return;

    try {
      const res = await fetch(`/api/posts/${slug}/comments/${commentId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      }
    } catch (err) {
      alert("Failed to delete comment");
    }
  };

  const formatDate = (isoStr) => {
    try {
      const d = new Date(isoStr);
      return d.toISOString().replace("T", " ").slice(0, 16) + " UTC";
    } catch {
      return isoStr;
    }
  };

  return (
    <section className={styles.container} id="discussion">
      <div className={styles.headerRow}>
        <h3 className={styles.title}>
          <span className="accent">//</span> TRANSMISSIONS &amp; DISCUSSION
        </h3>
        <span className={styles.countBadge}>
          {comments.length} {comments.length === 1 ? "TRANSMISSION" : "TRANSMISSIONS"}
        </span>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formPrompt}>
          // LOG TRANSMISSION TO THIS LOG ENTRY
        </div>

        <div className={styles.inputRow}>
          <input
            type="text"
            className={styles.authorInput}
            placeholder="Callsign / Name (e.g. Alex / CV Eng @ Paris)"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            maxLength={70}
          />
        </div>

        <textarea
          className={styles.textarea}
          placeholder="Enter technical comments, feedback, or questions regarding this system breakdown..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          required
          maxLength={1000}
        />

        <div className={styles.footerRow}>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting || !text.trim()}
          >
            {submitting ? "TRANSMITTING..." : "TRANSMIT COMMENT ↵"}
          </button>
          {statusMsg && <span className={styles.statusMsg}>{statusMsg}</span>}
        </div>
      </form>

      {/* Comments List */}
      <div className={styles.list}>
        {comments.length === 0 ? (
          <div className={styles.emptyState}>
            // Buffer empty. No transmissions logged yet. Be the first to comment.
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className={styles.commentCard}>
              <div className={styles.cardHeader}>
                <span className={styles.authorName}>
                  <span className={styles.authorPrompt}>&gt;</span> {comment.author}
                </span>
                <div className={styles.metaRight}>
                  <time className={styles.timestamp}>
                    {formatDate(comment.createdAt)}
                  </time>
                  {isAdmin && (
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(comment.id)}
                      title="Admin: Purge comment"
                    >
                      [PURGE ✕]
                    </button>
                  )}
                </div>
              </div>
              <p className={styles.commentBody}>{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
