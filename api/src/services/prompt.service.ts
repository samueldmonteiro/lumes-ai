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
      .map(
        (m) => `${m.role === 'user' ? 'Usuário' : 'Assistente'}: ${m.content}`,
      )
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
  build(
    question: string,
    chunks: SearchResult[],
    history: ChatMessage[] = [],
  ): string {
    // Monta o bloco de contexto com os chunks encontrados
    const context = chunks
      .map((c, i) => `[${i + 1}] Fonte: ${c.source}\n${c.content}`)
      .join('\n\n---\n\n');

    let historyText = '';
    if (history.length > 0) {
      historyText =
        '=== HISTÓRICO DA CONVERSA ===\n' +
        history
          .map(
            (m) =>
              `${m.role === 'user' ? 'Usuário' : 'Assistente'}: ${m.content}`,
          )
          .join('\n') +
        '\n=== FIM DO HISTÓRICO ===\n\n';
    }

    // Prompt completo enviado ao LLM
    // Instruções em português para o modelo responder em PT-BR
    return `Você é a LUMES AI, assistente virtual da faculdade. Responda de forma clara, objetiva e em português.

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

  /**
   * Classifica a intenção da mensagem: CASUAL (saudações, perguntas genéricas)
   * ou DOMAIN (perguntas sobre a faculdade/domínio da aplicação).
   */
  buildIntentClassificationPrompt(question: string): string {
    return `Classifique a mensagem abaixo em UMA das categorias:
- CASUAL: saudações, despedidas, agradecimentos, perguntas sobre quem você é, seu nome ou função, ou qualquer conversa genérica não relacionada à faculdade
- DOMAIN: perguntas sobre a faculdade, cursos, horários, disciplinas, professores, secretaria, matrícula, notas, ou qualquer assunto acadêmico

Mensagem: "${question}"

Responda APENAS com a palavra: CASUAL ou DOMAIN`;
  }

  /**
   * Constrói um prompt simples para responder mensagens casuais,
   * sem envolver contexto RAG ou base de dados.
   */
  buildCasualPrompt(question: string, history: ChatMessage[] = []): string {
    let historyText = '';
    if (history.length > 0) {
      historyText =
        '=== HISTÓRICO DA CONVERSA ===\n' +
        history
          .map(
            (m) =>
              `${m.role === 'user' ? 'Usuário' : 'Assistente'}: ${m.content}`,
          )
          .join('\n') +
        '\n=== FIM DO HISTÓRICO ===\n\n';
    }

    return `Você é a LUMES AI, um assistente virtual simpático e inteligente de uma faculdade.
Responda de forma natural, amigável e em português. Voce foi criada pela EQUIPE D.E.V.S (Samuel Davi, Erick Mendes, Luis Gustavo, Thomaz Ataydes)
Não mencione documentos, base de dados, contexto ou informações acadêmicas específicas.

${historyText}Usuário: ${question}

Resposta:`;
  }
}
