# agent-kit

A template that turns any repository into a place where a coding agent can work predictably.

It is one idea: **the work has one home, the gates have evidence, and the setup can be
verified.** Everything here serves that, and anything that stops serving it gets deleted.

## What you get

- `AGENTS.md` — the entry point. Read once, then follow five steps.
- `.agents/project.md` — generated from your manifests: stack, real build/test/lint commands,
  entry points, generated directories. One home, cited by everything else.
- `.agents/tasks/` — one task file per unit of work, with a lane (QUICK or PLANNED), two
  gates, an evidence table, and a close-out that derives the changed files from git.
- `.agents/rules/` — a router plus short rule files. One home per rule; indexes cite.
- `docs/` — the knowledge seed: architecture map, API skeleton, entry points.
- `scripts/agent-kit.mjs` — the only executable surface. Zero dependencies. Bun or Node.

## Install

```bash
git clone --depth 1 <template-url> "$TMPDIR/agent-kit"
bun "$TMPDIR/agent-kit/scripts/agent-kit.mjs" setup . --source <template-url>
bun scripts/agent-kit.mjs doctor --strict
```

`setup` detects your stack, writes `.agents/project.md`, and copies the kit. It never
overwrites a file that already exists. `doctor --strict` exits non-zero until the fill work
is done — that is the definition of "set up", and the point of the whole thing.

See `SETUP.md` for the contract and the expected output of each step.

## Daily use

```bash
bun scripts/agent-kit.mjs task new fix-login --lane planned
bun scripts/agent-kit.mjs verify          # records the evidence in the active task
bun scripts/agent-kit.mjs task close      # scope-check, inventory, archive, index
```

## The two lanes

| | QUICK | PLANNED |
|---|---|---|
| When | three files or fewer, reversible, no contract change | everything else |
| Halts | none; verify and record | one before the first edit, one before close |
| Always halts | destructive actions, new dependencies, schema changes, scope breaches | same |

The lane exists because the alternative is either ceremony for a typo or no review for a
schema change. Choosing per task is what keeps the gates honest.

## What the gates actually check

| Command | Question |
|---|---|
| `verify` | do the declared build, typecheck, lint and test commands exit 0 — with the codes recorded? |
| `task close` | did the diff stay inside the declared write set, and is the outcome written down? |
| `doctor` | do the docs name real paths, do the commands exist, is the index current, is the encoding clean? |
| `check` | has the template moved since install, and did you edit machinery you should not have? |

Every one of them can fail. `selftest` asserts that by building a throwaway repo and
deliberately tripping each gate.

## Staying current

`check` never writes and prints one row per file: `CURRENT`, `UPGRADE`, `DRIFT`, `MISSING`,
`PRUNE`, `SEED-UPDATED`. `pull` applies the safe rows, refuses to overwrite a file you
modified unless you pass `--force`, and never deletes without a `prune` entry. Provenance and
per-file hashes live in `.agents/template.json`.

## What is deliberately not here

No sprint system, no persona fleet, no 10-phase pipeline, no per-rule report script, no
PowerShell engine. Each of those is real machinery with a real maintenance cost, and none of
them earns that cost at this size. If a repo outgrows this, add one thing at a time and give
it a check.
