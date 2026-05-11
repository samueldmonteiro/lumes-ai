import { Injectable } from '@nestjs/common';
import { EmbeddingProvider } from './embedding-provider';

@Injectable()
export class OllamaEmbeddingProvider implements EmbeddingProvider {
  private baseUrl: string;
  private embedModel: string;

  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.embedModel = process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text';
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const res = await fetch(`${this.baseUrl}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.embedModel,
        prompt: text,
      }),
    });

    if (!res.ok) {
      throw new Error(`Erro ao gerar embedding: ${res.status} ${res.statusText}`);
    }
    const data = await res.json() as { embedding: number[] };
    return data.embedding;
  }

  formatVectorForPg(embedding: number[]): string {
    return `[${embedding.join(',')}]`;
  }
}