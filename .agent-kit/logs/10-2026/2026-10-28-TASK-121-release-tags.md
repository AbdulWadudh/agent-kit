---
id: TASK-121
type: added
date: 2026-10-28
summary: "a release gets its tag automatically, and the tag message is the release note"
---

# TASK-121 — a release gets its tag automatically, and the tag message is the release note

**Task:** [TASK-121](../../tasks/archive/2026-10/2026-10-28-TASK-121-release-tags.md)
**Scope:** .agent-kit, SETUP.md

## What changed

`release --tag vX.Y.Z` now makes the annotated tag, using the release note as its
message, so `git show` and every release page carry the change list from one source. It refuses a
note that is not committed (the tag would lack the file), an existing tag (never moved), and a
missing note. `doctor` gains a `release tags` WARN so "cut but not tagged" is visible, and the two
owed tags are created: `v1.0.0` at the commit that added its note, `v1.0.1` at HEAD.
