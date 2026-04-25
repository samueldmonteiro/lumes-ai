import 'dotenv/config';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class OllamaService implements OnModuleInit {
  private readonly logger = new Logger(OllamaService.name);
  private baseUrl: string;
  private embedModel: string;
  private llmModel: string;

  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.embedModel = process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text';
    this.llmModel = process.env.OLLAMA_LLM_MODEL || 'llama3.2';
  }

  // Verifica se o Ollama está rodando ao iniciar o módulo
  async onModuleInit() {
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`);
      if (!res.ok) throw new Error('Ollama não respondeu');
      this.logger.log(`✅ Ollama conectado em ${this.baseUrl}`);
      this.logger.log(`   Embed: ${this.embedModel} | LLM: ${this.llmModel}`);
    } catch {
      this.logger.error(`❌ Ollama não encontrado em ${this.baseUrl}`);
      this.logger.error('   Execute: ollama serve');
    }
  }

  // ─── CHAMADA 1: Gera embedding (vetor numérico) de um texto ───────────────
  // Usado tanto na ingestão quanto na busca
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
    return data.embedding; // array de 768 números (nomic-embed-text)
  }

  // ─── CHAMADA 2: Gera resposta do LLM com base no prompt ───────────────────
  // Usado no chat — recebe o prompt com contexto e retorna a resposta
  async generateResponse(prompt: string): Promise<string> {
    const res = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.llmModel,
        prompt,
        stream: false,   // aguarda resposta completa (não streaming)
        options: {
          temperature: 0.3,    // mais focado, menos criativo (bom para Q&A)
          num_predict: 512,    // máximo de tokens na resposta
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Erro no LLM: ${res.status} ${res.statusText}`);
    }

    const data = await res.json() as { response: string };
    return data.response.trim();
  }

  // Formata o vetor para o formato que o pgvector aceita: '[0.1,0.2,...]'
  formatVectorForPg(embedding: number[]): string {
    return `[${embedding.join(',')}]`;
  }
}