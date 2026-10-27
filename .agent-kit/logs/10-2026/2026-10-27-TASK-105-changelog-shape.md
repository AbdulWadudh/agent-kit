---
id: TASK-105
type: changed
date: 2026-10-27
summary: "a changelog entry carries the task summary, and each version gets a release file"
---

# TASK-105 — a changelog entry carries the task summary, and each version gets a release file

**Task:** [TASK-105](../../tasks/archive/2026-10/2026-10-27-TASK-105-changelog-shape.md)
**Scope:** .agent-kit, AGENTS.md, README.md, SETUP.md, .agent-kit/SKILL.md, scripts

## What changed

The change file is now the completion record: the date stays in the front matter, a `Task:` link points at the archived plan, and `## What changed` carries the close-out paragraph — no copied plan and no file list. `release <version>` rolls the unclaimed cards into `.agent-kit/releases/<version>.md` in the owner's release-note shape. A new task file is a skeleton of intent, decisions and pointers, so a later session reads only what changes its next action.
