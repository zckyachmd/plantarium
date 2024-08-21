import { Context } from 'hono';
import { successResponse, errorResponse } from '../utils/responseUtils';
import { handlePrismaError } from '../utils/prismaUtils';
import * as taxonomyModel from '../models/taxonomy';
import * as stringUtils from '../utils/stringUtils';

/**
 * Retrieves a list of taxonomies based on the provided query parameters.
 *
 * @param {Context} c - The Hono context object.
 * @return {Promise<Response>} A promise that resolves to the HTTP response containing the list of taxonomies.
 */
export async function getTaxonomies(c: Context): Promise<Response> {
  const queryParams = c.req.query();
  const filters = stringUtils.parseQuery(queryParams.filter);
  const sort = stringUtils.parseQuery(queryParams.sort);
  const include = c.req.query('include');

  try {
    const taxonomies = await taxonomyModel.getTaxonomies(
      filters,
      sort,
      include
    );

    if (!taxonomies || taxonomies.length === 0) {
      return c.json(errorResponse('Taxonomies not found'), { status: 404 });
    }

    return c.json(
      successResponse('Taxonomies retrieved successfully', taxonomies)
    );
  } catch (error) {
    const {
      error: errorMessage,
      details,
      errorCode,
    } = handlePrismaError(error);
    return c.json(errorResponse(errorMessage, details), { status: errorCode });
  }
}

/**
 * Retrieves a taxonomy based on the provided id parameter.
 *
 * @param {Context} c - The Hono context object.
 * @return {Promise<Response>} A promise that resolves to the HTTP response containing the taxonomy.
 */
export async function getTaxonomy(c: Context): Promise<Response> {
  const id = parseInt(c.req.param('id'));
  const include = c.req.query('include');

  try {
    const taxonomy = await taxonomyModel.getTaxonomy(id, include);
    if (!taxonomy) {
      return c.json(errorResponse('Taxonomy not found!'), { status: 404 });
    }

    return c.json(successResponse('Taxonomy retrieved successfully', taxonomy));
  } catch (error) {
    const {
      error: errorMessage,
      details,
      errorCode,
    } = handlePrismaError(error);
    return c.json(errorResponse(errorMessage, details), { status: errorCode });
  }
}

/**
 * Creates a new taxonomy in the database.
 *
 * @param {Context} c - The Hono context object.
 * @return {Promise<Response>} A promise that resolves to the HTTP response containing the created taxonomy.
 */
export async function createTaxonomy(c: Context): Promise<Response> {
  const body = await c.req.json();

  const data = {
    kingdom: body.kingdom,
    phylum: body.phylum,
    class: body.taxonomyClass,
    order: body.order,
    family: body.family,
  };

  try {
    const existingTaxonomy = await taxonomyModel.prisma.taxonomy.findFirst({
      where: data,
    });

    if (existingTaxonomy) {
      return c.json(errorResponse('Taxonomy already exists!'), { status: 409 });
    }

    const taxonomy = await taxonomyModel.createTaxonomy(data);

    return c.json(
      successResponse('Taxonomy created successfully', taxonomy),
      201
    );
  } catch (error) {
    const {
      error: errorMessage,
      details,
      errorCode,
    } = handlePrismaError(error);
    return c.json(errorResponse(errorMessage, details), { status: errorCode });
  }
}

/**
 * Updates an existing taxonomy in the database.
 *
 * @param {Context} c - The Hono context object.
 * @return {Promise<Response>} A promise that resolves to the HTTP response containing the updated taxonomy.
 */
export async function updateTaxonomy(c: Context): Promise<Response> {
  const id = parseInt(c.req.param('id'));
  const body = await c.req.json();

  try {
    const data = {
      kingdom: body.kingdom,
      phylum: body.phylum,
      class: body.taxonomyClass,
      order: body.order,
      family: body.family,
    };

    const existingTaxonomy = await taxonomyModel.prisma.taxonomy.findFirst({
      where: {
        OR: [{ id: id }, { ...data, id: { not: id } }],
      },
    });

    if (existingTaxonomy) {
      if (existingTaxonomy.id === body.id) {
        return c.json(
          successResponse('Taxonomy already exists with the same ID'),
          { status: 409 }
        );
      }
    }

    const taxonomy = await taxonomyModel.updateTaxonomy(id, data);

    return c.json(successResponse('Taxonomy updated successfully', taxonomy));
  } catch (error) {
    const {
      error: errorMessage,
      details,
      errorCode,
    } = handlePrismaError(error);
    return c.json(errorResponse(errorMessage, details), { status: errorCode });
  }
}

/**
 * Deletes a taxonomy from the database.
 *
 * @param {Context} c - The Hono context object.
 * @return {Promise<Response>} A promise that resolves to the HTTP response containing the deleted taxonomy.
 */
export async function deleteTaxonomy(c: Context): Promise<Response> {
  const id = parseInt(c.req.param('id'));

  try {
    const existingTaxonomy = await taxonomyModel.getTaxonomy(id);
    if (!existingTaxonomy) {
      return c.json(errorResponse('Taxonomy not found!'), { status: 404 });
    }

    await taxonomyModel.deleteTaxonomy(id);

    return c.json(successResponse('Taxonomy deleted successfully'));
  } catch (error) {
    const {
      error: errorMessage,
      details,
      errorCode,
    } = handlePrismaError(error);
    return c.json(errorResponse(errorMessage, details), { status: errorCode });
  }
}

/**
 * Deletes all taxonomies from the database.
 *
 * @param {Context} c - The Hono context object.
 * @return {Promise<Response>} A promise that resolves to the HTTP response containing the result of the deletion.
 */
export async function deleteTaxonomies(c: Context): Promise<Response> {
  try {
    await taxonomyModel.deleteTaxonomies();

    return c.json(successResponse('Taxonomies deleted successfully'));
  } catch (error) {
    const {
      error: errorMessage,
      details,
      errorCode,
    } = handlePrismaError(error);
    return c.json(errorResponse(errorMessage, details), { status: errorCode });
  }
}
