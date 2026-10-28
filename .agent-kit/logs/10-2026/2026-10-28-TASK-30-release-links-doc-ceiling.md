---
id: TASK-30
type: changed
date: 2026-10-28
summary: "Link release task ids and split large docs at 12,000 characters"
---

# TASK-30 — Link release task ids and split large docs at 12,000 characters

**Task:** [TASK-30](../../tasks/archive/2026-10/2026-10-28-TASK-30-release-links-doc-ceiling.md)
**Scope:** .agent-kit, AGENTS.md, README.md, SETUP.md, docs, setup

## What changed

The release note now links each task id to its archived task file and, in issue mode, to its issue, so a reader reaches the plan and the board from the note. Reference Markdown has a 12,000-character ceiling, enforced by the `markdown ceiling` doctor row and its selftest: past it, a doc becomes a folder with an `INDEX.md` and one file per section. `README.md` and `SETUP.md` were split behind `docs/` and `setup/` accordingly, with their prose unchanged; task files, change cards and release notes stay exempt because they are records.
