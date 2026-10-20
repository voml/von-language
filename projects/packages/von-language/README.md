# `@voml/von-language`

The **VON (Virtual Object Notation)** language toolchain for TypeScript: lexer, token model, parser, parse errors,
lexical helpers, and deterministic canonical writers. The values it produces are the
[`@voml/von`](../von/README.md) value model, which this package depends on.

## What you get

- `parse` and `VonParser` for VON V1 documents;
- `stringify` and `stringifyIndented` for canonical output;
- `Lexer`, `Token` / `TokenKind`, `isTrivia`, and lexical helpers for tooling;
- `VonError` and `VonParseError` for failures.

## Parse a document

```ts
import { parse } from "@voml/von-language";

const config = parse(`
  # Comments are part of the authoring experience.
  { name: "atlas", enabled: true, ports: [8080, 8443] }
`);
```

`parse` returns a `VonValue` from [`@voml/von`](../von/README.md): null, boolean, integer, string, array, or a
string-keyed object. VON V1 does not accept floating-point literals.

## Write canonical VON

```ts
import { stringifyIndented } from "@voml/von-language";

const text = stringifyIndented({ version: 1, name: "atlas", enabled: true });
```

Indented output uses two spaces and lexicographically sorted object keys. That makes it suitable for generated
configuration, snapshots, and normalization tools where stable diffs matter.

## Handle syntax errors

```ts
import { parse, VonParseError } from "@voml/von-language";

try {
  parse(`{ scale: 1.5 }`);
} catch (error) {
  if (error instanceof VonParseError) console.error(error.message);
}
```

## Build language-aware tools

The lower-level exports are intentionally public for formatters, editors, and diagnostic tools:

```ts
import { Lexer, isTrivia, type Token } from "@voml/von-language";
```

Use `Lexer` when token-level information matters. Use `parse` for application data. Document-specific validation belongs
in the sibling
[`@voml/von-schema`](../von-schema/README.md) package.

## Develop

```bash
pnpm --filter @voml/von-language test
pnpm --filter @voml/von-language typecheck
pnpm --filter @voml/von-language build
```

Run these commands from the **repository root**. Licensed under
[MPL-2.0](../../../License.md). See the
[repository overview](../../../readme.md) for the shared language contract.
