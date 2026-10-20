# `@voml/von`

The **VON (Virtual Object Notation)** value model for TypeScript: the canonical `VonValue` union plus the guards and
accessors that inspect or narrow it. This package is dependency-free and never touches VON source text — lexing,
parsing, diagnostics, and formatting live in [`@voml/von-language`](../von-language/README.md).

## What you get

- `VonValue` — the canonical V1 value union;
- `isVonObject` — object narrowing that rejects arrays and `null`;
- `asBool` / `asInteger` / `asStr` / `asArray` / `asObject` — non-coercing accessors.

## The V1 value model

```ts
import { asInteger, asStr, isVonObject, type VonValue } from "@voml/von";

const value: VonValue = { name: "atlas", replicas: 3 };
if (isVonObject(value)) {
  asStr(value.name); // "atlas"
  asInteger(value.replicas); // 3
}
```

`VonValue` is `null`, boolean, safe integer, string, array, or a string-keyed object. Floating-point numbers are outside
VON V1, so `asInteger` returns `undefined` for them instead of rounding.

## Where the rest lives

| Need                                                     | Package                                        |
|----------------------------------------------------------|------------------------------------------------|
| Parse `.von` text, tokens, diagnostics, canonical writers | [`@voml/von-language`](../von-language/README.md) |
| Validate a document against a contract                    | [`@voml/von-schema`](../von-schema/README.md)  |

## Develop

```bash
pnpm --filter @voml/von test
pnpm --filter @voml/von typecheck
pnpm --filter @voml/von build
```

Run these commands from the **repository root**. Licensed under
[MPL-2.0](../../../License.md). See the
[repository overview](../../../readme.md) for the shared language contract.
