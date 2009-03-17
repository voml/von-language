# VON source notice

`src/cst/`, `src/deserializer.rs`, `src/error.rs`, `src/lexer/`,
`src/lexical.rs`, `src/parser/`, `src/serializer.rs`, and `src/value.rs`
were copied from `valkyrie-language/valkyrie.rs`,
`projects/std-data/src/text/von`, on 2026-08-09.

The upstream repository root distributes the source under Mozilla Public License, version 2.0. The unmodified license
text is in
`LICENSE-MPL-2.0.md`. The copied implementation remains in separate source files so its MPL-2.0 source-form obligations
remain clear.

Spark-specific files are `src/lib.rs`, `src/format.rs`, `tests/meta_format.rs`, and the project documentation. They
define Spark's VON meta-file contract; they do not import or depend on the upstream Nyar runtime.
