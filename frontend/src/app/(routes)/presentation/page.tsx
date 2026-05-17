"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function PresentationPage() {
  const router = useRouter();

  const handleComplete = useCallback(() => {
    localStorage.setItem("lumes_seen_splash", "true");
    router.push("/home");
  }, [router]);

  // Automatically trigger transition after 3.2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleComplete();
    }, 3200);

    return () => clearTimeout(timer);
  }, [handleComplete]);

  return (
    <div 
      onClick={handleComplete}
      className="relative flex flex-col items-center justify-center min-h-screen w-full bg-[#07040D] overflow-hidden cursor-pointer select-none"
    >
      {/* Dynamic Ambient Background Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: [0.15, 0.25, 0.15],
          scale: [1, 1.15, 1],
        }}
        transition={{
          opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-pink-500 blur-[80px] md:blur-[120px] pointer-events-none z-0"
      />

      {/* Subtle Noise / Grid Pattern Overlay for Premium Depth */}
      <div 
        className="absolute inset-0 bg-cover opacity-[0.02] pointer-events-none z-0 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Main Logo Container */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 90,
            damping: 18,
            mass: 0.8,
            delay: 0.1,
          }}
          className="relative drop-shadow-[0_0_35px_rgba(139,92,246,0.3)]"
        >
          {/* Logo Image */}
          <div className="w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] md:w-[320px] md:h-[320px] relative transition-transform duration-500 hover:scale-105 active:scale-95">
            <Image
              src="/logo_lumes.png"
              alt="Lumes AI Logo"
              fill
              priority
              className="object-contain"
              sizes="(max-width: 640px) 180px, (max-width: 768px) 240px, 320px"
            />
          </div>
        </motion.div>

        {/* Shimmering Progress Bar / Loader */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="flex flex-col items-center gap-2 mt-4"
        >
          <div className="w-32 h-[3px] bg-white/10 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ left: "-100%" }}
              animate={{ left: "100%" }}
              transition={{
                repeat: Infinity,
                duration: 1.6,
                ease: "easeInOut",
              }}
              className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-violet-400 to-transparent"
            />
          </div>
          <motion.span 
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-[10px] tracking-[0.25em] uppercase text-violet-300 font-semibold text-center select-none mt-1"
          >
            Carregando Universo
          </motion.span>
        </motion.div>
      </div>

      {/* Floating Bottom Prompt */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 z-10 text-[11px] text-white/40 font-medium tracking-wide pointer-events-none"
      >
        Toque em qualquer lugar para pular
      </motion.div>
    </div>
  );
}
