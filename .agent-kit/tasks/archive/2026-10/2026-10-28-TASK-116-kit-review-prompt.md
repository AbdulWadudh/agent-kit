---
id: TASK-116
parent: ""
lane: QUICK
status: DONE
closed: 2026-10-28
created: 2026-10-28
baseline: 3c191eaeef22291f5bf663453ed9d90db9246275
touches: [".agent-kit/prompts/", ".agent-kit/SKILL.md"]
depends_on: []
type: added  # added | changed | fixed | removed
summary: a kit review finds the rule that costs two sessions, then fixes or proposes it
---
# TASK-116 — kit review prompt

## Scope (frozen once approved)

**Intent** — The owner: "suppose some rules it starts with is now becoming the bottleneck does it
identify why... and suggest user this is want making me slow... if the upgradation is small but
improves the process should upgrade itself and log and inform the user... if changes are major...
suggest as a upgrade let the user decide... these are not related to the codebase tasks these are
internal tasks".

**In scope**
- `.agent-kit/prompts/kit-review.md`: the evidence sources the kit already records, the
  bottleneck test, and the fix-or-propose split by what the change touches.
- One bullet in `SKILL.md`'s "When the loop bends" so the job has a trigger.

**Out of scope**
- Any automatic detection. Nothing measures rule cost at runtime; the review reads the change
  files and archived tasks that already exist.
- A new `BACKLOG.md` status. The vocabulary is fixed and `doctor` fails an unknown one; an
  existing status carries a process row.

**Decisions** — only choices a later session would otherwise re-open, each with the pointer it
rests on (`path:line`, a command's result, or the owner's words). No explanation.
- Machinery in an installed repo is proposed, never patched: `pull --force` reverts it and `check`
  reports the drift, so a self-upgrade there would be undone by the next pull
  (`kit-review.md`, "Then decide").
- Auto-apply is allowed only for repo-owned files, and only in the template repo for machinery
  that is small (three files, no new command, no gate softened); a softer gate is never small.
- Evidence is two citations, not one: one occurrence is an anecdote
  (`kit-review.md`, "What counts as evidence").
- The trigger lives in the loop because that is where a session notices friction; the procedure
  lives in `prompts/` because it is a job, and the rule is not restated.
- `SKILL.md` is 9,867 of its 10,000 cap after this bullet: the next one has to extract a section.

## Plan

1. Write `prompts/kit-review.md` with evidence, test, split, logging and the "do not" list.
2. Add its row to `prompts/INDEX.md` and the bend bullet to `SKILL.md`.

**Test plan** — command → expected; a new check also shows its failing run.
- `node .agent-kit/agent-kit.mjs doctor --strict` → exit 0, `context budget` included; adding
  400 characters to `SKILL.md` fails that row (scenario 32 proves the row can fail).

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
<!-- LOOP {"n":0,"fail":"","diff":"30d76a8d1e7f278d","plan":"1f2b09e141f92880"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — `prompts/kit-review.md` turns "this rule slows me down" into a check someone can
disagree with: two cited occurrences from the change files or archived tasks, the unit it cost,
and then a split by what the fix touches. A repo-owned file is fixed in the task and logged in the
report; machinery is fixed here when it is small, and proposed with a `BACKLOG.md` row when it is
not, because `pull --force` reverts a patched install. The loop gained one bullet so the job has a
trigger.

**Docs updated** — `.agent-kit/prompts/kit-review.md`, `.agent-kit/prompts/INDEX.md`,
`.agent-kit/SKILL.md`.

**Follow-ups** — none

<!-- FILES:START -->
- `.agent-kit/SKILL.md`
- `.agent-kit/prompts/INDEX.md`
- `.agent-kit/prompts/kit-review.md`
<!-- FILES:END -->
