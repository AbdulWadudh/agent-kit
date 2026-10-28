---
id: TASK-128
type: changed
date: 2026-10-28
summary: "Issues open with a real title and body; release notes carry each card's paragraph"
---

# TASK-128 — Issues open with a real title and body; release notes carry each card's paragraph

**Task:** [TASK-128](../../tasks/archive/2026-10/2026-10-28-TASK-128-readable-issue-and-release.md)
**Scope:** .agent-kit, README.md, SETUP.md

## What changed

A task opened in `ids: issue` now carries the work into its issue: `--summary` is the title and the card's, `--intent` is the body, and publish and close keep the title in step with the summary. A release note quotes each card's `## What changed` paragraph under a bold title with the commit that shipped it, so the note reads as prose and points at the code instead of repeating a clause no reader can act on.
