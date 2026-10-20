import { describe, expect, it } from "vitest";
import {
  asArray,
  asBool,
  asInteger,
  asObject,
  asStr,
  isVonObject,
  type VonValue,
} from "./index.js";

describe("@voml/von", () => {
  it("narrows objects and rejects arrays for object access", () => {
    const value: VonValue = { name: "atlas", ports: [8080] };
    expect(isVonObject(value)).toBe(true);
    expect(asObject(value)).toEqual({ name: "atlas", ports: [8080] });
    expect(isVonObject([])).toBe(false);
    expect(asObject([])).toBeUndefined();
  });

  it("narrows scalars without coercing across kinds", () => {
    expect(asBool(true)).toBe(true);
    expect(asBool(1)).toBeUndefined();
    expect(asStr("atlas")).toBe("atlas");
    expect(asStr(1)).toBeUndefined();
    expect(asInteger(1)).toBe(1);
    expect(asInteger(1.5)).toBeUndefined();
    expect(asInteger(true)).toBeUndefined();
  });

  it("exposes arrays only for array values", () => {
    expect(asArray([1, 2])).toEqual([1, 2]);
    expect(asArray({ a: 1 })).toBeUndefined();
  });
});
