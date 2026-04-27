import { Injectable } from '@nestjs/common';
import { SearchResult } from './search.service';

@Injectable()
export class PromptService {

  build(question: string, chunks: SearchResult[]): string {
    // Monta o bloco de contexto com os chunks encontrados
    const context = chunks
      .map((c, i) =>
        `[${i + 1}] Categoria: ${c.category} | Fonte: ${c.source}\n${c.content}`,
      )
      .join('\n\n---\n\n');

    // Prompt completo enviado ao LLM
    // Instruções em português para o modelo responder em PT-BR
    return `Você é um assistente virtual da faculdade. Responda de forma clara, objetiva e em português.

REGRAS IMPORTANTES:
- Baseie sua resposta APENAS nas informações do contexto abaixo
- Se a informação não estiver no contexto, diga: "Não tenho essa informação na minha base de dados"
- Não invente informações
- Seja direto e útil

=== CONTEXTO ===
${context}
=== FIM DO CONTEXTO ===

Pergunta do aluno: ${question}

Resposta:`;
  }
}