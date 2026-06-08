'use client';

import { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import { useChat } from 'ai/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChatLayout } from '@/components/templates/ChatLayout';
import { ChatHeader } from '@/components/organisms/ChatHeader';
import { useUser } from '@/hooks/queries/use-auth';
import { AppSidebar } from '@/components/organisms/AppSidebar';
import { MessageList } from '@/components/organisms/MessageList';
import { ChatInput } from '@/components/molecules/ChatInput';
import { useChatTheme } from '@/features/chat/hooks/useChatTheme';
import { useScrollToBottom } from '@/features/chat/hooks/useScrollToBottom';
import { cn } from '@/lib/utils';

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isClient, setIsClient] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const hasProcessedQuery = useRef(false);

  // Custom Hooks
  const { isDark, toggleTheme } = useChatTheme();
  const { user } = useUser();

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
    const seenSplash = localStorage.getItem('lumes_seen_splash');
    if (seenSplash !== 'true') {
      router.push('/presentation');
      return;
    }

    // Process home page query injection
    const query = searchParams.get('q');
    if (query && !hasProcessedQuery.current) {
      hasProcessedQuery.current = true;
      append({
        role: 'user',
        content: decodeURIComponent(query),
      });
      // Replace URL to clean query and prevent re-submissions on refresh
      router.replace('/chat');
    } else if (!query && messages.length === 0) {
      // Redirect to home if accessed directly without context
      router.push('/home');
    }
  }, [searchParams, router, messages.length, append]);

  // Reset conversation and redirect to home screen
  const handleNewConversation = useCallback(() => {
    setMessages([]);
    router.push('/home');
  }, [setMessages, router]);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  // Safe frame to prevent hydration flicker mismatches
  if (!isClient) {
    return <div className="min-h-screen w-full bg-[#07040D]" />;
  }

  return (
    <ChatLayout isDarkTheme={isDark}>
      <div className="flex flex-row h-screen w-full overflow-hidden">
        {/* Sidebar (Auto-responsiva) */}
        <AppSidebar
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          isDarkTheme={isDark}
          onToggleTheme={toggleTheme}
          onNewConversation={handleNewConversation}
        />

        {/* Chat Principal */}
        <div className="flex-1 h-screen flex flex-col min-w-0 relative">
          {/* Header */}
          <ChatHeader
            onNewConversation={handleNewConversation}
            onToggleSidebar={handleToggleSidebar}
            isDarkTheme={isDark}
            user={user}
          />

          {/* Área de Mensagens + Input centralizados com max-w-4xl no desktop */}
          <div className="flex-1 flex flex-col justify-between min-h-0 w-full max-w-4xl mx-auto">
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
              className="px-4"
            />
          </div>
        </div>

        {/* Painel de Contexto (Desktop) */}
        <div className="hidden lg:block w-[320px] h-screen shrink-0 relative z-20">
          <aside
            className={cn(
              'w-full h-full flex flex-col p-5 select-none border-l',
              isDark ? 'bg-[#0A0714] text-zinc-300 border-zinc-900/60' : 'bg-white text-zinc-700 border-zinc-200/80',
            )}
          >
            <h3
              className={cn(
                'text-xs font-bold tracking-widest uppercase mb-4',
                isDark ? 'text-zinc-500' : 'text-zinc-400',
              )}
            >
              Painel de Contexto
            </h3>

            {/* Status da IA */}
            <div
              className={cn(
                'p-4 rounded-xl border mb-5 flex flex-col gap-3',
                isDark ? 'bg-[#110D20]/60 border-zinc-800/80' : 'bg-zinc-50 border-zinc-200/60',
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">Assistente</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] uppercase font-bold text-emerald-500">Ativo</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className={cn('text-xs font-extrabold', isDark ? 'text-white' : 'text-zinc-900')}>
                  Lumes Pro
                </span>
                <span className="text-[10px] text-zinc-500">Powered by Gemini 3.5 Flash</span>
              </div>
            </div>

            {/* Estatísticas Simples */}
            <div className="flex flex-col gap-3.5 mb-6">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Métricas da Sessão</h4>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Mensagens</span>
                <span className="font-semibold">{messages.length}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Tempo de Resposta</span>
                <span className="font-semibold">~1.2s</span>
              </div>
            </div>

            <div className={cn('h-[1px] w-full my-5', isDark ? 'bg-zinc-800/60' : 'bg-zinc-200/80')} />

            {/* Dicas / Atalhos */}
            <div className="flex flex-col gap-3.5">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Como interagir</h4>
              <div className="text-xs space-y-3 leading-relaxed">
                <p>
                  💡 <strong>Envio rápido:</strong> Pressione <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-[10px]">Enter</kbd> para enviar a mensagem diretamente.
                </p>
                <p>
                  ✏️ <strong>Quebra de linha:</strong> Pressione <kbd className="px-1.5 py-0.5 rounded bg-zinc-250 dark:bg-zinc-800 text-[10px]">Shift + Enter</kbd> para pular linha.
                </p>
                <p>
                  ✨ Você pode pedir análises de faculdades, valores de mensalidades ou tirar dúvidas sobre carreiras!
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
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
