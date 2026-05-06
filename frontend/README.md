# Lumes AI - Frontend

Este é o frontend do projeto **Lumes AI**, um chat de inteligência artificial focado em tirar dúvidas de estudantes.

A interface foi desenvolvida com **Next.js (App Router)**, Tailwind CSS e shadcn/ui.

## FASE 1: Ambiente de Testes (Atual)

Atualmente, o chat está configurado para consumir temporariamente a **API do Gemini**. O objetivo desta fase é testar a interface de usuário e a renderização do formato Markdown (efeito ChatGPT) sem depender do backend real.

### Como rodar localmente

1. Instale as dependências:
   ```bash
   pnpm install
   ```

2. Configure a variável de ambiente:
   - Copie o arquivo `.env.example` para `.env.local`
   - Obtenha uma chave do Google Gemini API e adicione ao arquivo:
     ```env
     GEMINI_API_KEY=sua_chave_aqui
     ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   pnpm dev
   ```

4. Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## FASE 2: Integração com NestJS (Futuro)

A arquitetura do projeto já está preparada para substituir o Gemini pela comunicação com o backend NestJS (arquitetura RAG com PostgreSQL/pgvector).

**O que precisará ser alterado:**

1. Localize o arquivo `src/services/chatService.ts`.
2. Remova a lógica relacionada ao SDK do Gemini (`@google/generative-ai`).
3. Substitua o conteúdo da função `sendMessage` por um fetch para o seu backend NestJS, por exemplo:

```typescript
export async function sendMessage(message: string, history: { role: string; content: string }[] = []): Promise<string> {
  const response = await fetch("http://localhost:3001/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok) {
    throw new Error("Erro na comunicação com o backend NestJS");
  }

  const data = await response.json();
  return data.reply; // Ajuste conforme a estrutura de resposta do backend
}
```
Não será necessário alterar os componentes da UI ou o `MarkdownRenderer`, pois eles continuarão recebendo e formatando a string de Markdown da mesma forma.
