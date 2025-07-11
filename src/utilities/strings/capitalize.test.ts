import { describe, expect, it } from "vitest";
import { capitalize } from "./capitalize";

describe("capitalize", () => {
  it("should capitalize the first letter of every word", () => {
    expect(capitalize("hello")).toEqual("Hello");
    expect(capitalize("hello world")).toEqual("Hello World");
    expect(capitalize("hello-world")).toEqual("Hello-world");
    expect(capitalize("THIS is a vERy long TexT and then many spaces    Okay , bye.")).toEqual(
      "THIS Is A VERy Long TexT And Then Many Spaces    Okay , Bye."
    );
  });

  it("should return when string is not truthy", () => {
    expect(capitalize("")).toEqual("");
    expect(capitalize(" ")).toEqual(" ");
    expect(capitalize(null)).toEqual(null);
    expect(capitalize(undefined)).toEqual(undefined);
  });
});
