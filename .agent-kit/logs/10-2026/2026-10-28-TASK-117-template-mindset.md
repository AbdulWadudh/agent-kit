---
id: TASK-117
type: changed
date: 2026-10-28
summary: "a template change is judged by the install it reaches, not by this repo's tidiness"
---

# TASK-117 — a template change is judged by the install it reaches, not by this repo's tidiness

**Task:** [TASK-117](../../tasks/archive/2026-10/2026-10-28-TASK-117-template-mindset.md)
**Scope:** AGENTS.md

## What changed

`AGENTS.md` now opens the template-change section with the test a change has to
pass: this repo is the installer and the product is what a target repo gets, so a change needs a
symptom an installed repo would hit and the check in the throwaway repo `selftest` builds; tidying
the template is not a reason, and a change with neither a symptom nor a check is a proposal, not a
patch.
