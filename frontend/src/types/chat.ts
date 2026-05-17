import { Message as SDKMessage } from "ai";

export type Theme = "light" | "dark";

export type ChatMessage = SDKMessage;

export interface UseChatThemeReturn {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

export interface UseScrollToBottomReturn {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  newestAssistantRef: React.RefObject<HTMLDivElement | null>;
  showScrollButton: boolean;
  scrollToBottom: () => void;
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}
