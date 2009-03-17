import { parse } from "@game-gpt/von";
import { describe, expect, it } from "vitest";
import { validate, type VonSchema } from "./index.js";

const configSchema: VonSchema = {
  $id: "https://game-gpt.dev/schemas/app.config.von-schema",
  type: "object",
  required: ["format", "version", "name", "ports"],
  additionalProperties: false,
  properties: {
    format: { type: "string", const: "app.config" },
    version: { type: "integer", minimum: 1 },
    name: { type: "string", minLength: 1 },
    ports: {
      type: "array",
      minItems: 1,
      items: { type: "integer" },
    },
  },
};

describe("@game-gpt/von-schema", () => {
  it("accepts a valid config document", () => {
    const value = parse(`{
  format: "app.config",
  version: 1,
  name: "atlas",
  ports: [8080]
}`);
    expect(validate(value, configSchema).valid).toBe(true);
  });

  it("rejects missing required fields and wrong types", () => {
    const value = parse(`{ format: "app.config", version: "1" }`);
    const result = validate(value, configSchema);
    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.keyword === "required")).toBe(true);
    expect(result.errors.some((error) => error.keyword === "type")).toBe(true);
  });
});
