import { ChatLog } from './chat-log';

export type ChatSession = {
  id: string;
  title: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export type ChatSessionWithLogs = ChatSession & {
  chatLogs: ChatLog[];
}