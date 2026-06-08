import { http } from '@/lib/http';
import type { ApiResponseSuccess } from '@/types/api.type';
import type {
  IngestResult,
  IngestTextRequest,
  IngestJsonRequest,
  AdminDocument,
  AdminStats,
  DeleteDocumentResult,
} from '@/types/admin';

// Serviço de ingestão — comunicação direta com a API (lado do cliente)
export const ingestService = {
  async listDocuments(): Promise<ApiResponseSuccess<AdminDocument[]>> {
    const resp = await http.get<ApiResponseSuccess<AdminDocument[]>>('/ingests');
    return resp.data;
  },

  async getStats(): Promise<ApiResponseSuccess<AdminStats>> {
    const resp = await http.get<ApiResponseSuccess<AdminStats>>('/ingests/stats');
    return resp.data;
  },

  async deleteDocument(source: string): Promise<ApiResponseSuccess<DeleteDocumentResult>> {
    const resp = await http.delete<ApiResponseSuccess<DeleteDocumentResult>>(
      `/ingests/${encodeURIComponent(source)}`,
    );
    return resp.data;
  },

  async ingestText(payload: IngestTextRequest): Promise<ApiResponseSuccess<IngestResult>> {
    const resp = await http.post<ApiResponseSuccess<IngestResult>>('/ingests/text', payload);
    return resp.data;
  },

  async ingestJson(payload: IngestJsonRequest): Promise<ApiResponseSuccess<IngestResult>> {
    const resp = await http.post<ApiResponseSuccess<IngestResult>>('/ingests/json', payload);
    return resp.data;
  },

  async ingestPdf(file: File, source?: string): Promise<ApiResponseSuccess<IngestResult>> {
    const formData = new FormData();
    formData.append('file', file);
    if (source) formData.append('source', source);
    const resp = await http.post<ApiResponseSuccess<IngestResult>>(
      '/ingests/pdf',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return resp.data;
  },
};
