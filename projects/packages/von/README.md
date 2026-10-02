# `@game-gpt/von`

The core TypeScript implementation of **VON (Virtual Object Notation)**. It is a focused, dependency-free language
package for reading human-authored VON and writing deterministic VON from application data.

## What you get

- `parse` and `VonParser` for VON V1 documents;
- `stringify` and `stringifyIndented` for canonical output;
- `Lexer`, tokens, and lexical helpers for tooling;
- `VonParseError` for syntax failures;
- `VonValue` plus narrowing helpers for consumers that inspect data manually.

## Parse a document

```ts
import { parse } from "@game-gpt/von";

const config = parse(`
  # Comments are part of the authoring experience.
  { name: "atlas", enabled: true, ports: [8080, 8443] }
`);
```

`parse` returns a `VonValue`: `null`, boolean, integer, string, array, or a string-keyed object. VON V1 does not accept
floating-point literals.

## Write canonical VON

```ts
import { stringifyIndented } from "@game-gpt/von";

const text = stringifyIndented({ version: 1, name: "atlas", enabled: true });
```

Indented output uses two spaces and lexicographically sorted object keys. That makes it suitable for generated
configuration, snapshots, and normalization tools where stable diffs matter.

## Handle syntax errors

```ts
import { parse, VonParseError } from "@game-gpt/von";

try {
  parse(`{ scale: 1.5 }`);
} catch (error) {
  if (error instanceof VonParseError) console.error(error.message);
}
```

## Build language-aware tools

The lower-level exports are intentionally public for formatters, editors, and diagnostic tools:

```ts
import { Lexer, isTrivia, type Token } from "@game-gpt/von";
```

Use `Lexer` when token-level information matters. Use `parse` for application data. Document-specific validation belongs
in the sibling
[`@game-gpt/von-schema`](../von-schema/README.md) package.

## Develop

```bash
pnpm --filter @game-gpt/von test
pnpm --filter @game-gpt/von typecheck
pnpm --filter @game-gpt/von build
```

Run these commands from the **repository root**. Licensed under
[MPL-2.0](../../../License.md). See the
[repository overview](../../../readme.md) for the shared language contract.
