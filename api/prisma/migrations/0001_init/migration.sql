-- prisma/migrations/0001_init/migration.sql
-- Esta migration é aplicada via: npx prisma migrate dev

-- Habilita a extensão pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabela de chunks de conhecimento
CREATE TABLE "knowledge_chunks" (
  "id"        SERIAL PRIMARY KEY,
  "content"   TEXT NOT NULL,
  "embedding" VECTOR(384),        -- dimensão do nomic-embed-text
  "category"  TEXT NOT NULL DEFAULT 'geral',
  "source"    TEXT NOT NULL DEFAULT 'manual',
  "metadata"  JSONB NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índice vetorial para busca rápida por similaridade (cosine)
-- ivfflat é o índice padrão do pgvector, lists=100 é bom para até ~100k chunks
CREATE INDEX knowledge_chunks_embedding_idx
  ON "knowledge_chunks"
  USING ivfflat ("embedding" vector_cosine_ops)
  WITH (lists = 100);

-- Tabela de logs de chat
CREATE TABLE "chat_logs" (
  "id"         SERIAL PRIMARY KEY,
  "question"   TEXT NOT NULL,
  "answer"     TEXT NOT NULL,
  "sources"    JSONB NOT NULL DEFAULT '[]',
  "similarity" FLOAT,
  "createdAt"  TIMESTAMP NOT NULL DEFAULT NOW()
);