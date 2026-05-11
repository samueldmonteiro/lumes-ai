import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

// Configura o provedor Google com a chave existente no .env
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      console.error('Missing GEMINI_API_KEY');
      return new Response('Configuração ausente: GEMINI_API_KEY não encontrada.', { status: 500 });
    }

    if (!messages || !Array.isArray(messages)) {
      return new Response('Formato de mensagem inválido.', { status: 400 });
    }

    const result = await streamText({
      model: google('gemini-flash-latest'),
      system: `Você é o Lumes AI, um assistente inteligente focado em tirar dúvidas de estudantes saindo do ensino medio e que estão na faculdade deve responder comparações entre cursos e faculdades.
Responda sempre de forma clara e didática.
Responda usando Markdown com títulos, listas, tabelas quando necessário e destaque de informações importantes.`,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error: unknown) {
    console.error('Chat API Error:', error);
    
    // Tratamento específico para erro de cota (429)
    const isQuotaError = error instanceof Error && 
      ('status' in error && error.status === 429 || error.message?.includes('quota'));

    if (isQuotaError) {
      return new Response('Limite de uso atingido. Por favor, aguarde alguns minutos e tente novamente.', { 
        status: 429,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    return new Response('Ocorreu um erro ao processar sua mensagem. Tente novamente em breve.', { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
