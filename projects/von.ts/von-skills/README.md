# `@game-gpt/von-skills`

Agent Skills for **people** who edit `.von` files — configuration, metadata, and other human-maintained documents. Install
once with `npx skills add`; your AI assistant learns VON syntax, value-model limits, and stack-specific validation.

**Not** for contributors to the `von-language` repository.

## Install

```bash
# Current project
npx skills add @game-gpt/von-skills --skill von-language -y

# Preview skills in the package
npx skills add @game-gpt/von-skills --list

# All projects on this machine
npx skills add @game-gpt/von-skills --skill von-language -y -g
```

Requires Node.js 18+ for the installer only. Works with agents that support [Agent Skills](https://agentskills.io/).

## After install

Ask in chat:

- "Convert this JSON config to VON with comments explaining each field"
- "Review this `.von` file for invalid values or keys"
- "Add a `format` and `version` header to this settings document"

See [`skills/von-language/SKILL.md`](./skills/von-language/SKILL.md) and
[`skills/von-language/references/hosts.md`](./skills/von-language/references/hosts.md) for grammar and per-stack usage.

## Develop

Source: [voml/von-language](https://github.com/voml/von-language) → `projects/von.ts/von-skills`

```bash
pnpm --filter @game-gpt/von-skills typecheck
npx skills add ./projects/von.ts/von-skills --list
```
