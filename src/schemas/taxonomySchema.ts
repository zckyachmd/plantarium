import { z } from "@hono/zod-openapi";
import { IdSchema } from "./categorySchema";

export const IdTaxonomySchema = IdSchema;

export const TaxonomySchema = z
  .object({
    id: IdSchema,
    kingdom: z.string().min(1, "Kingdom is required").openapi({
      description: "The kingdom classification in the taxonomy",
      example: "Plantae",
    }),
    phylum: z.string().min(1, "Phylum is required").openapi({
      description: "The phylum classification in the taxonomy",
      example: "Tracheophyta",
    }),
    class: z.string().min(1, "Class is required").openapi({
      description: "The class classification in the taxonomy",
      example: "Magnoliopsida",
    }),
    order: z.string().min(1, "Order is required").openapi({
      description: "The order classification in the taxonomy",
      example: "Rosales",
    }),
    family: z.string().min(1, "Family is required").openapi({
      description: "The family classification in the taxonomy",
      example: "Rosaceae",
    }),
    createdAt: z.date().optional().openapi({
      description: "Timestamp when the taxonomy was created",
      example: "2023-08-24T12:00:00Z",
    }),
    updatedAt: z.date().optional().openapi({
      description: "Timestamp when the taxonomy was last updated",
      example: "2023-08-25T12:00:00Z",
    }),
  })
  .openapi("Taxonomy");

export const CreateTaxonomySchema = TaxonomySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).openapi("CreateTaxonomy");

export const UpdateTaxonomySchema = TaxonomySchema.partial()
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .openapi("UpdateTaxonomy");

export const QueryTaxonomySchema = z
  .object({
    filter: z.string().optional().openapi({
      description: "Filter criteria for querying taxonomies",
      example: "kingdom=Plantae",
    }),
    sort: z.string().optional().openapi({
      description: "Sort criteria for querying taxonomies",
      example: "family=asc",
    }),
    include: z.string().optional().openapi({
      description: "Comma-separated list of related tables to include",
      example: "varieties",
    }),
  })
  .openapi("QueryTaxonomy");
