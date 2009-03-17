# `von-parser`

The hand-written lexer and recursive-descent parser behind VON's Rust implementation.

Most applications should use the top-level [`von`](../von/README.md) crate.
`von-parser` exists for language tooling and libraries that need direct access to tokens, syntax failures, or VON's
lossless concrete syntax tree.

## Public surface

- `Lexer`, `Token`, and `TokenKind` expose lexical structure;
- `VonParser` parses source into the shared `VonValue` model;
- `VonCstParser`, `VonCstRoot`, and `VonCstElement` preserve source structure and edge trivia for tooling;
- `VonParseError` reports invalid VON input;
- identifier helpers expose the grammar's bare-key character rules.

## Value parsing and CST parsing

Use value parsing when the document's data is all that matters. Use the CST surface when a formatter, editor, or source
transformation must retain comments and surrounding trivia. The CST is not an alternative semantic model: both paths
implement the same VON language.

## Boundaries

The crate recognizes VON syntax only. It does not validate product schemas, resolve references, evaluate expressions, or
interpret application-specific fields. Keeping those responsibilities outside the parser makes the grammar portable and
predictable.

## Verify

```bash
cargo test -p von-parser
cargo clippy -p von-parser --all-targets -- -D warnings
```

Run these commands from `projects/von.rs`. Licensed under MPL-2.0. Attribution is recorded in the workspace [
`NOTICE.md`](../NOTICE.md).
