import { createFactory } from "hono/factory";
import { successResponse, errorResponse } from "../utils/responseUtils";
import { handlePrismaError } from "../utils/prismaUtils";
import * as stringUtils from "../utils/stringUtils";
import * as categoryModel from "../models/category";

const factory = createFactory();

export const getCategories = factory.createHandlers(
  async (c): Promise<Response> => {
    const queryParams = c.req.query();
    const filters = stringUtils.parseQuery(queryParams.filter);
    const sort = stringUtils.parseQuery(queryParams.sort);
    const include = c.req.query("include");

    try {
      const categories = await categoryModel.getCategories(
        filters,
        sort,
        include
      );

      if (!categories || categories.length === 0) {
        return c.json(errorResponse("Categories not found"), { status: 404 });
      }

      return c.json(
        successResponse("Categories retrieved successfully", categories)
      );
    } catch (error) {
      const {
        error: errorMessage,
        details,
        errorCode,
      } = handlePrismaError(error);
      return c.json(errorResponse(errorMessage, details), {
        status: errorCode,
      });
    }
  }
);

export const getCategory = factory.createHandlers(
  async (c): Promise<Response> => {
    const id = parseInt(c.req.param("id"));
    const include = c.req.query("include");

    try {
      const category = await categoryModel.getCategory(id, include);
      if (!category) {
        return c.json(errorResponse("Category not found!"), { status: 404 });
      }

      return c.json(
        successResponse("Category retrieved successfully", category)
      );
    } catch (error) {
      const {
        error: errorMessage,
        details,
        errorCode,
      } = handlePrismaError(error);
      return c.json(errorResponse(errorMessage, details), {
        status: errorCode,
      });
    }
  }
);

export const createCategory = factory.createHandlers(
  async (c): Promise<Response> => {
    const body = await c.req.json();

    try {
      const existingCategory = await categoryModel.prisma.category.findFirst({
        where: { name: body.name },
      });

      if (existingCategory) {
        return c.json(errorResponse("Category already exists!"), {
          status: 409,
        });
      }

      const newCategory = await categoryModel.createCategory(body);

      return c.json(
        successResponse("Category created successfully", newCategory),
        { status: 201 }
      );
    } catch (error) {
      const {
        error: errorMessage,
        details,
        errorCode,
      } = handlePrismaError(error);
      return c.json(errorResponse(errorMessage, details), {
        status: errorCode,
      });
    }
  }
);

export const updateCategory = factory.createHandlers(
  async (c): Promise<Response> => {
    const id = parseInt(c.req.param("id"));
    const body = await c.req.json();

    try {
      const existingCategory = await categoryModel.prisma.category.findFirst({
        where: {
          OR: [{ id }, { name: body.name, id: { not: id } }],
        },
      });

      if (!existingCategory) {
        return c.json(errorResponse("Category not found!"), { status: 404 });
      }

      if (existingCategory.name === body.name && existingCategory.id !== id) {
        return c.json(errorResponse("Category already exists!"), {
          status: 409,
        });
      }

      const updatedCategory = await categoryModel.updateCategory(id, body);

      return c.json(
        successResponse("Category updated successfully", updatedCategory)
      );
    } catch (error) {
      const {
        error: errorMessage,
        details,
        errorCode,
      } = handlePrismaError(error);
      return c.json(errorResponse(errorMessage, details), {
        status: errorCode,
      });
    }
  }
);

export const deleteCategory = factory.createHandlers(
  async (c): Promise<Response> => {
    const id = parseInt(c.req.param("id"));

    try {
      const existingCategory = await categoryModel.getCategory(id);
      if (!existingCategory) {
        return c.json(errorResponse("Category not found!"), { status: 404 });
      }

      await categoryModel.deleteCategory(id);

      return c.json(successResponse("Category deleted successfully"));
    } catch (error) {
      const {
        error: errorMessage,
        details,
        errorCode,
      } = handlePrismaError(error);
      return c.json(errorResponse(errorMessage, details), {
        status: errorCode,
      });
    }
  }
);

export const deleteCategories = factory.createHandlers(
  async (c): Promise<Response> => {
    try {
      await categoryModel.deleteCategories();

      return c.json(successResponse("Categories deleted successfully"));
    } catch (error) {
      const {
        error: errorMessage,
        details,
        errorCode,
      } = handlePrismaError(error);
      return c.json(errorResponse(errorMessage, details), {
        status: errorCode,
      });
    }
  }
);
