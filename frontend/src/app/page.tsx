"use client";

import { useEffect, useRef, useState } from "react";
import { Send, ArrowDown } from "lucide-react";
import { useChat } from "ai/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: "Olá! Sou o **Lumes AI**, seu assistente de estudos. Como posso ajudar você hoje?",
      },
    ],
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Função para scroll suave controlado
  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end"
        });
      }
    }, 100);
  };

  // Monitorar o scroll para mostrar/esconder o botão
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 100;
    setShowScrollButton(!isAtBottom);
  };

  // Scroll apenas quando uma NOVA mensagem é adicionada (pelo usuário ou início da resposta)
  // mas não durante o streaming da resposta
  const prevMessagesCount = useRef(messages.length);

  useEffect(() => {
    if (messages.length > prevMessagesCount.current) {
      scrollToBottom();
    }
    prevMessagesCount.current = messages.length;
  }, [messages.length]);

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4 md:p-6 overflow-hidden">
      <header className="mb-6 flex-shrink-0">
        <h1 className="text-3xl font-bold text-primary tracking-tight">Lumes AI</h1>
        <p className="text-muted-foreground">Assistente Inteligente para Estudantes</p>
      </header>

      <div className="flex-1 relative overflow-hidden flex flex-col min-h-0">
        <div 
          className="flex-1 border rounded-xl bg-card shadow-inner overflow-y-auto scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent"
          onScroll={handleScroll}
        >
          <div className="flex flex-col gap-6 p-6 min-h-full">
            <AnimatePresence mode="popLayout" initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  layout="position"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    layout: { type: "spring", stiffness: 350, damping: 35 },
                    opacity: { duration: 0.2 },
                    y: { type: "spring", stiffness: 350, damping: 35 }
                  }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-[85%] shadow-sm ${message.role === "user"
                        ? "bg-primary text-primary-foreground px-4 py-2 rounded-2xl rounded-tr-sm"
                        : "bg-muted/40 p-4 rounded-2xl rounded-tl-sm w-full border border-border/50"
                      }`}
                  >
                    {message.role === "user" ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <MarkdownRenderer content={message.content} />
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && messages[messages.length - 1]?.role === "user" && !error && (
              <motion.div
                layout="position"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-muted/40 p-4 rounded-2xl rounded-tl-sm w-full border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground h-6">
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      className="w-1.5 h-1.5 rounded-full bg-current"
                    />
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                      className="w-1.5 h-1.5 rounded-full bg-current"
                    />
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.4 }}
                      className="w-1.5 h-1.5 rounded-full bg-current"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center"
              >
                <div className="bg-destructive/10 text-destructive text-sm px-4 py-2 rounded-lg border border-destructive/20 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                  {error.message || "Erro de conexão. Tente novamente."}
                </div>
              </motion.div>
            )}

            <div ref={scrollRef} className="h-4 w-full flex-shrink-0" />
          </div>
        </div>

        <AnimatePresence>
          {showScrollButton && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
            >
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full shadow-lg border border-border bg-background/80 backdrop-blur-sm hover:bg-accent transition-all"
                onClick={scrollToBottom}
              >
                <ArrowDown className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Digite sua dúvida aqui..."
            disabled={isLoading}
            className="flex-1 bg-background/50 backdrop-blur-sm transition-all focus:ring-2 focus:ring-primary/20"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="transition-transform active:scale-95"
          >
            <Send className="w-4 h-4 mr-2" />
            Enviar
          </Button>
        </form>
      </div>
    </div>
  );
}
