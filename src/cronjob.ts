import { PrismaClient } from "@prisma/client";
import { exec } from "child_process";
import { promisify } from "util";
import cron from "node-cron";

const execPromise = promisify(exec);
const prisma = new PrismaClient();

const resetData: () => Promise<void> = async () => {
  try {
    // Reset existing data
    await prisma.$transaction([
      prisma.variety.deleteMany(),
      prisma.taxonomy.deleteMany(),
      prisma.category.deleteMany(),
    ]);

    // Reset primary keys
    await prisma.$executeRaw`TRUNCATE TABLE "Variety" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Taxonomy" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE`;

    // Seed new data
    await execPromise("bun run prisma/seed.ts");
    console.log("Data reset and seeding completed successfully.");
  } catch (error) {
    console.error("Error during data reset and seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
};

/**
 * Schedule listening for cron job.
 * Example:
 *   cron.schedule("0 0 * * *", resetData);
 *   0 0 * * * >> every day at 00:00 
 */
cron.schedule("0 0 * * *", resetData);
