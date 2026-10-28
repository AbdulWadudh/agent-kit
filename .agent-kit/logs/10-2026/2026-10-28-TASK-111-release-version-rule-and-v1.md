---
id: TASK-111
type: added
date: 2026-10-28
summary: "the release rule says who picks the number, and v1.0.0 is cut"
---

# TASK-111 — the release rule says who picks the number, and v1.0.0 is cut

**Task:** [TASK-111](../../tasks/archive/2026-10/2026-10-28-TASK-111-release-version-rule-and-v1.md)
**Scope:** .agent-kit

## What changed

The kit could cut a release but never said who picks the number, so the rule now sits
beside the command in `SKILL.md` §8: `v1.0.0` first, major when an installed repo must edit a path,
minor for a new command or rule, patch for fixes. `cmdRelease` no longer writes a blank line between
bullets. `v1.0.0` claims the nine change files in the log.
