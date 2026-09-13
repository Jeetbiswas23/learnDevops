import request from "supertest";
import { test } from "node:test";
import assert from "node:assert/strict";
import app from "../src/server.js";

test("GET /api/health returns healthy status", async () => {
  const response = await request(app).get("/api/health");

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.status, "ok");
  assert.equal(response.body.service, "backend");
});

test("task routes reject an invalid task id", async () => {
  const response = await request(app).get("/api/tasks/not-an-id");

  assert.equal(response.statusCode, 400);
  assert.deepEqual(response.body, { error: "Invalid task id" });
});