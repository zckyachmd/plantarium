import { Hono } from "hono";
import { testClient } from "hono/testing";
import { it, expect } from "bun:test";
import * as categoryController from "@/controllers/categoryController";

it("test", async () => {
  const app = new Hono().get("/search", (c) =>
    categoryController.getCategories(c)
  );
  
  const res = await testClient(app).search.$get();

  expect(await res.json()).toEqual({ hello: "world" });
});
