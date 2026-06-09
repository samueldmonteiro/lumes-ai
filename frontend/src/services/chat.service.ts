import { getHttpServer } from '@/lib/http-server';
import { ApiResponseSuccess } from '@/types/api.type';
import { ChatSession, ChatSessionWithLogs } from '@/types/chat-session';

export type AskRequest = {
  question: string;
  sessionId?: string;
  history?: {
    role: 'user' | 'model',
    content: string
  }[]
}

export type AskResponse = {
  answer: string,
  sources: {
    source: string,
    similarity: number
  }[],
  avgSimilarity: number,
  chunksUsed: number,
  sessionId?: string
}

export const ask = async (data: AskRequest): Promise<ApiResponseSuccess<AskResponse>> => {
  const http = await getHttpServer();
  const response = await http.post<ApiResponseSuccess<AskResponse>>('/chat/ask', data, {
    timeout: 100000,
  });
  return response.data;
};


export const getSessions = async (limit = 30): Promise<ApiResponseSuccess<ChatSession[]>> => {
  const http = await getHttpServer();
  const response = await http.get<ApiResponseSuccess<ChatSession[]>>('/chat/sessions', { params: { limit } });
  return response.data;
};


export const getSessionById = async (id: string): Promise<ApiResponseSuccess<ChatSessionWithLogs>> => {
  const http = await getHttpServer();
  const response = await http.get<ApiResponseSuccess<ChatSessionWithLogs>>(`/chat/sessions/${id}`);
  return response.data;
};


export const deleteSession = async (id: string): Promise<ApiResponseSuccess<ChatSession[]>> => {
  const http = await getHttpServer();
  const response = await http.delete<ApiResponseSuccess<ChatSession[]>>(`/chat/sessions/${id}`);
  return response.data;
};  