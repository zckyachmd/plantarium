import { PrismaClient } from "@prisma/client";
import { exec } from "child_process";
import { promisify } from "util";
import { CronJob } from "cron";

const execPromise = promisify(exec);
const prisma = new PrismaClient();

/**
 * Schedule listening for cron job.
 * Example:
 *   new CronJob("0 0 * * *", () => {}, null, true, "Asia/Jakarta");
 *   0 0 * * * >> every day at 00:00
 */
export const cronJob = new CronJob(
  "0 0 * * *",
  async () => {
    try {
      await prisma.$transaction(async (prismaTx) => {
        // Execute TRUNCATE within the transaction
        await prismaTx.$executeRaw`TRUNCATE TABLE "Variety" RESTART IDENTITY CASCADE`;
        await prismaTx.$executeRaw`TRUNCATE TABLE "Taxonomy" RESTART IDENTITY CASCADE`;
        await prismaTx.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE`;
      });

      // Seed new data outside of the transaction
      await execPromise("bun run prisma/seed.ts");

      console.log("Data reset and seeding completed successfully.");
    } catch (error) {
      console.error("Error during data reset and seeding:", error);
    } finally {
      await prisma.$disconnect();
    }
  },
  null,
  true,
  "Asia/Jakarta"
);
