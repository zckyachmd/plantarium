import { z } from "@hono/zod-openapi";

export const IdSchema = z.coerce
  .number()
  .int()
  .min(1)
  .openapi({
    param: {
      name: "id",
      in: "path",
      description: "The unique identifier for the category",
    },
  });

const keyValueSchema = z
  .string()
  .regex(/^[^=]+=[^=]+$/, "Must be in key=value format")
  .openapi({
    description: "A key-value pair in key=value format",
    example: "key=value",
  });

const includeSchema = z
  .string()
  .regex(
    /^([a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*(,[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*)*)?$/,
    "Must be a comma-separated list of tables and sub-tables"
  )
  .openapi({
    description: "Comma-separated list of tables and sub-tables to include",
    example: "table1,table2.subTable1",
  });

export const CategorySchema = z
  .object({
    id: IdSchema,
    name: z.string().min(1, "Name is required").openapi({
      description: "The name of the category",
      example: "Herb",
    }),
    description: z.string().optional().nullable().openapi({
      description: "A description of the category",
      example: "Herb with fragrant flowers",
    }),
    createdAt: z.date().optional().openapi({
      description: "Timestamp when the category was created",
      example: "2023-08-24T12:00:00Z",
    }),
    updatedAt: z.date().optional().openapi({
      description: "Timestamp when the category was last updated",
      example: "2023-08-25T12:00:00Z",
    }),
  })
  .openapi("Category");

export const CreateCategorySchema = CategorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).openapi("CreateCategory");

export const UpdateCategorySchema = CategorySchema.partial()
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .openapi("UpdateCategory");

export const QueryCategorySchema = z
  .object({
    filter: keyValueSchema.optional().openapi({
      description: "Filter criteria for querying categories",
      example: "name=Herb",
    }),
    sort: keyValueSchema.optional().openapi({
      description: "Sort criteria for querying categories",
      example: "name=asc",
    }),
    include: includeSchema.optional().openapi({
      description: "Comma-separated list of related tables to include",
      example: "varieties",
    }),
  })
  .openapi("QueryCategory");
