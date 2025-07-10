import { describe, expect, it } from "vitest";
import { unslug } from "./unslug";

describe("unslug", () => {
  it("replaces single dashes with a space", () => {
    expect(unslug("foo-bar")).toBe("foo bar");
  });

  it("replaces single underscores with a space", () => {
    expect(unslug("foo_bar")).toBe("foo bar");
  });

  it("replaces mixed sequences with a single space", () => {
    expect(unslug("foo-bar_baz--qux__zap")).toBe("foo bar baz qux zap");
  });

  it("collapses multiple dashes and underscores into one space", () => {
    expect(unslug("foo--__bar")).toBe("foo bar");
  });

  it("returns the same string if no dashes or underscores are present", () => {
    expect(unslug("plain text")).toBe("plain text");
  });

  it("returns an empty string unchanged", () => {
    expect(unslug("")).toBe("");
  });
});
