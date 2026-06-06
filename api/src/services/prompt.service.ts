import { Injectable } from '@nestjs/common';
import { SearchResult } from './search.service';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

@Injectable()
export class PromptService {
  /**
   * Constrói o prompt para reescrever a pergunta com base no histórico.
   */
  buildCondensationPrompt(history: ChatMessage[], newQuestion: string): string {
    const historyText = history
      .map((m) => `${m.role === 'user' ? 'Usuário' : 'Assistente'}: ${m.content}`)
      .join('\n');

    return `Dada a conversa anterior e uma nova pergunta do usuário, gere uma única pergunta ou frase de busca autossuficiente e otimizada (em português). 
Esta pergunta de busca deve conter todo o contexto necessário da conversa anterior para que possamos buscar em uma base de dados vetorial.
Não responda à pergunta, apenas reescreva-a de forma clara e objetiva.

=== HISTÓRICO DE CONVERSA ===
${historyText}
=== FIM DO HISTÓRICO ===

Nova pergunta do usuário: ${newQuestion}

Busca otimizada:`;
  }

  /**
   * Constrói o prompt completo contendo contexto, histórico opcional e a pergunta.
   */
  build(question: string, chunks: SearchResult[], history: ChatMessage[] = []): string {
    // Monta o bloco de contexto com os chunks encontrados
    const context = chunks
      .map(
        (c, i) =>
          `[${i + 1}] Categoria: ${c.category} | Fonte: ${c.source}\n${c.content}`,
      )
      .join('\n\n---\n\n');

    let historyText = '';
    if (history.length > 0) {
      historyText = '=== HISTÓRICO DA CONVERSA ===\n' + history
        .map((m) => `${m.role === 'user' ? 'Usuário' : 'Assistente'}: ${m.content}`)
        .join('\n') + '\n=== FIM DO HISTÓRICO ===\n\n';
    }

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

${historyText}Pergunta do aluno: ${question}

Resposta:`;
  }
}
