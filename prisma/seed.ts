import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Users Defaults
const users = [
  {
    username: "admin",
    email: "admin@mail.com",
    password: "admin",
  },
];

async function main() {
  try {
    const filePath = path.join(__dirname, "samples.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const samples = JSON.parse(rawData);

    await prisma.$transaction(async (tx) => {
      // Users samples
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await tx.user.upsert({
          where: { email: user.email },
          update: {},
          create: {
            username: user.username,
            email: user.email,
            password: hashedPassword,
          },
        });
      });

      // Plant samples
      await Promise.all(
        samples.map(async (sample: any) => {
          const categories = await Promise.all(
            sample.categories.map(async (categoryName: string) =>
              tx.category.upsert({
                where: { name: categoryName },
                update: {},
                create: { name: categoryName },
              })
            )
          );

          const taxonomy = await tx.taxonomy.upsert({
            where: {
              kingdom_phylum_class_order_family: {
                kingdom: sample.taxonomy.kingdom,
                phylum: sample.taxonomy.phylum,
                class: sample.taxonomy.class,
                order: sample.taxonomy.order,
                family: sample.taxonomy.family,
              },
            },
            update: {},
            create: {
              kingdom: sample.taxonomy.kingdom,
              phylum: sample.taxonomy.phylum,
              class: sample.taxonomy.class,
              order: sample.taxonomy.order,
              family: sample.taxonomy.family,
            },
          });

          await tx.variety.upsert({
            where: { name: sample.name },
            update: {
              scientificName: sample.scientificName,
              description: sample.description,
              origin: sample.origin,
              synonyms: sample.synonyms,
              genus: sample.genus,
              species: sample.species,
              taxonomyId: taxonomy.id,
              categories: {
                connect: categories.map((category) => ({ id: category.id })),
              },
            },
            create: {
              name: sample.name,
              scientificName: sample.scientificName,
              description: sample.description,
              origin: sample.origin,
              synonyms: sample.synonyms,
              genus: sample.genus,
              species: sample.species,
              taxonomyId: taxonomy.id,
              categories: {
                connect: categories.map((category) => ({ id: category.id })),
              },
            },
          });
        })
      );
    });

    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
