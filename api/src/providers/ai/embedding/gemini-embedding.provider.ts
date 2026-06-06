import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { EmbeddingProvider } from './embedding.provider';

@Injectable()
export class GeminiEmbeddingProvider implements EmbeddingProvider {
  private ai: GoogleGenAI;
  private embedModel: string;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    this.embedModel = process.env.GEMINI_EMBED_MODEL || 'gemini-embedding-2';
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.ai.models.embedContent({
      model: this.embedModel,
      contents: text,
    });

    const embedding = response.embeddings?.[0]?.values;
    if (!embedding) {
      throw new Error('Falha ao gerar embedding com Gemini');
    }

    return embedding;
  }

  formatVectorForPg(embedding: number[]): string {
    return `[${embedding.join(',')}]`;
  }
}
