# `@game-gpt/von-schema`

Validation for applications that store structured documents in VON.

VON defines a portable value format; it does not decide which fields your application requires. `@game-gpt/von-schema`
fills that deliberate gap with a small, JSON Schema-inspired vocabulary designed around VON V1 values.

## Validate a document

```ts
import {parse} from "@game-gpt/von";
import {validate, type VonSchema} from "@game-gpt/von-schema";

const schema: VonSchema = {
    type: "object",
    required: ["format", "version", "name"],
    additionalProperties: false,
    properties: {
        format: {type: "string", const: "app.config"},
        version: {type: "integer", minimum: 1},
        name: {type: "string", minLength: 1},
    },
};

const result = validate(
    parse(`{ format: "app.config", version: 1, name: "atlas" }`),
    schema,
);

if (!result.valid) {
    for (const error of result.errors) {
        console.error(`${error.path}: ${error.message}`);
    }
}
```

`validate` returns `{ valid, errors }` instead of throwing for ordinary validation failures. Each error carries a data
path, readable message, and the schema keyword that failed.

## Supported vocabulary

- `type`, `const`, and `enum`;
- integer `minimum` and `maximum`;
- string length and `pattern`;
- array items, length, and uniqueness;
- object properties, required keys, property counts, and
  `additionalProperties`;
- `anyOf`, `oneOf`, `allOf`, and `not`;
- local definitions through `definitions` and `$defs`.

The VON type vocabulary uses `integer`, not JSON Schema's broader `number`, because floating-point values do not exist
in VON V1. This package is JSON Schema-inspired rather than a claim of complete draft conformance; treat the exported
`VonSchema` type and validation tests as the implemented surface.

## Develop

```bash
pnpm --filter @game-gpt/von-schema test
pnpm --filter @game-gpt/von-schema typecheck
pnpm --filter @game-gpt/von-schema build
```

Run these commands from the **repository root**. Licensed under
[MPL-2.0](../../../License.md). Start with
[`@game-gpt/von`](../von/README.md) when you need parsing or serialization.
