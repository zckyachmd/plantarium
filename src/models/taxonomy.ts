import {
  Prisma,
  PrismaClient,
  Taxonomy as PrismaTaxonomy,
} from '@prisma/client';
import { buildQueryOptions } from '../utils/prismaUtils';

export const prisma = new PrismaClient();

/**
 * Retrieves a list of taxonomies from the database with optional filtering and sorting.
 *
 * @param {Record<string, any>} filters - Additional filters to apply to the query. Defaults to an empty object.
 * @param {Record<string, 'asc' | 'desc'>} sort - Sorting options for the query. Defaults to an empty object.
 * @return {Promise<PrismaTaxonomy[]>} A promise that resolves to the list of taxonomies.
 */
export async function getTaxonomies(
  filters: Record<string, any> = {},
  sort: Record<string, 'asc' | 'desc'> = {}
): Promise<PrismaTaxonomy[]> {
  const queryOptions = buildQueryOptions(filters, sort);

  try {
    return await prisma.taxonomy.findMany(queryOptions);
  } catch (error) {
    console.error('Error retrieving taxonomies:', error);
    throw new Error('An error occurred while retrieving taxonomies.');
  }
}

/**
 * Retrieves a taxonomy from the database by its ID and returns it as a JSON response.
 *
 * @param {number} id - The ID of the taxonomy to retrieve.
 * @return {Promise<Response>} A JSON response containing the taxonomy if found, or an error message if not found or an error occurred.
 */
export async function getTaxonomy(
  id: number
): Promise<PrismaTaxonomy | null> {
  if (isNaN(id)) {
    throw new Error('Invalid ID!');
  }

  return prisma.taxonomy.findUnique({
    where: { id },
  });
}

/**
 * Creates a new taxonomy in the database
 *
 * @param {PrismaTaxonomyCreateInput} data - The data to create the taxonomy with.
 * @return {Promise<PrismaTaxonomy>} A promise that resolves to the created taxonomy.
 */
export async function createTaxonomy(
  data: Prisma.TaxonomyCreateInput
): Promise<PrismaTaxonomy> {
  return prisma.taxonomy.create({ data });
}

/**
 * Updates a taxonomy in the database by its ID.
 *
 * @param {number} id - The ID of the taxonomy to update.
 * @param {PrismaTaxonomyUpdateInput} data - The data to update the taxonomy with.
 * @return {Promise<PrismaTaxonomy>} A promise that resolves to the updated taxonomy.
 */
export async function updateTaxonomy(
  id: number,
  data: Prisma.TaxonomyUpdateInput
): Promise<PrismaTaxonomy> {
  return prisma.taxonomy.update({ where: { id }, data });
}

/**
 * Deletes a taxonomy from the database by its ID.
 *
 * @param {number} id - The ID of the taxonomy to delete.
 * @return {Promise<void>} A promise that resolves when the taxonomy is deleted.
 */
export async function deleteTaxonomy(id: number): Promise<void> {
  await prisma.taxonomy.delete({ where: { id } });
}

/**
 * Deletes all taxonomies from the database.
 *
 * @return {Promise<void>} A promise that resolves when all taxonomies are deleted.
 */
export async function deleteTaxonomies(): Promise<void> {
  await prisma.taxonomy.deleteMany();
}