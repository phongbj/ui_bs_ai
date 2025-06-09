// src/components/PageTransition.tsx
"use client";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={path}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        style={{ height: "100%" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
