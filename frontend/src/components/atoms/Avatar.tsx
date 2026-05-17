"use client";

import { motion } from "framer-motion";
import { Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  role: "user" | "assistant";
  className?: string;
}

export function Avatar({ role, className }: AvatarProps) {
  const isAssistant = role === "assistant";

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "w-8 h-8 rounded-xl flex items-center justify-center shadow-md select-none flex-shrink-0 border transition-colors duration-300",
        isAssistant
          ? "bg-gradient-to-tr from-[#6366f1] via-[#8b5cf6] to-[#a855f7] border-violet-400/30 text-white drop-shadow-[0_0_10px_rgba(139,92,246,0.25)]"
          : "bg-zinc-800 border-zinc-700 text-zinc-300 dark:bg-zinc-900 dark:border-zinc-800",
        className
      )}
    >
      {isAssistant ? (
        <Sparkles className="w-4 h-4 stroke-[2.2]" />
      ) : (
        <User className="w-4 h-4 stroke-[2.2]" />
      )}
    </motion.div>
  );
}
