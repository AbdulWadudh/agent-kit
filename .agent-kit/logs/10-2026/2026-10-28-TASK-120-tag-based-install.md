---
id: TASK-120
type: changed
date: 2026-10-28
summary: "an install follows a release tag, so it never receives unreleased commits and can pick its version"
---

# TASK-120 — an install follows a release tag, so it never receives unreleased commits and can pick its version

**Task:** [TASK-120](../../tasks/archive/2026-10/2026-10-28-TASK-120-tag-based-install.md)
**Scope:** .agent-kit, README.md, SETUP.md

## What changed

An install now follows a release tag instead of a branch: `setup --ref v1.0.0`
clones that tag (omitting it takes the newest), `template.json` records `ref`, `release` and
`commit`, `check` gains a `release` row (`BEHIND v1.0.1 - pull --ref v1.0.1`, `UNPINNED` for an
install still on a branch), and `pull --ref` moves it. Unreleased commits are invisible to
`check`, which is the point: a version is a tag. The one existing install migrates on its next
pull. `release` now prints the tag command, because the tag is what makes a release installable.
