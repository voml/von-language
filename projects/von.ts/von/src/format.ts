import { VonError } from "./error.js";
import { isIdentifierContinue, isIdentifierStart } from "./lexical.js";
import { isVonObject, type VonValue } from "./value.js";

/** Serialize a value to compact, deterministic VON text. */
export function stringify(value: VonValue): string {
  return formatValue(assertVonValue(value), undefined, 0);
}

/** Serialize a value to deterministic, two-space-indented VON text. */
export function stringifyIndented(value: VonValue, indentWidth = 2): string {
  return formatValue(assertVonValue(value), indentWidth, 0);
}

function assertVonValue(value: VonValue): VonValue {
  if (typeof value === "number") {
    if (!Number.isSafeInteger(value)) {
      throw new VonError("VON 不支持浮点数或超出安全整数范围的数值");
    }
  }
  return value;
}

function formatValue(value: VonValue, indent: number | undefined, depth: number): string {
  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return quote(value);
  if (Array.isArray(value)) return formatArray(value, indent, depth);
  if (isVonObject(value)) return formatObject(value, indent, depth);
  throw new VonError("unsupported VON value");
}

function formatArray(
  values: VonValue[],
  indent: number | undefined,
  depth: number,
): string {
  if (values.length === 0) return "[]";
  if (indent === undefined) {
    return `[${values.map((value) => formatValue(value, undefined, depth)).join(",")}]`;
  }
  const prefix = " ".repeat(indent * (depth + 1));
  const suffix = " ".repeat(indent * depth);
  const body = values
    .map((value) => `${prefix}${formatValue(value, indent, depth + 1)}`)
    .join(",\n");
  return `[\n${body}\n${suffix}]`;
}

function formatObject(
  entries: { [key: string]: VonValue },
  indent: number | undefined,
  depth: number,
): string {
  const keys = Object.keys(entries).sort();
  if (keys.length === 0) return "{}";
  if (indent === undefined) {
    return `{${keys
      .map((key) => `${formatKey(key)}:${formatValue(entries[key]!, undefined, depth)}`)
      .join(",")}}`;
  }
  const prefix = " ".repeat(indent * (depth + 1));
  const suffix = " ".repeat(indent * depth);
  const body = keys
    .map(
      (key) =>
        `${prefix}${formatKey(key)}: ${formatValue(entries[key]!, indent, depth + 1)}`,
    )
    .join(",\n");
  return `{\n${body}\n${suffix}}`;
}

function formatKey(key: string): string {
  if (isIdentifier(key) && key !== "null" && key !== "true" && key !== "false") {
    return key;
  }
  return quote(key);
}

function isIdentifier(key: string): boolean {
  if (key.length === 0) return false;
  if (!isIdentifierStart(key[0]!)) return false;
  for (let i = 1; i < key.length; i += 1) {
    if (!isIdentifierContinue(key[i]!)) return false;
  }
  return true;
}

function quote(value: string): string {
  let output = '"';
  for (const ch of value) {
    switch (ch) {
      case '"':
        output += '\\"';
        break;
      case "\\":
        output += "\\\\";
        break;
      case "\n":
        output += "\\n";
        break;
      case "\r":
        output += "\\r";
        break;
      case "\t":
        output += "\\t";
        break;
      default:
        output += ch;
    }
  }
  return `${output}"`;
}
