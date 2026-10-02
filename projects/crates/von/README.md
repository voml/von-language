# `von`

The application-facing Rust crate for **VON (Virtual Object Notation)**.

`von` collects the value model and parser behind one public facade. Its default surface is useful without Serde; an
opt-in `serde` feature adds typed conversion and deterministic text serialization.

## Parse into `VonValue`

```rust
use von::{VonParser, VonValue};

let value = VonParser::parse(r#"{ name: "atlas", ports: [8080, 8443] }"#)?;

match value {
    VonValue::Object(fields) => println!("{} fields", fields.len()),
    _ => unreachable!("the document root is an object"),
}
```

The crate also re-exports `Lexer`, token types, the lossless CST surface, and
`VonParseError` for consumers that need more than a final value.

## Add Serde when you need it

```toml
[dependencies]
von = { version = "0.1", features = ["serde"] }
serde = { version = "1", features = ["derive"] }
```

```rust
#[derive(serde::Deserialize, serde::Serialize)]
struct Package {
    name: String,
    private: bool,
}

let package: Package = von::from_str(
    r#"{ name: "example", private: true }"#,
)?;

let canonical = von::to_string_indented(&package)?;
```

Serde support includes `from_str`, `from_value`, `to_value`, `to_string`, and
`to_string_indented`, plus serializer/deserializer types for advanced use.

## Choose the right surface

- Use `VonParser` and `VonValue` for dynamic documents or a minimal dependency graph.
- Use the `serde` feature for strongly typed application configuration.
- Use the re-exported CST types for source-aware tools.
- Depend directly on `von-parser` or `von-ast` when a narrower crate boundary is valuable to your library.

## Verify

```bash
cargo test -p von --all-features
cargo clippy -p von --all-features --all-targets -- -D warnings
```

Run these commands from `projects/von.rs`. Licensed under MPL-2.0. See the
[Rust workspace guide](../README.md) for architecture and attribution.
