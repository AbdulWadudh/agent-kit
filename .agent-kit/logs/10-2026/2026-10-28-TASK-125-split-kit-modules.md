---
id: TASK-125
type: changed
date: 2026-10-28
summary: "the entry point is one dispatch file over lib/ modules and folders, and a 300-line ceiling keeps it that way"
---

# TASK-125 — the entry point is one dispatch file over lib/ modules and folders, and a 300-line ceiling keeps it that way

**Task:** [TASK-125](../../tasks/archive/2026-10/2026-10-28-TASK-125-split-kit-modules.md)
**Scope:** .agent-kit, AGENTS.md, README.md, SETUP.md

## What changed

the kit's 5,068-line entry point became one dispatch file plus `lib/` — a module or folder per command area, with the four oversized modules (selftest, doctor, tasks, verify) split into category folders behind an `index.mjs`. A `source ceiling` row now fails any kit `.mjs` past 300 lines, so the tree cannot grow back, and a selftest case proves the row fails before it passes.
