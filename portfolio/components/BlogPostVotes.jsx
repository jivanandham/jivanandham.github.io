"use client";

import { useEffect, useState } from "react";
import styles from "./BlogPostVotes.module.css";

// Unique visitor fingerprint in localStorage
function getVisitorId() {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem("jk_visitor_uuid");
  if (!id) {
    id = "vis_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    try {
      localStorage.setItem("jk_visitor_uuid", id);
    } catch {}
  }
  return id;
}

export default function BlogPostVotes({ slug, initialUp = 0, initialDown = 0 }) {
  const [upvotes, setUpvotes] = useState(initialUp);
  const [downvotes, setDownvotes] = useState(initialDown);
  const [userVote, setUserVote] = useState(null); // 'up' | 'down' | null
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const visitorId = getVisitorId();
    fetch(`/api/posts/${slug}/vote?visitorId=${encodeURIComponent(visitorId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setUpvotes(data.upvotes);
          setDownvotes(data.downvotes);
          setUserVote(data.userVote);
        }
      })
      .catch(() => {});
  }, [slug]);

  const handleVote = async (type) => {
    if (loading) return;
    setLoading(true);

    const visitorId = getVisitorId();

    // Optimistic UI calculation
    const prevVote = userVote;
    let newUp = upvotes;
    let newDown = downvotes;
    let newVote = userVote;

    if (prevVote === type) {
      // Toggle off
      if (type === "up") newUp = Math.max(0, newUp - 1);
      if (type === "down") newDown = Math.max(0, newDown - 1);
      newVote = null;
    } else if (prevVote) {
      // Swap
      if (prevVote === "up") newUp = Math.max(0, newUp - 1);
      if (prevVote === "down") newDown = Math.max(0, newDown - 1);
      if (type === "up") newUp += 1;
      if (type === "down") newDown += 1;
      newVote = type;
    } else {
      // New
      if (type === "up") newUp += 1;
      if (type === "down") newDown += 1;
      newVote = type;
    }

    setUpvotes(newUp);
    setDownvotes(newDown);
    setUserVote(newVote);

    try {
      const res = await fetch(`/api/posts/${slug}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, visitorId }),
      });
      const data = await res.json();
      if (data.success) {
        setUpvotes(data.upvotes);
        setDownvotes(data.downvotes);
        setUserVote(data.userVote);
      }
    } catch (err) {
      // Revert if error
      setUpvotes(upvotes);
      setDownvotes(downvotes);
      setUserVote(prevVote);
    } finally {
      setLoading(false);
    }
  };

  const netScore = upvotes - downvotes;

  return (
    <div className={styles.votingContainer}>
      <span className={styles.label}>// SIGNAL RATING:</span>

      <div className={styles.buttonGroup}>
        <button
          className={`${styles.voteBtn} ${userVote === "up" ? styles.votedUp : ""}`}
          onClick={() => handleVote("up")}
          title="Upvote this technical article"
          aria-label="Upvote article"
          disabled={loading}
        >
          <span className={styles.arrow}>▲</span>
          <span className={styles.count}>{upvotes}</span>
        </button>

        <span className={`${styles.netBadge} ${netScore > 0 ? styles.positive : netScore < 0 ? styles.negative : ""}`}>
          {netScore > 0 ? `+${netScore}` : netScore}
        </span>

        <button
          className={`${styles.voteBtn} ${userVote === "down" ? styles.votedDown : ""}`}
          onClick={() => handleVote("down")}
          title="Downvote this article"
          aria-label="Downvote article"
          disabled={loading}
        >
          <span className={styles.arrow}>▼</span>
          <span className={styles.count}>{downvotes}</span>
        </button>
      </div>
    </div>
  );
}
