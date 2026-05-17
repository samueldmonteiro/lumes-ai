"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  PanelLeft, 
  Plus, 
  Mic, 
  Send, 
  FileText, 
  SquarePen, 
  Coffee 
} from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/chat?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (text: string) => {
    setQuery(text);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const suggestions = [
    {
      id: "suggestion-1",
      icon: <FileText className="w-[18px] h-[18px] text-zinc-500" />,
      text: "Melhores faculdades de direito em São Luis",
    },
    {
      id: "suggestion-2",
      icon: <SquarePen className="w-[18px] h-[18px] text-zinc-500" />,
      text: "Qual o valor da mensalidade de medicina em 2026?",
    },
    {
      id: "suggestion-3",
      icon: <Coffee className="w-[18px] h-[18px] text-zinc-500" />,
      text: "Qual curso combina mais comigo?",
    },
  ];

  return (
    <div className="relative min-h-screen w-full flex justify-center items-center bg-[#09090f] overflow-x-hidden">
      
      {/* Main Container: Mobile-first 430px max-width wrapper on desktop */}
      <div className="relative z-10 w-full max-w-[430px] min-h-screen flex flex-col justify-between py-6 px-5 bg-[#09090f] text-white sm:border-x sm:border-zinc-900/60 sm:shadow-[0_0_50px_rgba(0,0,0,0.85)]">
        
        {/* Top bar */}
        <header className="flex items-center justify-between w-full flex-shrink-0">
          {/* Left Side: Sidebar Toggle Icon */}
          <button 
            type="button"
            className="p-2 -ml-2 rounded-xl text-zinc-400 hover:text-white transition-colors duration-200 active:scale-95"
          >
            <PanelLeft className="w-[22px] h-[22px] stroke-[1.8]" />
          </button>

          {/* Right Side: Entrar Button - Roxo/Gradiente Premium */}
          <button 
            type="button"
            className="px-5 py-2 text-xs font-bold text-white rounded-full bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] shadow-md transition-transform duration-300 hover:scale-[1.03] active:scale-[0.97]"
          >
            Entrar
          </button>
        </header>

        {/* Centro Vertical: Title & Subtitle centered in remaining space */}
        <div className="flex-1 flex flex-col justify-center items-center w-full my-auto">
          <div className="text-center select-none">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-4xl font-extrabold tracking-[0.25em] text-white uppercase font-geist"
            >
              LUMES AI
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="text-base font-semibold text-[#8B5CF6] mt-2 tracking-wide"
            >
              Olá! Boa tarde
            </motion.p>
          </div>
        </div>

        {/* Bloco Inferior: Suggestions block stacked above input */}
        <div className="w-full flex flex-col gap-5 flex-shrink-0 mt-auto">
          
          {/* Suggestions block */}
          <div className="w-full flex flex-col gap-3">
            {/* Label in subtle gray */}
            <h2 className="text-[10px] sm:text-xs font-semibold tracking-wider text-zinc-500 select-none uppercase px-1.5">
              Sugestões para você
            </h2>

            {/* 3 cards empilhados com fundo levemente diferente (#12121a) e borda sutil */}
            <div className="flex flex-col gap-2.5 w-full">
              {suggestions.map((sug, idx) => (
                <motion.button
                  key={sug.id}
                  type="button"
                  onClick={() => handleSuggestionClick(sug.text)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.08, duration: 0.4 }}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-zinc-800/60 bg-[#12121a] text-zinc-300 hover:bg-[#191925] hover:border-[#8b5cf6]/40 hover:text-white transition-all duration-300 active:scale-[0.98] text-left text-xs font-semibold"
                >
                  <div className="p-1 rounded-lg flex items-center justify-center text-zinc-500">
                    {sug.icon}
                  </div>
                  <span className="flex-1 tracking-wide">{sug.text}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Search Input fixed at the bottom (Pill/Rounded) */}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex items-center gap-2 p-1.5 pl-3.5 rounded-full border border-zinc-800/80 bg-[#12121a] focus-within:border-violet-500/45 transition-all duration-300">
              {/* Left Plus icon */}
              <button
                type="button"
                className="p-2 rounded-full text-zinc-500 hover:text-zinc-300 transition-colors duration-200 active:scale-90"
              >
                <Plus className="w-[18px] h-[18px] stroke-[2.2]" />
              </button>

              {/* Main Search input */}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Digite sua dúvida"
                className="flex-1 text-sm bg-transparent outline-none border-none py-2 pr-2 text-white placeholder:text-zinc-500"
              />

              {/* Voice Mic icon */}
              <button
                type="button"
                className="p-2 rounded-full text-zinc-500 hover:text-zinc-300 transition-colors duration-200 active:scale-90"
              >
                <Mic className="w-[18px] h-[18px] stroke-[2]" />
              </button>

              {/* Submit/Send button - White circle with dark paper-plane send icon */}
              <button
                type="submit"
                disabled={!query.trim()}
                className={`p-2.5 rounded-full transition-all duration-300 flex items-center justify-center bg-white text-[#09090f] hover:bg-zinc-100 ${
                  query.trim() 
                    ? "active:scale-90 hover:scale-105" 
                    : "opacity-60 cursor-not-allowed"
                }`}
              >
                <Send className="w-[14px] h-[14px] stroke-[2.5] translate-x-[0.5px] -translate-y-[0.5px]" />
              </button>
            </div>
          </form>
          
        </div>

      </div>
    </div>
  );
}
