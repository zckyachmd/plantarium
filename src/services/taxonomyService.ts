import { OpenAPIHono } from "@hono/zod-openapi";
import handleRequest from "../utils/requestUtils";
import * as taxonomyModel from "../models/taxonomy";
import * as taxonomySchema from "../schemas/taxonomySchema";
import * as taxonomyRoute from "../routes/taxonomiesRoute";
import * as stringUtils from "../utils/stringUtils";
import * as responseUtils from "../utils/responseUtils";
import {
  validateQueryParams,
  validateIdParam,
} from "../validations/queryValidation";

const taxonomy = new OpenAPIHono();

const validateTaxonomyQueryParams = async (c: any) => {
  return validateQueryParams(
    c,
    taxonomySchema.QueryTaxonomySchema,
    "Invalid taxonomy query parameters"
  );
};

const validateTaxonomyIdParam = async (c: any) => {
  return validateIdParam(
    c,
    taxonomySchema.IdTaxonomySchema,
    "Invalid taxonomy ID"
  );
};

taxonomy.openapi(taxonomyRoute.getTaxonomies, async (c) => {
  const validationError = await validateTaxonomyQueryParams(c);
  if (validationError) return validationError;

  const queryParams = c.req.query();
  const filters = stringUtils.parseQuery(queryParams.filter);
  const sort = stringUtils.parseQuery(queryParams.sort);
  const include = c.req.query("include");

  return handleRequest(
    c,
    taxonomySchema.QueryTaxonomySchema,
    queryParams,
    async () => {
      try {
        const taxonomies = await taxonomyModel.getTaxonomies(
          filters,
          sort,
          include
        );

        if (!taxonomies || taxonomies.length === 0) {
          return c.json(responseUtils.errorResponse("Taxonomies not found"), {
            status: 404,
          });
        }

        return c.json(
          responseUtils.successResponse(
            "Taxonomies retrieved successfully",
            taxonomies
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

taxonomy.openapi(taxonomyRoute.getTaxonomy, async (c) => {
  const idOrError = await validateTaxonomyIdParam(c);
  if (typeof idOrError === "object") return idOrError;

  const id = idOrError;
  const queryParams = c.req.query();
  const include = queryParams.include;

  return handleRequest(
    c,
    taxonomySchema.QueryTaxonomySchema,
    queryParams,
    async () => {
      try {
        const taxonomy = await taxonomyModel.getTaxonomy(id, include);

        if (!taxonomy) {
          return c.json(responseUtils.errorResponse("Taxonomy not found!"), {
            status: 404,
          });
        }

        return c.json(
          responseUtils.successResponse(
            "Taxonomy retrieved successfully",
            taxonomy
          )
        );
      } catch (error) {
        return responseUtils.handleErrors(
          c,
          error,
          "An error occurred while retrieving taxonomy"
        );
      }
    }
  );
});

taxonomy.openapi(taxonomyRoute.createTaxonomy, async (c) => {
  const body = await c.req.json();

  return handleRequest(
    c,
    taxonomySchema.CreateTaxonomySchema,
    body,
    async (body) => {
      try {
        const existingTaxonomy = await taxonomyModel.prisma.taxonomy.findFirst({
          where: {
            kingdom: body.kingdom,
            phylum: body.phylum,
            class: body.class,
            order: body.order,
            family: body.family,
          },
        });

        if (existingTaxonomy) {
          return c.json(
            responseUtils.errorResponse(
              "Taxonomy with this combination already exists"
            ),
            {
              status: 409,
            }
          );
        }

        const newTaxonomy = await taxonomyModel.createTaxonomy(body);
        return c.json(
          responseUtils.successResponse(
            "Taxonomy created successfully",
            newTaxonomy
          ),
          {
            status: 201,
          }
        );
      } catch (error) {
        return responseUtils.handleErrors(
          c,
          error,
          "An error occurred while creating taxonomy"
        );
      }
    }
  );
});

taxonomy.openapi(taxonomyRoute.updateTaxonomy, async (c) => {
  const idOrError = await validateTaxonomyIdParam(c);
  if (typeof idOrError === "object") return idOrError;

  const id = idOrError;
  const body = await c.req.json();

  return handleRequest(
    c,
    taxonomySchema.UpdateTaxonomySchema,
    body,
    async (validatedBody) => {
      try {
        const [existingTaxonomy, conflictingTaxonomy] = await Promise.all([
          taxonomyModel.prisma.taxonomy.findUnique({
            where: { id },
          }),
          taxonomyModel.prisma.taxonomy.findFirst({
            where: {
              kingdom: validatedBody.kingdom,
              phylum: validatedBody.phylum,
              class: validatedBody.class,
              order: validatedBody.order,
              family: validatedBody.family,
              NOT: { id },
            },
          }),
        ]);

        if (!existingTaxonomy) {
          return c.json(responseUtils.errorResponse("Taxonomy not found!"), {
            status: 404,
          });
        }

        if (conflictingTaxonomy) {
          return c.json(
            responseUtils.errorResponse(
              "Another taxonomy with the same combination already exists!"
            ),
            {
              status: 409,
            }
          );
        }

        const updatedTaxonomy = await taxonomyModel.updateTaxonomy(
          id,
          validatedBody
        );
        return c.json(
          responseUtils.successResponse(
            "Taxonomy updated successfully",
            updatedTaxonomy
          )
        );
      } catch (error) {
        return responseUtils.handleErrors(
          c,
          error,
          "An error occurred while updating taxonomy"
        );
      }
    }
  );
});

taxonomy.openapi(taxonomyRoute.deleteTaxonomy, async (c) => {
  const idOrError = await validateTaxonomyIdParam(c);
  if (typeof idOrError === "object") return idOrError;

  const id = idOrError;

  return handleRequest(c, taxonomySchema.QueryTaxonomySchema, {}, async () => {
    try {
      const existingTaxonomy = await taxonomyModel.getTaxonomy(id);

      if (!existingTaxonomy) {
        return c.json(responseUtils.errorResponse("Taxonomy not found!"), {
          status: 404,
        });
      }

      await taxonomyModel.deleteTaxonomy(id);

      return c.json(
        responseUtils.successResponse(
          "Taxonomy deleted successfully",
          existingTaxonomy
        )
      );
    } catch (error) {
      return responseUtils.handleErrors(
        c,
        error,
        "An error occurred while deleting taxonomy"
      );
    }
  });
});

taxonomy.openapi(taxonomyRoute.deleteTaxonomies, async (c) => {
  return handleRequest(c, taxonomySchema.QueryTaxonomySchema, {}, async () => {
    try {
      await taxonomyModel.deleteTaxonomies();
      return c.json(
        responseUtils.successResponse("All taxonomies deleted successfully")
      );
    } catch (error) {
      return responseUtils.handleErrors(
        c,
        error,
        "An error occurred while deleting taxonomies"
      );
    }
  });
});

export default taxonomy;
