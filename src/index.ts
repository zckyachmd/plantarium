import { Hono } from "hono";
import { swaggerUI } from "@hono/swagger-ui";
import { readFileSync } from "fs";
import { join } from "path";
import api from "./routes/api";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/api", swaggerUI({ url: "/api/spec.json" }));
app.get("/api/spec.json", (c) => {
  try {
    const filePath = join(process.cwd(), "public", "api-spec.json");
    const jsonData = readFileSync(filePath, "utf-8");

    return c.json(JSON.parse(jsonData));
  } catch (error) {
    return c.json({ error: "File not found or invalid JSON format" }, 500);
  }
});

app.route("/api", api);

export default app;
