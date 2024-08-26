import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import categoriesService from "./services/categoryService";
import taxonomiesService from "./services/taxonomyService";
import varietiesService from "./services/varietyService";

const app = new OpenAPIHono();

// Web
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// API
app.get("/api", swaggerUI({ url: "/api/spec.json" }));
app.doc("/api/spec.json", {
  openapi: "3.1.0",
  info: {
    version: "1.0.0",
    title: "Plantarium API",
    description:
      "API documentation for Plantarium. Plantarium is a RESTful API platform offering structured access to diverse plant data. Explore taxonomy, varieties, synonyms, categories, and more in one place!",
  },
});

// Define API routes
app.route("/api/categories", categoriesService);
app.route("/api/taxonomies", taxonomiesService);
app.route("/api/varieties", varietiesService);

export default app;
