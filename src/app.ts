import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import rateLimiter from "./middlewares/rateLimit";
import categoriesService from "./services/categoryService";
import taxonomiesService from "./services/taxonomyService";
import varietiesService from "./services/varietyService";
import fs from "fs";
import path from "path";
import "./cronjob";

const app = new OpenAPIHono();

// Web routes
app.get("/", (c) => {
  const filePath = path.resolve(__dirname, "../public/index.html");
  const htmlContent = fs.readFileSync(filePath, "utf-8");

  return c.html(htmlContent);
});
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

// API routes
app.use("/api/*", rateLimiter(15 * 60 * 1000, 100));
app.route("/api/categories", categoriesService);
app.route("/api/taxonomies", taxonomiesService);
app.route("/api/varieties", varietiesService);

export default app;
