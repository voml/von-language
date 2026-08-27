# VON authoring reference

Grammar and value-model quick reference. For **installing the skill** and **using VON in TypeScript, Rust, or other
stacks**, read [hosts.md](hosts.md) first.

## V1 value model

| Kind    | Examples           | Notes                                |
|---------|--------------------|--------------------------------------|
| Null    | `null`             | Lowercase keyword                    |
| Boolean | `true`, `false`    | Lowercase keywords                   |
| Integer | `0`, `-12`, `4096` | No floating-point literals           |
| String  | `"hello"`          | Double-quoted; escapes supported     |
| Array   | `[1, 2, 3]`        | Values may nest                      |
| Object  | `{ a: 1 }`         | String keys only; bare or quoted     |

Anything outside this set (floats, expressions, undefined, dates as special types) is **invalid V1**.

## Comments and keys

- Comments: `#` to end of line.
- Bare keys: start with `[A-Za-z_]`; continue with letters, digits, `_`, `.`, `-`, `@`.
- Prefer bare keys for everyday config; use quoted keys when names need spaces or unusual characters.

## Canonical output

Tools that **generate** VON (not hand-authored files) should use canonical writers when stable diffs matter:

- two-space indentation,
- lexicographically sorted object keys,
- quoted string values.

Hand-authored files may use compact layout and comments; parsers accept both.

## Versioning pattern

VON does not mandate a schema. Products often add explicit headers:

```von
{
  format: "product.settings",
  version: 2,
  # ... payload ...
}
```

The application validates `format` and migrates on `version` changes. Document migration steps for the user's team when
bumping `version`.

## Compatibility (for the user's team)

**Usually backward compatible**

- Add optional object fields
- Add array elements
- Add comments

**Coordinate before shipping**

- Remove or rename fields
- Change value types (integer ↔ string)
- Tighten validation rules in `@game-gpt/von-schema` or custom checks

## Common mistakes

| Mistake              | Fix                                      |
|----------------------|------------------------------------------|
| `scale: 1.5`         | Use integer fixed-point or string policy |
| `enabled: True`      | Lowercase `true` / `false`               |
| `'name': "x"`        | Double quotes for strings; bare keys OK  |
| `{ 8080, 8443 }`     | Use array: `[8080, 8443]`              |
| YAML `---` headers   | VON is not YAML — use `#` comments       |

## Relationship to VOS

- **VON** — data documents (config, metadata, payloads).
- **VOS** — application schema (tables, classes, services).

Do not embed VOS grammar inside `.von` files unless the user's product explicitly defines that convention.
