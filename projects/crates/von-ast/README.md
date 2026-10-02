# `von-ast`

The syntax-independent value model shared by VON's Rust parser and public API.

`VonValue` represents exactly the VON V1 data kinds: null, boolean, signed 64-bit integer, string, array, and
string-keyed object. There is intentionally no floating-point or executable-expression variant.

## When to depend on this crate

Most applications can import `VonValue` through the top-level
[`von`](../von/README.md) crate. A direct `von-ast` dependency is useful for a library that exchanges VON values but
does not need to parse or serialize text.

The crate's optional Serde support is enabled by the top-level `von` crate when its `serde` feature is selected.

## A deliberately small model

Keeping the value layer independent of tokens and source text lets parsers and serializers share one portable
representation while application semantics stay in application types and validators. Source comments and whitespace
belong to the lossless CST in `von-parser`, not to `VonValue`.

## Verify

```bash
cargo test -p von-ast --all-features
cargo clippy -p von-ast --all-features --all-targets -- -D warnings
```

Run these commands from `projects/von.rs`. Licensed under MPL-2.0.
