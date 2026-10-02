/** VON v1 runtime value. Floats are intentionally unsupported. */
export type VonValue =
  | null
  | boolean
  | number
  | string
  | VonValue[]
  | { [key: string]: VonValue };

export function isVonObject(value: VonValue): value is { [key: string]: VonValue } {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function asBool(value: VonValue): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

export function asInteger(value: VonValue): number | undefined {
  return typeof value === "number" && Number.isSafeInteger(value) ? value : undefined;
}

export function asStr(value: VonValue): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export function asArray(value: VonValue): VonValue[] | undefined {
  return Array.isArray(value) ? value : undefined;
}

export function asObject(
  value: VonValue,
): { [key: string]: VonValue } | undefined {
  return isVonObject(value) ? value : undefined;
}
