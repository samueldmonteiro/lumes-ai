'use server';

import { getHttpServer } from '@/lib/http-server';
import type { ApiResponseSuccess } from '@/types/api.type';
import type {
  IngestResult,
  IngestTextRequest,
  IngestJsonRequest,
  AdminDocument,
  AdminStats,
  DeleteDocumentResult,
} from '@/types/admin';
import type { ActionResponse } from '@/types/api.type';

// Action para listar documentos ingeridos
export async function listDocumentsAction(): Promise<ActionResponse<AdminDocument[]>> {
  try {
    const http = await getHttpServer();
    const resp = await http.get<ApiResponseSuccess<AdminDocument[]>>('/ingests');
    return { success: true, data: resp.data.data };
  } catch (error) {
    console.error('Erro ao listar documentos:', error);
    return { success: false, message: 'Erro ao listar documentos.' };
  }
}

// Action para buscar estatísticas de ingestão
export async function getStatsAction(): Promise<ActionResponse<AdminStats>> {
  try {
    const http = await getHttpServer();
    const resp = await http.get<ApiResponseSuccess<AdminStats>>('/ingests/stats');
    return { success: true, data: resp.data.data };
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return { success: false, message: 'Erro ao buscar estatísticas.' };
  }
}

// Action para excluir documento por source
export async function deleteDocumentAction(source: string): Promise<ActionResponse<DeleteDocumentResult>> {
  try {
    const http = await getHttpServer();
    const resp = await http.delete<ApiResponseSuccess<DeleteDocumentResult>>(
      `/ingests/${encodeURIComponent(source)}`,
    );
    return { success: true, data: resp.data.data };
  } catch (error) {
    console.error('Erro ao excluir documento:', error);
    return { success: false, message: 'Erro ao excluir documento.' };
  }
}

// Action para ingerir texto puro
export async function ingestTextAction(payload: IngestTextRequest): Promise<ActionResponse<IngestResult>> {
  try {
    const http = await getHttpServer();
    const resp = await http.post<ApiResponseSuccess<IngestResult>>('/ingests/text', payload);
    return { success: true, data: resp.data.data };
  } catch (error) {
    console.error('Erro ao ingerir texto:', error);
    return { success: false, message: 'Erro ao ingerir texto.' };
  }
}

// Action para ingerir dados JSON
export async function ingestJsonAction(payload: IngestJsonRequest): Promise<ActionResponse<IngestResult>> {
  try {
    const http = await getHttpServer();
    const resp = await http.post<ApiResponseSuccess<IngestResult>>('/ingests/json', payload);
    return { success: true, data: resp.data.data };
  } catch (error) {
    console.error('Erro ao ingerir JSON:', error);
    return { success: false, message: 'Erro ao ingerir JSON.' };
  }
}

// Action para ingerir PDF via FormData
export async function ingestPdfAction(formData: FormData): Promise<ActionResponse<IngestResult>> {
  try {
    const http = await getHttpServer();
    const resp = await http.post<ApiResponseSuccess<IngestResult>>(
      '/ingests/pdf',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return { success: true, data: resp.data.data };
  } catch (error) {
    console.error('Erro ao ingerir PDF:', error);
    return { success: false, message: 'Erro ao ingerir PDF.' };
  }
}

