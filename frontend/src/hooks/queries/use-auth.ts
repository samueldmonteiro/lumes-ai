'use client';

import { useState, useEffect, useCallback } from 'react';
import { loginAction, logoutAction, getCurrentUserAction, registerAction } from '@/actions/auth';
import type { User, StoreUser } from '@/types/user.type';
import type { ActionResponse } from '@/types/api.type';

// Extrai os dados do usuário do cookie 'user'
function getUserFromCookie(): User | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)user=([^;]*)/);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1])) as User;
  } catch {
    return null;
  }
}

// Hook para obter o usuário autenticado atual
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cookieUser = getUserFromCookie();
    getCurrentUserAction().then((serverUser) => {
      setUser(serverUser ?? cookieUser);
      setIsLoading(false);
    });
  }, []);

  return { user, isLoading };
}

// Hook para ação de login
export function useLogin() {
  const [isPending, setIsPending] = useState(false);

  const login = useCallback(async (email: string, password: string): Promise<ActionResponse<User>> => {
    setIsPending(true);
    try {
      return await loginAction(email, password);
    } finally {
      setIsPending(false);
    }
  }, []);

  return { login, isPending };
}

// Hook para ação de registro
export function useRegister() {
  const [isPending, setIsPending] = useState(false);

  const register = useCallback(async (data: StoreUser): Promise<ActionResponse<User>> => {
    setIsPending(true);
    try {
      return await registerAction(data);
    } finally {
      setIsPending(false);
    }
  }, []);

  return { register, isPending };
}

// Hook para ação de logout
export function useLogout() {
  const [isPending, setIsPending] = useState(false);

  const logout = useCallback(async (): Promise<ActionResponse> => {
    setIsPending(true);
    try {
      return await logoutAction();
    } finally {
      setIsPending(false);
    }
  }, []);

  return { logout, isPending };
}
