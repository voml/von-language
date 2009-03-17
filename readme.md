# VON

**Virtual Object Notation: structured data that still feels written for people.**

VON is a compact, human-editable data format for configuration, metadata, and other versioned documents. It keeps JSON's
small and portable value model, then adds the things people miss as soon as a file has to be maintained by hand:
comments, bare keys, and a calm canonical layout.

```von
# A document can explain itself without becoming code.
{
  format: "app.config",
  version: 1,
  name: "atlas",
  ports: [8080, 8443],
  features: {
    search: true,
    telemetry: false
  }
}
```

VON deliberately stops at data. It does not evaluate expressions, interpolate environment variables, instantiate
classes, or hide application behavior in a configuration file. The application owns the meaning of a document; VON owns
the syntax, value model, parsing, and deterministic text representation.

## Why VON?

- **Readable without ceremony.** Comments and unquoted identifier keys keep everyday documents approachable.
- **Predictable by design.** The V1 value model is intentionally small: null, booleans, signed integers, strings,
  arrays, and string-keyed objects.
- **Stable in source control.** Canonical writers sort object keys and use a consistent two-space layout, making
  generated changes easier to review.
- **Portable across runtimes.** TypeScript and Rust implementations share the same language contract instead of growing
  host-specific dialects.
- **Safe to embed.** No executable syntax means consumers remain in control of validation, versioning, migration, and
  runtime behavior.

## Start in TypeScript

```ts
import {parse, stringifyIndented} from "@game-gpt/von";

const document = parse(`
  # Service metadata
  { name: "atlas", replicas: 3, enabled: true }
`);

console.log(stringifyIndented(document));
```

Use `@game-gpt/von-schema` when a document also needs an explicit validation contract:

```ts
import {parse} from "@game-gpt/von";
import {validate, type VonSchema} from "@game-gpt/von-schema";

const schema: VonSchema = {
    type: "object",
    required: ["name", "replicas"],
    properties: {
        name: {type: "string", minLength: 1},
        replicas: {type: "integer", minimum: 1},
    },
};

const result = validate(parse(`{ name: "atlas", replicas: 3 }`), schema);
```

See [`projects/von.ts`](./projects/von.ts/README.md) for package-level APIs, the browser playground, and workspace
commands.

## Start in Rust

The Rust workspace separates the public facade, parser, and value model. The
`von` crate parses directly into `VonValue`; enabling `serde` adds typed deserialization and canonical serialization.

```rust
use von::{VonParser, VonValue};

let value = VonParser::parse(r#"{ name: "atlas", replicas: 3 }"#) ?;
assert!(matches!(value, VonValue::Object(_)));
```

```rust
#[derive(Debug, serde::Deserialize)]
struct Service {
    name: String,
    replicas: i64,
}

let service: Service = von::from_str(r#"{ name: "atlas", replicas: 3 }"#) ?;
```

See [`projects/von.rs`](./projects/von.rs/README.md) for feature flags, crate boundaries, and development commands.

## The V1 language

| Kind    | Examples            | Notes                                |
|---------|---------------------|--------------------------------------|
| Null    | `null`              | A single null value                  |
| Boolean | `true`, `false`     | Lowercase keywords                   |
| Integer | `0`, `-12`, `4096`  | Floating-point literals are rejected |
| String  | `"hello"`           | Quoted strings support escapes       |
| Array   | `[1, 2, 3]`         | Values may be nested                 |
| Object  | `{ name: "atlas" }` | Keys are strings, quoted or bare     |

Comments begin with `#` and continue to the end of the line. Bare keys begin with an ASCII letter or `_`; subsequent
characters may also contain digits,
`.`, `-`, and `@`.

VON itself does not impose a document schema or compatibility policy. A format can make evolution explicit with fields
such as `format` and `version`, then validate them in the consuming application.

## Canonical output

Both implementations provide deterministic writers intended for generated or normalized documents. Canonical output
sorts object keys lexicographically, uses two spaces for indentation, quotes string values, and stays within the V1
value model. Tools get a shared output shape while authors remain free to use comments and compact formatting in
handwritten input.

## Repository map

```text
von-language/
├── License.md                MPL-2.0
├── pnpm-workspace.yaml       Single root pnpm workspace
├── .github/workflows/        TypeScript and Rust verification
├── scripts/                  Repo automation (`pnpm fmt`)
└── projects/
    ├── von.ts/               TS parser, schema validator, and playground
    └── von.rs/               Rust value model, parser, CST, and Serde bridge
```

The repository currently ships working TypeScript and Rust implementations. Editor tooling is represented by a private
placeholder package and is not yet presented as a finished extension.

## Develop

From the repository root (one pnpm workspace):

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm build
pnpm dev
```

Rust:

```bash
cd projects/von.rs
cargo fmt --all -- --check
cargo check --workspace --all-features
cargo clippy --workspace --all-features --all-targets -- -D warnings
cargo test --workspace --all-features
```

Or from the repo root: `pnpm check:rs` / `pnpm test:rs`.

## Project status

VON has a deliberately narrow V1 language contract and tested TypeScript and Rust implementations. The parser, canonical
writer, TypeScript schema validator, Rust lossless CST surface, and optional Rust Serde bridge are present today.
Broader editor integrations and additional language implementations remain future work.

## License and origin

This repository is licensed under the [Mozilla Public License 2.0](./License.md). The Rust parser, CST, and Serde core
include adapted work whose history and notices are recorded in [
`projects/von.rs/NOTICE.md`](./projects/von.rs/NOTICE.md).
