'use client';

import { PanelLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AdminSidebar, type AdminTab } from '@/components/organisms/AdminSidebar';
import { useChatTheme } from '@/features/chat/hooks/useChatTheme';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  sidebarOpen: boolean;
  onSidebarOpen: () => void;
  onSidebarClose: () => void;
}

export function AdminLayout({
  children,
  activeTab,
  onTabChange,
  sidebarOpen,
  onSidebarOpen,
  onSidebarClose,
}: AdminLayoutProps) {
  const { isDark, toggleTheme } = useChatTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen w-full flex overflow-hidden transition-colors duration-500 bg-background"
    >
      {/* Padrão de fundo pontilhado */}
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

      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={onSidebarClose}
        isDarkTheme={isDark}
        onToggleTheme={toggleTheme}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />

      <div className="relative z-10 flex-1 h-screen flex flex-col overflow-hidden transition-colors duration-500 text-foreground">
        {/* Cabeçalho mobile com botão de sidebar */}
        <header className="flex items-center justify-between px-5 py-3 shrink-0 lg:hidden">
          <button
            type="button"
            onClick={onSidebarOpen}
            className={cn(
              'p-2 -ml-2 rounded-xl transition-colors duration-200 active:scale-95 cursor-pointer text-muted-foreground hover:text-foreground',
            )}
          >
            <PanelLeft className="w-[22px] h-[22px] stroke-[1.8]" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-5 sm:px-8 py-6">
          {children}
        </main>
      </div>
    </motion.div>
  );
}
