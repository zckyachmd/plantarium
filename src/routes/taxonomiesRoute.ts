import { z } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { errorResponseSchema } from "../schemas/errorSchema";
import * as taxonomySchema from "../schemas/taxonomySchema";

const API_TAGS = ["Taxonomies"];

export const getTaxonomies = createRoute({
  method: "get",
  path: "/",
  summary: "Retrieve a list of taxonomies",
  description:
    "Fetches taxonomies based on optional query parameters. Supports filtering and including related tables.",
  request: {
    query: taxonomySchema.QueryTaxonomySchema,
  },
  tags: API_TAGS,
  responses: {
    200: {
      description: "List of taxonomies.",
      content: {
        "application/json": {
          schema: z.array(taxonomySchema.TaxonomySchema),
        },
      },
    },
    400: {
      description:
        "Invalid request due to incorrect parameters or data format.",
      content: {
        "application/json": {
          schema: errorResponseSchema
            .extend({
              errorCode: z.string().default("INVALID_DATA_FORMAT"),
              message: z
                .string()
                .default("The data parameter must be in key=value format."),
            })
            .openapi("GetTaxonomiesErrorResponse"),
        },
      },
    },
    404: {
      description: "Taxonomies not found.",
      content: {
        "application/json": {
          schema: errorResponseSchema
            .extend({
              errorCode: z.string().default("TAXONOMIES_NOT_FOUND"),
              message: z.string().default("Taxonomies not found."),
            })
            .openapi("GetTaxonomiesErrorResponse"),
        },
      },
    },
  },
});

export const getTaxonomy = createRoute({
  method: "get",
  path: "/{id}",
  summary: "Retrieve a taxonomy by ID",
  description: "Fetches a single taxonomy using its ID.",
  request: {
    params: z.object({
      id: taxonomySchema.IdTaxonomySchema,
    }),
  },
  tags: API_TAGS,
  responses: {
    200: {
      description: "Taxonomy retrieved successfully.",
      content: {
        "application/json": {
          schema: taxonomySchema.TaxonomySchema,
        },
      },
    },
    400: {
      description:
        "Invalid request due to incorrect parameters or data format.",
      content: {
        "application/json": {
          schema: errorResponseSchema
            .extend({
              errorCode: z.string().default("INVALID_DATA_FORMAT"),
              message: z
                .string()
                .default("The data parameter must be in key=value format."),
            })
            .openapi("GetCategoryErrorResponse"),
        },
      },
    },
    404: {
      description: "Taxonomy not found.",
      content: {
        "application/json": {
          schema: errorResponseSchema
            .extend({
              errorCode: z.string().default("TAXONOMY_NOT_FOUND"),
              message: z.string().default("Taxonomy not found."),
            })
            .openapi("GetCategoryErrorResponse"),
        },
      },
    },
  },
});

export const createTaxonomy = createRoute({
  method: "post",
  path: "/",
  summary: "Create a new taxonomy",
  description: "Creates a new taxonomy in the database.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: taxonomySchema.CreateTaxonomySchema,
        },
      },
    },
  },
  tags: API_TAGS,
  responses: {
    201: {
      description: "Taxonomy created successfully.",
      content: {
        "application/json": {
          schema: taxonomySchema.TaxonomySchema,
        },
      },
    },
    400: {
      description:
        "Invalid request due to incorrect parameters or data format.",
      content: {
        "application/json": {
          schema: errorResponseSchema
            .extend({
              errorCode: z.string().default("INVALID_DATA_FORMAT"),
              message: z
                .string()
                .default(
                  "Invalid data format. Ensure all fields meet the required schema."
                ),
              errors: z
                .array(
                  z.object({
                    field: z.string(),
                    message: z.string(),
                  })
                )
                .optional(),
            })
            .openapi("CreateTaxonomyErrorResponse"),
        },
      },
    },
  },
});

export const updateTaxonomy = createRoute({
  method: "put",
  path: "/{id}",
  summary: "Update a taxonomy by ID",
  description: "Updates a single taxonomy using its ID.",
  request: {
    params: z.object({
      id: taxonomySchema.IdTaxonomySchema,
    }),
    body: {
      content: {
        "application/json": {
          schema: taxonomySchema.UpdateTaxonomySchema,
        },
      },
    },
  },
  tags: API_TAGS,
  responses: {
    200: {
      description: "Taxonomy updated successfully.",
      content: {
        "application/json": {
          schema: taxonomySchema.TaxonomySchema,
        },
      },
    },
    400: {
      description:
        "Invalid request due to incorrect parameters or data format.",
      content: {
        "application/json": {
          schema: errorResponseSchema
            .extend({
              errorCode: z.string().default("INVALID_DATA_FORMAT"),
              message: z
                .string()
                .default(
                  "Invalid data format. Ensure all fields meet the required schema."
                ),
              errors: z
                .array(
                  z.object({
                    field: z.string(),
                    message: z.string(),
                  })
                )
                .optional(),
            })
            .openapi("UpdateTaxonomyErrorResponse"),
        },
      },
    },
    404: {
      description: "Taxonomy not found.",
      content: {
        "application/json": {
          schema: errorResponseSchema
            .extend({
              errorCode: z.string().default("TAXONOMY_NOT_FOUND"),
              message: z.string().default("Taxonomy not found."),
            })
            .openapi("UpdateTaxonomyNotFoundResponse"),
        },
      },
    },
    409: {
      description: "Conflict due to data already existing.",
      content: {
        "application/json": {
          schema: errorResponseSchema
            .extend({
              errorCode: z.string().default("DATA_CONFLICT"),
              message: z
                .string()
                .default(
                  "Another taxonomy with the same combination already exists."
                ),
            })
            .openapi("UpdateTaxonomyConflictResponse"),
        },
      },
    },
  },
});

export const deleteTaxonomy = createRoute({
  method: "delete",
  path: "/{id}",
  summary: "Delete a taxonomy by ID",
  description: "Deletes a single taxonomy using its ID.",
  request: {
    params: z.object({
      id: taxonomySchema.IdTaxonomySchema,
    }),
  },
  tags: API_TAGS,
  responses: {
    200: {
      description: "Taxonomy deleted successfully.",
      content: {
        "application/json": {
          schema: taxonomySchema.TaxonomySchema,
        },
      },
    },
    404: {
      description: "Taxonomy not found.",
      content: {
        "application/json": {
          schema: errorResponseSchema
            .extend({
              errorCode: z.string().default("TAXONOMY_NOT_FOUND"),
              message: z.string().default("Taxonomy not found."),
            })
            .openapi("DeleteTaxonomyErrorResponse"),
        },
      },
    },
  },
});

export const deleteTaxonomies = createRoute({
  method: "delete",
  path: "/",
  summary: "Delete all taxonomies",
  description: "Deletes all taxonomies from the database.",
  tags: API_TAGS,
  responses: {
    200: {
      description: "Taxonomies deleted successfully.",
      content: {
        "application/json": {
          schema: taxonomySchema.TaxonomySchema,
        },
      },
    },
  },
});
