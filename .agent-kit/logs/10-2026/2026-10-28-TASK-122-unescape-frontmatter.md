---
id: TASK-122
type: fixed
date: 2026-10-28
summary: "a quoted task summary no longer leaks YAML escapes into the release note"
---

# TASK-122 — a quoted task summary no longer leaks YAML escapes into the release note

**Task:** [TASK-122](../../tasks/archive/2026-10/2026-10-28-TASK-122-unescape-frontmatter.md)
**Scope:** .agent-kit

## What changed

`frontMatter` now unescapes a double-quoted scalar, so a task summary that contains
quotes reaches the release note as written. Scenario 34 asserts it, next to the note it protects.
