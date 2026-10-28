---
id: TASK-112
type: changed
date: 2026-10-28
summary: "the release procedure lives in its own rule file, one pointer in the loop"
---

# TASK-112 — the release procedure lives in its own rule file, one pointer in the loop

**Task:** [TASK-112](../../tasks/archive/2026-10/2026-10-28-TASK-112-release-procedure-own-file.md)
**Scope:** .agent-kit

## What changed

The release procedure moved to `.agent-kit/rules/releases.md`, the home `commits.md`
already set for a procedure that hangs off one step of the loop: the command, the note shape, the
version table and the publish step. `SKILL.md` §8 keeps one pointer, so a session that does not cut
a release pays 232 characters instead of 1,048. The other sections stay inline — they apply to every
session, and a loop made of pointers is a table of contents.
