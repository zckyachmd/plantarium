import { createFactory } from "hono/factory";
import handleRequest from "../utils/requestUtils";
import * as categoryModel from "../models/category";
import * as categorySchema from "../schemas/categorySchema";
import * as stringUtils from "../utils/stringUtils";
import * as responseUtils from "../utils/responseUtils";
import {
  validateQueryParams,
  validateIdParam,
} from "../validations/queryValidation";

const factory = createFactory();

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

export const getCategories = async (c: any) => {
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
};
