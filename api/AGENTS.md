# AGENTS.md — API (NestJS)

## Descrição

API para um chatbot de IA com RAG (Retrieval-Augmented Generation), utilizando **pgvector** para busca vetorial, **Ollama** (modelo de embeddings) para indexação/retorno de contexto e **Google Gemini** como modelo de linguagem principal para geração das respostas.

---

## Stack Tecnológica

- **Framework**: NestJS 11 + Express 5
- **Linguagem**: TypeScript 5.9 (strict), target ES2023
- **Node**: NodeJS v24.15.0
- **ORM**: Prisma 7 (PostgreSQL + extensão pgvector)
- **Validação**: `class-validator` + `class-transformer` (ativados via `ValidationPipe` global)
- **Documentação de API**: Swagger (`@nestjs/swagger`) disponível na rota `/api`
- **Testes**: Vitest 4 + SWC transforms (configuração multi-projeto para Unitário, Integração e E2E)
- **Gerenciador de Pacotes**: pnpm
- **Qualidade de Código**: ESLint (typescript-eslint) + Prettier

---

## Variáveis de Ambiente (`.env`)

Para o funcionamento correto dos agentes e da API, certifique-se de configurar as seguintes variáveis no arquivo `.env`:

```env
PORT=3000
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_banco?schema=public"
JWT_SECRET="sua-chave-secreta-jwt"

# Configurações de IA
GEMINI_API_KEY="sua-chave-api-do-gemini"
GEMINI_MODEL="gemini-3-flash-preview"
GEMINI_SYSTEM_INSTRUCTION="Instrução opcional para o comportamento do sistema"

OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_EMBED_MODEL="nomic-embed-text" # Dimensão do vetor: 768

# Parâmetros de Busca & Ingestão
SEARCH_TOP_K=4
SEARCH_MIN_SIMILARITY=0.5
CHUNK_SIZE=500
CHUNK_OVERLAP=50
```

---

## Estrutura do Projeto

```
src/
├── main.ts                       # Bootstrap da aplicação (CORS, Swagger, Filtros e Pipes globais)
├── app.module.ts                 # Módulo raiz e injeções de dependência
├── http/
│   ├── controllers/              # Controladores REST (devem estender BaseController)
│   ├── decorators/               # Decoradores customizados (@CurrentUser, @Public, @Roles)
│   ├── dtos/                     # DTOs de validação de payload (class-validator)
│   ├── filters/                  # Filtros globais de exceção (GlobalExceptionFilter)
│   └── guards/                   # Guards para autenticação e autorização (JwtAuthGuard, RolesGuard)
├── services/                     # Regras de negócio da aplicação (serviços injetáveis)
├── repositories/                 # Camada de persistência e acesso a dados
│   └── prisma/                   # Repositórios concretos do Prisma (ex: PrismaUserRepository)
├── providers/
│   └── ai/
│       ├── LLM/                  # Abstração LLMProvider + Implementação GeminiProvider
│       └── embedding/            # Abstração EmbeddingProvider + Implementação OllamaEmbeddingProvider
├── lib/                          # Funções utilitárias (ex: extractors.ts para PDFs, JSON e textos)
├── exeptions/                    # Erros de domínio herdando de DomainError (Atenção à grafia: "exeptions")
├── types/                        # Definições globais de tipos e interfaces TypeScript
└── generated/prisma/             # Cliente Prisma auto-gerado (não deve ser editado manualmente)
prisma/
├── schema.prisma                 # Definição do modelo de dados e schema do banco de dados
├── seed.ts                       # Script de sementes (inicialização de usuários padrão)
└── migrations/                   # Histórico de migrações do banco
test/
├── setup.ts                      # Configuração e hooks do banco isolado para execução de testes
├── *.e2e-spec.ts                 # Testes de ponta a ponta (E2E)
└── *.int-spec.ts                 # Testes de integração
```

---

## Convenções do Projeto

### 1. Nomenclatura de Arquivos e Classes
- **Arquivos**: `kebab-case.ts` (ex: `auth.controller.ts`, `prisma-user.repository.ts`).
- **Classes**: `PascalCase` (ex: `ChatService`, `PrismaUserRepository`).
- **Classes DTO**: `PascalCase` + sufixo `Dto` (ex: `ChatRequestDto`).
- **Interfaces**: `PascalCase` (sem o prefixo `I`).
- **Abstrações/Provedores**: Sufixo `Provider` (ex: `LLMProvider`, `EmbeddingProvider`).

### 2. Importações e Aliases de Caminho
Priorize os caminhos usando aliases configurados no `tsconfig.json`:
1. Use imports relativos apenas para arquivos dentro do **mesmo diretório** (ex: `import { BaseController } from './base.controller'`).
2. Use o alias `@/` para importações entre diferentes camadas (ex: `import { ChatService } from '@/services/chat.service'`).
3. **Atenção especial à grafia da pasta de exceções**: Use `@/exeptions/...` devido à grafia configurada no diretório físico.
4. Importe tipos do Prisma Client usando `@/generated/prisma/client`.

---

## Camadas da Arquitetura

### Controladores (`src/http/controllers/`)
- Todos os controladores REST devem estender `BaseController`.
- Devem injetar dependências necessárias no construtor como `private readonly`.
- Os payloads de entrada devem ser estritamente tipados e validados usando DTOs colocados na pasta `../dtos/`.
- Devem utilizar os métodos auxiliares herdados de `BaseController` para padronizar o formato de retorno da API:
  ```ts
  this.success(data, message?)        // Retorna status 200 { code: 200, ok: true, message, data }
  this.created(data, message?)        // Retorna status 201 { code: 201, ok: true, message, data }
  this.error(message?, code?)         // Retorna status 400 { code: 400, ok: false, message }
  this.notFound(message?)             // Retorna status 404 { code: 404, ok: false, message }
  ```

### Segurança e Guardas (`src/http/guards/` e `src/http/decorators/`)
- `JwtAuthGuard` valida tokens Bearer JWT recebidos no cabeçalho `Authorization`. É aplicado globalmente ou ao nível de controladores.
- Para tornar rotas públicas ou opcionais na validação de token (como o chat aberto), use o decorator `@Public()`.
- O payload verificado do JWT é atribuído a `request.user` e pode ser injetado nos endpoints usando o decorator `@CurrentUser()`.
- `RolesGuard` combinado com `@Roles(UserRole.ADMIN)` restringe acessos a rotas administrativas específicas.

### Serviços (`src/services/`)
- Devem ser marcados com `@Injectable()`.
- Todo serviço deve instanciar seu próprio logger: `private readonly logger = new Logger(NomeDoServico.name)`.
- Contêm as regras de negócio puras (ex: processamento de texto, lógica do RAG, etc.).

### Repositórios (`src/repositories/`)
- Encapsulam a lógica de acesso a dados via Prisma para desacoplar as tabelas dos serviços de negócio.
- Repositórios específicos são injetados diretamente em outros serviços ou controladores (ex: `PrismaKnowledgeChunkRepository`).

### Provedores de IA (`src/providers/ai/`)
- Seguem o padrão de contratos definidos por classes abstratas (`llm.provider.ts` e `embedding.provider.ts`).
- Implementações concretas estendem/implementam estas abstrações e são registradas no `AppModule` como provedores personalizados:
  - `{ provide: LLMProvider, useClass: GeminiProvider }`
  - `{ provide: EmbeddingProvider, useClass: OllamaEmbeddingProvider }`

---

## Integração com pgvector

Como o Prisma não possui suporte nativo integral a tipos e operadores de vetores de alta dimensionalidade, seguimos regras estritas para busca vetorial:

1. O campo de vetor é marcado no `schema.prisma` como `embedding Unsupported("vector(768)")?`.
2. Em queries sql raw, sempre converta a string do vetor usando casting explícito (`'[0.1, 0.2, ...]'::vector`) via `Prisma.raw()`.
3. Consultas vetoriais e cálculos de distância devem ser feitos via `$queryRaw` ou `$executeRaw` no repositório.
4. **Distância de Cosseno** e **Similaridade**:
   - Distância de cosseno: `embedding <=> ${vectorLiteral}`
   - Similaridade cosseno (usada para limiar de relevância): `1 - (embedding <=> ${vectorLiteral})`
5. **Atenção Ingestão vs Busca**: Não adicione metadados ou prefixos artificiais ao conteúdo do chunk ao gerar o embedding de ingestão (como `"Documento: Categoria: ..."`). O embedding do texto original e o embedding da pergunta livre do usuário devem ser puros para garantir a proximidade de cosseno ideal.

*Exemplo de consulta no repositório:*
```ts
const vectorLiteral = Prisma.raw(`'${embeddingVector}'::vector`);
const minSim = Prisma.raw(String(minSimilarity));

return this.prisma.$queryRaw<SearchResult[]>(
  Prisma.sql`
    SELECT id, content, category, source, 1 - (embedding <=> ${vectorLiteral}) AS similarity
    FROM knowledge_chunks
    WHERE 1 - (embedding <=> ${vectorLiteral}) > ${minSim}
    ORDER BY embedding <=> ${vectorLiteral}
    LIMIT ${limit}
  `
);
```

---

## Tratamento de Erros

- Exceções semânticas da camada de domínio estendem a classe abstrata `DomainError` e expõem a propriedade `statusCode` (ex: `EmailAlreadyExistsError` retorna `409 Conflict`).
- O `GlobalExceptionFilter` intercepta todas as exceções:
  - Subclasses de `DomainError` e `HttpException` (erros controlados) retornam seus respectivos códigos HTTP e mensagens personalizadas.
  - Erros inesperados (como falha no banco de dados ou erro de ponteiro nulo) retornam um status genérico `500 Internal Server Error` sem vazar logs internos ou detalhes do sistema para o cliente final.

---

## Scripts Disponíveis

| Comando | Descrição |
|---------|-------------|
| `pnpm start:dev` | Inicia a aplicação NestJS em modo de desenvolvimento com hot-reload (SWC) |
| `pnpm build` | Compila o projeto NestJS e resolve os aliases de caminhos (`tsc-alias`) |
| `pnpm lint` | Executa o ESLint em todo o código TypeScript para detectar problemas de estilo/sintaxe |
| `pnpm lint:fix` | Corrige automaticamente os avisos e erros identificados pelo ESLint |
| `pnpm format` | Formata todos os arquivos do projeto usando o Prettier |
| `pnpm test` | Roda toda a suíte de testes com o Vitest (Unitário, E2E, Integração) uma única vez |
| `pnpm test:watch` | Executa o executor do Vitest em modo watch para feedbacks rápidos |
| `pnpm test:cov` | Executa a cobertura de testes e exibe relatórios detalhado no terminal/HTML |
| `pnpm seed` | Executa o script de inserção de dados iniciais `prisma/seed.ts` utilizando a ferramenta `tsx` |

---

## Guia de Testes

Os testes são configurados via projetos multi-alvos no `vitest.config.mts`:

- **Testes Unitários**: Devem ser criados junto ao código-fonte com a extensão `*.spec.ts` (ex: `auth.service.spec.ts`).
- **Testes E2E (End-to-End)**: Devem ser criados na pasta `/test` com a extensão `*.e2e-spec.ts`.
- **Testes de Integração**: Devem ser criados na pasta `/test` com a extensão `*.int-spec.ts`.
- Quando escrever um ou mais testes para uma feature, quando rodar, rode somente o teste que foi criado, não todos

### Banco de Dados Isolado para Testes
O arquivo `test/setup.ts` garante que cada suíte de testes execute em isolamento completo. Ele:
1. Gera um esquema aleatório PostgreSQL (`test_uuid`).
2. Altera a URL de conexão do banco injetando dinamicamente o novo esquema.
3. Executa `npx prisma migrate deploy` para carregar a estrutura das tabelas.
4. Após a execução de todos os testes, o esquema gerado é destruído (`DROP SCHEMA CASCADE`).
