# Project Profile

This file is the only home for stack facts and commands. `AGENTS.md`, the rules and the
verification gate cite it; none of them restates it.

## Stack

| Fact | Value |
|---|---|
| Languages | JavaScript (ES modules, Node >= 18 or Bun) |
| Package manager | none — the kit has zero dependencies |
| Manifests | none |

## Commands

| Action | Command |
|---|---|
| test | `node scripts/agent-kit.mjs selftest` |
| lint | `node scripts/agent-kit.mjs doctor` |

`bun` runs the same file unchanged. No build step: the script is the artifact.

## Entry points

- `scripts/agent-kit.mjs`

## Never edit (generated)

- none

## Domain notes

- This repo is a template. `.agents/templates/` holds the seeds a target repo authors from;
  editing a seed changes every future install, and `check` reports it as `SEED-UPDATED`.
- Nothing here is allowed to become a second entry point. A new capability is a subcommand
  in `scripts/agent-kit.mjs`, with an assertion in `selftest`.
- The template's own `docs/` doubles as the seed for `docs/` (see `.agents/sync-manifest.json`).
  That is why it contains illustration blocks instead of this repo's history: it has none.
