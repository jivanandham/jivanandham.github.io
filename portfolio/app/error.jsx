"use client";

import Link from "next/link";

export default function GlobalError({ error, reset }) {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        fontFamily: "var(--font-mono, monospace)",
        color: "var(--text-primary, #e8dcc8)",
        gap: "16px",
        textAlign: "center",
      }}
    >
      <span
        style={{
          color: "var(--accent, #c45d3e)",
          fontSize: "0.76rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        // SYSTEM ERROR
      </span>
      <h1
        style={{
          fontSize: "1.3rem",
          fontFamily: "var(--font-serif, Georgia, serif)",
          color: "var(--text-primary, #e8dcc8)",
          margin: 0,
        }}
      >
        Something went wrong.
      </h1>
      <p
        style={{
          fontSize: "0.88rem",
          color: "var(--text-secondary, #9a8e7a)",
          maxWidth: "460px",
        }}
      >
        An unexpected server error occurred. This incident has been logged. You
        can try again or return to the index.
      </p>

      {process.env.NODE_ENV === "development" && error?.message && (
        <pre
          style={{
            background: "#14120e",
            border: "1px solid #383126",
            padding: "12px 16px",
            fontSize: "0.76rem",
            color: "#ff8585",
            borderRadius: "4px",
            maxWidth: "600px",
            overflow: "auto",
            textAlign: "left",
          }}
        >
          {error.message}
          {error.digest && `\nDigest: ${error.digest}`}
        </pre>
      )}

      <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
        <button
          onClick={reset}
          style={{
            padding: "8px 18px",
            background: "rgba(196,93,62,0.15)",
            border: "1px solid var(--accent, #c45d3e)",
            color: "var(--accent, #c45d3e)",
            fontFamily: "inherit",
            fontSize: "0.8rem",
            cursor: "pointer",
            borderRadius: "3px",
          }}
        >
          RETRY ↵
        </button>
        <Link
          href="/"
          style={{
            padding: "8px 18px",
            background: "transparent",
            border: "1px solid #383126",
            color: "#9a8e7a",
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "0.8rem",
            borderRadius: "3px",
            textDecoration: "none",
          }}
        >
          ← RETURN TO INDEX
        </Link>
      </div>
    </div>
  );
}
