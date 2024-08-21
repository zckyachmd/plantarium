import { Hono } from "hono";
import api from "./routes/api";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api", api);

export default app;
