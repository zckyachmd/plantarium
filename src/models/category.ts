import {
  Prisma,
  PrismaClient,
  Category as PrismaCategory,
} from "@prisma/client";
import { buildQueryOptions } from "../utils/prismaUtils";
import { parseInclude } from "../utils/stringUtils";

export const prisma = new PrismaClient();

/**
 * Retrieves all categories from the database with optional filtering, sorting, and including related data.
 *
 * @param {Record<string, any>} filters - Additional filters to apply to the query. Defaults to an empty object.
 * @param {Record<string, 'asc' | 'desc'>} sort - Sorting options for the query. Defaults to an empty object.
 * @param {string} include - Comma-separated list of relations to include in the query
 * @return {Promise<PrismaCategory[]>} A promise that resolves to the list of categories.
 */
export async function getCategories(
  filters: Record<string, any> = {},
  sort: Record<string, "asc" | "desc"> = {},
  include?: string
): Promise<PrismaCategory[]> {
  const includeConditions = include ? parseInclude(include) : {};
  const queryOptions = buildQueryOptions(filters, sort, includeConditions);

  try {
    return await prisma.category.findMany(queryOptions);
  } catch (error) {
    console.error("Error retrieving categories:", error);
    throw new Error("An error occurred while retrieving categories.");
  }
}

/**
 * Retrieves a category object from the database by its ID.
 *
 * @param {number} id - The ID of the category to retrieve
 * @param {string} include - Comma-separated list of relations to include in the query
 * @return {PrismaCategory | null} The category object if found, or null if not found
 */
export async function getCategory(
  id: number,
  include?: string
): Promise<PrismaCategory | null> {
  const includeConditions = include ? parseInclude(include) : {};

  return prisma.category.findUnique({
    where: { id },
    include:
      Object.keys(includeConditions).length > 0 ? includeConditions : undefined,
  });
}

/**
 * Creates a new category in the database and returns it as a JSON response.
 *
 * @param {PrismaCategory} data - The data to create the category with
 * @return {Promise<PrismaCategory>} The newly created plant
 */
export async function createCategory(
  data: Prisma.CategoryCreateInput
): Promise<PrismaCategory> {
  return prisma.category.create({ data });
}

/**
 * Updates a category in the database by its ID.
 *
 * @param {number} id - The ID of the category to update
 * @param {PrismaCategoryUpdateInput} data - The data to update the category with
 * @return {PrismaCategory} The updated category
 */
export async function updateCategory(
  id: number,
  data: Prisma.CategoryUpdateInput
): Promise<PrismaCategory> {
  return prisma.category.update({ where: { id }, data });
}

/**
 * Deletes a category from the database by its ID.
 *
 * @param {number} id - The ID of the category to delete
 * @return {Promise<void>} A promise that resolves when the category is deleted
 */
export async function deleteCategory(id: number): Promise<void> {
  await prisma.category.delete({ where: { id } });
}

/**
 * Deletes all categories from the database.
 *
 * @return {Promise<void>} A promise that resolves when the categories are deleted
 */
export async function deleteCategories(): Promise<void> {
  await prisma.category.deleteMany();
}
