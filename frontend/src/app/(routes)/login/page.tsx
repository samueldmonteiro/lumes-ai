"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useChatTheme } from "@/features/chat/hooks/useChatTheme";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { isDark } = useChatTheme();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid) {
      setEmailError("Por favor, insira um e-mail válido.");
      return;
    }
    setEmailError("");
    setStep(2);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setPasswordError("");
    setIsLoading(true);

    try {
      // Simulate API Login (as requested, only frontend)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Save splash status just in case
      localStorage.setItem("lumes_seen_splash", "true");

      // Redirect to home upon successful login simulation
      router.push("/home");
    } catch {
      setServerError("Ocorreu um erro ao entrar. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-geist transition-colors duration-500",
        isDark ? "bg-[#07040D] text-white" : "bg-[#F4F4F6] text-zinc-900"
      )}
    >
      {/* Light Pattern Overlay */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none",
          isDark ? "opacity-20" : "opacity-10"
        )}
        style={{
          backgroundImage: isDark
            ? "radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.15) 1px, transparent 0)"
            : "radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.08) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Decorative Glowing Orbs */}
      <div
        className={cn(
          "absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full blur-[120px] pointer-events-none",
          isDark ? "bg-violet-600/10" : "bg-violet-300/15"
        )}
      />
      <div
        className={cn(
          "absolute bottom-[-10%] left-[-5%] w-80 h-80 rounded-full blur-[100px] pointer-events-none",
          isDark ? "bg-fuchsia-600/10" : "bg-fuchsia-300/10"
        )}
      />

      {/* Floating Back to Home button at Top-Left */}
      <div className="absolute top-5 left-5 z-50">
        <Link href="/home">
          <motion.button
            whileHover={{ scale: 1.05, x: -3 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 rounded-full border transition-colors text-xs font-semibold cursor-pointer duration-300 shadow-sm",
              isDark
                ? "border-zinc-800 bg-zinc-950/40 hover:bg-zinc-800/40 text-zinc-400 hover:text-white"
                : "border-zinc-200 bg-white/70 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800"
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para o Início</span>
          </motion.button>
        </Link>
      </div>

      <main className="w-full max-w-[420px] z-10 flex flex-col items-center">
        {/* Core Card Container */}
        <div
          className={cn(
            "w-full rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl flex flex-col transition-all duration-300 border",
            isDark
              ? "bg-[#120D1F]/50 border-zinc-800/60"
              : "bg-white/80 border-zinc-200/80 shadow-lg"
          )}
        >
          {/* Brand Logo Header */}
          <div className="flex flex-col items-center mb-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 150 }}
              className="relative w-24 h-24 mb-1"
            >
              {/* Glow Behind Logo */}
              <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-xl" />
              <Image
                src="/lumes_logo.png"
                alt="Lumes AI Logo"
                fill
                priority
                className="object-contain drop-shadow-md"
                sizes="96px"
              />
            </motion.div>

            <div className="flex items-center gap-2 uppercase font-extrabold tracking-[0.2em] text-xl mt-2 select-none">
              <span className={cn(isDark ? "text-white" : "text-zinc-800")}>
                Lumes
              </span>
              <span className="text-violet-400">AI</span>
            </div>
          </div>

          {/* Heading */}
          <div className="flex flex-col items-center text-center mb-6">
            <h2
              className={cn(
                "text-2xl font-black leading-tight uppercase tracking-wider",
                isDark ? "text-white" : "text-zinc-800"
              )}
            >
              {step === 1 ? "Olá!" : "Senha"}
            </h2>
            <p
              className={cn(
                "text-xs mt-1",
                isDark ? "text-zinc-400" : "text-zinc-500"
              )}
            >
              {step === 1
                ? "Acesse sua conta para continuar"
                : "Insira sua senha de acesso"}
            </p>
          </div>

          {/* Step-by-Step Forms Container */}
          <div className="relative w-full overflow-hidden">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleNextStep}
                  className="flex flex-col gap-5 w-full"
                >
                  {/* Email Input Field */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="email"
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-widest",
                        isDark ? "text-zinc-400" : "text-zinc-500"
                      )}
                    >
                      E-mail
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
                      <input
                        id="email"
                        type="email"
                        placeholder="exemplo@email.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError("");
                          if (serverError) setServerError("");
                        }}
                        className={cn(
                          "w-full h-12 pl-12 pr-4 border focus:border-violet-500/80 rounded-xl font-geist focus:ring-4 outline-none transition-all duration-300",
                          isDark
                            ? "bg-zinc-950/70 border-zinc-800/80 text-white placeholder-zinc-600 focus:ring-violet-500/10"
                            : "bg-zinc-100/80 border-zinc-200 text-zinc-800 placeholder-zinc-400 focus:ring-violet-500/15"
                        )}
                        required
                      />
                    </div>
                    {emailError && (
                      <p className="text-xs text-rose-500 font-medium animate-in fade-in">
                        {emailError}
                      </p>
                    )}
                  </div>

                  {/* Continue Button */}
                  <button
                    type="submit"
                    disabled={!isEmailValid}
                    className="h-12 w-full bg-violet-600 text-white rounded-xl font-bold flex items-center justify-center gap-1 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-600/20 active:scale-[0.98] transition-all disabled:opacity-40 disabled:grayscale disabled:pointer-events-none cursor-pointer duration-300"
                  >
                    Continuar
                    <ChevronRight className="w-5 h-5" />
                  </button>


                </motion.form>
              ) : (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleLogin}
                  className="flex flex-col gap-5 w-full"
                >
                  {/* Account Badge Indicator */}
                  <div
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border",
                      isDark
                        ? "bg-violet-950/20 border-violet-500/10"
                        : "bg-violet-50 border-violet-200/60"
                    )}
                  >
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[9px] uppercase font-bold text-violet-400 tracking-wider">
                        Acessando como
                      </span>
                      <span
                        className={cn(
                          "text-xs font-semibold truncate",
                          isDark ? "text-white" : "text-zinc-800"
                        )}
                      >
                        {email}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setPassword("");
                        setPasswordError("");
                      }}
                      className="p-1.5 hover:bg-violet-500/10 rounded-lg text-violet-400 transition-colors cursor-pointer"
                      title="Alterar e-mail"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Password Input Field */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label
                        htmlFor="password"
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-widest",
                          isDark ? "text-zinc-400" : "text-zinc-500"
                        )}
                      >
                        Senha
                      </label>
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setServerError("Lógica de recuperação não integrada no frontend.");
                        }}
                        className="text-[10px] font-bold text-violet-400 hover:underline"
                      >
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (passwordError) setPasswordError("");
                          if (serverError) setServerError("");
                        }}
                        className={cn(
                          "w-full h-12 pl-12 pr-12 border focus:border-violet-500/80 rounded-xl font-geist focus:ring-4 outline-none transition-all duration-300",
                          isDark
                            ? "bg-zinc-950/70 border-zinc-800/80 text-white placeholder-zinc-600 focus:ring-violet-500/10"
                            : "bg-zinc-100/80 border-zinc-200 text-zinc-800 placeholder-zinc-400 focus:ring-violet-500/15"
                        )}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-violet-400 transition-colors cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-xs text-rose-500 font-medium animate-in fade-in">
                        {passwordError}
                      </p>
                    )}
                  </div>

                  {/* Server errors */}
                  {serverError && (
                    <div
                      className={cn(
                        "p-3 border rounded-xl animate-in fade-in",
                        isDark
                          ? "bg-rose-950/30 border-rose-500/20"
                          : "bg-rose-50 border-rose-200"
                      )}
                    >
                      <p className="text-xs text-rose-400 font-medium text-center">
                        {serverError}
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || password.length < 6}
                    className="h-12 w-full bg-violet-600 text-white rounded-xl font-bold flex items-center justify-center gap-1 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-600/20 active:scale-[0.98] transition-all disabled:opacity-40 disabled:grayscale disabled:pointer-events-none cursor-pointer duration-300"
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Entrar na conta"
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Signup Footer Link */}
        <div className="text-center mt-6 z-10">
          <p
            className={cn(
              "text-xs font-geist",
              isDark ? "text-zinc-400" : "text-zinc-500"
            )}
          >
            Ainda não tem conta?{" "}
            <Link
              className="font-bold text-violet-400 hover:underline transition-all hover:text-violet-300"
              href="/cadastro"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
