'use server';

import {
  ask,
  getSessions,
  getSessionById,
  deleteSession,
  type AskRequest,
  type AskResponse,
} from '@/services/chat.service';
import type { ActionResponse } from '@/types/api.type';
import type { ChatSession, ChatSessionWithLogs } from '@/types/chat-session';

/**
 * Envia uma pergunta para a API de chat.
 */
export async function askAction(data: AskRequest): Promise<ActionResponse<AskResponse>> {
  try {
    const response = await ask(data);
    if (response.ok) {
      return { success: true, data: response.data };
    }
    return { success: false, message: typeof response.message === 'string' ? response.message : response.message?.[0] };
  } catch (error: any) {
    console.error('Erro ao chamar askAction:', error);
    return { success: false, message: error.response?.data?.message || 'Falha ao enviar mensagem para o chat.' };
  }
}

/**
 * Obtém a lista de sessões de chat do usuário.
 */
export async function getSessionsAction(limit?: number): Promise<ActionResponse<ChatSession[]>> {
  try {
    const response = await getSessions(limit);
    if (response.ok) {
      return { success: true, data: response.data };
    }
    return { success: false, message: typeof response.message === 'string' ? response.message : response.message?.[0] };
  } catch (error: any) {
    console.error('Erro ao chamar getSessionsAction:', error);
    return { success: false, message: error.response?.data?.message || 'Falha ao recuperar sessões de chat.' };
  }
}

/**
 * Obtém uma sessão de chat específica pelo seu ID.
 */
export async function getSessionByIdAction(id: string): Promise<ActionResponse<ChatSessionWithLogs>> {
  try {
    const response = await getSessionById(id);
    if (response.ok) {
      return { success: true, data: response.data };
    }
    return { success: false, message: typeof response.message === 'string' ? response.message : response.message?.[0] };
  } catch (error: any) {
    console.error('Erro ao chamar getSessionByIdAction:', error);
    return { success: false, message: error.response?.data?.message || 'Falha ao recuperar a conversa.' };
  }
}

/**
 * Exclui uma sessão de chat pelo ID.
 */
export async function deleteSessionAction(id: string): Promise<ActionResponse<ChatSession[]>> {
  try {
    const response = await deleteSession(id);
    if (response.ok) {
      return { success: true, data: response.data };
    }
    return { success: false, message: typeof response.message === 'string' ? response.message : response.message?.[0] };
  } catch (error: any) {
    console.error('Erro ao chamar deleteSessionAction:', error);
    return { success: false, message: error.response?.data?.message || 'Falha ao excluir a conversa.' };
  }
}
