"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

const EASE = [0.16, 1, 0.3, 1];

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
