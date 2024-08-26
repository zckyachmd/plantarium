import { OpenAPIHono } from "@hono/zod-openapi";
import handleRequest from "../utils/requestUtils";
import * as varietyModel from "../models/variety";
import * as varietySchema from "../schemas/varietySchema";
import * as varietyRoute from "../routes/varietiesRoute";
import * as stringUtils from "../utils/stringUtils";
import * as responseUtils from "../utils/responseUtils";
import {
  validateQueryParams,
  validateIdParam,
} from "../validations/queryValidation";

const variety = new OpenAPIHono();

const validateVarietyQueryParams = async (c: any) => {
  return validateQueryParams(
    c,
    varietySchema.QueryVarietySchema,
    "Invalid category query parameters"
  );
};

const validateVarietyIdParam = async (c: any) => {
  return validateIdParam(
    c,
    varietySchema.IdVarietySchema,
    "Invalid category ID"
  );
};

variety.openapi(varietyRoute.getVarieties, async (c) => {
  const validationError = await validateVarietyQueryParams(c);
  if (validationError) return validationError;

  const queryParams = c.req.query();
  const filters = stringUtils.parseQuery(queryParams.filter);
  const sort = stringUtils.parseQuery(queryParams.sort);
  const include = c.req.query("include");

  return handleRequest(
    c,
    varietySchema.QueryVarietySchema,
    queryParams,
    async () => {
      try {
        const varieties = await varietyModel.getVarieties(
          filters,
          sort,
          include
        );

        if (!varieties || varieties.length === 0) {
          return c.json(responseUtils.errorResponse("Varieties not found"), {
            status: 404,
          });
        }

        return c.json(
          responseUtils.successResponse(
            "Varieties retrieved successfully",
            varieties
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

variety.openapi(varietyRoute.getVariety, async (c) => {
  const idOrError = await validateVarietyIdParam(c);
  if (typeof idOrError === "object") return idOrError;

  const id = idOrError;
  const queryParams = c.req.query();

  return handleRequest(
    c,
    varietySchema.QueryVarietySchema,
    queryParams,
    async () => {
      try {
        const variety = await varietyModel.getVariety(id, queryParams.include);
        if (!variety) {
          return c.json(responseUtils.errorResponse("Variety not found"), {
            status: 404,
          });
        }
        return c.json(
          responseUtils.successResponse(
            "Variety retrieved successfully",
            variety
          )
        );
      } catch (error) {
        return responseUtils.handleErrors(
          c,
          error,
          "An error occurred while retrieving varieties"
        );
      }
    }
  );
});

variety.openapi(varietyRoute.createVariety, async (c) => {
  const body = await c.req.json();

  return handleRequest(
    c,
    varietySchema.CreateVarietySchema,
    body,
    async (validatedBody) => {
      try {
        const existingVariety = await varietyModel.prisma.variety.findFirst({
          where: { name: validatedBody.name },
        });

        if (existingVariety) {
          return c.json(responseUtils.errorResponse("Variety already exists"), {
            status: 409,
          });
        }

        const newVariety = await varietyModel.createVariety(validatedBody);

        return c.json(
          responseUtils.successResponse(
            "Variety created successfully",
            newVariety
          )
        );
      } catch (error) {
        return responseUtils.handleErrors(
          c,
          error,
          "An error occurred while creating variety"
        );
      }
    }
  );
});

variety.openapi(varietyRoute.updateVariety, async (c) => {
  const idOrError = await validateVarietyIdParam(c);
  if (typeof idOrError === "object") return idOrError;

  const id = idOrError;
  const body = await c.req.json();

  return handleRequest(
    c,
    varietySchema.UpdateVarietySchema,
    body,
    async (validatedBody) => {
      try {
        const [existingVariety, conflictingVariety] = await Promise.all([
          varietyModel.getVariety(id),
          varietyModel.prisma.variety.findFirst({
            where: {
              name: validatedBody.name,
              id: { not: id },
            },
          }),
        ]);

        if (!existingVariety) {
          return c.json(responseUtils.errorResponse("Variety not found!"), {
            status: 404,
          });
        }

        if (conflictingVariety) {
          return c.json(
            responseUtils.errorResponse(
              "A variety with the same name already exists!"
            ),
            { status: 409 }
          );
        }

        const updatedVariety = await varietyModel.updateVariety(
          id,
          validatedBody
        );
        return c.json(
          responseUtils.successResponse(
            "Variety updated successfully",
            updatedVariety
          )
        );
      } catch (error) {
        return responseUtils.handleErrors(
          c,
          error,
          "An error occurred while updating variety"
        );
      }
    }
  );
});

variety.openapi(varietyRoute.deleteVariety, async (c) => {
  const idOrError = await validateVarietyIdParam(c);
  if (typeof idOrError === "object") return idOrError;

  const id = idOrError;

  return handleRequest(c, varietySchema.QueryVarietySchema, {}, async () => {
    try {
      const existingVariety = await varietyModel.getVariety(id);
      if (!existingVariety) {
        return c.json(responseUtils.errorResponse("Variety not found!"), {
          status: 404,
        });
      }

      const deletedVariety = await varietyModel.deleteVariety(id);

      return c.json(
        responseUtils.successResponse(
          "Variety deleted successfully",
          deletedVariety
        )
      );
    } catch (error) {
      return responseUtils.handleErrors(
        c,
        error,
        "An error occurred while deleting variety"
      );
    }
  });
});

variety.openapi(varietyRoute.deleteVarieties, async (c) => {
  return handleRequest(c, varietySchema.QueryVarietySchema, {}, async () => {
    try {
      const deletedVarieties = await varietyModel.deleteVarieties();

      return c.json(
        responseUtils.successResponse(
          "Varieties deleted successfully",
          deletedVarieties
        )
      );
    } catch (error) {
      return responseUtils.handleErrors(
        c,
        error,
        "An error occurred while deleting varieties"
      );
    }
  });
});

export default variety;
