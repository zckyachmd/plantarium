import { z } from "@hono/zod-openapi";
import { IdSchema } from "./categorySchema";

const synonymsSchema = z.array(z.string()).openapi({
  description: "A list of synonyms for the variety",
  example: ["Synonym1", "Synonym2"],
});

export const VarietySchema = z
  .object({
    id: IdSchema,
    name: z.string().min(1, "Name is required").openapi({
      description: "The name of the variety",
      example: "Golden Rice",
    }),
    scientificName: z.string().min(1, "Scientific name is required").openapi({
      description: "The scientific name of the variety",
      example: "Oryza sativa",
    }),
    description: z.string().optional().nullable().openapi({
      description: "A description of the variety",
      example: "A high-yielding variety of rice",
    }),
    origin: z.string().min(1, "Origin is required").openapi({
      description: "The origin of the variety",
      example: "Southeast Asia",
    }),
    synonyms: synonymsSchema.optional(),
    genus: z.string().min(1, "Genus is required").openapi({
      description: "The genus of the variety",
      example: "Oryza",
    }),
    species: z.string().min(1, "Species is required").openapi({
      description: "The species of the variety",
      example: "sativa",
    }),
    taxonomyId: IdSchema,
    createdAt: z.date().optional().openapi({
      description: "Timestamp when the variety was created",
      example: "2023-08-24T12:00:00Z",
    }),
    updatedAt: z.date().optional().openapi({
      description: "Timestamp when the variety was last updated",
      example: "2023-08-25T12:00:00Z",
    }),
  })
  .openapi("Variety");

export const CreateVarietySchema = VarietySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).openapi("CreateVariety");

export const UpdateVarietySchema = VarietySchema.partial()
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .openapi("UpdateVariety");

export const QueryVarietySchema = z
  .object({
    filter: z.string().optional().openapi({
      description: "Filter criteria for querying varieties",
      example: "name=Golden Rice",
    }),
    sort: z.string().optional().openapi({
      description: "Sort criteria for querying varieties",
      example: "name=asc",
    }),
    include: z.string().optional().openapi({
      description: "Comma-separated list of related tables to include",
      example: "categories,taxonomy",
    }),
  })
  .openapi("QueryVariety");
