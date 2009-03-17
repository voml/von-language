# VON for Rust

The Rust workspace brings VON's small, human-friendly data model to native applications without forcing every consumer
through Serde. Use the high-level
`von` crate for ordinary application code, or depend on the parser and AST crates directly when building language
tooling.

## Crates

| Crate                                  | Best for                    | Surface                                                                     |
|----------------------------------------|-----------------------------|-----------------------------------------------------------------------------|
| [`von`](./von/README.md)               | Application code            | Public facade, `VonValue`, parser exports, optional Serde, canonical writer |
| [`von-parser`](./von-parser/README.md) | Editors and language tools  | Lexer, tokens, recursive-descent parser, lossless CST, parse errors         |
| [`von-ast`](./von-ast/README.md)       | Shared value representation | Syntax-independent `VonValue` model                                         |

## Parse without Serde

```rust
use von::{VonParser, VonValue};

let value = VonParser::parse(
    r#"
    # Native application settings
    { name: "atlas", workers: 4, enabled: true }
    "#,
)?;

if let VonValue::Object(fields) = value {
    println!("{} fields", fields.len());
}
```

## Deserialize typed data

Enable the `serde` feature when the destination is an application struct:

```toml
[dependencies]
von = { version = "0.1", features = ["serde"] }
serde = { version = "1", features = ["derive"] }
```

```rust
#[derive(Debug, serde::Deserialize)]
struct Service {
    name: String,
    workers: i64,
    enabled: bool,
}

let service: Service = von::from_str(
    r#"{ name: "atlas", workers: 4, enabled: true }"#,
)?;
```

The same feature enables `to_value`, `from_value`, `to_string`, and
`to_string_indented` for Serde-backed conversion and canonical text output.

## Feature model

| Feature | Default | Adds                                                                     |
|---------|---------|--------------------------------------------------------------------------|
| `serde` | No      | Typed serialization/deserialization, canonical writer, rich Serde errors |

Parsing into `VonValue`, tokenization, and CST access do not require Serde.

## Develop

```bash
cargo fmt --all -- --check
cargo check --workspace --all-features
cargo clippy --workspace --all-features --all-targets -- -D warnings
cargo test --workspace --all-features
```

## Design boundaries

- VON represents data, not executable configuration.
- The parser does not interpret application, scene, resource, or database semantics.
- The value model contains signed 64-bit integers and no floating-point variant.
- The lossless CST is available for tooling that must retain surrounding trivia; ordinary consumers should prefer
  `VonValue`.
- Canonical writers provide stable text and do not preserve an author's original whitespace or comments.

The Rust parser, CST, and Serde core contain adapted MPL-2.0 work. Attribution and history are recorded in [
`NOTICE.md`](./NOTICE.md). For the shared language contract, see the [repository overview](../../readme.md).
