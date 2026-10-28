---
id: TASK-118
type: added
date: 2026-10-28
summary: "the three kit-review limits are decided in the backlog, so a later session does not re-open them"
---

# TASK-118 — the three kit-review limits are decided in the backlog, so a later session does not re-open them

**Task:** [TASK-118](../../tasks/archive/2026-10/2026-10-28-TASK-118-park-the-three.md)
**Scope:** none

## What changed

three rows in `.agent-kit/tasks/BACKLOG.md` decide the kit-review limits: automatic
detection stays open with a concrete next step (a WARN row over the last ten archived cards where
`LOOP n >= 2`), runtime telemetry and self-modification are `not-important` with the reason that
closes them. Nothing is built; the next session reads a decision instead of re-deriving it.
