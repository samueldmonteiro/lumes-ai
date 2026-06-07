import type { AdminDocument, AdminStats, DocumentType, IngestResult } from "@/types/admin";

export interface AdminApiClient {
  listDocuments(): Promise<AdminDocument[]>;
  ingestText(text: string, source: string): Promise<IngestResult>;
  ingestJson(data: Record<string, unknown>, source: string): Promise<IngestResult>;
  ingestPdf(file: File, source: string): Promise<IngestResult>;
  deleteDocument(source: string): Promise<void>;
  getStats(): Promise<AdminStats>;
}

const MOCK_DOCUMENTS: AdminDocument[] = [
  { id: "1", source: "manual-ajuda", type: "text", content: "O Lumes AI é um assistente de estudos inteligente que utiliza RAG para responder perguntas sobre educação, vestibulares e ENEM...", chunks: 3, createdAt: "2026-06-01T10:00:00Z", updatedAt: "2026-06-01T10:00:00Z" },
  { id: "2", source: "manual-enem-2026", type: "text", content: "O ENEM 2026 terá provas nos dias 1 e 8 de novembro. As inscrições ocorrem entre maio e junho...", chunks: 5, createdAt: "2026-06-01T11:30:00Z", updatedAt: "2026-06-01T11:30:00Z" },
  { id: "3", source: "edital-medicina", type: "pdf", content: "Processo seletivo para medicina 2026. Inscrições abertas de 15/jun a 15/jul. São 60 vagas...", chunks: 8, createdAt: "2026-06-02T09:00:00Z", updatedAt: "2026-06-02T09:00:00Z" },
  { id: "4", source: "faculdades-ma", type: "json", content: '{"faculdades":[{"nome":"UFMA","cidade":"São Luís"},{"nome":"UEMA","cidade":"São Luís"}]}', chunks: 2, createdAt: "2026-06-03T14:00:00Z", updatedAt: "2026-06-03T14:00:00Z" },
  { id: "5", source: "cronograma-estudos", type: "text", content: "Cronograma de estudos semanal: Segunda: Matemática (2h), Terça: Português (2h), Quarta: Redação (2h)...", chunks: 4, createdAt: "2026-06-04T08:00:00Z", updatedAt: "2026-06-04T08:00:00Z" },
];

let documents = [...MOCK_DOCUMENTS];

function generateId(): string {
  return String(Date.now());
}

function estimateChunks(text: string): number {
  const wordCount = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export class MockAdminClient implements AdminApiClient {
  async listDocuments(): Promise<AdminDocument[]> {
    await delay(300);
    return [...documents].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async ingestText(text: string, source: string): Promise<IngestResult> {
    await delay(1500);
    return ingestCommon(text, source, "text");
  }

  async ingestJson(data: Record<string, unknown>, source: string): Promise<IngestResult> {
    await delay(1500);
    const text = Object.entries(data)
      .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`)
      .join("\n");
    return ingestCommon(text, source, "json");
  }

  async ingestPdf(file: File, source: string): Promise<IngestResult> {
    await delay(2000);
    const text = `[Conteúdo extraído do PDF: ${file.name}]\n\nSimulação de texto extraído de PDF para fins de demonstração. O conteúdo real seria extraído utilizando unpdf no backend.`;
    return ingestCommon(text, source, "pdf");
  }

  async deleteDocument(source: string): Promise<void> {
    await delay(400);
    documents = documents.filter((d) => d.source !== source);
  }

  async getStats(): Promise<AdminStats> {
    await delay(200);
    const byType: Record<DocumentType, number> = { text: 0, json: 0, pdf: 0 };
    for (const d of documents) {
      byType[d.type] = (byType[d.type] ?? 0) + 1;
    }
    const sorted = [...documents].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return {
      totalDocs: documents.length,
      totalChunks: documents.reduce((acc, d) => acc + d.chunks, 0),
      uniqueSources: new Set(documents.map((d) => d.source)).size,
      lastUpload: sorted[0]?.createdAt ?? null,
      documentsByType: byType,
    };
  }
}

function ingestCommon(content: string, source: string, type: DocumentType): IngestResult {
  const chunks = estimateChunks(content);
  const existing = documents.findIndex((d) => d.source === source);
  const now = new Date().toISOString();
  const doc: AdminDocument = {
    id: existing >= 0 ? documents[existing].id : generateId(),
    source,
    type,
    content: content.slice(0, 300),
    chunks,
    createdAt: existing >= 0 ? documents[existing].createdAt : now,
    updatedAt: now,
  };
  if (existing >= 0) {
    documents[existing] = doc;
  } else {
    documents.push(doc);
  }
  return { ok: true, source, chunksProcessed: chunks, chunksSaved: chunks };
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export const adminClient: AdminApiClient = new MockAdminClient();
