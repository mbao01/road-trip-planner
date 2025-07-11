import { describe, expect } from "vitest";
import { isURLValid } from "./isURLValid";

describe("isURLValid", () => {
  it("should return true for valid URLs with https", () => {
    expect(isURLValid("https://example.com")).toBe(true);
  });

  it("should return true for valid URLs with http", () => {
    expect(isURLValid("http://example.com")).toBe(true);
  });

  it("should return false for invalid protocol (ftp)", () => {
    expect(isURLValid("ftp://example.com")).toBe(false);
  });

  it("should return true for localhost", () => {
    expect(isURLValid("http://localhost")).toBe(true);
  });

  it("should return true for localhost with port", () => {
    expect(isURLValid("http://localhost:8080")).toBe(true);
  });

  it("should return true for IPv4 address", () => {
    expect(isURLValid("http://127.0.0.1")).toBe(true);
  });

  it("should return true for IPv4 address with port", () => {
    expect(isURLValid("http://127.0.0.1:8080")).toBe(true);
  });

  it("should return false for relative URL", () => {
    expect(isURLValid("example.com")).toBe(false);
  });

  it("should return true for URL with fragment", () => {
    expect(isURLValid("https://example.com#fragment")).toBe(true);
  });

  it("should return false for fragment-only URL", () => {
    expect(isURLValid("#")).toBe(false);
  });

  it("should return false for invalid URL", () => {
    expect(isURLValid("invalid-url")).toBe(false);
  });

  it("should return false for IPv6 address", () => {
    expect(isURLValid("http://[::1]")).toBe(false);
  });

  it("should return false for IPv6 address with port", () => {
    expect(isURLValid("http://[::1]:8080")).toBe(false);
  });
});
