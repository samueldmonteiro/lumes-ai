'use client';

import { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChatLayout } from '@/components/templates/ChatLayout';
import { ChatHeader } from '@/components/organisms/ChatHeader';
import { useUser } from '@/hooks/queries/use-auth';
import { AppSidebar } from '@/components/organisms/AppSidebar';
import { MessageList } from '@/components/organisms/MessageList';
import { ChatInput } from '@/components/molecules/ChatInput';
import { useChatTheme } from '@/features/chat/hooks/useChatTheme';
import { useScrollToBottom } from '@/features/chat/hooks/useScrollToBottom';
import { askAction, getSessionByIdAction } from '@/actions/chat';
import type { ChatMessage } from '@/types/chat';
import { cn } from '@/lib/utils';

const GUEST_STORAGE_KEY = 'lumes_chat_history_guest';

function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isClient, setIsClient] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const hasProcessedQuery = useRef(false);
  const hasLoadedSession = useRef(false);
  // Captura o ?q= da URL imediatamente no mount, antes de isUserLoading resolver
  const initialQueryRef = useRef<string | null>(
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('q')
      : null,
  );

  const { isDark, toggleTheme } = useChatTheme();
  const { user, isLoading: isUserLoading } = useUser();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);

  const {
    scrollRef,
    newestAssistantRef,
    showScrollButton,
    scrollToBottom,
    handleScroll,
  } = useScrollToBottom(messages);

  const loadGuestHistory = useCallback((): ChatMessage[] => {
    try {
      const stored = localStorage.getItem(GUEST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed as ChatMessage[];
      }
    } catch {}
    return [];
  }, []);

  const saveGuestHistory = useCallback((msgs: ChatMessage[]) => {
    try {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(msgs));
    } catch {}
  }, []);

  const loadSession = useCallback(async (id: string) => {
    if (hasLoadedSession.current) return;
    hasLoadedSession.current = true;
    setSessionId(id);
    const result = await getSessionByIdAction(id);
    if (result.success && result.data) {
      const loadedMessages: ChatMessage[] = [];
      for (const log of result.data.chatLogs) {
        loadedMessages.push({
          id: generateId(),
          role: 'user',
          content: log.question,
        });
        loadedMessages.push({
          id: generateId(),
          role: 'assistant',
          content: log.answer,
        });
      }
      setMessages(loadedMessages);
    }
  }, []);

  const sendMessage = useCallback(async (question: string) => {
    if (!question.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: question,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    if (!user) {
      saveGuestHistory(updatedMessages);
    }

    try {
      const history = user
        ? undefined
        : messages.map(m => ({
          role: m.role === 'assistant' ? 'model' as const : 'user' as const,
          content: m.content,
        }));

      const result = await askAction({
        question,
        sessionId: user ? sessionId : undefined,
        history,
      });

      if (!result.success || !result.data) {
        setError(result.message || 'Erro ao obter resposta.');
        setIsLoading(false);
        return;
      }

      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: result.data.answer,
      };

      const finalMessages = [...updatedMessages, assistantMsg];
      setMessages(finalMessages);

      if (user && result.data.sessionId && !sessionId) {
        setSessionId(result.data.sessionId);
        router.replace(`/chat?id=${result.data.sessionId}`);
      }

      if (!user) {
        saveGuestHistory(finalMessages);
      }
    } catch (err: any) {
      setError(err?.message || 'Erro de conexão. Tente novamente.');
    }

    setIsLoading(false);
  }, [messages, isLoading, user, sessionId, router, saveGuestHistory]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
  }, [input, isLoading, sendMessage]);

  const handleNewConversation = useCallback(() => {
    setMessages([]);
    setSessionId(undefined);
    setError(null);
    hasProcessedQuery.current = false;
    hasLoadedSession.current = false;
    if (!user) {
      localStorage.removeItem(GUEST_STORAGE_KEY);
    }
    router.push('/home');
  }, [user, router]);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  useEffect(() => {
    setTimeout(() => { setIsClient(true); }, 0);

    const seenSplash = localStorage.getItem('lumes_seen_splash');
    if (seenSplash !== 'true') {
      router.push('/presentation');
    }
  }, [router]);

  useEffect(() => {
    if (!isClient || isUserLoading || hasProcessedQuery.current) return;

    const idParam = searchParams.get('id');
    // Usa o ?q= capturado no mount como fallback para o caso em que
    // isUserLoading retarda o effect e o Next.js já limpou searchParams
    const queryParam = searchParams.get('q') ?? initialQueryRef.current;

    if (user && idParam && messages.length === 0) {
      setTimeout(() => { void loadSession(idParam); }, 0);
      return;
    }

    if (queryParam) {
      hasProcessedQuery.current = true;
      initialQueryRef.current = null; // evita reprocessamento
      const question = decodeURIComponent(queryParam);
      router.replace('/chat');
      setTimeout(() => { void sendMessage(question); }, 0);
      return;
    }

    if (messages.length === 0 && !idParam) {
      if (!user) {
        const stored = loadGuestHistory();
        if (stored.length > 0) {
          setTimeout(() => setMessages(stored), 0);
          return;
        }
      }
    }
  }, [isClient, isUserLoading, user, searchParams, messages.length, loadSession, loadGuestHistory, router, sendMessage]);

  if (!isClient) {
    return <div className="min-h-screen w-full bg-[#07040D]" />;
  }

  return (
    <ChatLayout isDarkTheme={isDark}>
      <div className="flex flex-row h-screen w-full overflow-hidden">
        <AppSidebar
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          isDarkTheme={isDark}
          onToggleTheme={toggleTheme}
          onNewConversation={handleNewConversation}
          activeChatId={sessionId}
        />

        <div className="flex-1 h-screen flex flex-col min-w-0 relative">
          <ChatHeader
            onNewConversation={handleNewConversation}
            onToggleSidebar={handleToggleSidebar}
            isDarkTheme={isDark}
            user={user}
          />

          <div className="flex-1 flex flex-col justify-between min-h-0 w-full max-w-4xl mx-auto">
            <MessageList
              messages={messages}
              isLoading={isLoading}
              error={error ? { message: error } : null}
              isDarkTheme={isDark}
              scrollRef={scrollRef}
              newestAssistantRef={newestAssistantRef}
              showScrollButton={showScrollButton}
              scrollToBottom={scrollToBottom}
              handleScroll={handleScroll}
            />

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
