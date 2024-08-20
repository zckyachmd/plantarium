import { PrismaClient } from '@prisma/client';
import categories from './data/categories';
import taxonomies from './data/taxonomies';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$transaction(async (tx) => {
      // Batch upsert categories
      await Promise.all(
        categories.map((category) =>
          tx.category.upsert({
            where: { name: category.name },
            update: category,
            create: category,
          })
        )
      );

      // Batch upsert taxonomies
      await Promise.all(
        taxonomies.map((taxonomy) =>
          tx.taxonomy.upsert({
            where: {
              kingdom_phylum_class_order_family_genus_species: {
                kingdom: taxonomy.kingdom,
                phylum: taxonomy.phylum,
                class: taxonomy.class,
                order: taxonomy.order,
                family: taxonomy.family,
                genus: taxonomy.genus,
                species: taxonomy.species,
              },
            },
            update: taxonomy,
            create: taxonomy,
          })
        )
      );
    });

    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
