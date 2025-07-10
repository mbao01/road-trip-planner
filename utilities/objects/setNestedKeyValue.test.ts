import { describe, expect, it } from "vitest";
import { setNestedKeyValue } from "./setNestedKeyValue";

describe("setNestedKeyValue", () => {
  it("should set the nested value if the path exists", () => {
    const obj = { a: { b: { c: "initial" } } };
    const keys = ["a", "b", "c"];
    const value = "updated";

    const result = setNestedKeyValue(keys, value, obj);

    expect(result).toEqual({ a: { b: { c: "updated" } } });
  });

  it("should create nested objects if the path does not exist", () => {
    const obj = {};
    const keys = ["a", "b", "c"];
    const value = "newValue";

    const result = setNestedKeyValue(keys, value, obj);

    expect(result).toEqual({ a: { b: { c: "newValue" } } });
  });

  it("should replace non-object values with objects if necessary", () => {
    const obj = { a: "notAnObject" };
    const keys = ["a", "b", "c"];
    const value = "newValue";

    const result = setNestedKeyValue(keys, value, obj);

    expect(result).toEqual({ a: { b: { c: "newValue" } } });
  });

  it("should handle arrays within the object", () => {
    const obj = { a: { b: { c: [1, 2, 3] } } };
    const keys = ["a", "b", "c", "2"];
    const value = "updated";

    const result = setNestedKeyValue(keys, value, obj);

    expect(result).toEqual({
      a: { b: { c: { 2: "updated" } } },
    });
  });

  it("should return a new object and not mutate the original", () => {
    const obj = { a: { b: { c: "initial" } } };
    const keys = ["a", "b", "c"];
    const value = "updated";

    const result = setNestedKeyValue(keys, value, obj);

    expect(result).not.toBe(obj); // Should not be the same reference
    expect(obj).toEqual({ a: { b: { c: "initial" } } }); // Original object should remain unchanged
  });

  it("should handle setting a property in an empty object", () => {
    const obj = {};
    const keys = ["a"];
    const value = "newValue";

    const result = setNestedKeyValue(keys, value, obj);

    expect(result).toEqual({ a: "newValue" });
  });

  it("should handle an empty keys array by not modifying the object", () => {
    const obj = { a: { b: { c: "initial" } } };
    const keys: string[] = [];
    const value = "newValue";

    const result = setNestedKeyValue(keys, value, obj);

    expect(result).toEqual(obj);
  });
});
