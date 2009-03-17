import { asArray, asInteger, asObject, asStr, type VonValue } from "@game-gpt/von";
import type { VonSchema, VonSchemaType, VonValidationError, VonValidationResult } from "./types.js";

export function validate(data: VonValue, schema: VonSchema): VonValidationResult {
  const errors: VonValidationError[] = [];
  validateAt(data, schema, "", errors, schema);
  return { valid: errors.length === 0, errors };
}

function validateAt(
  data: VonValue,
  schema: VonSchema,
  path: string,
  errors: VonValidationError[],
  root: VonSchema,
): void {
  if (schema.$ref) {
    const resolved = resolveRef(schema.$ref, root);
    if (!resolved) {
      errors.push({
        path,
        keyword: "$ref",
        message: `unresolved $ref ${schema.$ref}`,
      });
      return;
    }
    validateAt(data, resolved, path, errors, root);
    return;
  }

  if (schema.const !== undefined && !deepEqual(data, schema.const as VonValue)) {
    errors.push({ path, keyword: "const", message: "value does not match const" });
  }

  if (schema.enum && !schema.enum.some((item) => deepEqual(data, item as VonValue))) {
    errors.push({ path, keyword: "enum", message: "value is not in enum" });
  }

  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!types.some((type) => matchesType(data, type))) {
      errors.push({
        path,
        keyword: "type",
        message: `expected ${types.join(" | ")}, got ${runtimeType(data)}`,
      });
      return;
    }
  }

  if (schema.allOf) {
    for (const item of schema.allOf) {
      validateAt(data, item, path, errors, root);
    }
  }

  if (schema.anyOf) {
    const anyOk = schema.anyOf.some((item) => validate(data, item).valid);
    if (!anyOk) {
      errors.push({ path, keyword: "anyOf", message: "value matches no anyOf schema" });
    }
  }

  if (schema.oneOf) {
    const matches = schema.oneOf.filter((item) => validate(data, item).valid).length;
    if (matches !== 1) {
      errors.push({
        path,
        keyword: "oneOf",
        message: `value matched ${matches} oneOf schemas`,
      });
    }
  }

  if (schema.not && validate(data, schema.not).valid) {
    errors.push({ path, keyword: "not", message: "value matches not schema" });
  }

  const integer = asInteger(data);
  if (integer !== undefined) {
    if (schema.minimum !== undefined && integer < schema.minimum) {
      errors.push({
        path,
        keyword: "minimum",
        message: `integer ${integer} is less than minimum ${schema.minimum}`,
      });
    }
    if (schema.maximum !== undefined && integer > schema.maximum) {
      errors.push({
        path,
        keyword: "maximum",
        message: `integer ${integer} is greater than maximum ${schema.maximum}`,
      });
    }
  }

  const text = asStr(data);
  if (text !== undefined) {
    if (schema.minLength !== undefined && text.length < schema.minLength) {
      errors.push({
        path,
        keyword: "minLength",
        message: `string length ${text.length} is less than minLength ${schema.minLength}`,
      });
    }
    if (schema.maxLength !== undefined && text.length > schema.maxLength) {
      errors.push({
        path,
        keyword: "maxLength",
        message: `string length ${text.length} is greater than maxLength ${schema.maxLength}`,
      });
    }
    if (schema.pattern !== undefined && !new RegExp(schema.pattern).test(text)) {
      errors.push({
        path,
        keyword: "pattern",
        message: `string does not match pattern ${schema.pattern}`,
      });
    }
  }

  const array = asArray(data);
  if (array !== undefined) {
    if (schema.minItems !== undefined && array.length < schema.minItems) {
      errors.push({
        path,
        keyword: "minItems",
        message: `array length ${array.length} is less than minItems ${schema.minItems}`,
      });
    }
    if (schema.maxItems !== undefined && array.length > schema.maxItems) {
      errors.push({
        path,
        keyword: "maxItems",
        message: `array length ${array.length} is greater than maxItems ${schema.maxItems}`,
      });
    }
    if (schema.uniqueItems) {
      for (let i = 0; i < array.length; i += 1) {
        for (let j = i + 1; j < array.length; j += 1) {
          if (deepEqual(array[i]!, array[j]!)) {
            errors.push({
              path: joinPath(path, String(i)),
              keyword: "uniqueItems",
              message: `duplicate item at index ${j}`,
            });
          }
        }
      }
    }
    if (schema.items) {
      if (Array.isArray(schema.items)) {
        schema.items.forEach((itemSchema, index) => {
          if (index < array.length) {
            validateAt(array[index]!, itemSchema, joinPath(path, String(index)), errors, root);
          }
        });
      } else {
        array.forEach((item, index) => {
          validateAt(item, schema.items as VonSchema, joinPath(path, String(index)), errors, root);
        });
      }
    }
  }

  const object = asObject(data);
  if (object !== undefined) {
    const keys = Object.keys(object);
    if (schema.minProperties !== undefined && keys.length < schema.minProperties) {
      errors.push({
        path,
        keyword: "minProperties",
        message: `object has fewer than ${schema.minProperties} properties`,
      });
    }
    if (schema.maxProperties !== undefined && keys.length > schema.maxProperties) {
      errors.push({
        path,
        keyword: "maxProperties",
        message: `object has more than ${schema.maxProperties} properties`,
      });
    }
    if (schema.required) {
      for (const key of schema.required) {
        if (!(key in object)) {
          errors.push({
            path: joinPath(path, key),
            keyword: "required",
            message: `missing required property '${key}'`,
          });
        }
      }
    }
    for (const key of keys) {
      const propertySchema = schema.properties?.[key];
      if (propertySchema) {
        validateAt(object[key]!, propertySchema, joinPath(path, key), errors, root);
        continue;
      }
      if (schema.additionalProperties === false) {
        errors.push({
          path: joinPath(path, key),
          keyword: "additionalProperties",
          message: `unexpected property '${key}'`,
        });
      } else if (typeof schema.additionalProperties === "object") {
        validateAt(
          object[key]!,
          schema.additionalProperties,
          joinPath(path, key),
          errors,
          root,
        );
      }
    }
  }
}

function resolveRef(ref: string, root: VonSchema): VonSchema | undefined {
  const match = ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
  if (!match) return undefined;
  const name = match[1]!;
  return root.$defs?.[name] ?? root.definitions?.[name];
}

function matchesType(data: VonValue, type: VonSchemaType): boolean {
  switch (type) {
    case "null":
      return data === null;
    case "boolean":
      return typeof data === "boolean";
    case "integer":
      return asInteger(data) !== undefined;
    case "string":
      return typeof data === "string";
    case "array":
      return Array.isArray(data);
    case "object":
      return asObject(data) !== undefined;
  }
}

function runtimeType(data: VonValue): string {
  if (data === null) return "null";
  if (typeof data === "boolean") return "boolean";
  if (typeof data === "number") return Number.isSafeInteger(data) ? "integer" : "number";
  if (typeof data === "string") return "string";
  if (Array.isArray(data)) return "array";
  return "object";
}

function joinPath(base: string, segment: string): string {
  if (!base) return `/${segment}`;
  return `${base}/${segment}`;
}

function deepEqual(left: VonValue, right: VonValue): boolean {
  if (left === right) return true;
  if (Array.isArray(left) && Array.isArray(right)) {
    if (left.length !== right.length) return false;
    return left.every((item, index) => deepEqual(item, right[index]!));
  }
  const leftObject = asObject(left);
  const rightObject = asObject(right);
  if (leftObject && rightObject) {
    const leftKeys = Object.keys(leftObject).sort();
    const rightKeys = Object.keys(rightObject).sort();
    if (leftKeys.length !== rightKeys.length) return false;
    return leftKeys.every(
      (key, index) =>
        key === rightKeys[index] && deepEqual(leftObject[key]!, rightObject[key]!),
    );
  }
  return false;
}
