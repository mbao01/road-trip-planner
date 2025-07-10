import { describe, expect, it } from "vitest";
import { isObject } from "./isObject";

describe("isObject", () => {
  it("should return true for a plain object", () => {
    const obj = { key: "value" };
    const result = isObject(obj);
    expect(result).toBe(true);
  });

  it("should return false for null", () => {
    const obj = null;
    const result = isObject(obj);
    expect(result).toBe(false);
  });

  it("should return false for an array", () => {
    const obj = [1, 2, 3];
    const result = isObject(obj);
    expect(result).toBe(false);
  });

  it("should return false for a number", () => {
    const obj = 42;
    const result = isObject(obj);
    expect(result).toBe(false);
  });

  it("should return false for a string", () => {
    const obj = "hello";
    const result = isObject(obj);
    expect(result).toBe(false);
  });

  it("should return false for a boolean", () => {
    const obj = true;
    const result = isObject(obj);
    expect(result).toBe(false);
  });

  it("should return false for a function", () => {
    const obj = () => {};
    const result = isObject(obj);
    expect(result).toBe(false);
  });

  it("should return false for undefined", () => {
    const obj = undefined;
    const result = isObject(obj);
    expect(result).toBe(false);
  });

  it("should return true for an object created with Object.create(null)", () => {
    const obj = Object.create(null);
    obj.key = "value";
    const result = isObject(obj);
    expect(result).toBe(true);
  });
});
