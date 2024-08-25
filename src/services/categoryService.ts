import { OpenAPIHono } from "@hono/zod-openapi";
import handleRequest from "../utils/requestUtils";
import * as categoryModel from "../models/category";
import * as categorySchema from "../schemas/categorySchema";
import * as categoryRoute from "../routes/categoriesRoute";
import * as stringUtils from "../utils/stringUtils";
import * as responseUtils from "../utils/responseUtils";
import {
  validateQueryParams,
  validateIdParam,
} from "../validations/queryValidation";

const category = new OpenAPIHono();

const validateCategoryQueryParams = async (c: any) => {
  return validateQueryParams(
    c,
    categorySchema.QueryCategorySchema,
    "Invalid category query parameters"
  );
};

const validateCategoryIdParam = async (c: any) => {
  return validateIdParam(c, categorySchema.IdSchema, "Invalid category ID");
};

category.openapi(categoryRoute.getCategories, async (c) => {
  const validationError = await validateCategoryQueryParams(c);
  if (validationError) return validationError;

  const queryParams = c.req.query();
  const filters = stringUtils.parseQuery(queryParams.filter);
  const sort = stringUtils.parseQuery(queryParams.sort);
  const include = queryParams.include;

  return handleRequest(
    c,
    categorySchema.QueryCategorySchema,
    queryParams,
    async () => {
      try {
        const categories = await categoryModel.getCategories(
          filters,
          sort,
          include
        );

        if (!categories || categories.length === 0) {
          return c.json(responseUtils.errorResponse("Categories not found"), {
            status: 404,
          });
        }

        return c.json(
          responseUtils.successResponse(
            "Categories retrieved successfully",
            categories
          )
        );
      } catch (error) {
        return responseUtils.handleErrors(
          c,
          error,
          "An error occurred while retrieving categories"
        );
      }
    }
  );
});

category.openapi(categoryRoute.getCategory, async (c) => {
  const idOrError = await validateCategoryIdParam(c);
  if (typeof idOrError === "object") return idOrError;

  const id = idOrError;
  const queryParams = c.req.query();

  return handleRequest(
    c,
    categorySchema.QueryCategorySchema,
    queryParams,
    async () => {
      try {
        const category = await categoryModel.getCategory(
          id,
          queryParams.include
        );

        if (!category) {
          return c.json(responseUtils.errorResponse("Category not found!"), {
            status: 404,
          });
        }

        return c.json(
          responseUtils.successResponse(
            "Category retrieved successfully",
            category
          )
        );
      } catch (error) {
        return responseUtils.handleErrors(
          c,
          error,
          "An error occurred while retrieving the category"
        );
      }
    }
  );
});

category.openapi(categoryRoute.createCategory, async (c) => {
  const body = await c.req.json();

  return handleRequest(
    c,
    categorySchema.CreateCategorySchema,
    body,
    async (validatedBody) => {
      try {
        const existingCategory = await categoryModel.prisma.category.findFirst({
          where: { name: validatedBody.name },
        });

        if (existingCategory) {
          return c.json(
            responseUtils.errorResponse("Category already exists!"),
            {
              status: 409,
            }
          );
        }

        const newCategory = await categoryModel.createCategory(validatedBody);
        return c.json(
          responseUtils.successResponse(
            "Category created successfully",
            newCategory
          ),
          { status: 201 }
        );
      } catch (error) {
        return responseUtils.handleErrors(
          c,
          error,
          "An error occurred while creating the category"
        );
      }
    }
  );
});

category.openapi(categoryRoute.updateCategory, async (c) => {
  const idOrError = await validateCategoryIdParam(c);
  if (typeof idOrError === "object") return idOrError;

  const id = idOrError;
  const body = await c.req.json();

  return handleRequest(
    c,
    categorySchema.CreateCategorySchema,
    body,
    async (validatedBody) => {
      try {
        const [existingCategory, conflictingCategory] = await Promise.all([
          categoryModel.prisma.category.findUnique({
            where: { id },
          }),
          categoryModel.prisma.category.findFirst({
            where: {
              name: validatedBody.name,
              id: { not: id },
            },
          }),
        ]);

        if (!existingCategory) {
          return c.json(responseUtils.errorResponse("Category not found!"), {
            status: 404,
          });
        }

        if (conflictingCategory) {
          return c.json(
            responseUtils.errorResponse(
              "A category with the same name already exists!"
            ),
            { status: 409 }
          );
        }

        const updatedCategory = await categoryModel.updateCategory(
          id,
          validatedBody
        );
        return c.json(
          responseUtils.successResponse(
            "Category updated successfully",
            updatedCategory
          )
        );
      } catch (error) {
        return responseUtils.handleErrors(
          c,
          error,
          "An error occurred while updating the category"
        );
      }
    }
  );
});

category.openapi(categoryRoute.deleteCategory, async (c) => {
  const idOrError = await validateCategoryIdParam(c);
  if (typeof idOrError === "object") return idOrError;

  const id = idOrError;

  return handleRequest(c, categorySchema.QueryCategorySchema, {}, async () => {
    try {
      const existingCategory = await categoryModel.getCategory(id);
      if (!existingCategory) {
        return c.json(responseUtils.errorResponse("Category not found!"), {
          status: 404,
        });
      }

      await categoryModel.deleteCategory(id);

      return c.json(
        responseUtils.successResponse("Category deleted successfully")
      );
    } catch (error) {
      return responseUtils.handleErrors(
        c,
        error,
        "An error occurred while deleting the category"
      );
    }
  });
});

category.openapi(categoryRoute.deleteCategories, async (c) => {
  return handleRequest(c, categorySchema.QueryCategorySchema, {}, async () => {
    try {
      await categoryModel.deleteCategories();
      return c.json(
        responseUtils.successResponse("Categories deleted successfully")
      );
    } catch (error) {
      return responseUtils.handleErrors(
        c,
        error,
        "An error occurred while deleting the categories"
      );
    }
  });
});

export default category;
