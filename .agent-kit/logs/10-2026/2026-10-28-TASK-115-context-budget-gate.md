---
id: TASK-115
type: added
date: 2026-10-28
summary: "the files a session reads before it plans now have a cap, and doctor fails past it"
---

# TASK-115 — the files a session reads before it plans now have a cap, and doctor fails past it

**Task:** [TASK-115](../../tasks/archive/2026-10/2026-10-28-TASK-115-context-budget-gate.md)
**Scope:** .agent-kit, SETUP.md

## What changed

`doctor` now has a `context budget` row: the four files a session reads before it
plans (`AGENTS.md`, `SKILL.md`, `rules/INDEX.md`, `_behavior.md`) each have a character cap, and a
file past its cap fails with the number and the prompt that fixes it. `_behavior.md` §2 states the
rule the row enforces, so extension adds a file behind an index instead of a paragraph in front of
one. The row is proven in `selftest` both ways.
