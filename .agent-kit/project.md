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

`always` runs on every `verify`; `milestone` runs on the full baseline, `verify --full` and a
quick/planned `task close` — a subtask's or micro close is always-tier only. Mark a slow command
`milestone` so the inner loop stays short.

| Action | Command | When |
|---|---|---|
| test | `node .agent-kit/agent-kit.mjs selftest` | always |
| lint | `node .agent-kit/agent-kit.mjs doctor` | always |

`bun` runs the same file unchanged. No build step: the script is the artifact. Both rows are
fast enough for every run; a target repo's build is the row that would be `milestone`.

## Tasks

Who allocates a task id. `local` derives the next number from this repo's own task
files and change cards; `issue` takes the GitHub issue number, so two sessions on two
clones cannot mint the same id. `task renumber` moves a local id; it refuses in issue mode.

| Fact | Value |
|---|---|
| ids | issue |

## Entry points

- `.agent-kit/agent-kit.mjs` — dispatch only; its modules live in `.agent-kit/lib/` and are not
  entry points

## Never edit (generated)

- none

## Domain notes

- This repo is a template. `.agent-kit/templates/` holds the seeds a target repo authors from;
  editing a seed changes every future install, and `check` reports it as `SEED-UPDATED`.
- Nothing here is allowed to become a second entry point. A new capability is a subcommand whose
  module lives in `.agent-kit/lib/`, with an assertion in `selftest`.
- The template's own `.agent-kit/docs/` is both the seed source and the installed destination
  (see `.agent-kit/sync-manifest.json`).
  That is why it contains illustration blocks instead of this repo's history: it has none.
