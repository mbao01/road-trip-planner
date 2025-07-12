import { describe, expect, it } from "vitest";
import { getNestedKeyValue } from "./getNestedKeyValue";

describe("getNestedKeyValue", () => {
  it("should return the nested value if the path exists", () => {
    const obj = { a: { b: { c: "value" } } };
    const keys = ["a", "b", "c"];

    const result = getNestedKeyValue(keys, obj);

    expect(result).toBe("value");
  });

  it("should return undefined if the path does not exist", () => {
    const obj = { a: { b: { c: "value" } } };
    const keys = ["a", "b", "nonexistent"];

    const result = getNestedKeyValue(keys, obj);

    expect(result).toBeUndefined();
  });

  it("should return undefined if any part of the path is not an object", () => {
    const obj = { a: "notAnObject" };
    const keys = ["a", "b", "c"];

    const result = getNestedKeyValue(keys, obj);

    expect(result).toBeUndefined();
  });

  it("should return undefined if the initial object is not an object", () => {
    const obj: any = null;
    const keys = ["a", "b", "c"];

    const result = getNestedKeyValue(keys, obj);

    expect(result).toBeUndefined();
  });

  it("should return undefined if keys are not in the correct nested order", () => {
    const obj = { a: { b: { c: "value" } } };
    const keys = ["c", "b", "a"];

    const result = getNestedKeyValue(keys, obj);

    expect(result).toBeUndefined();
  });

  it("should handle arrays within the object", () => {
    const obj = { a: { b: { c: [1, 2, "value"] } } };
    const keys = ["a", "b", "c", "2"];

    const result = getNestedKeyValue(keys, obj);

    expect(result).toBe(undefined);
  });

  it("should return the object itself if the keys array is empty", () => {
    const obj = { a: { b: { c: "value" } } };
    const keys: string[] = [];

    const result = getNestedKeyValue(keys, obj);

    expect(result).toBe(obj);
  });
});
