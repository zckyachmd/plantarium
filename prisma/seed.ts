import { PrismaClient } from '@prisma/client';
import categories from './data/categories';

const prisma = new PrismaClient();

async function main() {
  // Use transactions to ensure all operations succeed or fail together
  await prisma.$transaction(async (tx) => {
    // Batch upsert categories
    await Promise.all(
      categories.map((category) =>
        tx.category.upsert({
          where: category,
          update: category,
          create: category,
        })
      )
    );
  });
}

main()
  .catch((e) => {
    console.error('Error:', e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
