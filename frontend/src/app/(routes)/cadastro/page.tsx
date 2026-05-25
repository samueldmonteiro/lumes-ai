"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronRight, Eye, EyeOff, Lock, Mail, User, ShieldCheck, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isAdult, setIsAdult] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (name.trim().length < 3) {
        setNameError("O nome deve ter pelo menos 3 caracteres.");
        return;
      }
      setNameError("");
      setStep(2);
    } else if (step === 2) {
      if (!isEmailValid) {
        setEmailError("Por favor, insira um e-mail válido.");
        return;
      }
      setEmailError("");
      setStep(3);
    }
  };

  const handleBack = () => {
    setServerError("");
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setPasswordError("");

    if (password !== confirmPassword) {
      setConfirmPasswordError("As senhas não coincidem.");
      return;
    }
    setConfirmPasswordError("");
    
    // Valid password & matching -> trigger Terms Dialogue
    setShowTerms(true);
  };

  const handleConfirmRegistration = async () => {
    if (!acceptedTerms || !isAdult) return;
    setIsLoading(true);

    try {
      // Simulate API registration
      await new Promise((resolve) => setTimeout(resolve, 1800));
      
      // Complete signup -> automatically log user in & redirect
      localStorage.setItem("lumes_seen_splash", "true");
      router.push("/home");
    } catch {
      setServerError("Não foi possível criar a conta. Tente novamente.");
      setShowTerms(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#07040D] text-white min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-geist">
      {/* Light Pattern Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.15) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Decorative Glowing Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none" />

      <main className="w-full max-w-[420px] z-10 flex flex-col items-center">
        {/* Core Card Container */}
        <div className="w-full bg-[#120D1F]/50 rounded-3xl p-6 md:p-8 shadow-2xl border border-zinc-800/60 backdrop-blur-xl flex flex-col transition-all duration-300">
          
          {/* Brand Logo Header */}
          <div className="flex flex-col items-center mb-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
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
              <span className="text-white">Lumes</span>
              <span className="text-violet-400">AI</span>
            </div>
          </div>

          {/* Heading */}
          <div className="flex flex-col items-center text-center mb-6">
            <h2 className="text-2xl font-black text-white leading-tight uppercase tracking-wider">
              {step === 1 && "Crie sua conta"}
              {step === 2 && "E-mail"}
              {step === 3 && "Segurança"}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              {step === 1 && "Primeiro passo: Como devemos chamar você?"}
              {step === 2 && "Segundo passo: Seu e-mail de acesso"}
              {step === 3 && "Terceiro passo: Proteja sua conta"}
            </p>
          </div>

          {/* Wizard Forms Container */}
          <div className="relative w-full overflow-hidden">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleNextStep}
                  className="flex flex-col gap-5 w-full"
                >
                  {/* Name Input */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="name"
                      className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest"
                    >
                      Nome Completo
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
                      <input
                        id="name"
                        type="text"
                        placeholder="Digite seu nome"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (nameError) setNameError("");
                          if (serverError) setServerError("");
                        }}
                        className="w-full h-12 pl-12 pr-4 bg-zinc-950/70 border border-zinc-800/80 focus:border-violet-500/80 rounded-xl font-geist text-white placeholder-zinc-600 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all duration-300"
                        required
                        autoFocus
                      />
                    </div>
                    {nameError && (
                      <p className="text-xs text-rose-500 font-medium animate-in fade-in">
                        {nameError}
                      </p>
                    )}
                  </div>

                  {/* Continue Button */}
                  <button
                    type="submit"
                    disabled={name.trim().length < 3}
                    className="h-12 w-full bg-violet-600 text-white rounded-xl font-bold flex items-center justify-center gap-1 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-600/20 active:scale-[0.98] transition-all disabled:opacity-40 disabled:grayscale disabled:pointer-events-none cursor-pointer duration-300"
                  >
                    Continuar
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </motion.form>
              )}

              {step === 2 && (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleNextStep}
                  className="flex flex-col gap-5 w-full"
                >
                  {/* Back Indicator Info */}
                  <div className="flex items-center justify-between p-3 bg-violet-950/20 rounded-xl border border-violet-500/10">
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[9px] uppercase font-bold text-violet-400 tracking-wider">
                        Nome
                      </span>
                      <span className="text-xs font-semibold text-white truncate">
                        {name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleBack}
                      className="p-1.5 hover:bg-violet-500/10 rounded-lg text-violet-400 transition-colors cursor-pointer"
                      title="Voltar"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="email"
                      className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest"
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
                        className="w-full h-12 pl-12 pr-4 bg-zinc-950/70 border border-zinc-800/80 focus:border-violet-500/80 rounded-xl font-geist text-white placeholder-zinc-600 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all duration-300"
                        required
                        autoFocus
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
              )}

              {step === 3 && (
                <motion.form
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleFinalSubmit}
                  className="flex flex-col gap-5 w-full"
                >
                  {/* Back Indicator Info */}
                  <div className="flex items-center justify-between p-3 bg-violet-950/20 rounded-xl border border-violet-500/10">
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[9px] uppercase font-bold text-violet-400 tracking-wider">
                        E-mail
                      </span>
                      <span className="text-xs font-semibold text-white truncate">
                        {email}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleBack}
                      className="p-1.5 hover:bg-violet-500/10 rounded-lg text-violet-400 transition-colors cursor-pointer"
                      title="Voltar"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Password Input */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="password"
                      className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest"
                    >
                      Senha
                    </label>
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
                        className="w-full h-12 pl-12 pr-12 bg-zinc-950/70 border border-zinc-800/80 focus:border-violet-500/80 rounded-xl font-geist text-white placeholder-zinc-600 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all duration-300"
                        required
                        autoFocus
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

                  {/* Confirm Password Input */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="confirmPassword"
                      className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest"
                    >
                      Confirmar Senha
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (confirmPasswordError) setConfirmPasswordError("");
                          if (serverError) setServerError("");
                        }}
                        className="w-full h-12 pl-12 pr-12 bg-zinc-950/70 border border-zinc-800/80 focus:border-violet-500/80 rounded-xl font-geist text-white placeholder-zinc-600 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all duration-300"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-violet-400 transition-colors cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {confirmPasswordError && (
                      <p className="text-xs text-rose-500 font-medium animate-in fade-in">
                        {confirmPasswordError}
                      </p>
                    )}
                  </div>

                  {/* Server Error Displays */}
                  {serverError && (
                    <div className="p-3 bg-rose-950/30 border border-rose-500/20 rounded-xl animate-in fade-in">
                      <p className="text-xs text-rose-400 font-medium text-center">
                        {serverError}
                      </p>
                    </div>
                  )}

                  {/* Register Button */}
                  <button
                    type="submit"
                    disabled={password.length < 6 || confirmPassword.length < 6 || password !== confirmPassword}
                    className="h-12 w-full bg-violet-600 text-white rounded-xl font-bold flex items-center justify-center gap-1 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-600/20 active:scale-[0.98] transition-all disabled:opacity-40 disabled:grayscale disabled:pointer-events-none cursor-pointer duration-300"
                  >
                    Finalizar Cadastro
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Login Link */}
        <div className="text-center mt-8 z-10">
          <p className="text-xs text-zinc-400 font-geist">
            Já possui uma conta?{" "}
            <Link
              className="font-bold text-violet-400 hover:underline transition-all hover:text-violet-300"
              href="/login"
            >
              Fazer login
            </Link>
          </p>
        </div>
      </main>

      {/* CUSTOM TERMS OF USE MODAL DIALOG */}
      <AnimatePresence>
        {showTerms && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black backdrop-blur-md"
              onClick={() => {
                if (!isLoading) setShowTerms(false);
              }}
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative w-full max-w-[425px] bg-[#120D1F] rounded-3xl p-6 shadow-2xl border border-zinc-800 z-10 flex flex-col max-h-[90vh]"
            >
              {/* Header Title */}
              <div className="flex flex-col gap-0 select-none">
                <div className="w-12 h-12 bg-violet-500/10 rounded-full flex items-center justify-center mb-4 text-violet-400">
                  <ShieldCheck className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-white leading-none">
                  Termos de Uso
                </h3>
                <p className="text-xs text-zinc-400 mt-2">
                  Por favor, leia e aceite os termos para continuar.
                </p>
              </div>

              {/* Scrollable Terms Text Container */}
              <div className="py-4 my-2 max-h-[220px] overflow-y-auto pr-2 border-y border-zinc-800/80 custom-scrollbar text-xs text-zinc-400 space-y-4">
                <p className="leading-relaxed">
                  Estes são os termos de uso do <strong>Lumes AI</strong>. Ao utilizar nossa plataforma, você concorda em seguir todas as diretrizes de segurança, privacidade e termos descritos. O Lumes AI é um assistente inteligente projetado para auxiliar em seus estudos e otimizar seu aprendizado de forma ética e eficiente.
                </p>
                <p className="leading-relaxed font-bold text-zinc-300">
                  1. Privacidade e Proteção de Dados
                </p>
                <p className="leading-relaxed">
                  Suas informações de estudo e histórico de interações estão devidamente protegidas em conformidade total com a Lei Geral de Proteção de Dados (LGPD). Não compartilhamos seus dados pessoais com terceiros sob nenhuma circunstância.
                </p>
                <p className="leading-relaxed font-bold text-zinc-300">
                  2. Conduta do Usuário
                </p>
                <p className="leading-relaxed">
                  Ao usar a plataforma, você se compromete a não submeter conteúdos maliciosos, ofensivos ou que violem direitos de terceiros. A falsidade ideológica ou criação de contas falsas poderá acarretar na suspensão imediata do seu acesso.
                </p>
                <p className="leading-relaxed font-bold text-zinc-300">
                  3. Idade Mínima
                </p>
                <p className="leading-relaxed">
                  O uso do assistente é permitido apenas a indivíduos com idade mínima de 18 anos completos ou sob expressa supervisão legal.
                </p>
              </div>

              {/* Checkboxes List Container */}
              <div className="flex flex-col gap-4 py-3 select-none">
                {/* Checkbox 1: Terms */}
                <div
                  className="flex items-start gap-3 group cursor-pointer"
                  onClick={() => {
                    if (!isLoading) setAcceptedTerms(!acceptedTerms);
                  }}
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-300 shrink-0 mt-0.5 ${
                      acceptedTerms
                        ? "bg-violet-600 border-violet-600"
                        : "border-zinc-700 bg-zinc-950/40 group-hover:border-zinc-500"
                    }`}
                  >
                    {acceptedTerms && <Check className="w-3.5 h-3.5 text-white stroke-[3.5]" />}
                  </div>
                  <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors leading-snug">
                    Eu li e aceito os termos de uso e política de privacidade.
                  </span>
                </div>

                {/* Checkbox 2: Age */}
                <div
                  className="flex items-start gap-3 group cursor-pointer"
                  onClick={() => {
                    if (!isLoading) setIsAdult(!isAdult);
                  }}
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-300 shrink-0 mt-0.5 ${
                      isAdult
                        ? "bg-violet-600 border-violet-600"
                        : "border-zinc-700 bg-zinc-950/40 group-hover:border-zinc-500"
                    }`}
                  >
                    {isAdult && <Check className="w-3.5 h-3.5 text-white stroke-[3.5]" />}
                  </div>
                  <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors leading-snug">
                    Confirmo que tenho 18 anos ou mais.
                  </span>
                </div>
              </div>

              {/* Action Confirm Button */}
              <div className="flex flex-col gap-2 mt-4">
                <button
                  type="button"
                  disabled={!acceptedTerms || !isAdult || isLoading}
                  onClick={handleConfirmRegistration}
                  className="h-12 w-full bg-violet-600 text-white rounded-xl font-bold flex items-center justify-center gap-1 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-600/20 active:scale-[0.98] transition-all disabled:opacity-40 disabled:grayscale disabled:pointer-events-none cursor-pointer duration-300"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Concluir e Criar Conta"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
