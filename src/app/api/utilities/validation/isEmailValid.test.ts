import { describe, expect } from "vitest";
import { isEmailValid } from "./isEmailValid";

describe("isEmailValid", () => {
  it("should return true for a valid email", () => {
    expect(isEmailValid("example@example.com")).toBe(true);
  });

  it("should return true for a valid email with subdomain", () => {
    expect(isEmailValid("user@mail.example.com")).toBe(true);
  });

  it("should return false for an email without @ symbol", () => {
    expect(isEmailValid("example.com")).toBe(false);
  });

  it("should return false for an email without domain", () => {
    expect(isEmailValid("example@")).toBe(false);
  });

  it("should return false for an email without username", () => {
    expect(isEmailValid("@example.com")).toBe(false);
  });

  it("should return false for an email with spaces", () => {
    expect(isEmailValid("exa mple@example.com")).toBe(false);
  });

  it("should return true for an email with special characters", () => {
    expect(isEmailValid("example@exa!mple.com")).toBe(true);
  });

  it("should return true for a valid email with plus sign", () => {
    expect(isEmailValid("user+mailbox@example.com")).toBe(true);
  });

  it("should return true for a valid email with hyphen", () => {
    expect(isEmailValid("user-name@example.com")).toBe(true);
  });

  it("should return false for an email with multiple @ symbols", () => {
    expect(isEmailValid("user@@example.com")).toBe(false);
  });

  it("should return true for a valid email with numeric domain", () => {
    expect(isEmailValid("user@example123.com")).toBe(true);
  });

  it("should return true for a valid email with underscore", () => {
    expect(isEmailValid("user_name@example.com")).toBe(true);
  });
});
