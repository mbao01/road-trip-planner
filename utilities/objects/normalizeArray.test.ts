import { describe, expect, it } from "vitest";
import { normalizeArray } from "./normalizeArray";

describe("normalizeArray", () => {
  it("pads array [1, 2, 3] to length 5", () => {
    expect(normalizeArray([1, 2, 3], 5)).toEqual([1, 2, 3, "", ""]);
  });

  it("pads array [1, 2] to length 5", () => {
    expect(normalizeArray([1, 2], 5)).toEqual([1, 2, "", "", ""]);
  });

  it("does not change array [1, 2, 3, 4, 5]", () => {
    expect(normalizeArray([1, 2, 3, 4, 5], 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("does not truncate array [1, 2, 3, 4, 5, 6] to length 5", () => {
    expect(normalizeArray([1, 2, 3, 4, 5, 6], 5)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('pads array [1, 2, 3] with custom pad value "-" to length 5', () => {
    expect(normalizeArray([1, 2, 3], 5, "-")).toEqual([1, 2, 3, "-", "-"]);
  });

  it("pads array [1, 2] to custom length 6 with default pad value", () => {
    expect(normalizeArray([1, 2], 6)).toEqual([1, 2, "", "", "", ""]);
  });

  it("returns non-array input as is", () => {
    expect(normalizeArray("not an array" as unknown, 2)).toEqual("not an array");
  });
});
