# agent-kit — Agent Entry Point

This repository is a **template for coding agents**, not an application. Read this file,
then do the one thing you were asked to do.

## If you were asked to set this up in another repo

Do not improvise a file layout. Run the kit:

```bash
git clone --depth 1 <template-url> "$TMPDIR/agent-kit"
bun "$TMPDIR/agent-kit/scripts/agent-kit.mjs" setup . --source <template-url>
bun scripts/agent-kit.mjs doctor --strict
```

`SETUP.md` is the contract: what to detect, what to fill, and the exact output each step
must produce. Follow it in order; it is idempotent and never overwrites an authored file.

The only work that needs judgement is the fill: `AGENTS.md` rules and placeholders,
`.agents/project.md` domain notes, and `docs/` from the real tree. Everything else is
deterministic. `doctor --strict` exiting 0 is the definition of "set up".

## If you were asked to change the template

Read, in order:

1. `SETUP.md` — the install contract the change must keep true.
2. `.agents/sync-manifest.json` — what travels to a target repo and what never does.
3. `.agents/rules/_behavior.md` — how work is planned, verified and closed here.
4. `docs/INDEX.md` — this repo's own map (it is small on purpose).

Then run the gates before and after:

```bash
node scripts/agent-kit.mjs selftest
node scripts/agent-kit.mjs doctor
```

`selftest` builds a throwaway repo and asserts that every gate can fail. A change that
makes a gate unfailable is the defect the suite exists to catch.

## Boundary protocol

**Always** — keep changes inside the files the task declares; run `selftest` and `doctor`
before and after; cite a rule's home instead of restating it.

**Ask first** — a new file category, a new command, a change to the manifest's
`machinery`/`seeds`/`owned` split, or anything that makes a gate softer.

**Never** — add a rule without a check that enforces it; duplicate a rule into a second
file; ship a seed whose example paths would be read as real.

## Core rules

1. **The kit is the only executable surface.** One script, zero dependencies, Bun or Node.
   Do not add a second entry point; add a subcommand.
2. **One home per fact.** Commands live in `project.md`. Rules live in one file. Indexes
   cite, they do not summarise.
3. **Seeds, not copies.** Anything a target repo must author lives in `.agents/templates/`
   or is declared in the manifest's `seeds` map. Nothing else is duplicated.
4. **Every invariant has a check, and every check must be able to fail.** `selftest`
   proves it once; the CI workflow proves it on every push.

## Layout

```
AGENTS.md                     this file (the template's own entry point)
SETUP.md                      the install contract
INIT_PROMPT.md                the text a human pastes into a new repo
.agents/
  sync-manifest.json          machinery / seeds / owned / prune
  project.md                  generated per repo: stack + commands (single source)
  rules/                      INDEX (router) + _behavior + one file per domain
  tasks/                      INDEX, active/, archive/, .counter
  logs/changelog.md           release notes: Unreleased + one block per release
  templates/                  the seeds, plus rule-file examples and the task template
scripts/agent-kit.mjs         setup | check | pull | doctor | verify | task | selftest
.githooks/pre-commit          optional per-clone guard: refuses an out-of-scope commit
.opencode/skills/agent-kit/   project skill: the trigger and the do/do-not boundary
examples/minimal/             what a filled repo looks like (not installed)
docs/                         the knowledge seed a target repo authors from
```
