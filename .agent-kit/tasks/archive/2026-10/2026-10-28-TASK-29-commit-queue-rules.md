---
id: TASK-29
parent: ""
lane: PLANNED
status: DONE
closed: 2026-10-28
created: 2026-10-28
baseline: 02ee4137654331460f11f106154e5d15bcd3f135
touches: [".agent-kit/", "README.md", "SETUP.md", "examples/minimal/AGENTS.md"]
depends_on: []
type: changed  # added | changed | fixed | removed
summary: "Split commits by feature, drop the file cap, and queue follow-ups"
---
# TASK-29 — Split commits by feature, drop the file cap, and queue follow-ups

## Scope (frozen once approved)

**Intent** — The owner asked that one commit stop being one task and one kind of change, that the three-file cap on a single task go, and that a request arriving while a task is open be queued on that task and worked as a subtask instead of opening a new task. A separate delivery is the only case that may be a new task, and the owner chooses it. The same task also answers why the front-matter summary is capped at 140 characters, and adds a doctor check and a close gate so a queued request cannot be dropped.

**In scope**
- Rewrite the commit rule: one commit per feature, fix, doc update or test; several commits per task; the body describes that commit.
- Remove the three-file cap from the QUICK lane; reversibility, one domain and no contract change decide it.
- Add `## Queue` to the task skeleton, its four statuses, and the routing rule that a later request becomes a subtask.
- Add `queueRows`, the `task queue` doctor row, and the close gate that refuses a `queued` or `in progress` row.
- Add selftest scenario 40 and keep the self-copy fixture offline.
- Align the seeds, `SKILL.md`, the task index, `README.md` and `SETUP.md`.

**Out of scope**
- The 28 archived tasks: history is not rewritten.
- `prompts/kit-review.md`'s three-file heuristic: it prices a machinery self-upgrade, not a task's scope.
- A global cross-task queue; `BACKLOG.md` stays the parked-work list.
- Raising `ENTRY_LIMIT`; 140 stays the title cap.

**Decisions** — only choices a later session would otherwise re-open, each with the pointer it
rests on (`path:line`, a command's result, or the owner's words). No explanation.
- The queue lives in the task file (`.agent-kit/templates/task.md`), not in `BACKLOG.md`: the task file is the state a session trusts, and the backlog is parked work with no lane or write set.
- `task close` refuses while a row is `queued` or `in progress`, so a request cannot be dropped by closing and opening a new task.
- `ENTRY_LIMIT` at `.agent-kit/lib/consts.mjs:27` governs the front-matter title only; the close-out paragraph is uncapped and becomes the card's `## What changed` and the closing commit body.
- The open baseline was red because the self-copy scenario copied the new active task and then refused the id switch; the fixture now empties `active/` in the copy, and the suite re-ran green.

## Queue — requests that arrive while this task is open

Append each request here instead of opening a new task. A row is `queued`, becomes `in progress`
with its `TASK-N.M` id when work starts, and ends `done` or `dropped`.

| # | Request | Status | Subtask |
|---|---|---|---|

## Plan

1. Rewrite `.agent-kit/rules/commits.md` and the guard's body message.
2. Remove the three-file cap from `SKILL.md` and every lane table and seed.
3. Add `## Queue` to the task template and the routing rules.
4. Add `queueRows`, the `task queue` doctor row and the close gate.
5. Add selftest scenario 40 and make the self-copy fixture offline and task-independent.
6. Align `README.md`, `SETUP.md`, the seeds and the example.
7. Close, split the commits by feature, cut v1.5.0 and tag it.

**Test plan** — command → expected; a new check also shows its failing run.
- `node .agent-kit/agent-kit.mjs selftest` → exit 0, including scenario 40's bad queue rows and the close refusal.
- `node .agent-kit/agent-kit.mjs doctor` → 0 failures, `task queue` PASS.

## Baseline (before the change)

<!-- BASELINE:START -->
| Action | Command | Scope | Expected | Observed | Exit |
|---|---|---|---|---|---|
| test | `node .agent-kit/agent-kit.mjs selftest` | full | exit 0 | exit 1 | 1 |
| lint | `node .agent-kit/agent-kit.mjs doctor` | full | exit 0 | exit 0 | 0 |
<!-- BASELINE:END -->

## Verification

<!-- VERIFY:START -->
| Action | Command | Scope | Expected | Observed | Exit |
|---|---|---|---|---|---|
| test | `node .agent-kit/agent-kit.mjs selftest` | full | exit 0 | exit 0 | 0 |
| lint | `node .agent-kit/agent-kit.mjs doctor` | full | exit 0 | exit 0 | 0 |
<!-- LOOP {"n":0,"fail":"","diff":"0403a8f501a942b1","plan":"12289cd469fd3956"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — The kit now commits one change at a time: a feature, a fix, a doc update or a test, grouped by the feature or issue it serves, with several commits allowed under one task and every commit naming its task. QUICK no longer counts files; it is judged by reversibility, one domain and no contract change. A request that arrives while a task is open lands in the task's `## Queue` and is worked as a subtask; a new task is reserved for a separate delivery, and the owner chooses that. `doctor` validates the queue and `task close` refuses while a row is queued or in progress, so a request cannot be dropped by closing. The 140-character limit remains the front-matter title only; the close-out paragraph carries the detail.

**Docs updated** — `.agent-kit/SKILL.md`, `.agent-kit/rules/commits.md`, `.agent-kit/tasks/INDEX.md`, `.agent-kit/templates/`, `README.md`, `SETUP.md`, `examples/minimal/AGENTS.md`.

**Follow-ups** — none

<!-- FILES:START -->
- `.agent-kit/SKILL.md`
- `.agent-kit/lib/doctor/tasks.mjs`
- `.agent-kit/lib/guard.mjs`
- `.agent-kit/lib/selftest/INDEX.md`
- `.agent-kit/lib/selftest/index.mjs`
- `.agent-kit/lib/selftest/install.mjs`
- `.agent-kit/lib/selftest/state.mjs`
- `.agent-kit/lib/selftest/tasks.mjs`
- `.agent-kit/lib/taskfile.mjs`
- `.agent-kit/lib/tasks/close.mjs`
- `.agent-kit/lib/tasks/open.mjs`
- `.agent-kit/rules/commits.md`
- `.agent-kit/templates/AGENTS.seed.md`
- `.agent-kit/templates/task.md`
- `.agent-kit/templates/tasks-INDEX.seed.md`
- `README.md`
- `SETUP.md`
- `examples/minimal/AGENTS.md`
<!-- FILES:END -->
