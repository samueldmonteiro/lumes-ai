"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * ⚠️ FASE 1 - Integração Temporária (Gemini)
 * 
 * Este serviço gerencia a comunicação do chat. Atualmente utiliza o Gemini API 
 * para gerar respostas simulando o backend real e permitindo testar a interface
 * e o MarkdownRenderer.
 * 
 * -------------------------------------------------------------------------
 * 🔄 FASE 2 - Como substituir pelo Backend NestJS RAG
 * -------------------------------------------------------------------------
 * Quando o backend estiver pronto para integração:
 * 1. Remova o import do @google/generative-ai
 * 2. Substitua a implementação da função `sendMessage` para fazer um fetch/axios
 *    chamando a rota do NestJS (ex: POST /api/chat).
 * 3. A assinatura da função pode ser mantida (recebe a mensagem, retorna string).
 */

// Initialize Gemini API (only works on server side or if NEXT_PUBLIC is used, but for simplicity we will call this from a server action or API route. 
// However, since it's just a test, we can use it in a client/server agnostic way if key is exposed, or via Server Actions.
// The best approach in App Router without exposing the key is using a Server Action.

export async function sendMessage(message: string, history: { role: string; content: string }[] = []): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY não configurada no ambiente.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const systemInstruction = `
    Você é o Lumes AI, um assistente inteligente focado em tirar dúvidas de estudantes.
    Responda sempre de forma clara e didática.
    Responda usando Markdown com títulos, listas, tabelas quando necessário e destaque de informações importantes.
  `;

  // Format history for Gemini if needed (Gemini expects {role: 'user'|'model', parts: [{text: string}]})
  let formattedHistory = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));

  // O Gemini exige que o histórico comece com 'user'.
  // Como a UI tem uma saudação inicial do assistente, nós a removemos do histórico enviado.
  if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
    formattedHistory = formattedHistory.slice(1);
  }

  try {
    const chat = model.startChat({
      history: formattedHistory,
      systemInstruction: {
        role: "system",
        parts: [{ text: systemInstruction }]
      }
    });

    const result = await chat.sendMessage(message);
    return result.response.text();
  } catch (error) {
    console.error("Erro ao comunicar com a API:", error);
    throw new Error("Falha ao gerar resposta.");
  }
}
