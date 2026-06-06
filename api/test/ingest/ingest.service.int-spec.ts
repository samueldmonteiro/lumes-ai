/**
 * Testes de integração do IngestService.
 *
 * Verifica o comportamento real dos métodos de ingestão contra um banco
 * PostgreSQL isolado (schema gerado pelo test/setup.ts), com o EmbeddingProvider
 * substituído por um mock para não depender do Ollama/Gemini em CI.
 */
import { Test, TestingModule } from '@nestjs/testing';
import {
  describe,
  beforeAll,
  afterAll,
  beforeEach,
  it,
  expect,
  vi,
} from 'vitest';
import { IngestService } from '@/services/ingest.service';
import { ChunkerService } from '@/services/chunker.service';
import { PrismaService } from '@/services/prisma.service';
import { PrismaKnowledgeChunkRepository } from '@/repositories/prisma/prisma-knowledge-chunk.repository';
import { EmbeddingProvider } from '@/providers/ai/embedding/embedding.provider';
import { extractFromJSON } from '@/utils/extractors';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Gera um vetor de 3072 dimensões com valores aleatórios, simulando o Gemini. */
function fakeEmbedding(): number[] {
  return Array.from({ length: 3072 }, () => Math.random() * 2 - 1);
}

/** Converte array numérico para o formato de string do pgvector: [0.1,0.2,...] */
function formatVector(embedding: number[]): string {
  return `[${embedding.join(',')}]`;
}

// ─── Mock do EmbeddingProvider ────────────────────────────────────────────────

class MockEmbeddingProvider extends EmbeddingProvider {
  generateEmbedding = vi.fn(() => Promise.resolve(fakeEmbedding()));
  formatVectorForPg = vi.fn((embedding: number[]) => formatVector(embedding));
}

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('IngestService (integration)', () => {
  let module: TestingModule;
  let ingestService: IngestService;
  let prisma: PrismaService;
  let embeddingProvider: MockEmbeddingProvider;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        PrismaService,
        PrismaKnowledgeChunkRepository,
        ChunkerService,
        IngestService,
        {
          provide: EmbeddingProvider,
          useClass: MockEmbeddingProvider,
        },
      ],
    }).compile();

    ingestService = module.get(IngestService);
    prisma = module.get(PrismaService);
    embeddingProvider = module.get(EmbeddingProvider);
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(async () => {
    // Limpa todos os chunks entre testes para garantir isolamento
    await prisma.knowledgeChunk.deleteMany({});
    vi.clearAllMocks();
  });

  // ── Ingestão de texto ───────────────────────────────────────────────────────

  describe('ingestText()', () => {
    it('deve retornar ok=true e persistir chunks no banco', async () => {
      const text =
        'O Lumes AI é um sistema de chatbot com RAG. Ele utiliza pgvector para busca semântica e Gemini como LLM principal.';

      const result = await ingestService.ingestText(text, 'test-text-source');

      expect(result.ok).toBe(true);
      expect(result.source).toBe('test-text-source');
      expect(result.chunksProcessed).toBeGreaterThan(0);
      expect(result.chunksSaved).toBe(result.chunksProcessed);

      // Confirma persistência no banco
      const stored = await prisma.knowledgeChunk.findMany({
        where: { source: 'test-text-source' },
      });
      expect(stored.length).toBe(result.chunksSaved);
    });

    it('deve chamar generateEmbedding uma vez por chunk', async () => {
      const text =
        'Frase curta mas válida para o teste de embedding por chunk gerado.';

      const result = await ingestService.ingestText(text, 'test-embed-count');

      expect(embeddingProvider.generateEmbedding).toHaveBeenCalledTimes(
        result.chunksProcessed,
      );
    });

    it('deve substituir chunks existentes ao reingerir a mesma source', async () => {
      const source = 'test-dedup-source';
      const text =
        'Conteúdo original da base de conhecimento para teste de deduplicação.';

      await ingestService.ingestText(text, source);
      const firstCount = await prisma.knowledgeChunk.count({
        where: { source },
      });

      // Segunda ingestão com mesmo source deve deletar e recriar
      await ingestService.ingestText(text, source);
      const secondCount = await prisma.knowledgeChunk.count({
        where: { source },
      });

      expect(secondCount).toBe(firstCount);
    });
  });

  // ── Ingestão de JSON ────────────────────────────────────────────────────────

  describe('ingestJSON()', () => {
    it('deve achatar o objeto e persistir chunks', async () => {
      const data = {
        sistema: 'Lumes AI',
        versao: '2.0',
        features: ['RAG', 'chat', 'pgvector'],
        config: { chunkSize: 500, overlap: 50 },
      };

      const result = await ingestService.ingestJSON(data, 'test-json-source');

      expect(result.ok).toBe(true);
      expect(result.source).toBe('test-json-source');
      expect(result.chunksSaved).toBeGreaterThan(0);

      const stored = await prisma.knowledgeChunk.findMany({
        where: { source: 'test-json-source' },
      });
      expect(stored.length).toBe(result.chunksSaved);
    });

    it('deve converter objetos aninhados em texto plano via extractFromJSON', () => {
      const data = { a: { b: { c: 'valor' } }, lista: [1, 2, 3] };
      const flat = extractFromJSON(data);

      expect(flat).toContain('a.b.c: valor');
      expect(flat).toContain('lista[0]: 1');
      expect(flat).toContain('lista[2]: 3');
    });

    it('deve persistir chunks independentes por source diferente', async () => {
      const dataA = {
        produto: 'A',
        descricao: 'Produto A com detalhes suficientes para chunking.',
      };
      const dataB = {
        produto: 'B',
        descricao: 'Produto B com detalhes suficientes para chunking.',
      };

      await ingestService.ingestJSON(dataA, 'source-a');
      await ingestService.ingestJSON(dataB, 'source-b');

      const countA = await prisma.knowledgeChunk.count({
        where: { source: 'source-a' },
      });
      const countB = await prisma.knowledgeChunk.count({
        where: { source: 'source-b' },
      });

      expect(countA).toBeGreaterThan(0);
      expect(countB).toBeGreaterThan(0);
    });
  });

  // ── Ingestão de PDF ─────────────────────────────────────────────────────────

  describe('ingestPDF()', () => {
    it('deve rejeitar buffer corrompido e lançar erro', async () => {
      const invalidBuffer = Buffer.from('isto nao e um pdf valido');

      await expect(
        ingestService.ingestPDF(invalidBuffer, 'test-corrupted-pdf'),
      ).rejects.toThrow();
    });
  });
});
