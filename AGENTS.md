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
bun "$TMPDIR/agent-kit/.agent-kit/agent-kit.mjs" setup . --source https://github.com/AbdulWadudh/agent-kit --ids local|issue
bun .agent-kit/agent-kit.mjs doctor --strict
```

Ask the owner which id mode before that first line (`SETUP.md` §1.1): `local` stays offline,
`issue` takes each task id from its GitHub issue. `setup` refuses to finish while a
prerequisite is missing (runtime, git, `rtk`; in issue mode also the credential — `gh` first,
a token as fallback).

`SETUP.md` is the contract: what to detect, what to fill, and the exact output each step
must produce. Follow it in order; it is idempotent and never overwrites an authored file.

The only work that needs judgement is the fill: `AGENTS.md` rules and placeholders,
`.agent-kit/project.md` domain notes, and `.agent-kit/docs/` from the real tree. Everything else is
deterministic. `doctor --strict` exiting 0 is the definition of "set up".

## If you were asked to change the template

**Judge it from the install.** This repo is the installer; the product is what a target repo gets
after `setup`. A change earns its place when it removes a failure an installed repo would hit — a
stale pointer after `pull`, a gate that fires on work it should not, a step that needs a guess.
Tidying this template is not a reason, and neither is making this repo's own tree nicer. Before
the plan, name the target symptom, the step it breaks, and the check in the throwaway repo
`selftest` builds that proves the fix; no symptom and no check means a proposal to the owner, not
a patch.

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
| a prompt an agent runs, not a file it authors | `.agent-kit/prompts/<name>.md` | its row in `.agent-kit/prompts/INDEX.md`, and the step that runs it |
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

1. **The kit is the only executable surface.** One entry point — `agent-kit.mjs` — importing
   modules from `.agent-kit/lib/`; zero dependencies, Bun or Node. Do not add a second entry
   point; add a subcommand to the module that owns it.
2. **One home per fact.** Commands live in `project.md`. Rules live in one file. Indexes
   cite, they do not summarise.
3. **Seeds, not copies.** Anything a target repo must author lives in `.agent-kit/templates/`
   or is declared in the manifest's `seeds` map. Nothing else is duplicated.
4. **Every invariant has a check, and every check must be able to fail.** `selftest`
   proves it once; a row that cannot fail on the fixture that breaks it is not a check.

## Layout

```
AGENTS.md                     this file (the template's own entry point)
CLAUDE.md                     Claude Code's pointer to AGENTS.md
README.md                     landing page and setup prompt
docs/                         INDEX: the template's own guide (using, inside)
SETUP.md                      the install contract and step index
setup/                        INDEX: the install steps behind SETUP.md
examples/                     INDEX -> minimal/: what a filled repo looks like (not installed)
.agent-kit/
  INDEX.md                    the map of .agent-kit; read before browsing
  agent-kit.mjs               the only entry point: argv parsing and dispatch; usage sits at the top
  lib/                        INDEX: a module or folder per command area, imported by the entry;
                              past 300 lines the module becomes a folder with an index.mjs
  SKILL.md                    the work loop: classify, open, gate, verify, close
  sync-manifest.json          machinery / seeds / owned / prune
  project.md                  generated per repo: stack, commands and the task id mode (single source)
  docs/                       INDEX: the knowledge seed a target repo authors from
  rules/                      INDEX (which file, when) + _behavior + one per domain
  tasks/                      INDEX (lanes, gates) + active/, archive/
  logs/                       INDEX (model + last five) -> MM-YYYY/: one file per change
  releases/                   vX.Y.Z.md: release notes rolled up from the change files
  githooks/                   INDEX + pre-commit (scope) + commit-msg (message): optional guard
  prompts/                    INDEX -> the long jobs a session runs, one file each
  templates/                  INDEX -> the seeds and copyable rule examples
```
