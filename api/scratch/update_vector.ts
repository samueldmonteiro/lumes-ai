import { prisma } from '../src/lib/prisma';

async function main() {
  try {
    console.log('Updating vector dimension...');
    await prisma.$executeRawUnsafe('ALTER TABLE knowledge_chunks ALTER COLUMN embedding TYPE vector(768);');
    console.log('Success!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
}

main();
