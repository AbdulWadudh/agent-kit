---
id: TASK-129
type: added
date: 2026-10-28
summary: "Every task gets an issue — archived ones are backfilled, and a mint never lands on a taken id"
---

# TASK-129 — Every task gets an issue — archived ones are backfilled, and a mint never lands on a taken id

**Task:** [TASK-129](../../tasks/archive/2026-10/2026-10-28-TASK-129-migrate-archived-tasks-to-issues.md)
**Scope:** .agent-kit, README.md, SETUP.md

## What changed

A repo that ran on local ids keeps its history when it switches: `task migrate` opens one closed issue per archived task, titled with its id and carrying the paragraph its close already wrote, and reads the issue list so a rerun adds nothing. `task new` now refuses an issue number an archived task already carries, naming both instead of writing a second file under one id.
