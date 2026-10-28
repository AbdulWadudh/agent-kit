---
id: TASK-127
type: changed
date: 2026-10-28
summary: "A close writes two files, not four — the five newest closes are derived by `start`"
---

# TASK-127 — A close writes two files, not four — the five newest closes are derived by `start`

**Task:** [TASK-127](../../tasks/archive/2026-10/2026-10-28-TASK-127-derive-recent-closes.md)
**Scope:** .agent-kit, README.md, SETUP.md

## What changed

A close now writes the task, the card and the `ACTIVE` block only: the two `RECENT` index rewrites are gone, and `start` derives the five newest closes from the cards at read time. A pre-TASK-127 install retires its `RECENT` block on the first close, and doctor's `recent lists` row is replaced by the selftest assertion that proves both halves.
