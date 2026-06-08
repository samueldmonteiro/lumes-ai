'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Upload,
  FileText,
  ArrowLeft,
  Sun,
  Moon,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export type AdminTab = 'dashboard' | 'upload' | 'documents';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

const NAV_ITEMS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4 stroke-[1.8]" /> },
  { id: 'upload', label: 'Upload', icon: <Upload className="w-4 h-4 stroke-[1.8]" /> },
  { id: 'documents', label: 'Documentos', icon: <FileText className="w-4 h-4 stroke-[1.8]" /> },
];

export function AdminSidebar({
  isOpen,
  onClose,
  isDarkTheme,
  onToggleTheme,
  activeTab,
  onTabChange,
}: AdminSidebarProps) {
  const router = useRouter();
  const userInitial = 'A';

  const renderContent = () => (
    <div className="w-full h-full flex flex-col bg-transparent">
      <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
        <div className="flex items-center gap-2.5 select-none">
          <div className="relative w-[30px] h-[30px]">
            <Image
              src="/lumes_logo.png"
              alt="Lumes AI Logo"
              fill
              unoptimized
              className="object-contain"
              sizes="30px"
            />
          </div>
          <span
            className={cn(
              'text-sm font-extrabold tracking-[0.15em] font-geist leading-none m-0',
              'text-sidebar-foreground',
            )}
          >
              LUMES <span className="text-violet-400">ADM</span>
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggleTheme}
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer text-sidebar-foreground/60 hover:text-amber-300 hover:bg-sidebar-accent',
            isDarkTheme ? 'hover:text-amber-300' : 'hover:text-amber-600',
          )}
          title={isDarkTheme ? 'Modo Claro' : 'Modo Escuro'}
        >
          <AnimatePresence mode="wait">
            {isDarkTheme ? (
              <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Sun className="w-[18px] h-[18px] stroke-[1.8]" />
              </motion.div>
            ) : (
              <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Moon className="w-[18px] h-[18px] stroke-[1.8]" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <div className="px-4 pb-2">
        <Separator className="bg-sidebar-border" />
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-3 pt-2">
        {NAV_ITEMS.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onTabChange(item.id);
              onClose();
            }}
            className={cn(
              'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-300 cursor-pointer text-left group',
              activeTab === item.id
                ? isDarkTheme
                  ? 'bg-violet-500/15 text-violet-300'
                  : 'bg-violet-100 text-violet-700'
                : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground',
            )}
          >
            <div className={cn(
              'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
              activeTab === item.id
                ? isDarkTheme
                  ? 'bg-violet-500/20'
                  : 'bg-violet-200'
                : 'bg-sidebar-accent',
            )}>
              {item.icon}
            </div>
            <span className="text-[13px] font-semibold tracking-wide">{item.label}</span>
          </motion.button>
        ))}
      </nav>

      <div className="flex-shrink-0 px-4 pb-4 pt-2">
        <Separator className="mb-3 bg-sidebar-border" />
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/home')}
          className={cn(
            'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-300 cursor-pointer text-left group border border-sidebar-border text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground',
          )}
        >
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-sidebar-accent">
            <ArrowLeft className="w-4 h-4 stroke-[1.8]" />
          </div>
          <span className="text-[13px] font-semibold tracking-wide">Voltar ao App</span>
        </motion.button>

        <div className="flex items-center justify-between mt-3 px-1">
          <div className="flex items-center gap-2.5">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold select-none',
              isDarkTheme
                ? 'bg-gradient-to-br from-violet-500/30 to-indigo-500/30 text-violet-300 border border-violet-500/20'
                : 'bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-700 border border-violet-200/60',
            )}>
              {userInitial}
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold leading-tight truncate max-w-[140px] text-sidebar-foreground">
                Admin
              </span>
              <span className="text-[10px] leading-tight text-sidebar-foreground/60">
                Painel Administrativo
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-[240px] h-screen shrink-0 relative z-20 border-r border-sidebar-border transition-colors duration-500 overflow-y-auto bg-sidebar">
        {renderContent()}
      </aside>
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={onClose}>
          <SheetContent
            side="left"
            showCloseButton={false}
            className={cn(
              'w-[240px] sm:max-w-[240px] p-0 flex flex-col border-r-0 overflow-y-auto bg-sidebar/98 backdrop-blur-xl',
            )}
          >
            <SheetTitle className="sr-only">Menu Administrativo</SheetTitle>
            {renderContent()}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
