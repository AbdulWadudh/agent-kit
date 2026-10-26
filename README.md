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
- `.opencode/skills/agent-kit/` — a project skill: the trigger and the do/do-not boundary.
- `examples/minimal/` — what a filled repo looks like, for a fictional project.
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

You do not type commands. You describe the task:

> "Login fails when the email has a plus sign. Fix it."

The agent opens the task (`task new`, which records the baseline run for you), edits inside
the declared write set, and closes it (`task close`, which runs the suite itself and refuses a
red result). The kit exists so that path is checkable — not so that you drive it.

What is worth typing yourself:

| When | Command |
|---|---|
| you want to see what the agent claims | `task show` |
| you want the truth check, not the agent's summary | `doctor --strict` (`--json` in CI) |
| you are about to accept a template upgrade | `check`, then `pull --dry-run` |

And when an agent commits outside its declared write set, the optional pre-commit guard
reports it:

```bash
git config core.hooksPath .githooks   # per clone, off by default
```

It is off by default on purpose. It is git config, not a repo file: every clone would
otherwise get a hook nobody asked for, and the same check already runs at `task close`. Turn
it on where an agent commits unattended; skip it if your team would rather not have a hook.

## What the changelog is

`.agents/logs/changelog.md` is the release notes, and both halves of it are generated:

```
## 🚧 Unreleased

### 🟢 Added
- `TASK-118`: rate-limited the invite endpoint

### 🔵 Changed
- `TASK-116`: session tokens now rotate on refresh
```

`task close` files one entry under the task's `type` (`added`, `changed`, `fixed`, `removed`).
When the batch is done:

```bash
bun scripts/agent-kit.mjs release 0.4.0 --summary "Invites are rate-limited and sessions rotate."
```

That turns the Unreleased block into a release — summary, the categories that have entries, and
Touched Modules derived from the archived plans' file inventories:

```
## 🚀 Release [v0.4.0] — 2026-10-27

### 🚀 Summary
Invites are rate-limited and sessions rotate.

---

### 🟢 Added
- `TASK-118`: rate-limited the invite endpoint

### 🔵 Changed
- `TASK-116`: session tokens now rotate on refresh

---

### 📦 Touched Modules
- `src/api/invites/`
- `src/session.ts`
```

and leaves a fresh, empty Unreleased block behind. `release` refuses an empty batch and a
version that is not `1.2.3`-shaped; the version is the one thing it will not invent.

Each task ID is the pointer back to the evidence: the archived plan holds the scope, the
baseline run, the post-change run with real exit codes and the inventory. `doctor` fails if an
archived task has no entry, so the notes cannot quietly lose a change — and the task index
deliberately does not repeat them.

If the repo already publishes a user-facing `CHANGELOG.md`, this is a different audience and a
different cadence. Keep both, and do not generate one from the other.

`--amend "<why>"` on `task close` is the recorded way to accept a file that turned out to be
in scope later; the reason is written into the archived plan.

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
| `task close` | did the diff stay inside the declared write set, is the evidence green, and is the outcome written down? |
| `doctor` | do the docs name real paths, do the commands exist, is the index current, is the encoding clean, is every rule checkable? |
| `check` | has the template moved since install, and did you edit machinery you should not have? |

Every one of them can fail. `selftest` asserts that by building a throwaway repo and
deliberately tripping each gate — twelve scenarios, from a red baseline to a scope breach.

## The skill

`.opencode/skills/agent-kit/SKILL.md` is shipped with the kit: a project skill that triggers
on "set this repo up" and states the boundary — what to do, what never to do. It is a
pointer, not a second copy of the rules: `AGENTS.md` and `SETUP.md` remain the contract, and
the skill says so in its first paragraph.

No plugin: a plugin is code that runs on every turn, and this needs instructions at the
moment the work starts. `examples/minimal/` shows a filled repo, for when you want to see the
target instead of reading about it.

The skill is repo-local: it triggers while you work in a repo that has it. To have it trigger
in every repo, copy the directory into your own global skills folder once — that copy belongs
to your machine, not to the kit, and `pull` will never touch it.

## Staying current

`check` never writes and prints one row per file: `CURRENT`, `UPGRADE`, `DRIFT`, `MISSING`,
`PRUNE`, `SEED-UPDATED`. `pull` applies the safe rows, refuses to overwrite a file you
modified unless you pass `--force`, and never deletes without a `prune` entry. Provenance and
per-file hashes live in `.agents/template.json`.

## What is deliberately not here

No sprint system, no persona fleet, no 10-phase pipeline, no per-rule report script, no
PowerShell engine, no plugin. Each of those is real machinery with a real maintenance cost,
and none of them earns that cost at this size. If a repo outgrows this, add one thing at a
time and give it a check.
