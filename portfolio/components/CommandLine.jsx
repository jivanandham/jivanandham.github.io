"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { NAV, PROJECTS, SITE } from "../data/site";
import { POSTS } from "../data/posts";
import styles from "./CommandLine.module.css";

export const OPEN_EVENT = "jk:open-command-line";

function buildCommands(router, notify) {
  const go = (href) => () => router.push(href);
  // Same-page hash changes must go through location.hash so "hashchange" fires.
  const openProject = (slug) => () => {
    if (window.location.pathname.replace(/\/$/, "").endsWith("/work")) window.location.hash = slug;
    else router.push(`/work#${slug}`);
  };
  return [
    ...NAV.map((n) => ({ name: n.label.toLowerCase(), hint: `go to ${n.href}`, run: go(n.href) })),
    {
      name: "agent",
      hint: "chat with Jeeva's interactive AI assistant",
      run: () => window.dispatchEvent(new Event("jk:open-agent-chat")),
    },
    {
      name: "chat",
      hint: "open interactive AI agent terminal",
      run: () => window.dispatchEvent(new Event("jk:open-agent-chat")),
    },
    {
      name: "ask",
      hint: "ask questions to portfolio AI agent",
      run: () => window.dispatchEvent(new Event("jk:open-agent-chat")),
    },
    {
      name: "admin",
      hint: "open secure admin blog publishing console",
      run: go("/admin"),
    },
    ...PROJECTS.map((p) => ({
      name: `open ${p.slug}`,
      hint: p.title,
      run: openProject(p.slug),
    })),
    ...POSTS.map((p) => ({
      name: `read ${p.slug}`,
      hint: `blog: ${p.title}`,
      run: go(`/blog/${p.slug}`),
    })),
    {
      name: "email",
      hint: `copy ${SITE.email}`,
      run: async () => {
        try {
          await navigator.clipboard.writeText(SITE.email);
          notify("Email copied to clipboard");
        } catch {
          window.location.href = `mailto:${SITE.email}`;
        }
      },
      keepOpen: true,
    },
    { name: "github", hint: "open GitHub profile", run: () => window.open(SITE.github, "_blank", "noopener") },
    { name: "linkedin", hint: "open LinkedIn profile", run: () => window.open(SITE.linkedin, "_blank", "noopener") },
  ];
}

export default function CommandLine() {
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);
  const returnFocus = useRef(null);

  const commands = useMemo(() => buildCommands(router, setMessage), [router]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.name.includes(q) || c.hint.toLowerCase().includes(q));
  }, [commands, query]);

  const open = useCallback(() => {
    returnFocus.current = document.activeElement;
    setQuery("");
    setActive(0);
    setMessage("");
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    returnFocus.current?.focus?.();
  }, []);

  // global shortcuts: "/" or Ctrl/Cmd+K
  useEffect(() => {
    const onKey = (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        isOpen ? close() : open();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, open);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, open);
    };
  }, [isOpen, open, close]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => setActive(0), [query]);

  const run = (cmd) => {
    if (!cmd) {
      setMessage(`command not found: ${query.trim()} — try "work" or "email"`);
      return;
    }
    cmd.run();
    if (!cmd.keepOpen) close();
  };

  const onInputKey = (e) => {
    if (e.key === "Tab") {
      e.preventDefault(); // keep focus inside the dialog
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(matches[active]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onMouseDown={close}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Command line"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.prompt}>
          <span className={styles.caret} aria-hidden="true">&gt;</span>
          <input
            ref={inputRef}
            className={styles.input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="type a command…"
            aria-label="Command"
            aria-controls="command-results"
            aria-activedescendant={matches[active] ? `cmd-${active}` : undefined}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className={styles.esc}>esc</kbd>
        </div>

        <ul id="command-results" className={styles.results} role="listbox">
          {matches.map((c, i) => (
            <li
              key={c.name}
              id={`cmd-${i}`}
              role="option"
              aria-selected={i === active}
              className={`${styles.result} ${i === active ? styles.resultOn : ""}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => run(c)}
            >
              <span className={styles.cmdName}>{c.name}</span>
              <span className={styles.cmdHint}>{c.hint}</span>
            </li>
          ))}
          {matches.length === 0 && (
            <li className={styles.empty}>No matching command. Clear the line to see them all.</li>
          )}
        </ul>

        <p className={styles.status} role="status">
          {message || "↑↓ to move, enter to run"}
        </p>
      </div>
    </div>
  );
}
