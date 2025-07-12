import { describe, expect, it } from "vitest";
import { isKeysInObject } from "./isKeysInObject";

describe("isKeysInObject", () => {
  it("should return true if the keys exist in the object", () => {
    const obj = { a: { b: { c: "value" } } };
    const keys = ["a", "b", "c"];

    const result = isKeysInObject(keys, obj);

    expect(result).toBe(true);
  });

  it("should return false if the keys do not exist in the object", () => {
    const obj = { a: { b: { c: "value" } } };
    const keys = ["a", "b", "nonexistent"];

    const result = isKeysInObject(keys, obj);

    expect(result).toBe(false);
  });

  it("should return false if any part of the path is not an object", () => {
    const obj = { a: "notAnObject" };
    const keys = ["a", "b", "c"];

    const result = isKeysInObject(keys, obj);

    expect(result).toBe(false);
  });

  it("should return false if the initial object is not an object", () => {
    const obj: any = null;
    const keys = ["a", "b", "c"];

    const result = isKeysInObject(keys, obj);

    expect(result).toBe(false);
  });

  it("should handle arrays within the object", () => {
    const obj = { a: { b: { c: [1, 2, "value"] } } };
    const keys = ["a", "b", "c", "2"];

    const result = isKeysInObject(keys, obj);

    expect(result).toBe(false);
  });

  it("should return true if the keys array is empty", () => {
    const obj = { a: { b: { c: "value" } } };
    const keys: string[] = [];

    const result = isKeysInObject(keys, obj);

    expect(result).toBe(true);
  });

  it("should return false if any key does not exist in an array", () => {
    const obj = { a: { b: { c: [1, 2, 3] } } };
    const keys = ["a", "b", "c", "3"];

    const result = isKeysInObject(keys, obj);

    expect(result).toBe(false);
  });
});
