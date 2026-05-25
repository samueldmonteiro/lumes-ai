# AGENTS.md — API (NestJS)

## Description

Api para um chatbot de IA, que usa RAG juntamente com um modelo de IA externo para gerar respostas para consultas.

## Stack
- **Framework**: NestJS 11 + Express 5
- **Language**: TypeScript 5.9 (strict), ES2023 target
- **ORM**: Prisma 7 (PostgreSQL + pgvector)
- **Validation**: `class-validator` + `class-transformer` (global `ValidationPipe`)
- **API Docs**: Swagger (`@nestjs/swagger`)
- **Testing**: Vitest 3 + SWC transforms
- **Package manager**: pnpm
- **Lint/Format**: ESLint (typescript-eslint strict) + Prettier

## Scripts
| Command | Description |
|---------|-------------|
| `pnpm start:dev` | Dev watch mode (SWC) |
| `pnpm build` | Compila + tsc-alias |
| `pnpm lint` | ESLint check |
| `pnpm lint:fix` | ESLint auto-fix |
| `pnpm format` | Prettier format |
| `pnpm test` | Vitest (unit + int + e2e) |
| `pnpm test:watch` | Vitest watch mode |
| `pnpm seed` | Executa prisma/seed.ts com tsx |

## Project Structure
```
src/
├── main.ts                       # Bootstrap (NestFactory, CORS, Swagger, ValidationPipe)
├── app.module.ts                 # Root module (DI bindings)
├── http/
│   ├── controllers/              # Route handlers (extend BaseController)
│   ├── dtos/                     # class-validator DTOs
│   └── filters/                  # GlobalExceptionFilter
├── services/                     # Business logic (injectable)
├── providers/
│   └── ai/
│       ├── LLM/                  # LLMProvider abstract + GeminiProvider
│       └── embedding/            # EmbeddingProvider abstract + OllamaEmbeddingProvider
├── lib/                          # Utility functions (extractors)
├── exceptions/                   # DomainError base class
└── generated/prisma/             # Auto-generated Prisma client (do not edit)
prisma/
├── schema.prisma                 # Data model
└── migrations/                   # Prisma migrations
test/
├── setup.ts                      # Isolated schema per test run
├── *.e2e-spec.ts                 # E2E tests
└── *.int-spec.ts                 # Integration tests
```

## Conventions

### Naming
- Files: `kebab-case.ts`
- Classes: `PascalCase`
- DTO classes: `PascalCase` + `Dto` suffix
- Interfaces: `PascalCase` (no `I` prefix)
- Abstract providers: `Provider` suffix (`LLMProvider`, `EmbeddingProvider`)

### Imports (priority order)
1. Relative imports for same-directory files (`./base.controller`)
2. `@/` alias for cross-layer (`@/services/chat.service`, `@/providers/ai/LLM/llm.provider`, `@/exeptions/domain.error`)
3. `@/generated/prisma/client` for Prisma client/types

### Controllers
- Always extend `BaseController`
- Use `@Controller('resource')` decorator
- Constructor injection with `private readonly`
- Re-export DTOs from `../dtos/` directory
- Return responses using `this.success()`, `this.created()`, `this.error()`, `this.notFound()`
- Response shape: `{ code: number, ok: boolean, message: string, data?: T }`

### Services
- `@Injectable()` decorator
- Private `logger` = `new Logger(ServiceName.name)`
- Constructor injection
- Exported interfaces/types co-located in same file

### Providers (abstractions)
- Abstract class defines contract in its own file
- Concrete implementation uses `implements ProviderInterface`
- Module binding: `{ provide: LLMProvider, useClass: GeminiProvider }`
- `OnModuleInit` for async initialization (lazy imports)

### Error handling
- `DomainError` (abstract) → custom semantic errors with `statusCode`
- `GlobalExceptionFilter` handles: DomainError → HttpException → unexpected (500)
- Never expose internal error details to client (500 → generic message)

### Testing
- **Integration**: `test/**/*.int-spec.ts`
- **E2E**: `test/**/*.e2e-spec.ts`
- Setup creates isolated PostgreSQL schema per test run (auto-cleanup)
- Use `@nestjs/testing` `Test.createTestingModule`

### pgvector
- Prisma marks `embedding` as `Unsupported("vector(768)")`
- Always use `Prisma.raw()` for vector literals (bind params don't work)
- Query with `$queryRaw` / `$executeRaw`
- Cosine distance: `embedding <=> ${vectorLiteral}`
- Similarity: `1 - (embedding <=> ${vectorLiteral})`

### API response helpers (BaseController)
```ts
this.success(data, message?)        // 200
this.created(data, message?)        // 201
this.error(message?, code?)         // 400
this.notFound(message?)             // 404
```

### Code style
- 2-space indentation, semicolons required
- Single quotes, trailing commas (enforced by Prettier + ESLint)
- No comments on implementation code
- ESLint rules: `no-explicit-any: off`, `no-floating-promises: warn`
