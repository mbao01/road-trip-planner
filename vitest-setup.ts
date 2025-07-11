import dotenv from "dotenv";
import { afterAll, afterEach, beforeAll } from "vitest";
import "@mbao01/common/vitest/setup";
import { server } from "./mocks/node";

dotenv.config();

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
