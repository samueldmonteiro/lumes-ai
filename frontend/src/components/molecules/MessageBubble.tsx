"use client";

import { motion } from "framer-motion";
import { Avatar } from "@/components/atoms/Avatar";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { ChatMessage } from "@/types/chat";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: ChatMessage;
  isDarkTheme: boolean;
}

export function MessageBubble({ message, isDarkTheme }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        layout: { type: "spring", stiffness: 350, damping: 30 },
        opacity: { duration: 0.25 },
        y: { type: "spring", stiffness: 350, damping: 30 },
      }}
      className={cn(
        "flex w-full items-start gap-2.5 sm:gap-3.5 my-1.5",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* AI Avatar on Left */}
      {!isUser && <Avatar role="assistant" className="mt-1" />}

      {/* Message Content Bubble */}
      <div
        className={cn(
          "max-w-[85%] sm:max-w-[75%] shadow-sm leading-relaxed text-sm md:text-[15px] transition-all duration-300 relative",
          isUser
            ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm selection:bg-white/20 selection:text-white"
            : cn(
                "p-4 rounded-2xl rounded-tl-sm w-full border border-zinc-200 bg-white text-zinc-800",
                isDarkTheme
                  ? "bg-[#130F22]/70 border-zinc-800/80 text-zinc-200"
                  : "bg-zinc-50/80 border-zinc-250/80 text-zinc-700"
              )
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap font-sans break-words">{message.content}</p>
        ) : (
          <MarkdownRenderer content={message.content} />
        )}
      </div>

      {/* User Avatar on Right */}
      {isUser && <Avatar role="user" className="mt-1" />}
    </motion.div>
  );
}
