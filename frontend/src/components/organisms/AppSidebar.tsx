"use client";

import { useCallback, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MessageSquare,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ChatHistoryItem {
  id: string;
  title: string;
  timestamp: string;
}

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  onNewConversation: () => void;
  userName?: string;
  chatHistory?: ChatHistoryItem[];
  activeChatId?: string;
}

export function AppSidebar({
  isOpen,
  onClose,
  isDarkTheme,
  onToggleTheme,
  onNewConversation,
  userName = "Usuário",
  chatHistory = [],
  activeChatId,
}: AppSidebarProps) {
  const router = useRouter();

  const userInitial = useMemo(
    () => userName.charAt(0).toUpperCase(),
    [userName]
  );

  const handleNewChat = useCallback(() => {
    onNewConversation();
    onClose();
  }, [onNewConversation, onClose]);

  const handleChatSelect = useCallback(
    (chatId: string) => {
      router.push(`/chat?id=${chatId}`);
      onClose();
    },
    [router, onClose]
  );

  const handleLogout = useCallback(() => {
    localStorage.removeItem("lumes_seen_splash");
    localStorage.removeItem("lumes_theme");
    router.push("/login");
    onClose();
  }, [router, onClose]);

  const renderSidebarContent = (isStaticContent: boolean) => (
    <div className="w-full h-full flex flex-col bg-transparent">
      {/* ── Header: Logo + Theme Toggle ── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
        <div className="flex items-center gap-2.5 select-none">
          <div className="relative w-[30px] h-[30px]">
            <Image
              src="/lumes_logo.png"
              alt="Lumes AI Logo"
              fill
              className="object-contain"
              sizes="30px"
            />
          </div>
          {isStaticContent ? (
            <h2
              className={cn(
                "text-sm font-extrabold tracking-[0.15em] font-geist leading-none m-0",
                isDarkTheme ? "text-white" : "text-zinc-800"
              )}
            >
              LUMES <span className="text-violet-400">AI</span>
            </h2>
          ) : (
            <SheetTitle
              className={cn(
                "text-sm font-extrabold tracking-[0.15em] font-geist leading-none m-0",
                isDarkTheme ? "text-white" : "text-zinc-800"
              )}
            >
              LUMES <span className="text-violet-400">AI</span>
            </SheetTitle>
          )}
        </div>

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggleTheme}
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer",
            isDarkTheme
              ? "text-zinc-400 hover:text-amber-300 hover:bg-zinc-800/60"
              : "text-zinc-500 hover:text-amber-600 hover:bg-zinc-100"
          )}
          title={isDarkTheme ? "Modo Claro" : "Modo Escuro"}
        >
          <AnimatePresence mode="wait">
            {isDarkTheme ? (
              <motion.div
                key="sun"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="w-[18px] h-[18px] stroke-[1.8]" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="w-[18px] h-[18px] stroke-[1.8]" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <div className="px-4 pb-2">
        <Separator
          className={cn(
            isDarkTheme ? "bg-zinc-800/60" : "bg-zinc-200/80"
          )}
        />
      </div>

      {/* ── New Chat Button ── */}
      <div className="px-4 pb-2 flex-shrink-0">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNewChat}
          className={cn(
            "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-300 cursor-pointer text-left group border",
            isDarkTheme
              ? "bg-violet-500/10 border-violet-500/20 text-violet-300 hover:bg-violet-500/15 hover:border-violet-500/30"
              : "bg-violet-50 border-violet-200/60 text-violet-700 hover:bg-violet-100 hover:border-violet-300"
          )}
        >
          <div
            className={cn(
              "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
              isDarkTheme
                ? "bg-violet-500/20 group-hover:bg-violet-500/30"
                : "bg-violet-100 group-hover:bg-violet-200"
            )}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-[13px] font-semibold tracking-wide">
            Novo Chat
          </span>
        </motion.button>
      </div>

      {/* ── Chat History ── */}
      <div className="flex-1 min-h-0 flex flex-col px-4 pt-1">
        <h3
          className={cn(
            "text-[10px] font-bold tracking-[0.1em] uppercase px-1 mb-2 select-none",
            isDarkTheme ? "text-zinc-500" : "text-zinc-400"
          )}
        >
          Recentes
        </h3>

        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-0.5 pb-2">
            {chatHistory.length > 0 ? (
              chatHistory.map((chat, idx) => (
                <motion.button
                  key={chat.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03, duration: 0.2 }}
                  onClick={() => handleChatSelect(chat.id)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-200 cursor-pointer group",
                    activeChatId === chat.id
                      ? isDarkTheme
                        ? "bg-zinc-800/70 text-white"
                        : "bg-zinc-100 text-zinc-900"
                      : isDarkTheme
                        ? "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-800"
                  )}
                >
                  <MessageSquare
                    className={cn(
                      "w-3.5 h-3.5 flex-shrink-0 stroke-[1.8] transition-colors",
                      activeChatId === chat.id
                        ? "text-violet-400"
                        : isDarkTheme
                          ? "text-zinc-600 group-hover:text-zinc-400"
                          : "text-zinc-400 group-hover:text-zinc-500"
                    )}
                  />
                  <span className="text-[13px] truncate flex-1 leading-tight">
                    {chat.title}
                  </span>
                </motion.button>
              ))
            ) : (
              <div
                className={cn(
                  "flex flex-col items-center justify-center py-10 gap-3 select-none",
                  isDarkTheme ? "text-zinc-600" : "text-zinc-400"
                )}
              >
                <MessageSquare className="w-8 h-8 stroke-[1.2] opacity-50" />
                <p className="text-xs text-center leading-relaxed opacity-70">
                  Nenhuma conversa ainda.
                  <br />
                  Comece um novo chat!
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* ── Footer: User + Logout ── */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2">
        <Separator
          className={cn(
            "mb-3",
            isDarkTheme ? "bg-zinc-800/60" : "bg-zinc-200/80"
          )}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* User Avatar */}
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold select-none",
                isDarkTheme
                  ? "bg-gradient-to-br from-violet-500/30 to-indigo-500/30 text-violet-300 border border-violet-500/20"
                  : "bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-700 border border-violet-200/60"
              )}
            >
              {userInitial}
            </div>
            <div className="flex flex-col">
              <span
                className={cn(
                  "text-[13px] font-semibold leading-tight truncate max-w-[140px]",
                  isDarkTheme ? "text-zinc-200" : "text-zinc-700"
                )}
              >
                {userName}
              </span>
              <span
                className={cn(
                  "text-[10px] leading-tight",
                  isDarkTheme ? "text-zinc-500" : "text-zinc-400"
                )}
              >
                Conta pessoal
              </span>
            </div>
          </div>

          {/* Logout */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer",
              isDarkTheme
                ? "text-zinc-500 hover:text-red-400 hover:bg-red-50/10"
                : "text-zinc-400 hover:text-red-500 hover:bg-red-50"
            )}
            title="Sair"
          >
            <LogOut className="w-4 h-4 stroke-[1.8]" />
          </motion.button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Versão Estática para Desktop (lg:) */}
      <aside
        className={cn(
          "hidden lg:block w-[280px] h-screen shrink-0 relative z-20 border-r transition-colors duration-500",
          isDarkTheme
            ? "bg-[#0A0714] border-zinc-900/60"
            : "bg-white border-zinc-200/80"
        )}
      >
        {renderSidebarContent(true)}
      </aside>

      {/* Versão Sheet para Mobile (< lg) */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={onClose}>
          <SheetContent
            side="left"
            showCloseButton={false}
            className={cn(
              "w-[280px] sm:max-w-[280px] p-0 flex flex-col border-r-0",
              isDarkTheme
                ? "bg-[#0A0714]/98 backdrop-blur-xl"
                : "bg-white/98 backdrop-blur-xl"
            )}
          >
            {renderSidebarContent(false)}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
