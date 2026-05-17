"use client";

import { motion } from "framer-motion";

export function LoadingDots() {
  const dotVariants = {
    animate: (i: number) => ({
      y: [0, -6, 0],
      opacity: [0.3, 1, 0.3],
      transition: {
        repeat: Infinity,
        duration: 1.2,
        ease: "easeInOut" as const,
        delay: i * 0.15,
      },
    }),
  };

  return (
    <div className="flex items-center gap-1.5 h-6 pl-1 text-violet-400">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          custom={i}
          variants={dotVariants}
          animate="animate"
          className="w-2 h-2 rounded-full bg-current shadow-[0_0_8px_rgba(139,92,246,0.3)]"
        />
      ))}
    </div>
  );
}
