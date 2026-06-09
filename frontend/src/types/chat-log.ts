export type ChatLog = {
  id: number,
  question: string,
  answer: string,
  sources: [
    {
      source: string,
      similarity: number
    }
  ],
  similarity: number,
  createdAt: string,
  userId: number,
  sessionId: string
}