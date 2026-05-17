"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useChat } from "ai/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChatLayout } from "@/components/templates/ChatLayout";
import { ChatHeader } from "@/components/organisms/ChatHeader";
import { MessageList } from "@/components/organisms/MessageList";
import { ChatInput } from "@/components/molecules/ChatInput";
import { useChatTheme } from "@/features/chat/hooks/useChatTheme";
import { useScrollToBottom } from "@/features/chat/hooks/useScrollToBottom";

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isClient, setIsClient] = useState(false);
  const hasProcessedQuery = useRef(false);

  // Custom Hooks
  const { theme, isDark, toggleTheme } = useChatTheme();

  // Vercel AI SDK Hook
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    append,
    setMessages,
  } = useChat({
    initialMessages: [],
  });

  const {
    scrollRef,
    newestAssistantRef,
    showScrollButton,
    scrollToBottom,
    handleScroll,
  } = useScrollToBottom(messages);

  // Synchronize client component mount and initial query parameter check
  useEffect(() => {
    setTimeout(() => {
      setIsClient(true);
    }, 0);

    // Validate splash screen
    const seenSplash = localStorage.getItem("lumes_seen_splash");
    if (seenSplash !== "true") {
      router.push("/presentation");
      return;
    }

    // Process home page query injection
    const query = searchParams.get("q");
    if (query && !hasProcessedQuery.current) {
      hasProcessedQuery.current = true;
      append({
        role: "user",
        content: decodeURIComponent(query),
      });
      // Replace URL to clean query and prevent re-submissions on refresh
      router.replace("/chat");
    } else if (!query && messages.length === 0) {
      // Redirect to home if accessed directly without context
      router.push("/home");
    }
  }, [searchParams, router, messages.length, append]);

  // Reset conversation and redirect to home screen
  const handleNewConversation = () => {
    setMessages([]);
    router.push("/home");
  };

  // Safe frame to prevent hydration flicker mismatches
  if (!isClient) {
    return <div className="min-h-screen w-full bg-[#07040D]" />;
  }

  return (
    <ChatLayout isDarkTheme={isDark}>
      {/* Header */}
      <ChatHeader
        theme={theme}
        toggleTheme={toggleTheme}
        onNewConversation={handleNewConversation}
        isDarkTheme={isDark}
      />

      {/* Main message viewport */}
      <MessageList
        messages={messages}
        isLoading={isLoading}
        error={error}
        isDarkTheme={isDark}
        scrollRef={scrollRef}
        newestAssistantRef={newestAssistantRef}
        showScrollButton={showScrollButton}
        scrollToBottom={scrollToBottom}
        handleScroll={handleScroll}
      />

      {/* Fixed bottom interactive capsule */}
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        isDarkTheme={isDark}
      />
    </ChatLayout>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full bg-[#07040D]" />}>
      <ChatContent />
    </Suspense>
  );
}
