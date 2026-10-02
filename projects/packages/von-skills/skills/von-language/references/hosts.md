# Install and use VON (by stack)

This guide is for **people building applications** — not for contributors to the `von-language` repository.

## Step 1 — Install the Agent Skill (any language)

The skill teaches your **AI assistant** how to write `.von` files. It does not replace your app's VON library.

**Requires:** [Node.js](https://nodejs.org/) 18+ (only for the one-time `npx` installer).

```bash
# Install into the current project (recommended)
npx skills add @game-gpt/von-skills --skill von-language -y

# Preview skills in the package
npx skills add @game-gpt/von-skills --list

# Install for all projects on this machine
npx skills add @game-gpt/von-skills --skill von-language -y -g
```

Works with agents supported by the [Agent Skills](https://agentskills.io/) ecosystem (for example Cursor, Claude Code,
VS Code with Copilot Agent mode, and others that honor `npx skills`).

**After install**, ask in chat:

- "Rewrite this JSON config as VON with comments"
- "Review this `.von` file for invalid literals or keys"
- "Add a version field and normalize key order"

The skill file lands under your project's agent skills directory (for example `.agents/skills/von-language/`).

---

## Step 2 — Use VON in your project

Pick the row that matches **your application language**. The `.von` **syntax is the same**; only the library differs.

| Your stack                  | Install / validate                         | Typical workflow                                      |
|-----------------------------|--------------------------------------------|-------------------------------------------------------|
| **Browser / playground**    | [von-language.pages.dev](https://von-language.pages.dev/playground) | Paste or edit → compare JSON/YAML/VON                 |
| **TypeScript / JavaScript** | [`@game-gpt/von`](#typescript--javascript) | `parse()` / `stringifyIndented()` in app or scripts   |
| **Schema validation**       | [`@game-gpt/von-schema`](#schema-validation) | Parse then `validate()` against `VonSchema`         |
| **Rust**                    | [`von` crate](#rust)                       | `VonParser::parse` / optional Serde `from_str`        |
| **Other languages**         | [No local parser yet](#other-languages)    | Edit `.von` in repo; validate in CI via TS/Rust host  |

---

### TypeScript / JavaScript

```bash
npm install @game-gpt/von
# or
pnpm add @game-gpt/von
```

```ts
import { parse, stringifyIndented, VonParseError } from "@game-gpt/von";

try {
  const value = parse(`
    # Service config
    { name: "atlas", replicas: 3, enabled: true }
  `);
  console.log(stringifyIndented(value));
} catch (error) {
  if (error instanceof VonParseError) console.error(error.message);
}
```

Canonical output sorts object keys and uses two-space indentation — useful for normalization and stable diffs.

---

### Schema validation

When a document must match a contract (required fields, integer ranges, `const` discriminators):

```bash
pnpm add @game-gpt/von @game-gpt/von-schema
```

```ts
import { parse } from "@game-gpt/von";
import { validate, type VonSchema } from "@game-gpt/von-schema";

const schema: VonSchema = {
  type: "object",
  required: ["format", "version", "name"],
  properties: {
    format: { const: "service.config" },
    version: { type: "integer", minimum: 1 },
    name: { type: "string", minLength: 1 },
  },
};

const result = validate(parse(`{ format: "service.config", version: 1, name: "atlas" }`), schema);
if (!result.valid) console.error(result.errors);
```

Validation is **application-defined** — VON itself does not ship one global schema for all documents.

---

### Rust

Add to `Cargo.toml` (see [voml/von-language](https://github.com/voml/von-language) for current crate version):

```toml
[dependencies]
von = { version = "0.1", features = ["serde"] }
```

```rust
use von::{VonParser, VonValue};

let value = VonParser::parse(r#"{ name: "atlas", replicas: 3 }"#)?;
assert!(matches!(value, VonValue::Object(_)));
```

Enable the `serde` feature when deserializing into Rust structs.

---

### Other languages

There is no official C#, Kotlin, or Go parser in this repository yet. Practical options:

1. Call the TypeScript or Rust implementation from CI or a small host tool.
2. Use the [browser playground](https://von-language.pages.dev/playground) for ad-hoc checks.
3. Keep `.von` as the human-edited source and validate at integration boundaries.

Do not invent a parallel `.von` dialect — stay on the V1 value model.

---

## Package map

| Package               | Role                                              |
|-----------------------|---------------------------------------------------|
| `@game-gpt/von-skills`| **This package** — AI help writing VON (any language) |
| `@game-gpt/von`       | TypeScript parser and canonical writer            |
| `@game-gpt/von-schema`| JSON Schema–inspired validation for `VonValue`    |
| `von` (Rust crate)    | Parser, value model, optional Serde bridge        |

Homepage: [von-language.pages.dev](https://von-language.pages.dev/)
