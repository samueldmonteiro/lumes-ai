"use client";

import { motion } from "framer-motion";
import { PanelLeft, Sun, Moon } from "lucide-react";
import { Theme } from "@/types/chat";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  theme: Theme;
  toggleTheme: () => void;
  onNewConversation: () => void;
  isDarkTheme: boolean;
}

export function ChatHeader({
  theme,
  toggleTheme,
  onNewConversation,
  isDarkTheme,
}: ChatHeaderProps) {
  return (
    <header
      className={cn(
        "relative z-20 flex items-center justify-between px-5 py-3.5 w-full max-w-4xl mx-auto flex-shrink-0 border-b transition-colors duration-500",
        isDarkTheme ? "border-zinc-800/60" : "border-zinc-200"
      )}
    >
      {/* Branding and back control */}
      <div className="flex items-center gap-2.5">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewConversation}
          className={cn(
            "p-2 rounded-xl transition-all duration-300 active:scale-95 cursor-pointer",
            isDarkTheme
              ? "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              : "text-zinc-600 hover:bg-zinc-200/50 hover:text-zinc-900"
          )}
          title="Voltar para a tela inicial"
        >
          <PanelLeft className="w-[21px] h-[21px] stroke-[1.8]" />
        </motion.button>
        <div>
          <h1
            className={cn(
              "text-sm font-extrabold tracking-wider font-geist select-none leading-none",
              isDarkTheme ? "text-white" : "text-zinc-800"
            )}
          >
            LUMES AI
          </h1>
          <p className="text-[10px] text-violet-400 font-bold tracking-wider mt-0.5 select-none leading-none">
            Assistente de Estudos
          </p>
        </div>
      </div>

      {/* Action buttons: Theme and Reset */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Animated Theme Toggler */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleTheme}
          className={cn(
            "p-2 rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center",
            isDarkTheme
              ? "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              : "text-zinc-600 hover:bg-zinc-200/50 hover:text-zinc-900"
          )}
          title={isDarkTheme ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
        >
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {isDarkTheme ? (
              <Sun className="w-[19px] h-[19px] text-amber-400 stroke-[2]" />
            ) : (
              <Moon className="w-[19px] h-[19px] text-indigo-650 stroke-[2]" />
            )}
          </motion.div>
        </motion.button>

        {/* New Conversation Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNewConversation}
          className={cn(
            "px-4.5 py-2 text-xs font-bold rounded-full border transition-all duration-300 cursor-pointer shadow-sm select-none",
            isDarkTheme
              ? "border-zinc-800 text-zinc-300 bg-zinc-900/60 hover:bg-zinc-800/80 hover:text-white hover:shadow-[0_0_15px_rgba(139,92,246,0.1)]"
              : "border-zinc-250 text-zinc-600 bg-white hover:bg-zinc-50 hover:text-zinc-900"
          )}
        >
          Nova Conversa
        </motion.button>
      </div>
    </header>
  );
}
