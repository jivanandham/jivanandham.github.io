"use client";

import { Component } from "react";

/**
 * React Error Boundary — catches rendering errors in client components
 * and shows a minimal fallback instead of a white screen crash.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console in dev; in prod you'd pipe to Sentry/Datadog etc.
    if (process.env.NODE_ENV === "development") {
      console.error("[ErrorBoundary] Caught rendering error:", error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "48px 32px",
            fontFamily: "var(--font-mono), monospace",
            background: "var(--bg-primary, #1a1814)",
            color: "var(--text-primary, #e8dcc8)",
            minHeight: "200px",
            borderLeft: "3px solid var(--accent, #c45d3e)",
            margin: "24px",
          }}
        >
          <div
            style={{
              color: "var(--accent, #c45d3e)",
              fontSize: "0.8rem",
              letterSpacing: "0.12em",
              marginBottom: "12px",
            }}
          >
            // RENDER ERROR — COMPONENT FAILURE
          </div>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary, #9a8e7a)" }}>
            {this.props.fallback ||
              "A component encountered an unexpected error. Please refresh the page."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop: "16px",
              padding: "6px 14px",
              background: "transparent",
              border: "1px solid var(--accent, #c45d3e)",
              color: "var(--accent, #c45d3e)",
              fontFamily: "inherit",
              fontSize: "0.78rem",
              cursor: "pointer",
              borderRadius: "3px",
            }}
          >
            RETRY ↵
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
