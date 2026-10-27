---
id: TASK-108
type: changed
date: 2026-10-27
summary: "every installed path lives under .agent-kit, except the three a harness pins to a fixed location"
---

# TASK-108 — every installed path lives under .agent-kit, except the three a harness pins to a fixed location

**Task:** [TASK-108](../../tasks/archive/2026-10/2026-10-27-TASK-108-move-kit-under-dot-agent-kit.md)
**Scope:** .agent-kit, .agents, .github, .gitignore, AGENTS.md, CLAUDE.md, README.md, SETUP.md, examples, scripts

## What changed

The kit's install surface is now one folder. Everything it installs lives under
`.agent-kit/`; the only paths outside are the three a harness resolves at a fixed location
(`AGENTS.md`, `CLAUDE.md`, `.github/workflows/agent-kit.yml`). `doctor` now refuses a manifest
entry outside `.agent-kit/`, so the folder cannot drift back out. The write-set collision row now
skips a blocked card, because a parked task cannot be edited; `selftest` proves two workable
cards still fail.
