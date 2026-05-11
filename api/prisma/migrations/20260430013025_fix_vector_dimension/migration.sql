-- AlterTable
ALTER TABLE "knowledge_chunks" ALTER COLUMN "embedding" TYPE vector(768);

-- Recreate index
CREATE INDEX "knowledge_chunks_embedding_idx" ON "knowledge_chunks" USING ivfflat ("embedding" vector_cosine_ops) WITH (lists = 100);