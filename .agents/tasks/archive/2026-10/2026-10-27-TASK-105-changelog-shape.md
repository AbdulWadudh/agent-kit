---
id: TASK-105
parent: ""
lane: PLANNED
status: DONE
closed: 2026-10-27
created: 2026-10-27
baseline: a2b133ee9746e91ae171af9a518645f73d71d224
touches: ["scripts/agent-kit.mjs", ".agents/templates/task.md", ".agents/rules/_behavior.md", ".agents/templates/logs-INDEX.seed.md", ".agents/logs/INDEX.md", ".agents/templates/AGENTS.seed.md", "AGENTS.md", "README.md", "SKILL.md", "SETUP.md", ".agents/sync-manifest.json", ".agents/tasks/BACKLOG.md", ".agents/project.md", ".agents/templates/tasks-INDEX.seed.md"]
depends_on: []
type: changed
summary: a changelog entry carries the task summary, and each version gets a release file
---
# TASK-105 — changelog and release notes

## Scope (frozen once approved)

**Intent** — The owner opened TASK-104's change file and asked where the summary was; the card
must record what a closed task did and nothing the archived task already holds. The owner set
the final shape on 2026-10-27: date in the front matter only, no file list, a link to the task,
release files in the attached eidolon shape, and task files cut to decisions and pointers so a
later session does not pay for narrative.

**In scope**
- Change card: front matter, `# TASK-N — <summary>`, a `Task:` link to the archive, `Scope:`
  areas, `## What changed` (the close-out paragraph). No date line, no file list, no plan sections.
- `releases/vX.Y.Z.md` and `agent-kit release <version>`: unclaimed cards grouped under
  `Added` / `Changed` / `Fixed` / `Removed` as `- <summary> (TASK-N)`, a hidden list of claimed
  ids, a doctor row, and `releases` in the manifest's `owned`.
- A minimal task template: intent, in/out scope, decisions with pointers, plan, test plan; no
  guidance prose, no Assumptions/Learnings/Evidence blocks and no Files line.
- The recorded-runs block is `VERIFY` (was `EVIDENCE`); marker matching is whole-line, so prose
  naming a marker is never taken for the block.
- Selftest card, release, skeleton and prose-marker assertions. Docs: README, logs INDEX + seed,
  SKILL §3/§8, SETUP, AGENTS + seed, `_behavior.md` §3.
- Close TASK-105, commit and push. TASK-104's card keeps its old shape: its close predates this
  writer and a re-close would wipe its inventory or rename this task's files as its own.

**Out of scope**
- Tagging, pushing a tag or `gh release create`; one entry per subtask.
- Rewriting TASK-104's card or archived task bodies — history keeps its shape and markers.

**Decisions**
- The card is a completion record; the task keeps the plan and its proof. Copying the plan into
  the card duplicates the record — the owner's "or else we need to eleminate changelogs".
- Release files are repo data for git and people, not agent context: no INDEX, never read by a
  session, written only by `release`.
- Archived tasks keep the old marker; new tasks use `VERIFY`. Renaming history would rewrite proof.
- Assumptions live in Decisions with their pointer — an assumption is a choice taken without asking.
- A task file holds only what changes a later action; explanation that changes none is dropped.

## Plan

1. `scripts/agent-kit.mjs`: card writer, `release` command + doctor row, whole-line marker
   helpers, selftest card/release/skeleton scenarios.
2. Template and rules: slim `task.md`; minimality in `_behavior.md` §3 and SKILL §3.
3. Docs and manifest: README, logs INDEX + seed, SKILL §8, SETUP, AGENTS + seed, `owned`.
4. Close TASK-105, commit and push.

**Test plan**
- `node scripts/agent-kit.mjs selftest` → 0; the card, release and skeleton assertions fail on
  the unfixed tree; a marker named in prose is not mistaken for the block.
- `node scripts/agent-kit.mjs doctor --strict` → 0.
- `node scripts/agent-kit.mjs verify --full` → 0.

## Baseline (before the change)

<!-- BASELINE:START -->
| Action | Command | Scope | Expected | Observed | Exit |
|---|---|---|---|---|---|
| test | `node scripts/agent-kit.mjs selftest` | full | exit 0 | exit 0 | 0 |
| lint | `node scripts/agent-kit.mjs doctor` | full | exit 0 | exit 0 | 0 |
<!-- BASELINE:END -->

## Verification

<!-- VERIFY:START -->
| Action | Command | Scope | Expected | Observed | Exit |
|---|---|---|---|---|---|
| test | `node scripts/agent-kit.mjs selftest` | full | exit 0 | exit 0 | 0 |
| lint | `node scripts/agent-kit.mjs doctor` | full | exit 0 | exit 0 | 0 |
<!-- LOOP {"n":0,"fail":"","diff":"e40d6e02c9b43fa1","plan":"a5b5dd4cb5917dd7"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — The change file is now the completion record: the date stays in the front matter, a `Task:` link points at the archived plan, and `## What changed` carries the close-out paragraph — no copied plan and no file list. `release <version>` rolls the unclaimed cards into `releases/vX.Y.Z.md` in the owner's release-note shape. A new task file is a skeleton of intent, decisions and pointers, so a later session reads only what changes its next action.

**Docs updated** — README, SKILL (§3, §8), SETUP, AGENTS + `.agents/templates/AGENTS.seed.md`, logs INDEX + seed, `.agents/rules/_behavior.md` §3, `.agents/sync-manifest.json`.

**Follow-ups** — none

**Scope amended at close** — TASK-104's delivery and TASK-105 share one uncommitted tree (the owner asked for one commit and push); .agents/project.md and .agents/templates/tasks-INDEX.seed.md are TASK-104's files: `.agents/project.md`, `.agents/templates/tasks-INDEX.seed.md`

<!-- FILES:START -->
- `.agents/project.md`
- `.agents/rules/_behavior.md`
- `.agents/sync-manifest.json`
- `.agents/templates/AGENTS.seed.md`
- `.agents/templates/logs-INDEX.seed.md`
- `.agents/templates/task.md`
- `.agents/templates/tasks-INDEX.seed.md`
- `AGENTS.md`
- `README.md`
- `SETUP.md`
- `SKILL.md`
- `scripts/agent-kit.mjs`
<!-- FILES:END -->
