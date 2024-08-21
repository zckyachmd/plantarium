import { Context } from 'hono';
import { successResponse, errorResponse } from '../utils/responseUtils';
import { handlePrismaError } from '../utils/prismaUtils';
import * as categoryModel from '../models/category';
import * as stringUtils from '../utils/stringUtils';

/**
 * Retrieves all categories from the database and returns them as a JSON response.
 *
 * @param {Context} c - The Hono context object.
 * @return {Promise<Response>} A JSON response containing the list of categories or an error response if the operation fails.
 */
export async function getCategories(c: Context): Promise<Response> {
  const queryParams = c.req.query();
  const filters = stringUtils.parseQuery(queryParams.filter);
  const sort = stringUtils.parseQuery(queryParams.sort);
  const include = c.req.query('include');

  try {
    const categories = await categoryModel.getCategories(
      filters,
      sort,
      include
    );

    if (!categories || categories.length === 0) {
      return c.json(errorResponse('Categories not found'), { status: 404 });
    }

    return c.json(
      successResponse('Categories retrieved successfully', categories)
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
 * Retrieves a category from the database by its ID and returns it as a JSON response.
 *
 * @param {Context} c - The Hono context object.
 * @return {Promise<Response>} A JSON response containing the category if found, or an error message if not found or an error occurred.
 */
export async function getCategory(c: Context): Promise<Response> {
  const id = parseInt(c.req.param('id'));
  const include = c.req.query('include');

  try {
    const category = await categoryModel.getCategory(id, include);
    if (!category) {
      return c.json(errorResponse('Category not found!'), { status: 404 });
    }

    return c.json(successResponse('Category retrieved successfully', category));
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
 * Creates a new category in the database and returns it as a JSON response.
 *
 * @param {Context} c - The Hono context object.
 * @return {Promise<Response>} A JSON response containing the newly created category, or an error message if creation failed.
 */
export async function createCategory(c: Context): Promise<Response> {
  const body = await c.req.json();

  try {
    const existingCategory = await categoryModel.prisma.category.findFirst({
      where: { name: body.name },
    });

    if (existingCategory) {
      return c.json(errorResponse('Category already exists!'), { status: 409 });
    }

    const newCategory = await categoryModel.createCategory(body);

    return c.json(
      successResponse('Category created successfully', newCategory),
      { status: 201 }
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
 * Updates an existing category in the database and returns the updated category as a JSON response.
 *
 * @param {Context} c - The Hono context object.
 * @return {Promise<Response>} A JSON response containing the updated category, or an error message if the update failed.
 */
export async function updateCategory(c: Context): Promise<Response> {
  const id = parseInt(c.req.param('id'));
  const body = await c.req.json();

  try {
    const existingCategory = await categoryModel.prisma.category.findFirst({
      where: {
        OR: [{ id }, { name: body.name, id: { not: id } }],
      },
    });

    if (!existingCategory) {
      return c.json(errorResponse('Category not found!'), { status: 404 });
    }

    if (existingCategory.name === body.name && existingCategory.id !== id) {
      return c.json(errorResponse('Category already exists!'), { status: 409 });
    }

    const updatedCategory = await categoryModel.updateCategory(id, body);

    return c.json(
      successResponse('Category updated successfully', updatedCategory)
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
 * Deletes a category from the database by its ID and returns a success message as a JSON response.
 *
 * @param {Context} c - The Hono context object.
 * @return {Promise<Response>} A JSON response containing a success message if the deletion was successful, or an error message if the deletion failed.
 */
export async function deleteCategory(c: Context): Promise<Response> {
  const id = parseInt(c.req.param('id'));

  try {
    const existingCategory = await categoryModel.getCategory(id);
    if (!existingCategory) {
      return c.json(errorResponse('Category not found!'), { status: 404 });
    }

    await categoryModel.deleteCategory(id);

    return c.json(successResponse('Category deleted successfully'));
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
 * Deletes all categories from the database and returns a success message as a JSON response.
 *
 * @param {Context} c - The Hono context object.
 * @return {Promise<Response>} A JSON response containing a success message if the deletion was successful, or an error message if the deletion failed.
 */
export async function deleteCategories(c: Context): Promise<Response> {
  try {
    await categoryModel.deleteCategories();

    return c.json(successResponse('Categories deleted successfully'));
  } catch (error) {
    const {
      error: errorMessage,
      details,
      errorCode,
    } = handlePrismaError(error);
    return c.json(errorResponse(errorMessage, details), { status: errorCode });
  }
}
