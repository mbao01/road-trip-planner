import { describe, expect, it } from "vitest";
import { sortBy } from "./sortBy";

describe("sortBy", () => {
  it("sorts an array of objects by a numeric property in descending order", () => {
    const data = [
      { name: "Alice", score: 88 },
      { name: "Bob", score: 95 },
      { name: "Charlie", score: 70 },
    ];

    sortBy(data, "score");

    expect(data).toEqual([
      { name: "Bob", score: 95 },
      { name: "Alice", score: 88 },
      { name: "Charlie", score: 70 },
    ]);
  });

  it("sorts an array of objects by a numeric property in ascending order", () => {
    const data = [
      { name: "Alice", score: 88 },
      { name: "Bob", score: 95 },
      { name: "Charlie", score: 70 },
    ];

    sortBy(data, "score", "asc");

    expect(data).toEqual([
      { name: "Charlie", score: 70 },
      { name: "Alice", score: 88 },
      { name: "Bob", score: 95 },
    ]);
  });

  it("handles empty arrays", () => {
    const data: { score: number }[] = [];
    sortBy(data, "score");
    expect(data).toEqual([]);
  });

  it("handles properties that are strings that can be converted to numbers", () => {
    const data = [
      { name: "Item1", value: "10" },
      { name: "Item2", value: "5" },
      { name: "Item3", value: "20" },
    ];

    sortBy(data, "value");

    expect(data).toEqual([
      { name: "Item2", value: "5" },
      { name: "Item3", value: "20" },
      { name: "Item1", value: "10" },
    ]);
  });

  it("sorts non-numeric properties in descending order", () => {
    const data = [{ id: "b" }, { id: "a" }, { id: "c" }];

    sortBy(data, "id");

    expect(data).toEqual([{ id: "c" }, { id: "b" }, { id: "a" }]);
  });

  it("sorts non-numeric properties in ascending order", () => {
    const data = [{ id: "b" }, { id: "a" }, { id: "c" }];

    sortBy(data, "id", "asc");

    expect(data).toEqual([{ id: "a" }, { id: "b" }, { id: "c" }]);
  });
});
