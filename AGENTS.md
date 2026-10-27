# agent-kit — Agent Entry Point

This repository is a **template for coding agents**, not an application. Read this file,
then do the one thing you were asked to do.

## Load on demand

The tree is indexed so a session pays only for what it opens.

1. Open the index of the directory you are about to touch — `.agent-kit/INDEX.md`,
   then one row of it.
2. Read a file only when its index row matches the task. Follow a pointer only for the fact you
   need at the other end.
3. Never load an archive or a month folder in bulk. `task show` reads task state; a change is
   looked up by date or task id.
4. If a file repeats another file's fact, the copy is the bug. Keep the home, replace the copy
   with a pointer.

## If you were asked to set this up in another repo

Do not improvise a file layout. Run the kit:

```bash
git clone --depth 1 https://github.com/AbdulWadudh/agent-kit "$TMPDIR/agent-kit"
bun "$TMPDIR/agent-kit/.agent-kit/agent-kit.mjs" setup . --source https://github.com/AbdulWadudh/agent-kit
bun .agent-kit/agent-kit.mjs doctor --strict
```

`SETUP.md` is the contract: what to detect, what to fill, and the exact output each step
must produce. Follow it in order; it is idempotent and never overwrites an authored file.

The only work that needs judgement is the fill: `AGENTS.md` rules and placeholders,
`.agent-kit/project.md` domain notes, and `.agent-kit/docs/` from the real tree. Everything else is
deterministic. `doctor --strict` exiting 0 is the definition of "set up".

## If you were asked to change the template

Read, in order:

1. `SETUP.md` — the install contract the change must keep true.
2. `.agent-kit/sync-manifest.json` — what travels to a target repo and what never does.
3. `.agent-kit/rules/_behavior.md` — how work is planned, verified and closed here.
4. `.agent-kit/rules/commits.md` — the commit conventions.
5. `.agent-kit/docs/INDEX.md` — this repo's own map (it is small on purpose).

Then run the gates before and after:

```bash
node .agent-kit/agent-kit.mjs selftest
node .agent-kit/agent-kit.mjs doctor
```

`selftest` builds a throwaway repo and asserts that every gate can fail. A change that
makes a gate unfailable is the defect the suite exists to catch.

### What goes where

A rule — new, edited, moved or deleted — follows `.agent-kit/templates/INDEX.md`. Everything
else lands here:

| The change is | Home | Also update |
|---|---|---|
| a rule for every task, in every repo | `.agent-kit/rules/_behavior.md` | its row in `.agent-kit/rules/INDEX.md` |
| a commit-time rule | `.agent-kit/rules/commits.md` | its row in `.agent-kit/rules/INDEX.md` |
| a new hallucination guard | `.agent-kit/rules/anti-patterns.md` | its row in `.agent-kit/rules/INDEX.md` |
| a rule example for a domain | `.agent-kit/templates/rule-examples/<domain>.md` | `rule-examples/INDEX.md` |
| a file every installed repo starts with | `.agent-kit/templates/<name>.seed.md` | manifest `seeds`, `.agent-kit/templates/INDEX.md`, `SETUP.md` |
| a prompt an agent runs, not a file it authors | `.agent-kit/templates/<name>.md` | its row in `.agent-kit/templates/INDEX.md`, and the step that runs it |
| a command or a check | `.agent-kit/agent-kit.mjs` | header and usage, the kit table in `AGENTS.seed.md`, `SETUP.md` if setup runs it, a `selftest` scenario, `README.md` if the owner runs it |
| a directory the kit owns | the directory | `.agent-kit/sync-manifest.json` (`machinery` or `owned`), its `INDEX.md` |

A new gate is added, never softened: `selftest` must show it failing on the unfixed tree.

## Boundary protocol

**Always** — keep changes inside the files the task declares; run shell output through `rtk`
(`rtk bypass <cmd>` when the full text is evidence); run `selftest` and `doctor` before and
after; cite a rule's home instead of restating it.

**Ask first** — a new file category, a new command, a change to the manifest's
`machinery`/`seeds`/`owned` split, or anything that makes a gate softer.

**Never** — add a rule without a check that enforces it; duplicate a rule into a second
file; ship a seed whose example paths would be read as real.

## Core rules

1. **The kit is the only executable surface.** One script, zero dependencies, Bun or Node.
   Do not add a second entry point; add a subcommand.
2. **One home per fact.** Commands live in `project.md`. Rules live in one file. Indexes
   cite, they do not summarise.
3. **Seeds, not copies.** Anything a target repo must author lives in `.agent-kit/templates/`
   or is declared in the manifest's `seeds` map. Nothing else is duplicated.
4. **Every invariant has a check, and every check must be able to fail.** `selftest`
   proves it once; the CI workflow proves it on every push.

## Layout

```
AGENTS.md                     this file (the template's own entry point)
CLAUDE.md                     Claude Code's pointer to AGENTS.md
SETUP.md                      the install contract
.github/workflows/            INDEX + agent-kit.yml: the same gates on push
examples/                     INDEX -> minimal/: what a filled repo looks like (not installed)
.agent-kit/
  INDEX.md                    the map of .agent-kit; read before browsing
  agent-kit.mjs               the only executable: setup | check | pull | doctor | start | verify | harnesses | task | learnings | release | selftest
  SKILL.md                    the work loop: classify, open, gate, verify, close
  sync-manifest.json          machinery / seeds / owned / prune
  project.md                  generated per repo: stack + commands (single source)
  docs/                       INDEX: the knowledge seed a target repo authors from
  rules/                      INDEX (which file, when) + _behavior + one per domain
  tasks/                      INDEX (lanes, gates) + active/, archive/, .counter
  logs/                       INDEX (model + last five) -> MM-YYYY/: one file per change
  releases/                   vX.Y.Z.md: release notes rolled up from the change files
  githooks/                   INDEX + pre-commit (scope) + commit-msg (message): optional guard
  templates/                  INDEX -> the seeds and copyable rule examples
```
