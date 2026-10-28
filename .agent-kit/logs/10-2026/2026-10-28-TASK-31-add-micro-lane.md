---
id: TASK-31
type: added
date: 2026-10-28
summary: "Add a MICRO lane for one-file hotfixes"
---

# TASK-31 — Add a MICRO lane for one-file hotfixes

**Task:** [TASK-31](../../tasks/archive/2026-10/2026-10-28-TASK-31-add-micro-lane.md)
**Scope:** .agent-kit, setup

## What changed

Added a MICRO lane for one-file reversible hotfixes. A micro task opens with a local `PATCH-N` id in either id mode, records only the always-tier baseline, closes on typecheck, lint and the scope check, archives like a top-level task, and writes the normal change card under its `PATCH-N`. `release` claims PATCH cards exactly once, skips their issue lookup, and runs `verify --full` before writing, so build is proven once per version. The commit guard, doctor vocabulary and micro-close evidence row follow, and `agent-kit hotfix` runs the same three commands for the cheap path. No second ledger and no card-less path.
