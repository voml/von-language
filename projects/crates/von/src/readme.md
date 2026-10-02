# VON implementation boundary

This module is the application-facing assembly point for VON's Rust implementation. It combines the shared `VonValue`
model with the lexer, value parser, lossless edge-trivia CST, and optional Serde conversion.

The boundary is intentionally narrow: VON parses and serializes portable data. It does not interpret project files,
scenes, resources, database schemas, or other host-specific document meanings. Those contracts belong to the consumer
and can evolve independently through explicit document fields and validation.

For public examples, feature flags, and crate selection guidance, see the crate-level [`README.md`](../README.md).
