"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function PresentationPage() {
  const router = useRouter();
  const [particles, setParticles] = useState<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
  }[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleComplete = useCallback(() => {
    localStorage.setItem("lumes_seen_splash", "true");
    router.push("/home");
  }, [router]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { clientWidth, clientHeight } = document.documentElement;
    const x = (e.clientX / clientWidth) - 0.5;
    const y = (e.clientY / clientHeight) - 0.5;
    setMousePos({ x, y });
  }, []);

  // Gera as particulas flutuantes no lado do cliente baseado no tamanho da tela
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      const isDesktop = window.innerWidth >= 1024;
      const count = isDesktop ? 60 : 40;
      setParticles(
        Array.from({ length: count }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          duration: Math.random() * 3 + 4,
          delay: Math.random() * 2,
        }))
      );
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  // Redireciona automaticamente apos 3.2 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      handleComplete();
    }, 3200);

    return () => clearTimeout(timer);
  }, [handleComplete]);

  return (
    <div
      onClick={handleComplete}
      onMouseMove={handleMouseMove}
      className="relative flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-[#0a0515] via-[#07040D] to-[#120821] overflow-hidden cursor-pointer select-none"
    >
      {/* Container com efeito Parallax sutil */}
      <motion.div
        animate={{
          x: mousePos.x * 50,
          y: mousePos.y * 50,
        }}
        transition={{ type: "spring", stiffness: 40, damping: 20 }}
        className="absolute inset-0 pointer-events-none z-0"
      >
        {/* Animated Gradient Orb - Top Left */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0.2, 0.3, 0.2],
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] lg:w-[650px] lg:h-[650px] rounded-full bg-gradient-to-tr from-purple-600 via-violet-500 to-indigo-600 blur-[100px] lg:blur-[140px] pointer-events-none"
        />

        {/* Animated Gradient Orb - Bottom Right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0.15, 0.25, 0.15],
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] lg:w-[550px] lg:h-[550px] rounded-full bg-gradient-to-bl from-fuchsia-600 via-purple-500 to-violet-600 blur-[90px] lg:blur-[120px] pointer-events-none"
        />
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, y: 0 }}
            animate={{
              opacity: [0, 0.8, 0],
              y: [-20, -100],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeOut",
            }}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            className="absolute rounded-full"
          >
            <div
              className="w-full h-full rounded-full bg-violet-300"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                boxShadow: `0 0 ${particle.size * 2}px rgba(167, 139, 250, 0.8)`,
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Radial Light Burst */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{
          opacity: [0, 0.35, 0],
          scale: [0.8, 1.5, 0.8],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none z-[5]"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
        }}
      />

      {/* Decorative Rotating Circles */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.2, 1],
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-10 right-10 w-20 h-20 border-2 border-violet-500/20 rounded-full pointer-events-none z-[5]"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.3, 1],
          rotate: -360,
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-20 left-10 w-16 h-16 border-2 border-purple-500/30 rounded-full pointer-events-none z-[5]"
      />

      {/* Main Logo + Brand Container */}
      <div className="relative z-20 flex flex-col items-center">
        {/* Animated Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.3, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            mass: 0.8,
            delay: 0.2,
          }}
          className="relative mb-2"
        >
          {/* Logo Glow Effect - Elegant Pale Violet & White Silhouette Halo */}
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.25, 0.45, 0.25],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 via-violet-300/20 to-transparent blur-3xl"
          />

          {/* Logo Image */}
          <motion.div
            className="relative w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] md:w-[300px] md:h-[300px] lg:w-[380px] lg:h-[380px]"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src="/lumes_logo.png"
              alt="Lumes AI Logo"
              fill
              priority
              className="object-contain drop-shadow-2xl"
              sizes="(max-width: 640px) 180px, (max-width: 768px) 240px, (max-width: 1024px) 300px, 380px"
            />
          </motion.div>
        </motion.div>

        {/* Brand Name — Premium Unified Typography (Geist Sans) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex items-baseline gap-3 sm:gap-4 font-geist font-extrabold uppercase"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-b from-white via-zinc-100 to-violet-300 bg-clip-text text-transparent leading-none tracking-[0.25em] mr-[-0.25em]">
            LUMES
          </h1>
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-violet-400 font-extrabold tracking-[0.25em]"
          >
            AI
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
}