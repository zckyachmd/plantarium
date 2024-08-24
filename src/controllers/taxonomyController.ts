import { createFactory } from "hono/factory";
import { successResponse, errorResponse } from "../utils/responseUtils";
import { handlePrismaError } from "../utils/prismaUtils";
import * as stringUtils from "../utils/stringUtils";
import * as taxonomyModel from "../models/taxonomy";

const factory = createFactory();

export const getTaxonomies = factory.createHandlers(
  async (c): Promise<Response> => {
    const queryParams = c.req.query();
    const filters = stringUtils.parseQuery(queryParams.filter);
    const sort = stringUtils.parseQuery(queryParams.sort);
    const include = c.req.query("include");

    try {
      const taxonomies = await taxonomyModel.getTaxonomies(
        filters,
        sort,
        include
      );

      if (!taxonomies || taxonomies.length === 0) {
        return c.json(errorResponse("Taxonomies not found"), { status: 404 });
      }

      return c.json(
        successResponse("Taxonomies retrieved successfully", taxonomies)
      );
    } catch (error) {
      const {
        error: errorMessage,
        details,
        errorCode,
      } = handlePrismaError(error);
      return c.json(errorResponse(errorMessage, details), {
        status: errorCode,
      });
    }
  }
);

export const getTaxonomy = factory.createHandlers(
  async (c): Promise<Response> => {
    const id = parseInt(c.req.param("id"));
    const include = c.req.query("include");

    try {
      const taxonomy = await taxonomyModel.getTaxonomy(id, include);
      if (!taxonomy) {
        return c.json(errorResponse("Taxonomy not found!"), { status: 404 });
      }

      return c.json(
        successResponse("Taxonomy retrieved successfully", taxonomy)
      );
    } catch (error) {
      const {
        error: errorMessage,
        details,
        errorCode,
      } = handlePrismaError(error);
      return c.json(errorResponse(errorMessage, details), {
        status: errorCode,
      });
    }
  }
);

export const createTaxonomy = factory.createHandlers(
  async (c): Promise<Response> => {
    const body = await c.req.json();

    const data = {
      kingdom: body.kingdom,
      phylum: body.phylum,
      class: body.taxonomyClass,
      order: body.order,
      family: body.family,
    };

    try {
      const existingTaxonomy = await taxonomyModel.prisma.taxonomy.findFirst({
        where: data,
      });

      if (existingTaxonomy) {
        return c.json(errorResponse("Taxonomy already exists!"), {
          status: 409,
        });
      }

      const taxonomy = await taxonomyModel.createTaxonomy(data);

      return c.json(
        successResponse("Taxonomy created successfully", taxonomy),
        201
      );
    } catch (error) {
      const {
        error: errorMessage,
        details,
        errorCode,
      } = handlePrismaError(error);
      return c.json(errorResponse(errorMessage, details), {
        status: errorCode,
      });
    }
  }
);

export const updateTaxonomy = factory.createHandlers(
  async (c): Promise<Response> => {
    const id = parseInt(c.req.param("id"));
    const body = await c.req.json();

    try {
      const data = {
        kingdom: body.kingdom,
        phylum: body.phylum,
        class: body.taxonomyClass,
        order: body.order,
        family: body.family,
      };

      const existingTaxonomy = await taxonomyModel.prisma.taxonomy.findFirst({
        where: {
          OR: [{ id: id }, { ...data, id: { not: id } }],
        },
      });

      if (existingTaxonomy) {
        if (existingTaxonomy.id === body.id) {
          return c.json(
            successResponse("Taxonomy already exists with the same ID"),
            { status: 409 }
          );
        }
      }

      const taxonomy = await taxonomyModel.updateTaxonomy(id, data);

      return c.json(successResponse("Taxonomy updated successfully", taxonomy));
    } catch (error) {
      const {
        error: errorMessage,
        details,
        errorCode,
      } = handlePrismaError(error);
      return c.json(errorResponse(errorMessage, details), {
        status: errorCode,
      });
    }
  }
);

export const deleteTaxonomy = factory.createHandlers(
  async (c): Promise<Response> => {
    const id = parseInt(c.req.param("id"));

    try {
      const existingTaxonomy = await taxonomyModel.getTaxonomy(id);
      if (!existingTaxonomy) {
        return c.json(errorResponse("Taxonomy not found!"), { status: 404 });
      }

      await taxonomyModel.deleteTaxonomy(id);

      return c.json(successResponse("Taxonomy deleted successfully"));
    } catch (error) {
      const {
        error: errorMessage,
        details,
        errorCode,
      } = handlePrismaError(error);
      return c.json(errorResponse(errorMessage, details), {
        status: errorCode,
      });
    }
  }
);

export const deleteTaxonomies = factory.createHandlers(
  async (c): Promise<Response> => {
    try {
      await taxonomyModel.deleteTaxonomies();

      return c.json(successResponse("Taxonomies deleted successfully"));
    } catch (error) {
      const {
        error: errorMessage,
        details,
        errorCode,
      } = handlePrismaError(error);
      return c.json(errorResponse(errorMessage, details), {
        status: errorCode,
      });
    }
  }
);
