/**
 * VON Schema — a JSON Schema–like vocabulary for VON v1 values.
 *
 * VON has no floats; use `integer` instead of JSON Schema's `number`.
 */
export type VonSchemaType =
  | "null"
  | "boolean"
  | "integer"
  | "string"
  | "array"
  | "object";

export interface VonSchema {
  $id?: string;
  $schema?: string;
  $ref?: string;
  title?: string;
  description?: string;
  type?: VonSchemaType | VonSchemaType[];
  const?: unknown;
  enum?: unknown[];
  /** Minimum inclusive integer. */
  minimum?: number;
  /** Maximum inclusive integer. */
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  items?: VonSchema | VonSchema[];
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
  properties?: { [key: string]: VonSchema };
  required?: string[];
  additionalProperties?: boolean | VonSchema;
  minProperties?: number;
  maxProperties?: number;
  anyOf?: VonSchema[];
  oneOf?: VonSchema[];
  allOf?: VonSchema[];
  not?: VonSchema;
  definitions?: { [key: string]: VonSchema };
  $defs?: { [key: string]: VonSchema };
}

export interface VonValidationError {
  path: string;
  message: string;
  keyword: string;
}

export interface VonValidationResult {
  valid: boolean;
  errors: VonValidationError[];
}
