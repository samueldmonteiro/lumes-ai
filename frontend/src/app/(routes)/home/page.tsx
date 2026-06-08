'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  PanelLeft,
  FileText,
  SquarePen,
  Coffee,
  Calendar,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChatInput } from '@/components/molecules/ChatInput';
import { AppSidebar } from '@/components/organisms/AppSidebar';
import { useChatTheme } from '@/features/chat/hooks/useChatTheme';
import { useUser } from '@/hooks/queries/use-auth';

export default function HomePage() {
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const { isDark, toggleTheme } = useChatTheme();
  const { user, isLoading: isUserLoading } = useUser();

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      router.push(`/chat?q=${encodeURIComponent(input.trim())}`);
    }
  }, [input, router]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const handleSuggestionClick = useCallback((text: string) => {
    setInput(text);
  }, []);

  const handleNewConversation = useCallback(() => {
    setInput('');
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const suggestions = useMemo(() => [
    {
      id: 'suggestion-1',
      icon: <FileText className={cn('w-[18px] h-[18px]', isDark ? 'text-zinc-500' : 'text-zinc-400')} />,
      text: 'Melhores faculdades de direito em São Luis',
    },
    {
      id: 'suggestion-2',
      icon: <SquarePen className={cn('w-[18px] h-[18px]', isDark ? 'text-zinc-500' : 'text-zinc-400')} />,
      text: 'Qual o valor da mensalidade de medicina em 2026?',
    },
    {
      id: 'suggestion-3',
      icon: <Coffee className={cn('w-[18px] h-[18px]', isDark ? 'text-zinc-500' : 'text-zinc-400')} />,
      text: 'Qual curso combina mais comigo?',
    },
    {
      id: 'suggestion-4',
      icon: <Calendar className={cn('w-[18px] h-[18px]', isDark ? 'text-zinc-500' : 'text-zinc-400')} />,
      text: 'Cronograma de estudos para o ENEM',
    },
  ], [isDark]);

  return (
    <div
      className={cn(
        'relative min-h-screen w-full flex overflow-hidden transition-colors duration-500',
        isDark ? 'bg-[#07040D]' : 'bg-[#F4F4F6]',
      )}
    >
      {/* Sidebar responsiva — desktop fixa, mobile em sheet */}
      <AppSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        isDarkTheme={isDark}
        onToggleTheme={toggleTheme}
        onNewConversation={handleNewConversation}
      />

      {/* Fundo pontilhado decorativo */}
      <div
        className={cn(
          'absolute inset-0 pointer-events-none',
          isDark ? 'opacity-20' : 'opacity-10',
        )}
        style={{
          backgroundImage: isDark
            ? 'radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.15) 1px, transparent 0)'
            : 'radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.08) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Orbes brilhantes decorativos */}
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

      {/* Área de conteúdo principal */}
      <div
        className={cn(
          'relative z-10 flex-1 h-screen flex flex-col justify-between py-6 px-5 sm:px-8 transition-colors duration-500',
          isDark ? 'text-white' : 'text-zinc-900',
        )}
      >
        {/* Barra superior */}
        <header className="flex items-center justify-between w-full shrink-0">
          {/* Botão de abrir sidebar (apenas mobile) */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className={cn(
              'p-2 -ml-2 rounded-xl transition-colors duration-200 active:scale-95 cursor-pointer lg:hidden',
              isDark
                ? 'text-zinc-400 hover:text-white'
                : 'text-zinc-500 hover:text-zinc-800',
            )}
          >
            <PanelLeft className="w-[22px] h-[22px] stroke-[1.8]" />
          </button>

          {/* Espaçador para empurrar botão Entrar à direita */}
          <div className="hidden lg:block" />

          {/* Botão Entrar (lado direito) */}
          {!isUserLoading && !user && (
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="px-5 py-2 text-xs font-bold text-white rounded-full bg-linear-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] shadow-md transition-all duration-300 hover:scale-[1.03] hover:shadow-lg active:scale-[0.97] cursor-pointer"
            >
              Entrar
            </button>
          )}
        </header>

        {/* Container central que alinha o conteúdo vertical e horizontalmente */}
        <div className="flex-1 flex flex-col lg:justify-center items-center w-full max-w-[720px] mx-auto my-auto py-8">
          {/* Título e subtítulo da marca */}
          <div className="flex-1 lg:flex-none flex flex-col justify-center items-center text-center select-none lg:mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-4xl md:text-5xl font-extrabold tracking-[0.25em] uppercase font-geist"
            >
              <span className={cn(isDark ? 'text-white' : 'text-zinc-800')}>LUMES</span>
              <span className="text-violet-500 ml-3 sm:ml-4">AI</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className={cn(
                'text-sm md:text-base font-semibold mt-2 tracking-wide',
                isDark ? 'text-[#8B5CF6]' : 'text-violet-600',
              )}
            >
              Olá! Boa tarde
            </motion.p>
          </div>

          {/* Bloco inferior: sugestões e input de chat */}
          <div className="w-full flex flex-col gap-6 mt-auto lg:mt-0">
            {/* Bloco de sugestões */}
            <div className="w-full flex flex-col gap-3">
              <h2
                className={cn(
                  'text-[10px] sm:text-xs font-semibold tracking-wider select-none uppercase px-1.5',
                  isDark ? 'text-zinc-500' : 'text-zinc-400',
                )}
              >
                Sugestões para você
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 w-full">
                {suggestions.map((sug: { id: string; icon: React.JSX.Element; text: string; }, idx: number) => (
                  <motion.button
                    key={sug.id}
                    type="button"
                    onClick={() => handleSuggestionClick(sug.text)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.015, y: -2 }}
                    whileTap={{ scale: 0.985 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                      delay: 0.1 + idx * 0.05,
                    }}
                    className={cn(
                      'flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all duration-300 text-left text-xs font-semibold cursor-pointer',
                      isDark
                        ? 'border-zinc-800/60 bg-[#12121a] text-zinc-300 hover:bg-[#191925] hover:border-[#8b5cf6]/40 hover:text-white'
                        : 'border-zinc-200/80 bg-white text-zinc-600 hover:bg-violet-50/60 hover:border-violet-300/50 hover:text-zinc-800 shadow-sm',
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
    </div>
  );
}
