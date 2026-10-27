---
id: TASK-107
type: changed
date: 2026-10-27
summary: "commit conventions and skill sources leave the always-read rule file"
---

# TASK-107 — commit conventions and skill sources leave the always-read rule file

**Task:** [TASK-107](../../tasks/archive/2026-10/2026-10-27-TASK-107-rules-split.md)
**Scope:** none

## What changed

The commit conventions moved to `.agent-kit/rules/commits.md`, read before the first commit; `_behavior.md` §10 keeps "commit or push only when asked" and a pointer. §12 lists the skills with a one-line use each and no URLs, whose sources now live in `SETUP.md` §3. §2 scopes the character rule to text a session reads; a source file's ceiling counts lines, because its job is splitting one file. The always-read file drops 1,305 characters.
