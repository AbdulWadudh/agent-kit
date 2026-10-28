---
id: TASK-116
type: added
date: 2026-10-28
summary: "a kit review finds the rule that costs two sessions, then fixes or proposes it"
---

# TASK-116 — a kit review finds the rule that costs two sessions, then fixes or proposes it

**Task:** [TASK-116](../../tasks/archive/2026-10/2026-10-28-TASK-116-kit-review-prompt.md)
**Scope:** .agent-kit

## What changed

`prompts/kit-review.md` turns "this rule slows me down" into a check someone can
disagree with: two cited occurrences from the change files or archived tasks, the unit it cost,
and then a split by what the fix touches. A repo-owned file is fixed in the task and logged in the
report; machinery is fixed here when it is small, and proposed with a `BACKLOG.md` row when it is
not, because `pull --force` reverts a patched install. The loop gained one bullet so the job has a
trigger.
