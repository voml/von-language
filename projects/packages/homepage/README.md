# VON language site and playground

**Live site:** [von-language.pages.dev](https://von-language.pages.dev/)

VMZ application: bilingual intro at `/` and an interactive playground at `/playground` for JSON, YAML, and VON conversion.
Uses `@vmz/ui`, `@vmz/ui-icons`, and the workspace `@voml/von-language` parser.

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
projects/packages/homepage/dist/cdn/
```

`dist/<name>` is the **delivery slice** to upload (Cloudflare Pages, Netlify, any object/CDN host). It is not the VMZ
`--target` enum — compile target stays `browser`; the folder name `cdn` means “ship this tree to a CDN”.

Preview:

```bash
pnpm --filter @voml/von-homepage serve
```

## Output layout

| Path | Meaning |
|------|---------|
| `dist/cdn/` | Browser + `static` release — upload this directory |
| (future) `dist/<other>/` | Other VMZ targets / profiles when needed (e.g. mini-program) |

## Static hosts (Cloudflare / Netlify / …)

| Setting | Value |
|---------|-------|
| Root directory | repository root (`.`) — **not** `projects/packages` |
| Build command | `pnpm homepage` |
| Output / publish directory | `dist/cdn` |
| Node.js | 22 |
| Env | `VMZ_SITE_ORIGIN=https://von-language.pages.dev` |

`VMZ_SITE_ORIGIN` is a **build-time** input for canonical / sitemap / `hreflang`. Set it on Cloudflare Pages (or any host running `pnpm homepage`) to the public origin.

`pnpm homepage` builds to `projects/packages/homepage/dist/cdn`, then syncs a copy to repo-root `dist/cdn` for static hosts. Do **not** set root to `projects/packages` while output stays `projects/packages/...` — Cloudflare will double the path.

Do **not** add SPA `_redirects` fallback — `static` emits real per-route HTML and `404.html`.

Parser APIs: [`@voml/von-language`](../von-language/README.md).
