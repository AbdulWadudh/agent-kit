---
id: TASK-31
parent: ""
lane: PLANNED
status: DONE
closed: 2026-10-28
created: 2026-10-28
baseline: 4c24c85ec68010912f3911164c1c7f0b7bf58952
touches: [".agent-kit/", "setup/5-baseline.md"]
depends_on: []
type: added  # added | changed | fixed | removed
summary: "Add a MICRO lane for one-file hotfixes"
---
# TASK-31 — Add a MICRO lane for one-file hotfixes

## Scope (frozen once approved)

**Intent** — Add a MICRO lane for one-file reversible hotfixes: local PATCH-N ids in either id mode, an always-tier baseline and close, a normal change card, no milestone build rows, and build proof once at release. Release claims PATCH cards once; hooks, doctor, docs and selftests follow. No second ledger and no card-less path.

**In scope**
- `task new --lane micro`: a local `PATCH-N` id, the normal task file, an always-tier baseline.
- `task close` on micro: always-tier commands, scope check, archive, one `PATCH-N` card.
- `release`: claim PATCH ids once, skip their issue lookup, prove `verify --full` before writing.
- The commit-message guard, doctor vocabulary and the micro-close evidence row.
- Docs, seeds, rules and the optional `hotfix` shortcut.

**Out of scope**
- A second ledger, a card-less commit path, or a change to quick/planned ceremony.
- Contracts, dependencies, schema, env, signing material, or releases/ from a micro task.

**Decisions** — only choices a later session would otherwise re-open, each with the pointer it
rests on (`path:line`, a command's result, or the owner's words). No explanation.
- PATCH ids are local in both id modes: `nextPatchId` reads `usedIds`; `task new` returns before the mint (`lib/tasks/open.mjs`).
- Micro reuses close's card writer and type mapping, so there is one record and one ledger (`lib/tasks/close.mjs`, `lib/changelog.mjs`).
- Build proves once per version: `release` runs `verify --full`; micro close passes `full: false` (`lib/release.mjs`, `lib/verify/index.mjs`).
- `hotfix` is the same three calls, not a fourth code path (`lib/tasks/hotfix.mjs`).

## Queue — requests that arrive while this task is open

Append each request here instead of opening a new task. A row is `queued`, becomes `in progress`
with its `TASK-N.M` id when work starts, and ends `done` or `dropped`.

| # | Request | Status | Subtask |
|---|---|---|---|

## Plan

1. Add the lane vocabulary and the local `PATCH-N` allocator, then branch `task new` before the mint.
2. Close micro on the always-tier rows and the existing card writer; archive like a top-level task.
3. Make `release` claim PATCH cards, skip their issue lookup, and run `verify --full` first.
4. Extend the guard and doctor, and add the closed-micro evidence row.
5. Update the workflow docs, seeds, rules and the generated tier wording.
6. Prove it in one selftest scenario, then cut `v1.7.0`.

**Test plan** — command → expected; a new check also shows its failing run.
- `selftest` → exit 0; scenario 41 covers both id modes, no build, no GitHub, the red release, the claim-once card, the scope breach, the guard, and `hotfix`.
- `doctor` → exit 0; `task lanes`, `task ids unique` and `micro closes` show PASS on the fixture and FAIL when the evidence/lane is tampered with.

## Baseline (before the change)

<!-- BASELINE:START -->
| Action | Command | Scope | Expected | Observed | Exit |
|---|---|---|---|---|---|
| test | `node .agent-kit/agent-kit.mjs selftest` | full | exit 0 | exit 0 | 0 |
| lint | `node .agent-kit/agent-kit.mjs doctor` | full | exit 0 | exit 0 | 0 |
<!-- BASELINE:END -->

## Verification

<!-- VERIFY:START -->
| Action | Command | Scope | Expected | Observed | Exit |
|---|---|---|---|---|---|
| test | `node .agent-kit/agent-kit.mjs selftest` | full | exit 0 | exit 0 | 0 |
| lint | `node .agent-kit/agent-kit.mjs doctor` | full | exit 0 | exit 0 | 0 |
<!-- LOOP {"n":0,"fail":"","diff":"52fa6b25c2424521","plan":"bbe09f39b4bc4cec"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — Added a MICRO lane for one-file reversible hotfixes. A micro task opens with a local `PATCH-N` id in either id mode, records only the always-tier baseline, closes on typecheck, lint and the scope check, archives like a top-level task, and writes the normal change card under its `PATCH-N`. `release` claims PATCH cards exactly once, skips their issue lookup, and runs `verify --full` before writing, so build is proven once per version. The commit guard, doctor vocabulary and micro-close evidence row follow, and `agent-kit hotfix` runs the same three commands for the cheap path. No second ledger and no card-less path.

**Docs updated** — `.agent-kit/SKILL.md`, `tasks/INDEX.md`, `logs/INDEX.md`, `rules/commits.md`, `rules/releases.md`, the three seeds, the module indexes, the generated tier wording in `project.md`, and `setup/5-baseline.md`.

**Follow-ups** — none. `sync-manifest.json` needed no entry: `.agent-kit/lib` is already a machinery directory, so both new modules travel.

<!-- FILES:START -->
- `.agent-kit/agent-kit.mjs`
- `.agent-kit/lib/doctor/history.mjs`
- `.agent-kit/lib/doctor/tasks.mjs`
- `.agent-kit/lib/guard.mjs`
- `.agent-kit/lib/main.mjs`
- `.agent-kit/lib/project.mjs`
- `.agent-kit/lib/release.mjs`
- `.agent-kit/lib/selftest/INDEX.md`
- `.agent-kit/lib/selftest/index.mjs`
- `.agent-kit/lib/selftest/micro.mjs`
- `.agent-kit/lib/setup.mjs`
- `.agent-kit/lib/taskfile.mjs`
- `.agent-kit/lib/tasks/close.mjs`
- `.agent-kit/lib/tasks/hotfix.mjs`
- `.agent-kit/lib/tasks/index.mjs`
- `.agent-kit/lib/tasks/open.mjs`
- `.agent-kit/lib/tasks/show.mjs`
- `.agent-kit/lib/tasks/start.mjs`
- `.agent-kit/SKILL.md`
- `.agent-kit/githooks/INDEX.md`
- `.agent-kit/lib/INDEX.md`
- `.agent-kit/lib/tasks/INDEX.md`
- `.agent-kit/project.md`
- `.agent-kit/rules/commits.md`
- `.agent-kit/rules/releases.md`
- `.agent-kit/templates/AGENTS.seed.md`
- `.agent-kit/templates/logs-INDEX.seed.md`
- `.agent-kit/templates/tasks-INDEX.seed.md`
- `setup/5-baseline.md`
<!-- FILES:END -->
