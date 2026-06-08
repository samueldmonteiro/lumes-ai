'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PanelLeft, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import type { User } from '@/types/user.type';

interface ChatHeaderProps {
  onNewConversation: () => void;
  onToggleSidebar: () => void;
  isDarkTheme: boolean;
  user: User | null;
}

export function ChatHeader({
  onNewConversation,
  onToggleSidebar,
  isDarkTheme,
  user,
}: ChatHeaderProps) {
  const router = useRouter();

  const userInitial = useMemo(
    () => (user?.name ?? 'U').charAt(0).toUpperCase(),
    [user],
  );

  return (
    <header
      className={cn(
        'relative z-20 flex items-center justify-between px-4 py-2.5 w-full shrink-0 border-b transition-colors duration-500',
        isDarkTheme ? 'border-zinc-800/60' : 'border-zinc-200',
      )}
    >
      {/* Marca e controle da sidebar */}
      <div className="flex items-center gap-3">
        {/* Botão de abrir/fechar sidebar */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleSidebar}
          className={cn(
            'p-2 rounded-xl transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center lg:hidden',
            isDarkTheme
              ? 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
              : 'text-zinc-600 hover:bg-zinc-200/50 hover:text-zinc-900',
          )}
          title="Menu"
        >
          <PanelLeft className="w-[22px] h-[22px] stroke-[1.8]" />
        </motion.button>

        {/* Logo e nome lado a lado */}
        <div className="flex items-center gap-2 select-none">
          <div className="relative w-[28px] h-[28px]">
            <Image
              src="/lumes_logo.png"
              alt="Lumes AI Logo"
              fill
              unoptimized
              className="object-contain"
              sizes="28px"
            />
          </div>
          <span
            className={cn(
              'text-sm font-extrabold tracking-[0.15em] font-geist leading-none',
              isDarkTheme ? 'text-white' : 'text-zinc-800',
            )}
          >
            LUMES <span className="text-violet-500">AI</span>
          </span>
        </div>
      </div>

      {/* Controles do lado direito */}
      <div className="flex items-center gap-3">
        {/* Informações do usuário / Login */}
        {user ? (
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold select-none',
                isDarkTheme
                  ? 'bg-linear-to-br from-violet-500/30 to-indigo-500/30 text-violet-300 border border-violet-500/20'
                  : 'bg-linear-to-br from-violet-100 to-indigo-100 text-violet-700 border border-violet-200/60',
              )}
            >
              {userInitial}
            </div>
            <span
              className={cn(
                'hidden sm:block text-[13px] font-semibold leading-tight truncate max-w-[120px]',
                isDarkTheme ? 'text-zinc-200' : 'text-zinc-700',
              )}
            >
              {user.name}
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="px-4 py-1.5 text-[11px] font-bold text-white rounded-full bg-linear-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] shadow-md transition-all duration-300 hover:scale-[1.03] hover:shadow-lg active:scale-[0.97] cursor-pointer"
          >
            Entrar
          </button>
        )}

        {/* Botão de nova conversa */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onNewConversation}
          className={cn(
            'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-sm select-none border',
            isDarkTheme
              ? 'border-zinc-800 text-zinc-400 bg-zinc-900/60 hover:bg-zinc-800/80 hover:text-white hover:border-zinc-700 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]'
              : 'border-zinc-200 text-zinc-650 bg-white hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-300',
          )}
          title="Nova Conversa"
        >
          <Plus className="w-[19px] h-[19px] stroke-[2.5]" />
        </motion.button>
      </div>
    </header>
  );
}
