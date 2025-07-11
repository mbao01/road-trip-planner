import { describe, expect, it } from "vitest";
import { deleteNestedKey } from "./deleteNestedKey";

describe("deleteNestedKey", () => {
  it("should delete the nested key and return the updated object", () => {
    const obj = { a: { b: { c: "value", d: undefined } } };
    const keys = ["a", "b", "c"];

    const result = deleteNestedKey(keys, obj);

    expect(result).toEqual({ a: { b: { d: undefined } } });
  });

  it.each([
    { obj: { a: { b: { c: "value" } } }, expected: {} },
    {
      obj: { a: { b: { c: "value" }, e: "inside" } },
      expected: { a: { e: "inside" } },
    },
    {
      obj: { a: { b: { c: "value" } }, e: "outside" },
      expected: { e: "outside" },
    },
  ])("should delete the nested key and its empty parents", ({ obj, expected }) => {
    const keys = ["a", "b", "c"];

    const result = deleteNestedKey(keys, obj);

    expect(result).toEqual(expected);
  });

  it("should not modify the original object", () => {
    const obj = { a: { b: { c: "value" } } };
    const keys = ["a", "b", "c"];

    const result = deleteNestedKey(keys, obj);

    expect(result).not.toBe(obj); // Should not be the same reference
    expect(obj).toEqual({ a: { b: { c: "value" } } }); // Original object should remain unchanged
  });

  it("should return the original object if the key does not exist", () => {
    const obj = { a: { b: { c: "value" } } };
    const keys = ["a", "b", "nonexistent"];

    const result = deleteNestedKey(keys, obj);

    expect(result).toEqual({ a: { b: { c: "value" } } });
  });

  it("should return the original object if the object is not an object", () => {
    const obj: any = null;
    const keys = ["a", "b", "c"];

    const result = deleteNestedKey(keys, obj);

    expect(result).toEqual(null);
  });

  it("should not handle arrays as an object", () => {
    const obj = { a: { b: { c: [1, 2, "value"] } } };
    const keys = ["a", "b", "c", 2] as string[];

    const result = deleteNestedKey(keys, obj);

    expect(result).toEqual({ a: { b: { c: [1, 2, "value"] } } });
  });

  it("should return original array when key is not found", () => {
    const obj = { a: { b: { c: "value" } } };
    const keys = ["c", "b", "a"];

    const result = deleteNestedKey(keys, obj);

    expect(result).toEqual({ a: { b: { c: "value" } } });
  });

  it("should return the original object if keys array is empty", () => {
    const obj = { a: { b: { c: "value" } } };
    const keys: string[] = [];

    const result = deleteNestedKey(keys, obj);

    expect(result).toEqual({ a: { b: { c: "value" } } });
  });
});
