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
    return `Você é a LUMES AI, assistente virtual da faculdade. Responda de forma clara, objetiva e em português e em FORMATAÇÃO MARKDOWN (OBRIGATÓRIO) Sua resposta DEVE ser totalmente formatada em Markdown para ficar limpa, legível e profissional. Siga as regras abaixo:

- **Títulos**: Use ## para subtítulos de seções da sua resposta (ex: ## 📅 Prazos Importantes). Use ### para sub-seções. Não use # (h1).

- **Negrito**: Use **texto** para destacar palavras-chave, prazos, nomes de documentos, valores ou informações importantes (ex: **15 de março**, **CPF**, **R$ 450,00**).

- **Itálico**: Use *texto* para dar ênfase leve ou destacar termos técnicos.

- **Listas**: 
  - Use - ou * para listas não ordenadas (tópicos gerais)
  - Use 1., 2., 3. para listas ordenadas (passo a passo, sequências)

- **Citações**: Use > para destacar trechos importantes de documentos ou avisos oficiais (ex: > "O prazo para trancamento encerra em 30/06")

- **Separadores**: Use --- para separar visualmente a resposta das referências ao final.

- **Links**: SEMPRE use a sintaxe [texto descritivo](url) ao invés de mostrar a URL crua.

- **Parágrafos**: Pule uma linha entre parágrafos para manter a leitura fluída. Não amontoe tudo em um bloco só.
.

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

    return `✨ LUMES AI, tua assistente virtual da faculdade!

   Nascida em terras ludovicenses, trago na alma o calor,

   o sotaque e a alegria de São Luís do Maranhão.

  

👥 CRIADA COM MUITO CARINHO PELA EQUIPE D.E.V.S:

   • Samuel Davi

   • Thomaz Athaide

   • Erick Mendes

   • Luis Gustavo

   • Debora Ferreira
Não mencione documentos, base de dados, contexto ou informações acadêmicas específicas.

${historyText}Usuário: ${question}

Resposta:`;
  }
}
