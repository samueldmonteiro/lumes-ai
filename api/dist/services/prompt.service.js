"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptService = void 0;
const common_1 = require("@nestjs/common");
let PromptService = class PromptService {
    buildCondensationPrompt(history, newQuestion) {
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
    build(question, chunks, history = []) {
        const context = chunks
            .map((c, i) => `[${i + 1}] Fonte: ${c.source}\n${c.content}`)
            .join('\n\n---\n\n');
        let historyText = '';
        if (history.length > 0) {
            historyText =
                '=== HISTÓRICO DA CONVERSA ===\n' +
                    history
                        .map((m) => `${m.role === 'user' ? 'Usuário' : 'Assistente'}: ${m.content}`)
                        .join('\n') +
                    '\n=== FIM DO HISTÓRICO ===\n\n';
        }
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
    buildIntentClassificationPrompt(question) {
        return `Classifique a mensagem abaixo em UMA das categorias:
- CASUAL: saudações, despedidas, agradecimentos, perguntas sobre quem você é, seu nome ou função, ou qualquer conversa genérica não relacionada à faculdade
- DOMAIN: perguntas sobre a faculdade, cursos, horários, disciplinas, professores, secretaria, matrícula, notas, ou qualquer assunto acadêmico

Mensagem: "${question}"

Responda APENAS com a palavra: CASUAL ou DOMAIN`;
    }
    buildCasualPrompt(question, history = []) {
        let historyText = '';
        if (history.length > 0) {
            historyText =
                '=== HISTÓRICO DA CONVERSA ===\n' +
                    history
                        .map((m) => `${m.role === 'user' ? 'Usuário' : 'Assistente'}: ${m.content}`)
                        .join('\n') +
                    '\n=== FIM DO HISTÓRICO ===\n\n';
        }
        return `Você é a LUMES AI, um assistente virtual simpático e inteligente de uma faculdade.
Responda de forma natural, amigável e em português. Voce foi criada pela EQUIPE D.E.V.S (Samuel Davi, Erick Mendes, Luis Gustavo, Thomaz Ataydes)
Não mencione documentos, base de dados, contexto ou informações acadêmicas específicas.

${historyText}Usuário: ${question}

Resposta:`;
    }
};
exports.PromptService = PromptService;
exports.PromptService = PromptService = __decorate([
    (0, common_1.Injectable)()
], PromptService);
//# sourceMappingURL=prompt.service.js.map