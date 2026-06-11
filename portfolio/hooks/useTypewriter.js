"use client";

import { useEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Types out `lines` sequentially with human-feeling variable delay (30–70ms).
 * Returns { rendered, done } where rendered is an array of partial strings.
 */
export function useTypewriter(lines, { enabled = true, charDelay = [30, 70], lineDelay = 120 } = {}) {
  const [rendered, setRendered] = useState(() =>
    prefersReducedMotion() || !enabled ? [...lines] : lines.map(() => "")
  );
  const [done, setDone] = useState(prefersReducedMotion() || !enabled);
  const cancelled = useRef(false);

  useEffect(() => {
    if (!enabled || prefersReducedMotion()) {
      setRendered([...lines]);
      setDone(true);
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
        setTimeout(tick, lineDelay);
      } else {
        const [min, max] = charDelay;
        setTimeout(tick, min + Math.random() * (max - min));
      }
    };
    tick();

    return () => {
      cancelled.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return { rendered, done };
}
