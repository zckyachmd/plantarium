import { z } from "@hono/zod-openapi";
import { Prisma, PrismaClient, Variety as PrismaVariety } from "@prisma/client";
import { buildQueryOptions } from "../utils/prismaUtils";
import { parseInclude } from "../utils/stringUtils";
import * as varietySchema from "../schemas/varietySchema";

export const prisma = new PrismaClient();

/**
 * Retrieves a list of varieties from the database based on the provided filters, sorting options, and included relations.
 *
 * @param {Record<string, any>} filters - Additional filters to apply to the query. Defaults to an empty object.
 * @param {Record<string, 'asc' | 'desc'>} sort - Sorting options for the query. Defaults to an empty object.
 * @param {string} include - Comma-separated list of relations to include in the query
 * @return {Promise<PrismaVariety[]>} A promise that resolves to the list of varieties.
 * @throws {Error} If an error occurs while retrieving the varieties.
 */
export async function getVarieties(
  filters: Record<string, any> = {},
  sort: Record<string, "asc" | "desc"> = {},
  include?: string
) {
  const includeConditions = include ? parseInclude(include) : {};
  const queryOptions = buildQueryOptions(filters, sort, includeConditions);

  try {
    return await prisma.variety.findMany(queryOptions);
  } catch (error) {
    console.error("Error retrieving varieties:", error);
    throw new Error("An error occurred while retrieving varieties.");
  }
}

/**
 * Retrieves a variety object from the database by its ID.
 *
 * @param {number} id - The ID of the variety to retrieve
 * @param {string} include - Comma-separated list of relations to include in the query
 * @return {PrismaVariety | null} The variety object if found, or null if not found
 */
export async function getVariety(
  id: number,
  include?: string
): Promise<PrismaVariety | null> {
  const includeConditions = include ? parseInclude(include) : {};

  return prisma.variety.findUnique({
    where: { id },
    include:
      Object.keys(includeConditions).length > 0 ? includeConditions : undefined,
  });
}

/**
 * Creates a new variety in the database.
 *
 * @param {Prisma.VarietyCreateInput} data - The data to create the variety with.
 * @return {Promise<PrismaVariety>} The newly created variety.
 */
export async function createVariety(
  data: z.infer<typeof varietySchema.CreateVarietySchema>
): Promise<PrismaVariety> {
  return prisma.variety.create({
    data: {
      name: data.name,
      scientificName: data.scientificName,
      origin: data.origin,
      genus: data.genus,
      species: data.species,
      description: data.description,
      synonyms: data.synonyms,
      taxonomy: { connect: { id: data.taxonomyId } },
    },
  });
}

/**
 * Updates a variety in the database.
 *
 * @param {number} id - The ID of the variety to update.
 * @param {Prisma.VarietyUpdateInput} data - The data to update the variety with.
 * @return {Promise<PrismaVariety | null>} The updated variety, or null if not found.
 */
export async function updateVariety(
  id: number,
  data: Prisma.VarietyUpdateInput
): Promise<PrismaVariety | null> {
  return prisma.variety.update({ where: { id }, data });
}

/**
 * Deletes a variety from the database.
 *
 * @param {number} id - The ID of the variety to delete.
 * @return {Promise<PrismaVariety | null>} The deleted variety, or null if not found.
 */
export async function deleteVariety(id: number): Promise<PrismaVariety | null> {
  return prisma.variety.delete({ where: { id } });
}

/**
 * Deletes all varieties from the database.
 *
 * @return {Promise<void>} A promise that resolves when the deletion is complete.
 */
export async function deleteVarieties(): Promise<void> {
  await prisma.variety.deleteMany({});
}
