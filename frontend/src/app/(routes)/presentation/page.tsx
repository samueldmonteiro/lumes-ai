'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function PresentationPage() {
  const router = useRouter();

  const handleComplete = useCallback(() => {
    localStorage.setItem('lumes_seen_splash', 'true');
    router.push('/home');
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleComplete();
    }, 4500);
    return () => clearTimeout(timer);
  }, [handleComplete]);

  return (
    <div
      onClick={handleComplete}
      className="relative flex flex-col items-center justify-center min-h-screen w-full bg-[#07040D] overflow-hidden cursor-pointer select-none"
    >
      {/* Floating tech particles - System Palette (Violet) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => {
          const duration = 5 + (i * 0.25) % 5;
          const delay = (i * 0.3) % 5;
          const left = `${(i * 17) % 100}%`;
          return (
            <motion.div
              key={`v1-p-${i}`}
              initial={{ y: '110vh', opacity: 0 }}
              animate={{ y: '-10vh', opacity: [0, 0.5, 0] }}
              transition={{ duration, repeat: Infinity, delay }}
              className="absolute w-1 h-1 bg-violet-400 rounded-full blur-[1px]"
              style={{ left }}
            />
          );
        })}
      </div>

      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center gap-8">
        
        {/* Logo Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
        >
          <Image
            src="/lumes_logo.png"
            alt="Lumes AI Logo"
            fill
            priority
            unoptimized
            className="object-contain relative z-10 drop-shadow-2xl"
            sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 192px"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-geist font-black tracking-[0.3em] uppercase flex items-center">
            <span className="text-white">LUMES</span>
            <span className="text-violet-500 ml-3 sm:ml-4">AI</span>
          </h1>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
            className="mt-3 sm:mt-4 text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] text-violet-400/60 uppercase font-semibold"
          >
            Inteligência Artificial
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}