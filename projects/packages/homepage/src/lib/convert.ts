import { stringifyIndented, type VonValue } from "@game-gpt/von";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

export type ExternalFormat = "json" | "yaml";

export const EXTERNAL_FORMATS: { id: ExternalFormat; label: string }[] = [
  { id: "json", label: "JSON" },
  { id: "yaml", label: "YAML" },
];

/** Convert a JSON/YAML decoded value into a VON-compatible value. */
export function toVonValue(input: unknown, path = "$"): VonValue {
  if (input === null) return null;
  if (typeof input === "boolean") return input;
  if (typeof input === "string") return input;
  if (typeof input === "number") {
    if (!Number.isSafeInteger(input)) {
      throw new Error(`${path}: VON v1 rejects floats and unsafe integers`);
    }
    return input;
  }
  if (typeof input === "bigint") {
    const asNumber = Number(input);
    if (!Number.isSafeInteger(asNumber) || BigInt(asNumber) !== input) {
      throw new Error(`${path}: integer outside safe integer range`);
    }
    return asNumber;
  }
  if (Array.isArray(input)) {
    return input.map((item, index) => toVonValue(item, `${path}[${index}]`));
  }
  if (typeof input === "object") {
    const proto = Object.getPrototypeOf(input);
    if (proto !== Object.prototype && proto !== null) {
      throw new Error(`${path}: unsupported object type`);
    }
    const object: { [key: string]: VonValue } = {};
    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      object[key] = toVonValue(value, `${path}.${key}`);
    }
    return object;
  }
  throw new Error(`${path}: unsupported value type ${typeof input}`);
}

export function parseExternal(source: string, format: ExternalFormat): VonValue {
  const trimmed = source.trim();
  if (!trimmed) {
    throw new Error("input is empty");
  }
  if (format === "json") {
    return toVonValue(JSON.parse(trimmed));
  }
  return toVonValue(parseYaml(trimmed));
}

export function formatExternal(value: VonValue, format: ExternalFormat): string {
  if (format === "json") {
    return `${JSON.stringify(value, null, 2)}\n`;
  }
  return stringifyYaml(value, {
    indent: 2,
    lineWidth: 0,
    defaultStringType: "QUOTE_DOUBLE",
    defaultKeyType: "PLAIN",
  });
}

export function externalToVon(source: string, format: ExternalFormat): string {
  return stringifyIndented(parseExternal(source, format));
}

export function vonToExternal(
  source: string,
  format: ExternalFormat,
  parseVon: (text: string) => VonValue,
): string {
  return formatExternal(parseVon(source), format);
}
