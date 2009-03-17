import { describe, expect, it } from "vitest";
import { VonParseError, parse, stringifyIndented } from "./index.js";

describe("@game-gpt/von", () => {
  it("round-trips nested documents through canonical von", () => {
    const meta = {
      format: "app.config",
      version: 1,
      name: "atlas",
      ports: [8080],
    };

    const source = stringifyIndented(meta);
    expect(source).toBe(
      '{\n  format: "app.config",\n  name: "atlas",\n  ports: [\n    8080\n  ],\n  version: 1\n}',
    );
    expect(parse(source)).toEqual(meta);
  });

  it("parses comments and unquoted keys", () => {
    const source =
      "# application config\n{ format: app.config, version: 1, enabled: true }";
    const value = parse(source);
    expect(value).toEqual({
      format: "app.config",
      version: 1,
      enabled: true,
    });
  });

  it("rejects floating-point literals", () => {
    expect(() => parse("{ scale: 1.5 }")).toThrow(VonParseError);
  });
});
