# VON language site and playground

VMZ application: bilingual intro at `/` and an interactive playground at `/playground` for JSON, YAML, and VON conversion.
Uses `@vmz/ui`, `@vmz/ui-icons`, and the workspace `@game-gpt/von` parser.

## Run locally

From the **repository root**:

```bash
pnpm install
pnpm dev
```

## Production / CDN build

```bash
pnpm homepage
```

This runs the built-in `static` profile (`assembly: static-cdn`) for **`--target browser`**, and writes under:

```text
projects/von.ts/homepage/dist/cdn/
```

`dist/<name>` is the **delivery slice** to upload (Cloudflare Pages, Netlify, any object/CDN host). It is not the VMZ
`--target` enum — compile target stays `browser`; the folder name `cdn` means “ship this tree to a CDN”.

Preview:

```bash
pnpm --filter @game-gpt/von-homepage serve
```

## Output layout

| Path | Meaning |
|------|---------|
| `dist/cdn/` | Browser + `static` release — upload this directory |
| (future) `dist/<other>/` | Other VMZ targets / profiles when needed (e.g. mini-program) |

## Static hosts (Cloudflare / Netlify / …)

| Setting | Value |
|---------|-------|
| Root directory | repository root (`.`) |
| Build command | `corepack enable && pnpm install && pnpm homepage` |
| Output / publish directory | `projects/von.ts/homepage/dist/cdn` |
| Node.js | 22 |

Do **not** add SPA `_redirects` fallback — `static` emits real per-route HTML and `404.html`.

Parser APIs: [`@game-gpt/von`](../von/README.md).
