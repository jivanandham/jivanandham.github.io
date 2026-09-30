"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { processLocalQuery } from "../data/agentEngine";
import { useLanguage } from "../context/LanguageContext";
import styles from "./AgentChatbot.module.css";

export const CHAT_OPEN_EVENT = "jk:open-agent-chat";

const buildInitialMessage = (lang, t) => ({
  id: "init",
  sender: "agent",
  time: "LIVE",
  text: t.ui.botWelcome,
  actions: [
    { label: lang === "fr" ? "Projet Satellite RTU" : "View RTU Satellite Project", link: "/work#rtu-detection" },
    { label: lang === "fr" ? "Assistant RAG Slack" : "View RAG Slack Assistant", link: "/work#rag-slack-assistant" },
    { label: lang === "fr" ? "Disponibilité & Visa" : "Check Availability & Visa", query: lang === "fr" ? "Es-tu disponible pour une embauche ?" : "Are you available for hire?" },
  ],
  suggestions: lang === "fr"
    ? [
        "Quels sont ses meilleurs projets en vision ?",
        "Parle-moi de son expérience en RAG & LLM",
        "Quel est son statut de visa en France ?",
      ]
    : [
        "What are your top computer vision projects?",
        "Tell me about your RAG & LLM experience",
        "What is your work authorization status?",
      ],
});

export default function AgentChatbot() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [messages, setMessages] = useState(() => [buildInitialMessage(lang, t)]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [queryHistory, setQueryHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  // Update initial message when language changes if no conversation has started yet
  useEffect(() => {
    setMessages((prev) => {
      const hasUserMessages = prev.some((m) => m.sender === "user");
      if (!hasUserMessages) {
        return [buildInitialMessage(lang, t)];
      }
      return prev;
    });
  }, [lang, t]);

  const feedRef = useRef(null);
  const inputRef = useRef(null);
  const streamTimer = useRef(null);

  // Scroll to bottom when messages or streaming update
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages, streamingText, isTyping]);

  // Global event listener to open chat
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    };

    window.addEventListener(CHAT_OPEN_EVENT, handleOpen);
    return () => window.removeEventListener(CHAT_OPEN_EVENT, handleOpen);
  }, []);

  // Keyboard shortcut: Esc to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const openChat = () => {
    setIsOpen(true);
    setHasUnread(false);
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const handleClear = () => {
    clearTimeout(streamTimer.current);
    setIsTyping(false);
    setStreamingText("");
    setMessages([buildInitialMessage(lang, t)]);
  };

  // Stream text character by character for authentic analog typewriter feel
  const streamResponse = (fullText, callback) => {
    setIsTyping(true);
    let index = 0;
    setStreamingText("");

    const tick = () => {
      // Chunk 2-4 characters per frame for natural pace
      const step = Math.min(3, fullText.length - index);
      index += step;
      setStreamingText(fullText.slice(0, index));

      if (index < fullText.length) {
        streamTimer.current = setTimeout(tick, 18);
      } else {
        setIsTyping(false);
        setStreamingText("");
        callback();
      }
    };

    tick();
  };

  const handleSend = async (userQuery) => {
    const text = (userQuery || inputValue).trim();
    if (!text || isTyping) return;

    setInputValue("");
    setQueryHistory((prev) => [...prev, text]);
    setHistoryIdx(-1);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: "user",
      time: timeStr,
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // Local RAG & Intent Engine (Fast, Deterministic, 0 API key required)
      const result = processLocalQuery(text, [...messages, userMsg], lang);

      streamResponse(result.text, () => {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            sender: "agent",
            time: timeStr,
            text: result.text,
            actions: result.actions,
            suggestions: result.suggestions,
          },
        ]);
      });
    } catch {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action) => {
    if (action.query) {
      handleSend(action.query);
    } else if (action.link) {
      if (action.external) {
        window.open(action.link, "_blank", "noopener,noreferrer");
      } else {
        router.push(action.link);
      }
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === "ArrowUp") {
      if (queryHistory.length > 0) {
        e.preventDefault();
        const nextIdx =
          historyIdx === -1 ? queryHistory.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(nextIdx);
        setInputValue(queryHistory[nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      if (historyIdx !== -1) {
        e.preventDefault();
        const nextIdx = historyIdx + 1;
        if (nextIdx >= queryHistory.length) {
          setHistoryIdx(-1);
          setInputValue("");
        } else {
          setHistoryIdx(nextIdx);
          setInputValue(queryHistory[nextIdx]);
        }
      }
    }
  };

  // Render markdown text formatting (bold, code blocks, bullet points, links)
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;

    // Check for code blocks ```python ... ```
    const parts = rawText.split(/(```[\s\S]*?```)/g);

    return parts.map((part, pIdx) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const codeLines = part.slice(3, -3).replace(/^[a-z]+\n/i, "");
        return (
          <pre key={pIdx} className={styles.codeBlock}>
            <code>{codeLines}</code>
          </pre>
        );
      }

      // Parse bold **text** and `inline code`
      const paragraphs = part.split("\n\n");
      return (
        <div key={pIdx}>
          {paragraphs.map((para, i) => {
            const lines = para.split("\n");
            return (
              <p key={i}>
                {lines.map((line, lIdx) => {
                  const segments = line.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g);
                  return (
                    <span key={lIdx}>
                      {segments.map((seg, sIdx) => {
                        if (seg.startsWith("**") && seg.endsWith("**")) {
                          return <strong key={sIdx}>{seg.slice(2, -2)}</strong>;
                        }
                        if (seg.startsWith("`") && seg.endsWith("`")) {
                          return <code key={sIdx}>{seg.slice(1, -1)}</code>;
                        }
                        const linkMatch = seg.match(/^\[(.*?)\]\((.*?)\)$/);
                        if (linkMatch) {
                          const [, label, href] = linkMatch;
                          const isExternal = href.startsWith("http") || href.startsWith("mailto:");
                          return isExternal ? (
                            <a key={sIdx} href={href} target="_blank" rel="noopener noreferrer">
                              {label}
                            </a>
                          ) : (
                            <Link key={sIdx} href={href}>
                              {label}
                            </Link>
                          );
                        }
                        return seg;
                      })}
                      {lIdx < lines.length - 1 && <br />}
                    </span>
                  );
                })}
              </p>
            );
          })}
        </div>
      );
    });
  };

  return (
    <>
      {/* Floating launcher trigger */}
      {!isOpen && (
        <button
          className={styles.launcher}
          onClick={openChat}
          aria-label={lang === "fr" ? "Ouvrir l'Agent IA Jeeva" : "Open Jeeva AI Agent Chatbot"}
        >
          <span className={styles.statusDot} aria-hidden="true" />
          <span className={styles.launcherText}>
            &gt;_ {lang === "fr" ? "AGENT IA" : "ASK AGENT"}
            {hasUnread && <span className={styles.badge}>{lang === "fr" ? "NOUVEAU" : "NEW"}</span>}
          </span>
        </button>
      )}

      {/* Terminal Agent Chatbot Window */}
      {isOpen && (
        <div className={styles.chatWindow} role="dialog" aria-label="Jeeva AI Chatbot">
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <span className={styles.statusDot} aria-hidden="true" />
              <div className={styles.titleArea}>
                <span className={styles.title}>{t.ui.botTitle}</span>
                <span className={styles.subtitle}>{t.ui.botStatusLocal}</span>
              </div>
            </div>
            <div className={styles.headerControls}>
              <button
                className={styles.btnControl}
                onClick={handleClear}
                title={lang === "fr" ? "Réinitialiser la conversation" : "Reset conversation"}
              >
                CLR
              </button>
              <button
                className={`${styles.btnControl} ${styles.btnClose}`}
                onClick={closeChat}
                aria-label={lang === "fr" ? "Fermer le chat" : "Close chat"}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Status banner */}
          <div className={styles.banner}>
            <span>
              {lang === "fr"
                ? "Moteur RAG Neural Local actif. Zéro télémétrie."
                : "Offline Neural RAG active. Zero telemetry."}
            </span>
            <em>● {lang === "fr" ? "PRÊT" : "READY"}</em>
          </div>

          {/* Message Feed */}
          <div className={styles.messageFeed} ref={feedRef}>
            {messages.map((m) => (
              <div key={m.id} className={styles.message}>
                <div className={styles.msgHeader}>
                  <span
                    className={
                      m.sender === "agent" ? styles.senderAgent : styles.senderUser
                    }
                  >
                    {m.sender === "agent" ? "⌬ JEEVA.AI" : "&gt; VISITOR"}
                  </span>
                  <span className={styles.msgTime}>{m.time}</span>
                </div>

                <div
                  className={`${styles.msgBody} ${
                    m.sender === "user" ? styles.userMsgBody : ""
                  }`}
                >
                  {renderFormattedText(m.text)}

                  {/* Interactive Action Buttons */}
                  {m.actions && m.actions.length > 0 && (
                    <div className={styles.actionsRow}>
                      {m.actions.map((act, i) => (
                        <button
                          key={i}
                          className={styles.actionBtn}
                          onClick={() => handleActionClick(act)}
                        >
                          {act.label} →
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Contextual Suggested Questions */}
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div className={styles.suggestionsWrap}>
                      <span className={styles.suggestionsTitle}>
                        {t.ui.botFollowUps}
                      </span>
                      <div className={styles.suggestionChips}>
                        {m.suggestions.map((s, idx) => (
                          <button
                            key={idx}
                            className={styles.chip}
                            onClick={() => handleSend(s)}
                          >
                            &gt; {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Currently streaming response */}
            {isTyping && (
              <div className={styles.message}>
                <div className={styles.msgHeader}>
                  <span className={styles.senderAgent}>⌬ JEEVA.AI</span>
                  <span className={styles.msgTime}>
                    {lang === "fr" ? "TRANSMISSION EN COURS..." : "TRANSMITTING..."}
                  </span>
                </div>
                <div className={styles.msgBody}>
                  {renderFormattedText(streamingText)}
                  <span className={styles.cursorBlink}>█</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick starter bar */}
          <div className={styles.starterBar}>
            {t.ui.botStarterQuestions.map((q, idx) => (
              <button
                key={idx}
                className={styles.starterPill}
                onClick={() => handleSend(q.replace(/^[^\s]+\s*/, ""))}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            className={styles.inputForm}
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <span className={styles.promptCaret} aria-hidden="true">&gt;</span>
            <input
              ref={inputRef}
              type="text"
              className={styles.inputField}
              placeholder={t.ui.botInputPlaceholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={isTyping}
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={isTyping || !inputValue.trim()}
            >
              {t.ui.botSend}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
