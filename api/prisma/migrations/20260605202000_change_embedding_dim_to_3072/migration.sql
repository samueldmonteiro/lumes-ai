-- AlterTable: change vector dimension from 768 to 3072 for Gemini embedding
ALTER TABLE "knowledge_chunks" DROP COLUMN embedding;
ALTER TABLE "knowledge_chunks" ADD COLUMN embedding public.vector(3072);
