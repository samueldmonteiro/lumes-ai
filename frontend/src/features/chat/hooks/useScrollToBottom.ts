"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { ChatMessage, UseScrollToBottomReturn } from "@/types/chat";

export function useScrollToBottom(
  messages: ChatMessage[]
): UseScrollToBottomReturn {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const newestAssistantRef = useRef<HTMLDivElement | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrolledAssistantMessageId = useRef<string | null>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 50);
  }, []);

  const scrollToNewestAssistant = useCallback(() => {
    setTimeout(() => {
      if (scrollRef.current && newestAssistantRef.current) {
        const container = scrollRef.current;
        const bubble = newestAssistantRef.current;
        
        const containerRect = container.getBoundingClientRect();
        const bubbleRect = bubble.getBoundingClientRect();
        
        // Calculate position relative to container's scroll bounds
        const relativeTop = bubbleRect.top - containerRect.top + container.scrollTop;
        // Apply comfortable 12px margin so the bubble isn't tightly squished
        const targetScrollTop = Math.max(0, relativeTop - 12);
        
        container.scrollTo({
          top: targetScrollTop,
          behavior: "smooth",
        });
      }
    }, 80);
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 120;
    setShowScrollButton(!isAtBottom);
  }, []);

  // Monitor messages list to trigger contextual smart scroll
  useEffect(() => {
    if (messages.length === 0) {
      scrolledAssistantMessageId.current = null;
      return;
    }

    const lastMessage = messages[messages.length - 1];

    if (lastMessage.role === "user") {
      scrollToBottom();
    } else if (lastMessage.role === "assistant") {
      // Scroll to start of the AI response once upon generation start
      if (scrolledAssistantMessageId.current !== lastMessage.id) {
        scrolledAssistantMessageId.current = lastMessage.id;
        scrollToNewestAssistant();
      }
    }
  }, [messages, messages.length, scrollToBottom, scrollToNewestAssistant]);

  return {
    scrollRef,
    newestAssistantRef,
    showScrollButton,
    scrollToBottom,
    handleScroll,
  };
}
