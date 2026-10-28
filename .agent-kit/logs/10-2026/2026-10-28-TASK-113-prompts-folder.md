---
id: TASK-113
type: added
date: 2026-10-28
summary: "prompts have their own folder, and AGENTS.md has a trim pass"
---

# TASK-113 — prompts have their own folder, and AGENTS.md has a trim pass

**Task:** [TASK-113](../../tasks/archive/2026-10/2026-10-28-TASK-113-prompts-folder.md)
**Scope:** .agent-kit, AGENTS.md, README.md, SETUP.md

## What changed

`.agent-kit/prompts/` now holds the long jobs a session runs instead of improvising:
`docs-populate.md`, moved out of `templates/` so prompts have one home, and the new
`trim-agents-md.md`, which inventories a filled `AGENTS.md` line by line, moves each fact to the
file that owns it, rewrites the rest against the seed, and proves the result with `doctor --strict`
plus a character count. The folder ships with the machinery, and both indexes name it.
