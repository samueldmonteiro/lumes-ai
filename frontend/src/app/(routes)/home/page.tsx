"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  PanelLeft, 
  FileText, 
  SquarePen, 
  Coffee 
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChatInput } from "@/components/molecules/ChatInput";
import { AppSidebar } from "@/components/organisms/AppSidebar";
import { useChatTheme } from "@/features/chat/hooks/useChatTheme";

export default function HomePage() {
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const { isDark, toggleTheme } = useChatTheme();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      router.push(`/chat?q=${encodeURIComponent(input.trim())}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSuggestionClick = (text: string) => {
    setInput(text);
  };

  const handleNewConversation = useCallback(() => {
    setInput("");
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const suggestions = [
    {
      id: "suggestion-1",
      icon: <FileText className={cn("w-[18px] h-[18px]", isDark ? "text-zinc-500" : "text-zinc-400")} />,
      text: "Melhores faculdades de direito em São Luis",
    },
    {
      id: "suggestion-2",
      icon: <SquarePen className={cn("w-[18px] h-[18px]", isDark ? "text-zinc-500" : "text-zinc-400")} />,
      text: "Qual o valor da mensalidade de medicina em 2026?",
    },
    {
      id: "suggestion-3",
      icon: <Coffee className={cn("w-[18px] h-[18px]", isDark ? "text-zinc-500" : "text-zinc-400")} />,
      text: "Qual curso combina mais comigo?",
    },
  ];

  return (
    <div
      className={cn(
        "relative min-h-screen w-full flex justify-center items-center overflow-hidden transition-colors duration-500",
        isDark ? "bg-[#07040D]" : "bg-[#F4F4F6]"
      )}
    >
      
      {/* Sidebar */}
      <AppSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        isDarkTheme={isDark}
        onToggleTheme={toggleTheme}
        onNewConversation={handleNewConversation}
      />

      {/* Dot Pattern Overlay */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none",
          isDark ? "opacity-20" : "opacity-10"
        )}
        style={{
          backgroundImage: isDark
            ? "radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.15) 1px, transparent 0)"
            : "radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.08) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Decorative Glowing Orbs */}
      {isDark && (
        <>
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none" />
        </>
      )}
      {!isDark && (
        <>
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-violet-300/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-fuchsia-300/10 rounded-full blur-[100px] pointer-events-none" />
        </>
      )}

      {/* Main Container */}
      <div
        className={cn(
          "relative z-10 w-full max-w-[430px] h-screen flex flex-col justify-between py-6 px-5 transition-colors duration-500",
          isDark
            ? "text-white sm:border-x sm:border-zinc-900/60 sm:shadow-[0_0_50px_rgba(0,0,0,0.85)]"
            : "text-zinc-900 sm:border-x sm:border-zinc-200/60 sm:shadow-[0_0_50px_rgba(0,0,0,0.06)]"
        )}
      >
        
        {/* Top bar */}
        <header className="flex items-center justify-between w-full flex-shrink-0">
          {/* Left Side: Sidebar Toggle Icon */}
          <button 
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className={cn(
              "p-2 -ml-2 rounded-xl transition-colors duration-200 active:scale-95 cursor-pointer",
              isDark
                ? "text-zinc-400 hover:text-white"
                : "text-zinc-500 hover:text-zinc-800"
            )}
          >
            <PanelLeft className="w-[22px] h-[22px] stroke-[1.8]" />
          </button>

          {/* Right Side: Entrar Button */}
          <button 
            type="button"
            onClick={() => router.push("/login")}
            className="px-5 py-2 text-xs font-bold text-white rounded-full bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] shadow-md transition-transform duration-300 hover:scale-[1.03] active:scale-[0.97]"
          >
            Entrar
          </button>
        </header>

        {/* Centro Vertical: Title & Subtitle */}
        <div className="flex-1 flex flex-col justify-center items-center w-full my-auto">
          <div className="text-center select-none">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={cn(
                "text-4xl font-extrabold tracking-[0.25em] uppercase font-geist",
                isDark ? "text-white" : "text-zinc-800"
              )}
            >
              LUMES AI
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className={cn(
                "text-base font-semibold mt-2 tracking-wide",
                isDark ? "text-[#8B5CF6]" : "text-violet-600"
              )}
            >
              Olá! Boa tarde
            </motion.p>
          </div>
        </div>

        {/* Bloco Inferior: Suggestions + Input */}
        <div className="w-full flex flex-col gap-5 flex-shrink-0 mt-auto">
          
          {/* Suggestions block */}
          <div className="w-full flex flex-col gap-3">
            <h2
              className={cn(
                "text-[10px] sm:text-xs font-semibold tracking-wider select-none uppercase px-1.5",
                isDark ? "text-zinc-500" : "text-zinc-400"
              )}
            >
              Sugestões para você
            </h2>

            <div className="flex flex-col gap-2.5 w-full">
              {suggestions.map((sug, idx) => (
                <motion.button
                  key={sug.id}
                  type="button"
                  onClick={() => handleSuggestionClick(sug.text)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.08, duration: 0.4 }}
                  className={cn(
                    "flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all duration-300 active:scale-[0.98] text-left text-xs font-semibold",
                    isDark
                      ? "border-zinc-800/60 bg-[#12121a] text-zinc-300 hover:bg-[#191925] hover:border-[#8b5cf6]/40 hover:text-white"
                      : "border-zinc-200/80 bg-white text-zinc-600 hover:bg-violet-50/60 hover:border-violet-300/50 hover:text-zinc-800 shadow-sm"
                  )}
                >
                  <div className="p-1 rounded-lg flex items-center justify-center">
                    {sug.icon}
                  </div>
                  <span className="flex-1 tracking-wide">{sug.text}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={false}
            isDarkTheme={isDark}
            className="px-0"
          />
          
        </div>

      </div>
    </div>
  );
}
