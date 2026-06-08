"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useChatTheme } from "@/features/chat/hooks/useChatTheme";
import { useUser } from "@/hooks/queries/use-auth";
import { useUpdateProfile } from "@/hooks/queries/use-user";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProfilePage() {
  const router = useRouter();
  const { isDark } = useChatTheme();
  const { user } = useUser();
  const { updateProfile, isPending } = useUpdateProfile();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    setName(user.name || "");
    setEmail(user.email || "");
  }, [user, router]);

  const userInitial = useMemo(
    () => (user?.name ? user.name.charAt(0).toUpperCase() : "?"),
    [user]
  );

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (name.trim().length < 3) {
      newErrors.name = "O nome deve ter pelo menos 3 caracteres.";
    }

    if (!emailRegex.test(email)) {
      newErrors.email = "Insira um e-mail válido.";
    }

    if (password && password.length < 6) {
      newErrors.password = "A senha deve ter no mínimo 6 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, email, password]);

  const handleSave = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      const data: Record<string, string> = {};
      if (name !== user?.name) data.name = name.trim();
      if (email !== user?.email) data.email = email.trim();
      if (password) data.password = password;

      if (Object.keys(data).length === 0) {
        toast.info("Nenhuma alteração para salvar.");
        return;
      }

      const result = await updateProfile(data);

      if (result.success) {
        toast.success("Perfil atualizado com sucesso!");
        setPassword("");
      } else {
        toast.error(result.message || "Erro ao atualizar perfil.");
      }
    },
    [validate, name, email, password, user, updateProfile]
  );

  if (!user) {
    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center",
        isDark ? "bg-[#07040D]" : "bg-[#F4F4F6]"
      )}>
        <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500",
        isDark ? "bg-[#07040D] text-white" : "bg-[#F4F4F6] text-zinc-900"
      )}
    >
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
            <span>Voltar</span>
          </motion.button>
        </Link>
      </div>

      <main className="w-full max-w-[480px] z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.1 }}
          className={cn(
            "w-full rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl flex flex-col transition-all duration-300 border",
            isDark
              ? "bg-[#120D1F]/50 border-zinc-800/60"
              : "bg-white/80 border-zinc-200/80 shadow-lg"
          )}
        >
          <div className="flex flex-col items-center mb-6">
            <div
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold select-none mb-3",
                isDark
                  ? "bg-gradient-to-br from-violet-500/30 to-indigo-500/30 text-violet-300 border border-violet-500/20"
                  : "bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-700 border border-violet-200/60"
              )}
            >
              {userInitial}
            </div>
            <h1
              className={cn(
                "text-2xl font-black leading-tight uppercase tracking-wider",
                isDark ? "text-white" : "text-zinc-800"
              )}
            >
              Meu Perfil
            </h1>
            <p
              className={cn(
                "text-xs mt-1",
                isDark ? "text-zinc-400" : "text-zinc-500"
              )}
            >
              Gerencie suas informações pessoais
            </p>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="name"
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest",
                  isDark ? "text-zinc-400" : "text-zinc-500"
                )}
              >
                Nome
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                }}
                className={cn(
                  "h-12 px-4 rounded-xl transition-all duration-300",
                  isDark
                    ? "bg-zinc-950/70 border-zinc-800/80 text-white placeholder-zinc-600 focus:ring-violet-500/10"
                    : "bg-zinc-100/80 border-zinc-200 text-zinc-800 placeholder-zinc-400 focus:ring-violet-500/15",
                  errors.name ? "border-rose-500 focus:border-rose-500" : "focus:border-violet-500/80"
                )}
              />
              {errors.name && (
                <p className="text-xs text-rose-500 font-medium">{errors.name}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="email"
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest",
                  isDark ? "text-zinc-400" : "text-zinc-500"
                )}
              >
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                }}
                className={cn(
                  "h-12 px-4 rounded-xl transition-all duration-300",
                  isDark
                    ? "bg-zinc-950/70 border-zinc-800/80 text-white placeholder-zinc-600 focus:ring-violet-500/10"
                    : "bg-zinc-100/80 border-zinc-200 text-zinc-800 placeholder-zinc-400 focus:ring-violet-500/15",
                  errors.email ? "border-rose-500 focus:border-rose-500" : "focus:border-violet-500/80"
                )}
              />
              {errors.email && (
                <p className="text-xs text-rose-500 font-medium">{errors.email}</p>
              )}
            </div>

            <Separator className={cn(
              isDark ? "bg-zinc-800/60" : "bg-zinc-200/80"
            )} />

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="password"
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest",
                  isDark ? "text-zinc-400" : "text-zinc-500"
                )}
              >
                Nova senha
              </Label>
              <span className={cn(
                "text-[10px] -mt-1",
                isDark ? "text-zinc-500" : "text-zinc-400"
              )}>
                Deixe em branco para manter a atual
              </span>
              <div className="relative group">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nova senha (opcional)"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  className={cn(
                    "h-12 px-4 pr-12 rounded-xl transition-all duration-300",
                    isDark
                      ? "bg-zinc-950/70 border-zinc-800/80 text-white placeholder-zinc-600 focus:ring-violet-500/10"
                      : "bg-zinc-100/80 border-zinc-200 text-zinc-800 placeholder-zinc-400 focus:ring-violet-500/15",
                    errors.password ? "border-rose-500 focus:border-rose-500" : "focus:border-violet-500/80"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={cn(
                    "absolute right-4 top-1/2 -translate-y-1/2 transition-colors cursor-pointer",
                    isDark ? "text-zinc-500 hover:text-violet-400" : "text-zinc-400 hover:text-violet-600"
                  )}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 font-medium">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className={cn(
                "h-12 w-full rounded-xl font-bold text-base cursor-pointer transition-all duration-300",
                "bg-violet-600 text-white hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-600/20 active:scale-[0.98]",
                "disabled:opacity-40 disabled:grayscale disabled:pointer-events-none"
              )}
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Salvar alterações"
              )}
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
