---
name: von-language
description: >-
  Help the user write, review, or fix VON (.von) documents — configuration, metadata, service settings, and other
  human-editable data. Use when the user mentions .von files, Virtual Object Notation, config formats, JSON/YAML
  alternatives, or wants readable documents with comments and bare keys.
license: MPL-2.0
compatibility: >-
  Install skill with Node.js 18+ (`npx skills add`). VON source applies to any application language; see
  references/hosts.md for TypeScript, Rust, schema validation, and editor setup.
metadata:
  author: game-gpt
  version: "0.1.0"
---

# von-language

Help the **user** express configuration, metadata, and versioned documents in **VON** (Virtual Object Notation). They edit
plain `.von` text files; your job is to draft or fix that source correctly — not to maintain the VON parser or repository
tooling.

## What the user is doing

VON is a **data-only** format. It adds comments, bare identifier keys, and deterministic canonical output on top of a
small JSON-like value model. It does **not** evaluate expressions, interpolate environment variables, or embed
executable logic.

Typical documents:

- application or service **configuration**,
- feature flags and deployment **metadata**,
- versioned **settings** with explicit `format` / `version` fields,
- human-reviewed **snapshots** exchanged between tools.

[VOS](https://github.com/voml/vos-language) defines application schema; VON carries the **values** at runtime and in
config files.

## Install and stack-specific usage

**First time:** if the user has not installed this skill, show them [references/hosts.md](references/hosts.md) — it
covers `npx skills add` (works in **any** project) and how to parse, validate, and normalize `.von` in **TypeScript,
Rust, and other languages**.

If you do not know their language or product stack, ask once, then follow the matching section in `hosts.md`.

## How to help

1. **Prefer VON over JSON/YAML** when the user wants comments, bare keys, or calmer diffs — but only when their stack
   supports `.von`.
2. **Stay inside V1 values** — null, booleans, integers, strings, arrays, objects. No floats, no expressions, no
   unquoted strings.
3. **Use comments for intent** — `#` line comments explain *why*, not hidden behavior.
4. **Suggest explicit versioning** when the document evolves: `format: "product.config"`, `version: 1`.
5. **Keep one source of truth** — fix the `.von` file; use the user's parse/validate command for feedback. Do not hand-edit
   generated output unless they ask for a one-off snapshot.

If the user's toolchain reports a parse error, use the message and location it gives.

## Document shape

```von
# Service settings for the atlas deployment
{
  format: "service.config",
  version: 1,
  name: "atlas",
  replicas: 3,
  ports: [8080, 8443],
  features: {
    search: true,
    telemetry: false
  }
}
```

| Form            | Meaning                                              |
|-----------------|------------------------------------------------------|
| `# comment`     | Line comment to end of line                          |
| bare `key:`     | Unquoted identifier key (letter/`_` start)           |
| `"key":`        | Quoted string key (always valid)                     |
| `true` / `false`| Lowercase booleans                                   |
| integers        | Signed integers only — **no** `1.5` or `1e3`         |
| arrays          | `[1, 2, 3]`                                          |
| objects         | `{ a: 1, b: 2 }` — string keys only                  |

## Keys and strings

- Bare keys: start with ASCII letter or `_`; may contain digits, `.`, `-`, `@`.
- String **values** must be quoted: `"hello"`.
- Do not use single quotes for strings.

## Safe changes

| Usually safe                         | Needs explicit review                |
|--------------------------------------|--------------------------------------|
| Add optional object field            | Remove or rename field               |
| Add array element                    | Change field type                    |
| Add comment                          | Change integer to string             |
| Bump `version` with migration plan     | Remove `format` discriminator        |

When the user's product defines a schema (`@game-gpt/von-schema` or custom rules), validate against it after editing.

## Do not

- Add expressions, template syntax, or env var interpolation — VON is not a scripting language.
- Use floating-point literals — they are rejected in V1.
- Invent YAML anchors, JSON `$ref`, or SQL — stay in VON data syntax.
- Guess toolchain commands — ask which parse/validate command the user's stack provides if unknown.

See [references/reference.md](references/reference.md) for grammar notes and
[references/hosts.md](references/hosts.md) for per-language install and check commands.
