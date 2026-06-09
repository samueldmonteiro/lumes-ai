'use client';

import { useState, useCallback, useEffect } from 'react';
import { getSessionsAction, deleteSessionAction } from '@/actions/chat';
import type { ChatSession } from '@/types/chat-session';
import type { ActionResponse } from '@/types/api.type';
import { useUser } from './use-auth';

/**
 * Hook para gerenciar as sessões de chat do usuário logado.
 */
export function useChatSessions() {
  const { user } = useUser();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async (limit?: number) => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await getSessionsAction(limit);
      if (result.success && result.data) {
        setSessions(result.data);
      } else {
        setError(result.message || 'Erro ao carregar as sessões de chat.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro de conexão.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const deleteSession = useCallback(async (id: string): Promise<ActionResponse<ChatSession[]>> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await deleteSessionAction(id);
      if (result.success && result.data) {
        setSessions(result.data);
      } else {
        setError(result.message || 'Erro ao excluir a sessão.');
      }
      return result;
    } catch (err: any) {
      const errorMsg = err.message || 'Erro de conexão.';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Busca inicial das sessões quando o usuário loga
  useEffect(() => {
    if (user) {
      setTimeout(() => fetchSessions(), 0);
    } else {
      setTimeout(() => setSessions([]), 0);
    }
  }, [user, fetchSessions]);

  return {
    sessions,
    isLoading,
    error,
    refetchSessions: fetchSessions,
    deleteSession,
  };
}
