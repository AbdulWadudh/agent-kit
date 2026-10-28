---
id: TASK-119
type: added
date: 2026-10-28
summary: "\"upgrade agent-kit\" has a procedure: check the source, show the diff, pull as one task"
---

# TASK-119 — "upgrade agent-kit" has a procedure: check the source, show the diff, pull as one task

**Task:** [TASK-119](../../tasks/archive/2026-10/2026-10-28-TASK-119-upgrade-procedure.md)
**Scope:** .agent-kit

## What changed

`.agent-kit/prompts/upgrade.md` is the job "upgrade agent-kit" now lands on:
`check` the recorded source (`IN SYNC` stops it), `pull --dry-run` and report the rows, open a task
with the write set so the close can pass its scope check, `pull` (never `--force` or `--seeds`
without the owner's yes), then `doctor --strict` and one logged commit. The routers that point at
`prompts/` were listing two of the four prompts; both now match the folder.
