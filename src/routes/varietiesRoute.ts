import { z } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { errorResponseSchema } from "../schemas/errorSchema";
import * as varietySchema from "../schemas/varietySchema";

const API_TAGS = ["Varieties"];

export const getVarieties = createRoute({
  method: "get",
  path: "/",
  summary: "Retrieve a list of varieties",
  description:
    "Fetches varieties based on optional query parameters. Supports filtering and including related tables.",
  request: {
    query: varietySchema.QueryVarietySchema,
  },
  tags: API_TAGS,
  responses: {
    200: {
      description: "List of varieties.",
      content: {
        "application/json": {
          schema: z.array(varietySchema.VarietySchema),
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
              errorCode: z.string().default("INVALID_FILTER_FORMAT"),
              message: z
                .string()
                .default("The filter parameter must be in key=value format."),
            })
            .openapi("GetVarietiesErrorResponse"),
        },
      },
    },
  },
});

export const getVariety = createRoute({
  method: "get",
  path: "/{id}",
  summary: "Retrieve a variety by ID",
  description: "Fetches a single variety using its ID.",
  request: {
    params: z.object({
      id: varietySchema.IdVarietySchema,
    }),
  },
  tags: API_TAGS,
  responses: {
    200: {
      description: "Variety retrieved successfully.",
      content: {
        "application/json": {
          schema: varietySchema.VarietySchema,
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
              errorCode: z.string().default("INVALID_FILTER_FORMAT"),
              message: z
                .string()
                .default("The filter parameter must be in key=value format."),
            })
            .openapi("GetVarietyErrorResponse"),
        },
      },
    },
    404: {
      description: "Variety not found.",
      content: {
        "application/json": {
          schema: errorResponseSchema
            .extend({
              errorCode: z.string().default("VARIETY_NOT_FOUND"),
              message: z.string().default("Variety not found."),
            })
            .openapi("GetVarietyErrorResponse"),
        },
      },
    },
  },
});

export const createVariety = createRoute({
  method: "post",
  path: "/",
  summary: "Create a new variety",
  description: "Creates a new variety.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: varietySchema.CreateVarietySchema,
        },
      },
    },
  },
  tags: API_TAGS,
  responses: {
    201: {
      description: "Variety created successfully.",
      content: {
        "application/json": {
          schema: varietySchema.VarietySchema,
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
                .default("The data provided is not in the correct format."),
            })
            .openapi("CreateVarietyErrorResponse"),
        },
      },
    },
  },
});

export const updateVariety = createRoute({
  method: "put",
  path: "/{id}",
  summary: "Update a variety by ID",
  description: "Updates a single variety using its ID.",
  request: {
    params: z.object({
      id: varietySchema.IdVarietySchema,
    }),
    body: {
      content: {
        "application/json": {
          schema: varietySchema.UpdateVarietySchema,
        },
      },
    },
  },
  tags: API_TAGS,
  responses: {
    200: {
      description: "Variety updated successfully.",
      content: {
        "application/json": {
          schema: varietySchema.VarietySchema,
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
                .default("The data provided is not in the correct format."),
            })
            .openapi("UpdateVarietyErrorResponse"),
        },
      },
    },
    404: {
      description: "Variety not found.",
      content: {
        "application/json": {
          schema: errorResponseSchema
            .extend({
              errorCode: z.string().default("VARIETY_NOT_FOUND"),
              message: z.string().default("Variety not found."),
            })
            .openapi("UpdateVarietyErrorResponse"),
        },
      },
    },
    409: {
      description: "Conflict due to existing variety with the same name.",
      content: {
        "application/json": {
          schema: errorResponseSchema
            .extend({
              errorCode: z.string().default("VARIETY_CONFLICT"),
              message: z
                .string()
                .default("A variety with the same name already exists."),
            })
            .openapi("UpdateVarietyErrorResponse"),
        },
      },
    },
  },
});

export const deleteVariety = createRoute({
  method: "delete",
  path: "/{id}",
  summary: "Delete a variety by ID",
  description: "Deletes a single variety using its ID.",
  request: {
    params: z.object({
      id: varietySchema.IdVarietySchema,
    }),
  },
  tags: API_TAGS,
  responses: {
    200: {
      description: "Variety deleted successfully.",
      content: {
        "application/json": {
          schema: varietySchema.VarietySchema,
        },
      },
    },
    404: {
      description: "Variety not found.",
      content: {
        "application/json": {
          schema: errorResponseSchema
            .extend({
              errorCode: z.string().default("VARIETY_NOT_FOUND"),
              message: z.string().default("Variety not found."),
            })
            .openapi("DeleteVarietyErrorResponse"),
        },
      },
    },
  },
});

export const deleteVarieties = createRoute({
  method: "delete",
  path: "/",
  summary: "Delete all varieties",
  description: "Deletes all varieties.",
  tags: API_TAGS,
  responses: {
    200: {
      description: "All varieties deleted successfully.",
      content: {
        "application/json": {
          schema: z.array(varietySchema.VarietySchema),
        },
      },
    },
  },
});
