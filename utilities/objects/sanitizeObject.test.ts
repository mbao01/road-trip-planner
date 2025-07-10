import { describe, expect, it } from "vitest";
import { sanitizeObject } from "./sanitizeObject";

describe("sanitizeObject", () => {
  it.each([undefined, false, null, 0, ""])("returns input as is when it is %s", (input) => {
    const result = sanitizeObject(input, /password/) as Record<string, unknown>;
    expect(result).toEqual(input);
  });

  it("masks matching keys in a flat object", () => {
    const input = { name: "Alice", password: "secret" };
    const result = sanitizeObject(input, /password/) as Record<string, unknown>;
    expect(result).toEqual({ name: "Alice", password: "****" });
  });

  it("masks deeply nested keys", () => {
    const input = {
      user: {
        credentials: {
          token: "abc123",
          nested: {
            secret: "top-secret",
          },
        },
      },
    };

    const result = sanitizeObject(input, /token|secret/) as any;
    expect(result.user.credentials.token).toBe("****");
    expect(result.user.credentials.nested.secret).toBe("****");
  });

  it("handles arrays of objects", () => {
    const input = {
      logs: [
        { event: "login", token: "123" },
        { event: "logout", token: "456" },
      ],
    };

    const result = sanitizeObject(input, /token/) as any;
    expect(result.logs[0].token).toBe("****");
    expect(result.logs[1].token).toBe("****");
  });

  it("does not mutate the original input", () => {
    const input = { password: "unchanged" };
    const original = JSON.stringify(input);
    sanitizeObject(input, /password/);
    expect(JSON.stringify(input)).toBe(original);
  });

  it("supports case-insensitive regex", () => {
    const input = { Password: "abc", SeCrEt: "def" };
    const result = sanitizeObject(input, /password|secret/i) as Record<string, unknown>;
    expect(result.Password).toBe("****");
    expect(result.SeCrEt).toBe("****");
  });

  it("returns primitives unchanged", () => {
    expect(sanitizeObject(null, /x/)).toBeNull();
    expect(sanitizeObject(42, /x/)).toBe(42);
    expect(sanitizeObject("hello", /x/)).toBe("hello");
  });

  it("respects custom mask value", () => {
    const input = {
      secret: "hide me",
      nice: {
        mysecret: "hehehe",
        secretary: "must hide",
        someSecret: "secret",
      },
    };
    const result = sanitizeObject(input, /secret/gi, "[REDACTED]") as Record<string, unknown>;
    expect(result).toStrictEqual({
      secret: "[REDACTED]",
      nice: {
        mysecret: "[REDACTED]",
        secretary: "[REDACTED]",
        someSecret: "[REDACTED]",
      },
    });
  });

  it("works with empty objects and arrays", () => {
    expect(sanitizeObject({}, /x/)).toEqual({});
    expect(sanitizeObject([], /x/)).toEqual([]);
  });

  it("does not sanitize unmatched keys", () => {
    const input = { username: "john", email: "john@example.com" };
    const result = sanitizeObject(input, /password/) as Record<string, unknown>;
    expect(result).toEqual(input);
  });

  it("handles nested arrays and objects", () => {
    const input = {
      a: [
        {
          b: {
            c: [
              {
                password: "nested-password",
              },
            ],
          },
        },
      ],
    };

    const result = sanitizeObject(input, /password/) as any;
    expect(result.a[0].b.c[0].password).toBe("****");
  });
});
