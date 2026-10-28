---
id: TASK-123
type: fixed
date: 2026-10-28
summary: "release --tag reads its version from the flag, so the documented command runs"
---

# TASK-123 — release --tag reads its version from the flag, so the documented command runs

**Task:** [TASK-123](../../tasks/archive/2026-10/2026-10-28-TASK-123-release-tag-cli.md)
**Scope:** .agent-kit

## What changed

`release --tag vX.Y.Z` now reads the version from the flag, so the line a release
prints is the line that works. Scenario 34 calls the CLI, not `git tag`, which is why the defect
would have shipped otherwise.
