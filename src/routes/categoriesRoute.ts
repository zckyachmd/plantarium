import { z } from "@hono/zod-openapi";
import { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { errorResponseSchema } from "../schemas/errorSchema";
import * as categorySchema from "../schemas/categorySchema";
import * as categoryControllers from "../controllers/categoryController";

const category = new OpenAPIHono();
const API_TAGS = ["Categories"];

// export const getCategories = createRoute({
//   method: "get",
//   path: "/",
//   summary: "Retrieve a list of categories",
//   description:
//     "Fetches categories based on optional query parameters. Supports filtering and including related tables.",
//   request: {
//     query: categorySchema.QueryCategorySchema,
//   },
//   tags: API_TAGS,
//   responses: {
//     200: {
//       description: "List of categories.",
//       content: {
//         "application/json": {
//           schema: z.array(categorySchema.CategorySchema),
//         },
//       },
//     },
//     400: {
//       description:
//         "Invalid request due to incorrect parameters or data format.",
//       content: {
//         "application/json": {
//           schema: errorResponseSchema
//             .extend({
//               errorCode: z.string().default("INVALID_FILTER_FORMAT"),
//               message: z
//                 .string()
//                 .default("The filter parameter must be in key=value format."),
//             })
//             .openapi("GetCategoriesErrorResponse"),
//         },
//       },
//     },
//   },
// });

category.openapi(
  {
    method: "get",
    path: "/",
    summary: "Retrieve a list of categories",
    description:
      "Fetches categories based on optional query parameters. Supports filtering and including related tables.",
    request: {
      query: categorySchema.QueryCategorySchema,
    },
    tags: API_TAGS,
    responses: {
      200: {
        description: "List of categories.",
        content: {
          "application/json": {
            schema: z.array(categorySchema.CategorySchema),
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
              .openapi("GetCategoriesErrorResponse"),
          },
        },
      },
    },
  },
  async (c) => {
    return categoryControllers.getCategories(c);
  }
);

export const getCategory = createRoute({
  method: "get",
  path: "/{id}",
  summary: "Retrieve a category by ID",
  description: "Fetches a single category using its ID.",
  request: {
    params: z.object({
      id: categorySchema.IdSchema,
    }),
  },
  tags: API_TAGS,
  responses: {
    200: {
      description: "Taxonomy retrieved successfully.",
      content: {
        "application/json": {
          schema: categorySchema.CategorySchema,
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
            .openapi("GetCategoryErrorResponse"),
        },
      },
    },
    404: {
      description: "Category not found.",
      content: {
        "application/json": {
          schema: errorResponseSchema
            .extend({
              errorCode: z.string().default("CATEGORY_NOT_FOUND"),
              message: z.string().default("Category not found."),
            })
            .openapi("GetCategoryErrorResponse"),
        },
      },
    },
  },
});

export const createCategory = createRoute({
  method: "post",
  path: "/",
  summary: "Create a new category",
  description: "Creates a new category in the database.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: categorySchema.CreateCategorySchema,
        },
      },
    },
  },
  tags: API_TAGS,
  responses: {
    201: {
      description: "Category created successfully.",
      content: {
        "application/json": {
          schema: categorySchema.CategorySchema,
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
              errors: z
                .array(
                  z.object({
                    field: z.string(),
                    message: z.string(),
                  })
                )
                .optional(),
            })
            .openapi("CreateCategoryErrorResponse"),
        },
      },
    },
  },
});

export const updateCategory = createRoute({
  method: "put",
  path: "/{id}",
  summary: "Update a category by ID",
  description: "Updates a single category using its ID.",
  request: {
    params: z.object({
      id: categorySchema.IdSchema,
    }),
    body: {
      content: {
        "application/json": {
          schema: categorySchema.CreateCategorySchema,
        },
      },
    },
  },
  tags: API_TAGS,
  responses: {
    200: {
      description: "Category updated successfully.",
      content: {
        "application/json": {
          schema: categorySchema.CategorySchema,
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
              errors: z
                .array(
                  z.object({
                    field: z.string(),
                    message: z.string(),
                  })
                )
                .optional(),
            })
            .openapi("UpdateCategoryInvalidRequestResponse"),
        },
      },
    },
    404: {
      description: "Category not found.",
      content: {
        "application/json": {
          schema: errorResponseSchema
            .extend({
              errorCode: z.string().default("CATEGORY_NOT_FOUND"),
              message: z.string().default("Category not found."),
            })
            .openapi("UpdateCategoryErrorResponse"),
        },
      },
    },
    409: {
      description: "Conflict due to existing category with the same name.",
      content: {
        "application/json": {
          schema: errorResponseSchema
            .extend({
              errorCode: z.string().default("CATEGORY_CONFLICT"),
              message: z
                .string()
                .default("A category with the same name already exists."),
            })
            .openapi("UpdateCategoryConflictResponse"),
        },
      },
    },
  },
});

export const deleteCategory = createRoute({
  method: "delete",
  path: "/{id}",
  summary: "Delete a category by ID",
  description: "Deletes a single category using its ID.",
  request: {
    params: z.object({
      id: categorySchema.IdSchema,
    }),
  },
  tags: API_TAGS,
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Category deleted successfully.",
      content: {
        "application/json": {
          schema: categorySchema.CategorySchema,
        },
      },
    },
    404: {
      description: "Category not found.",
      content: {
        "application/json": {
          schema: errorResponseSchema
            .extend({
              errorCode: z.string().default("CATEGORY_NOT_FOUND"),
              message: z.string().default("Category not found."),
            })
            .openapi("DeleteCategoryErrorResponse"),
        },
      },
    },
  },
});

export const deleteCategories = createRoute({
  method: "delete",
  path: "/",
  summary: "Delete all categories",
  description: "Deletes all categories using an array of IDs.",
  tags: API_TAGS,
  responses: {
    200: {
      description: "Categories deleted successfully.",
      content: {
        "application/json": {
          schema: z.array(categorySchema.CategorySchema),
        },
      },
    },
  },

  security: [
    {
      Bearer: [],
    },
  ],
});

export default category;
