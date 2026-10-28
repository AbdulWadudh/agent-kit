---
id: TASK-114
type: changed
date: 2026-10-28
summary: "the trim moves each fact to its home and wires the pointer that reaches it"
---

# TASK-114 — the trim moves each fact to its home and wires the pointer that reaches it

**Task:** [TASK-114](../../tasks/archive/2026-10/2026-10-28-TASK-114-trim-prompt-wires-homes.md)
**Scope:** .agent-kit

## What changed

The trim prompt now decides a destination for every line and the way it is reached:
a rule file gets a router row and a pointer, a docs page gets an index row, a stack fact appends to
`project.md`. A home that does not exist is created from `rule-examples/` rather than skipped, and
the test is removal — delete the pointer, and a fresh session must still reach the fact. Step 5
kept only the seed shape so the pointer rule has one home.
