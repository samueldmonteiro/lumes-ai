import { extractText, getDocumentProxy } from 'unpdf';

export async function extractFromPDF(buffer: Buffer): Promise<string> {
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });

  return text
    .replace(/\n{3,}/g, '\n\n')  // remove linhas em branco em excesso
    .trim();
}

// ─────────────────────────────────────────────────────────────────────────────

// src/ingest/extractors/text.extractor.ts
export function extractFromText(raw: string): string {
  return raw
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ─────────────────────────────────────────────────────────────────────────────

// src/ingest/extractors/json.extractor.ts
// Converte qualquer objeto JSON em texto legível para o LLM
// Ex: { name: "João", role: "Professor" } → "name: João\nrole: Professor"
export function extractFromJSON(data: Record<string, unknown>): string {
  function flatten(obj: unknown, prefix = ''): string {
    if (typeof obj !== 'object' || obj === null) {
      return `${prefix}: ${String(obj)}`;
    }
    if (Array.isArray(obj)) {
      return obj
        .map((item, i) => flatten(item, prefix ? `${prefix}[${i}]` : `[${i}]`))
        .join('\n');
    }
    return Object.entries(obj as Record<string, unknown>)
      .map(([k, v]) => flatten(v, prefix ? `${prefix}.${k}` : k))
      .join('\n');
  }

  return flatten(data);
}