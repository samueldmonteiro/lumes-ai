"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChatLayoutProps {
  children: React.ReactNode;
  isDarkTheme: boolean;
}

export function ChatLayout({ children, isDarkTheme }: ChatLayoutProps) {
  return (
    <div
      className={cn(
        "flex flex-col h-screen w-full transition-colors duration-500 relative overflow-hidden font-sans",
        isDarkTheme ? "bg-[#07040D]" : "bg-[#F4F4F6]"
      )}
    >
      {/* Premium Ambient Background Mesh Glow - Only in dark mode for OLED eye comfort */}
      {isDarkTheme && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.08, 0.12, 0.08],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-[-25%] left-[-15%] w-[80vw] h-[80vw] sm:w-[500px] sm:h-[500px] rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 blur-[90px] sm:blur-[130px]"
          />
          <motion.div
            animate={{
              scale: [1.1, 0.95, 1.1],
              opacity: [0.06, 0.1, 0.06],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] sm:w-[500px] sm:h-[500px] rounded-full bg-gradient-to-tr from-[#6366f1] to-purple-600 blur-[90px] sm:blur-[130px]"
          />
        </div>
      )}

      {/* Responsive centering wrapper */}
      <div
        className={cn(
          "flex-1 flex flex-col w-full mx-auto relative z-10 min-h-0",
          "max-w-full sm:max-w-[430px] md:max-w-[768px] lg:max-w-[1200px]",
          "px-0 sm:px-4 md:px-6 lg:px-8 border-x transition-all duration-300",
          isDarkTheme 
            ? "border-zinc-900/40 sm:border-zinc-800/40 sm:shadow-[0_0_50px_rgba(0,0,0,0.8)]" 
            : "border-zinc-200/50 sm:border-zinc-200/60 sm:shadow-[0_0_50px_rgba(0,0,0,0.03)]"
        )}
      >
        {children}
      </div>
    </div>
  );
}
