'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  isDarkTheme: boolean;
  className?: string;
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  isDarkTheme,
  className,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Ajusta automaticamente a altura do textarea conforme o conteúdo
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      // Mantém altura entre 40px e 120px
      textarea.style.height = `${Math.min(Math.max(scrollHeight, 40), 120)}px`;
    }
  }, [input]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isLoading || !input.trim()) return;

      // Envia o formulário pai
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    }
  }, [input, isLoading]);

  return (
    <div className={cn('w-full flex-shrink-0 relative z-25 px-4 pb-4 pt-2', className)}>
      <form ref={formRef} onSubmit={handleSubmit} className="w-full">
        <div
          className={cn(
            'flex items-end gap-2 p-1.5 pl-5 rounded-[20px] border transition-all duration-300 relative',
            isDarkTheme
              ? 'bg-[#0E0A1A]/95 border-zinc-800/80 focus-within:border-violet-500/50 focus-within:shadow-[0_0_20px_rgba(139,92,246,0.22)]'
              : 'bg-white border-zinc-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.06)] focus-within:border-violet-400/60 focus-within:shadow-[0_4px_24px_rgba(139,92,246,0.12)]',
          )}
        >
          {/* Campo de input com redimensionamento automático */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua dúvida"
            disabled={isLoading}
            className={cn(
              'flex-1 text-sm bg-transparent outline-none border-none py-2 pr-1 placeholder:text-zinc-500 resize-none max-h-[120px] scrollbar-thin transition-colors duration-300 font-sans min-h-[40px] leading-relaxed self-center',
              isDarkTheme ? 'text-white' : 'text-zinc-800',
            )}
          />

          {/* Botão de envio */}
          <motion.button
            whileHover={input.trim() && !isLoading ? { scale: 1.05 } : {}}
            whileTap={input.trim() && !isLoading ? { scale: 0.95 } : {}}
            type="submit"
            disabled={isLoading || !input.trim()}
            className={cn(
              'p-2.5 rounded-full mb-0.5 flex items-center justify-center transition-all duration-300',
              input.trim() && !isLoading
                ? 'cursor-pointer'
                : 'opacity-40 cursor-not-allowed',
              isDarkTheme
                ? 'bg-white text-[#0B0813] hover:bg-zinc-100'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white',
            )}
          >
            <Send className="w-4 h-4 stroke-[2.4] translate-x-[0.5px] -translate-y-[0.5px]" />
          </motion.button>
        </div>
      </form>
    </div>
  );
}
