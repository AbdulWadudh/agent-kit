---
id: TASK-126
type: changed
date: 2026-10-28
summary: "One allocator per repo — offline by default, the issue number on request"
---

# TASK-126 — One allocator per repo — offline by default, the issue number on request

**Task:** [TASK-126](../../tasks/archive/2026-10/2026-10-28-TASK-126-collaborative-task-ids.md)
**Scope:** .agent-kit, AGENTS.md, README.md, SETUP.md

## What changed

A repo now has one id source, recorded as a row in `project.md`. `setup --ids
local` keeps the kit offline: `task new` takes the next number on disk and `task renumber` moves
a collided id after a merge. `setup --ids issue` mints the GitHub issue at open and uses its
number as the task id, so `TASK-131` and `#131` are the same thing; `task publish` sends the
approved plan, `task close --sync` closes the issue with the final record, and `--from <n>`
imports one a teammate opened. Prerequisites — runtime, git, `rtk`, and the credential in issue
mode — are now a FAIL-level row that `setup` cannot pass over.
