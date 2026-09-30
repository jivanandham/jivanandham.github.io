"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Types out `lines` sequentially with human-feeling variable delay.
 * Returns { rendered, done, skip } — rendered is an array of partial strings,
 * skip() jumps straight to the finished state.
 *
 * Initial state is always "empty, not done" so server and client markup match;
 * reduced-motion users get the finished text on the first effect tick.
 */
export function useTypewriter(lines, { enabled = true, charDelay = [30, 70], lineDelay = 120 } = {}) {
  const [rendered, setRendered] = useState(() => lines.map(() => ""));
  const [done, setDone] = useState(false);
  const cancelled = useRef(false);
  const timer = useRef(null);

  const skip = useCallback(() => {
    cancelled.current = true;
    clearTimeout(timer.current);
    setRendered([...lines]);
    setDone(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (prefersReducedMotion()) {
      skip();
      return;
    }
    cancelled.current = false;
    let li = 0;
    let ci = 0;

    const tick = () => {
      if (cancelled.current) return;
      if (li >= lines.length) {
        setDone(true);
        return;
      }
      ci += 1;
      const lineIdx = li;
      const partial = lines[lineIdx].slice(0, ci);
      setRendered((prev) => {
        const next = [...prev];
        next[lineIdx] = partial;
        return next;
      });
      if (ci >= lines[lineIdx].length) {
        li += 1;
        ci = 0;
        timer.current = setTimeout(tick, lineDelay);
      } else {
        const [min, max] = charDelay;
        timer.current = setTimeout(tick, min + Math.random() * (max - min));
      }
    };
    tick();

    return () => {
      cancelled.current = true;
      clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return { rendered, done, skip };
}
