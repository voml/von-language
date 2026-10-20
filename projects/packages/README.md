# VON for TypeScript

The TypeScript workspace is the quickest way to parse, inspect, validate, and experiment with VON documents. It contains
the core language package, a small schema vocabulary, and the public-facing browser playground in one pnpm workspace.

## Packages

| Directory                                   | Package                | What it provides                                                 |
|---------------------------------------------|------------------------|------------------------------------------------------------------|
| [`von/`](./von/README.md)                   | `@voml/von`            | Canonical `VonValue`, type guards, and host conversion helpers   |
| [`von-language/`](./von-language/README.md) | `@voml/von-language`   | Lexer, parser, tokens, parse diagnostics, and canonical writers  |
| [`von-schema/`](./von-schema/README.md)     | `@voml/von-schema`     | JSON Schema-inspired validation for the VON V1 value model       |
| [`von-skills/`](./von-skills/README.md)     | `@voml/von-skills`     | Agent Skills for **users** authoring `.von` (`npx skills add`)   |
| [`homepage/`](./homepage/README.md)         | `@voml/von-homepage`   | Bilingual language site and interactive JSON/YAML/VON playground |
| [`von-on-vscode/`](von-on-vscode/README.md) | `@voml/vscode-von`     | Reserved workspace for future VS Code support                    |

## A small end-to-end example

```ts
import {parse, stringifyIndented} from "@voml/von-language";
import {validate, type VonSchema} from "@voml/von-schema";

const value = parse(`
  # Human-authored service settings
  { format: "service.config", version: 1, name: "atlas", replicas: 3 }
`);

const schema: VonSchema = {
    type: "object",
    required: ["format", "version", "name", "replicas"],
    additionalProperties: false,
    properties: {
        format: {const: "service.config"},
        version: {type: "integer", minimum: 1},
        name: {type: "string", minLength: 1},
        replicas: {type: "integer", minimum: 1},
    },
};

const result = validate(value, schema);
if (!result.valid) console.error(result.errors);
console.log(stringifyIndented(value));
```

Parsing and validation stay separate on purpose: the language package defines valid VON, while each product decides what
a particular document means.

## Work in this repository

Requirements: Node.js 22 and pnpm 10. Install from the **repository root** (single pnpm workspace):

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm build
pnpm dev
```

Build or test one package with filters:

```bash
pnpm --filter @voml/von build
pnpm --filter @voml/von-language test
pnpm --filter @voml/von-schema test
pnpm --filter @voml/von-homepage build
# same as root: pnpm homepage → dist/cdn
```

## Workspace principles

- The core parser has no dependency on Vue, YAML, or the website.
- `@voml/von` owns the value model only, while `@voml/von-language` owns lexing, parsing, and formatting and depends on `@voml/von`. The reverse dependency is forbidden.
- Schema validation consumes ordinary `VonValue` data and does not alter the language grammar.
- The website dogfoods the local workspace packages through `workspace:*`.
- Floating-point values are outside VON V1 and are rejected rather than silently rounded or converted.
- Canonical formatting is deterministic so generated output remains reviewable.

For the language contract, Rust implementation, repository status, and license, return to
the [VON repository overview](../../readme.md).
