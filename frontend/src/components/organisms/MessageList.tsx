"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { MessageBubble } from "@/components/molecules/MessageBubble";
import { LoadingDots } from "@/components/atoms/LoadingDots";
import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/types/chat";
import { cn } from "@/lib/utils";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: { message?: string } | null | undefined;
  isDarkTheme: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  newestAssistantRef: React.RefObject<HTMLDivElement | null>;
  showScrollButton: boolean;
  scrollToBottom: () => void;
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

export function MessageList({
  messages,
  isLoading,
  error,
  isDarkTheme,
  scrollRef,
  newestAssistantRef,
  showScrollButton,
  scrollToBottom,
  handleScroll,
}: MessageListProps) {
  return (
    <div className="flex-1 relative overflow-hidden flex flex-col min-h-0 w-full max-w-3xl mx-auto px-4 md:px-6 mt-3 z-10">
      
      {/* Scrollable conversation stream box */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={cn(
          "flex-1 rounded-2xl border overflow-y-auto scrollbar-thin transition-colors duration-500 relative scroll-smooth",
          isDarkTheme
            ? "border-zinc-800/70 bg-[#0E0A1A]/40 scrollbar-thumb-zinc-800/80"
            : "border-zinc-200 bg-white shadow-sm scrollbar-thumb-zinc-200"
        )}
      >
        <div className="flex flex-col gap-5 p-4 sm:p-5 min-h-full">
          <AnimatePresence mode="popLayout" initial={false}>
            {messages.map((message, index) => {
              const isLast = index === messages.length - 1;
              const isAssistant = message.role === "assistant";
              return (
                <div
                  key={message.id}
                  ref={isLast && isAssistant ? newestAssistantRef : undefined}
                  className="w-full"
                >
                  <MessageBubble
                    message={message}
                    isDarkTheme={isDarkTheme}
                  />
                </div>
              );
            })}
          </AnimatePresence>

          {/* AI Typing / Generating State bubble */}
          {isLoading && messages[messages.length - 1]?.role === "user" && !error && (
            <motion.div
              layout="position"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start items-start gap-2.5 sm:gap-3.5 my-1.5"
            >
              <Avatar role="assistant" className="mt-1" />
              <div
                className={cn(
                  "p-4 rounded-2xl rounded-tl-sm w-full max-w-[85%] sm:max-w-[75%] border transition-all duration-300",
                  isDarkTheme
                    ? "bg-[#130F22]/70 border-zinc-800/80"
                    : "bg-zinc-50 border-zinc-250/80"
                )}
              >
                <LoadingDots />
              </div>
            </motion.div>
          )}

          {/* Connected API Errors */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center my-3"
            >
              <div className="bg-destructive/10 text-destructive text-xs px-4 py-2.5 rounded-xl border border-destructive/20 flex items-center gap-2 font-medium">
                <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                {error.message || "Erro de conexão. Tente novamente."}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Floating Scroll-to-Bottom Command */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20"
          >
            <Button
              variant="secondary"
              size="icon"
              className={cn(
                "rounded-full shadow-lg border backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95 w-10 h-10 flex items-center justify-center cursor-pointer",
                isDarkTheme
                  ? "border-zinc-800 bg-[#0E0A1A]/90 hover:bg-zinc-800 text-violet-400 hover:text-violet-300"
                  : "border-zinc-200 bg-white hover:bg-zinc-50 text-violet-600 hover:text-[#7c3aed]"
              )}
              onClick={scrollToBottom}
            >
              <ArrowDown className="w-5 h-5 stroke-[2.2] animate-bounce" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
