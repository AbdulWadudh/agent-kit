---
name: k79-release
description: verifies the suite, cuts the note, tags the version, publishes
license: MIT
metadata:
  source: "AbdulWadudh/agent-kit"
---

<!-- Generated from .agent-kit/skills/k79-release.md. Do not edit; edit the source skill and run `agent-kit skills build`. -->

Run this only in a repository with `.agent-kit/`. If it is absent, say the repository is not set up with agent-kit and stop.

# Release

Use `.agent-kit/rules/releases.md`. Read it only if it is not already in this session; do not re-read a loaded rule.

1. Confirm the version. Major when an installed repo must edit a path or command it wired; minor for a new command, check or rule; patch for fixes and docs.
2. Run `agent-kit verify --full`. A red suite stops the release; `--no-verify` is only for a deliberate cut the owner asked for.
3. Run `agent-kit release --entries` (add `--json` if a script needs it). It lists every unclaimed task with its id, type, commit, summary and note, and prints a template. It writes no note; code does not write prose.
4. **Author `.agent-kit/releases/<version>.md` yourself.** You are the writer, not a string builder:
   - `### Added`, `### Changed`, `### Fixed`, `### Removed`, in that order.
   - One entry per commit: bold title, task and commit links, then 2–5 short bullets.
   - If one commit spans categories, keep one entry and label its bullets `Added:`, `Changed:`, `Removed:`. Never repeat the commit under another heading.
   - No paragraph over three lines, no wall of text.
5. Commit the note, then tag it: `agent-kit release --tag vX.Y.Z`. The tag message is the note, so `git show` and the GitHub page carry the same text.
6. Push the tag. Create the GitHub release only when the owner asks: `gh release create vX.Y.Z --notes-file .agent-kit/releases/<version>.md`.
7. Never move a tag. A fix is a new patch tag, because an install pinned to the old tag must keep building what it installed.

If the release note has no tag, `doctor` warns; finish the tag before reporting the release as done.
