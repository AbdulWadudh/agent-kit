---
id: TASK-29
type: changed
date: 2026-10-28
summary: "Split commits by feature, drop the file cap, and queue follow-ups"
---

# TASK-29 — Split commits by feature, drop the file cap, and queue follow-ups

**Task:** [TASK-29](../../tasks/archive/2026-10/2026-10-28-TASK-29-commit-queue-rules.md)
**Scope:** .agent-kit, README.md, SETUP.md, examples

## What changed

The kit now commits one change at a time: a feature, a fix, a doc update or a test, grouped by the feature or issue it serves, with several commits allowed under one task and every commit naming its task. QUICK no longer counts files; it is judged by reversibility, one domain and no contract change. A request that arrives while a task is open lands in the task's `## Queue` and is worked as a subtask; a new task is reserved for a separate delivery, and the owner chooses that. `doctor` validates the queue and `task close` refuses while a row is queued or in progress, so a request cannot be dropped by closing. The 140-character limit remains the front-matter title only; the close-out paragraph carries the detail.
