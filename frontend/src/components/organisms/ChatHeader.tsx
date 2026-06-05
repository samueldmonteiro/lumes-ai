"use client";

import { motion } from "framer-motion";
import { PanelLeft, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ChatHeaderProps {
  onNewConversation: () => void;
  onToggleSidebar: () => void;
  isDarkTheme: boolean;
}

export function ChatHeader({
  onNewConversation,
  onToggleSidebar,
  isDarkTheme,
}: ChatHeaderProps) {
  return (
    <header
      className={cn(
        "relative z-20 flex items-center justify-between px-4 py-2.5 w-full flex-shrink-0 border-b transition-colors duration-500",
        isDarkTheme ? "border-zinc-800/60" : "border-zinc-200"
      )}
    >
      {/* Branding and sidebar control */}
      <div className="flex items-center gap-3">
        {/* Sidebar Trigger button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleSidebar}
          className={cn(
            "p-2 rounded-xl transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center lg:hidden",
            isDarkTheme
              ? "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              : "text-zinc-600 hover:bg-zinc-200/50 hover:text-zinc-900"
          )}
          title="Menu"
        >
          <PanelLeft className="w-[22px] h-[22px] stroke-[1.8]" />
        </motion.button>

        {/* Brand logo & title side by side */}
        <div className="flex items-center gap-2 select-none">
          <div className="relative w-[28px] h-[28px]">
            <Image
              src="/lumes_logo.png"
              alt="Lumes AI Logo"
              fill
              className="object-contain"
              sizes="28px"
            />
          </div>
          <span
            className={cn(
              "text-sm font-extrabold tracking-[0.15em] font-geist leading-none",
              isDarkTheme ? "text-white" : "text-zinc-800"
            )}
          >
            LUMES <span className="text-violet-400">AI</span>
          </span>
        </div>
      </div>

      {/* Right control: Circular Plus button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={onNewConversation}
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-sm select-none border",
          isDarkTheme
            ? "border-zinc-800 text-zinc-400 bg-zinc-900/60 hover:bg-zinc-800/80 hover:text-white hover:border-zinc-700 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]"
            : "border-zinc-200 text-zinc-650 bg-white hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-300"
        )}
        title="Nova Conversa"
      >
        <Plus className="w-[19px] h-[19px] stroke-[2.5]" />
      </motion.button>
    </header>
  );
}
