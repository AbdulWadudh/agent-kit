---
id: TASK-104
type: changed
date: 2026-10-27
summary: "subtasks close quick with lint; the main task runs build at close"
---

# TASK-104 — subtasks close quick with lint; the main task runs build at close

**Date:** 2026-10-27
**Scope:** .agent-kit, README.md, SETUP.md, .agent-kit/SKILL.md, scripts

## What changed

A subtask now closes on the quick suite, lint included, and the main task's close is where build runs. The tier lives in `.agent-kit/project.md`, so `verify` stays quick mid-flight while the baseline, `verify --full` and the main close run the slow one.

- `.agent-kit/project.md`
- `.agent-kit/templates/AGENTS.seed.md`
- `.agent-kit/templates/task.md`
- `.agent-kit/templates/tasks-INDEX.seed.md`
- `README.md`
- `SETUP.md`
- `.agent-kit/SKILL.md`
- `.agent-kit/agent-kit.mjs`
