# VON for VS Code

This directory reserves the package identity and workspace boundary for a future VON extension. It is currently a
**private placeholder**, not a usable or published editor extension.

Keeping the placeholder explicit prevents repository maps and package tooling from implying capabilities that do not
exist yet. Syntax highlighting, diagnostics, formatting, completion, packaging, and Marketplace publication are not
implemented here today.

The reusable building blocks for future editor work already live in
[`@game-gpt/von`](../von/README.md), including the lexer, token model, parser, lexical helpers, and parse errors. Any
editor integration should build on that shared language surface rather than defining a separate VON dialect.
