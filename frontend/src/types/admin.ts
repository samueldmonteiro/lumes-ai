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

export interface IngestResult {
  ok: boolean;
  source: string;
  chunksProcessed: number;
  chunksSaved: number;
}

export interface AdminStats {
  totalDocs: number;
  totalChunks: number;
  uniqueSources: number;
  lastUpload: string | null;
  documentsByType: Record<DocumentType, number>;
}

export type IngestMode = 'text' | 'json' | 'pdf';
