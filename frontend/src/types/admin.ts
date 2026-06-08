// Tipos de documento suportados para ingestão
export type DocumentType = 'text' | 'json' | 'pdf';

export interface AdminDocument {
  id: string;
  source: string;
  type: DocumentType;
  content: string;
  chunks: number;
  createdAt: string;
  updatedAt: string;
}

// Resposta da API de ingestão — espelha IngestResult do backend
export interface IngestResult {
  ok: boolean;
  source: string;
  chunksProcessed: number;
  chunksSaved: number;
}

// DTOs de request para ingestão — espelham IngestTextDto e IngestJsonDto do backend
export interface IngestTextRequest {
  text: string;
  source?: string;
}

export interface IngestJsonRequest {
  data: Record<string, unknown>;
  source?: string;
}

export interface AdminStats {
  totalDocs: number;
  totalChunks: number;
  uniqueSources: number;
  lastUpload: string | null;
  documentsByType: Record<DocumentType, number>;
}

// Resposta do endpoint de exclusão de documento
export interface DeleteDocumentResult {
  deletedCount: number;
}

export type IngestMode = 'text' | 'json' | 'pdf';

