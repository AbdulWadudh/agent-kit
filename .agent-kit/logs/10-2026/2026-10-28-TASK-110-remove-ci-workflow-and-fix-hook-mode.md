---
id: TASK-110
type: removed
date: 2026-10-28
summary: "the CI workflow is gone, and the commit guard is executable on every clone"
---

# TASK-110 — the CI workflow is gone, and the commit guard is executable on every clone

**Task:** [TASK-110](../../tasks/archive/2026-10/2026-10-28-TASK-110-remove-ci-workflow-and-fix-hook-mode.md)
**Scope:** .agent-kit, .github, AGENTS.md, SETUP.md

## What changed

The GitHub workflow is gone: `task close` already runs the same gates, so it cost a
runner per push and bought nothing. The commit guard was committed `100644`, which git silently
skips on Linux and macOS, so both hooks are now `100755` and `doctor`'s `hook mode` row reports a
clone that lost the bit.
