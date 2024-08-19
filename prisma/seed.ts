import { PrismaClient } from '@prisma/client';
import categories from './data/categories';

const prisma = new PrismaClient();

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {
        name: category.name,
        description: category.description,
      },
      create: category,
    });
  }
}

main()
  .catch((e) => {
    console.error('Error:', e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
