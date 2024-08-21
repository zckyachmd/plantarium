import { Hono } from "hono";
import categories from "./_categories";
import taxonomies from "./_taxonomies";

// Grouping /api for categories and taxonomies
const api = new Hono();

api.route("/categories", categories);
api.route("/taxonomies", taxonomies);

api.route("/api", api);

export default api;
