'use client';

import { useState, useCallback } from 'react';
import {
  ingestTextAction,
  ingestJsonAction,
  ingestPdfAction,
  deleteDocumentAction,
} from '@/actions/ingest';
import type { IngestResult, IngestTextRequest, IngestJsonRequest, DeleteDocumentResult } from '@/types/admin';
import type { ActionResponse } from '@/types/api.type';

// Hook para exclusão de documento por source
export function useDeleteDocument() {
  const [isPending, setIsPending] = useState(false);

  const deleteDocument = useCallback(
    async (source: string): Promise<ActionResponse<DeleteDocumentResult>> => {
      setIsPending(true);
      try {
        return await deleteDocumentAction(source);
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { deleteDocument, isPending };
}

// Hook para ingestão de texto
export function useIngestText() {
  const [isPending, setIsPending] = useState(false);

  const ingestText = useCallback(
    async (payload: IngestTextRequest): Promise<ActionResponse<IngestResult>> => {
      setIsPending(true);
      try {
        return await ingestTextAction(payload);
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { ingestText, isPending };
}

// Hook para ingestão de JSON
export function useIngestJson() {
  const [isPending, setIsPending] = useState(false);

  const ingestJson = useCallback(
    async (payload: IngestJsonRequest): Promise<ActionResponse<IngestResult>> => {
      setIsPending(true);
      try {
        return await ingestJsonAction(payload);
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { ingestJson, isPending };
}

// Hook para ingestão de PDF
export function useIngestPdf() {
  const [isPending, setIsPending] = useState(false);

  const ingestPdf = useCallback(
    async (file: File, source?: string): Promise<ActionResponse<IngestResult>> => {
      setIsPending(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        if (source) formData.append('source', source);
        return await ingestPdfAction(formData);
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { ingestPdf, isPending };
}
