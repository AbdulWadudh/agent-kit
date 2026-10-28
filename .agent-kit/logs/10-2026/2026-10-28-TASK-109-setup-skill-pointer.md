---
id: TASK-109
type: added
date: 2026-10-28
summary: "setup writes the harness skill pointer for a harness whose folder the repo already keeps"
---

# TASK-109 — setup writes the harness skill pointer for a harness whose folder the repo already keeps

**Task:** [TASK-109](../../tasks/archive/2026-10/2026-10-28-TASK-109-setup-skill-pointer.md)
**Scope:** .agent-kit, README.md, SETUP.md

## What changed

`setup` now writes the harness skill pointer itself where the repo already keeps
that harness's folder, instead of only printing the path. The pointer is generated from
`.agent-kit/SKILL.md`'s frontmatter and one line naming the loop, so the skill is discoverable
without a manual step and the loop still has exactly one home.
