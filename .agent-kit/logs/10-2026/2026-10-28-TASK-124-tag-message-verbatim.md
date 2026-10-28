---
id: TASK-124
type: fixed
date: 2026-10-28
summary: "a release tag keeps the note's headings, so the whole note reaches the reader"
---

# TASK-124 — a release tag keeps the note's headings, so the whole note reaches the reader

**Task:** [TASK-124](../../tasks/archive/2026-10/2026-10-28-TASK-124-tag-message-verbatim.md)
**Scope:** .agent-kit

## What changed

`release --tag` now writes the annotation verbatim, so `git show vX.Y.Z` prints
the release note as the file holds it — title and section headings included. The two tags made
before the fix were recreated locally; nothing had been pushed.
