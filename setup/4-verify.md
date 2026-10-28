# 4. Verify

```bash
bun .agent-kit/agent-kit.mjs doctor --strict
```

Expected, before the fill: `FAIL — N failure(s)`, naming `unfilled markers` and any doc path
that does not exist.

Expected, after the fill: `PASS — 0 failure(s)`. Warnings are allowed and are listed; they
are not a reason to keep editing.

| Check | Fails when |
|---|---|
| required files | a kit file is missing (including `.agent-kit/SKILL.md`) |
| directory indexes | a directory under `.agent-kit/` has no `INDEX.md` |
| kit modules covered | a `.mjs` under `.agent-kit/` is not covered by the manifest, so an install would miss it |
| source ceiling | a kit `.mjs` is past 300 lines - split it by area, keeping related functions in one file |
| markdown ceiling | a reference `.md` is past 12,000 characters - split it into a folder with an `INDEX.md`, one file per section; task files, cards and release notes are exempt |
| skill pointers | a harness skill file is a copy of the loop instead of a pointer to `.agent-kit/SKILL.md` |
| context budget | one of the files a session reads before it plans is past its cap (`AGENTS.md` 9000, `SKILL.md` 10000, `_behavior.md` 7500, `rules/INDEX.md` 1800 characters) - move the detail behind an index, or run `.agent-kit/prompts/trim-agents-md.md` |
| prerequisites | a tool every repo needs is missing — runtime, git or `rtk`; in issue mode also the GitHub credential (§1.2). Presence only: the row never calls the network |
| task ids | `project.md` has no `| ids |` row (WARN), or its value is not `local` or `issue` (FAIL) |
| task ids unique | two active or archived task files share an id, an id disagrees with its filename, or two change cards name the same id |
| manifest integrity | an `owned` path is inside a `machinery` directory or is also a seed |
| encoding | a file is not UTF-8, has a BOM, or shows mojibake (`--fix` repairs the mechanical part) |
| unfilled markers | a `FILL` marker or uppercase placeholder survived (`--strict` only) |
| doc paths resolve | a path written in `.agent-kit/docs/`, `.agent-kit/` or the skill does not exist |
| markdown links resolve | an index link points at a missing file |
| declared commands | `project.md` names a package script that `package.json` does not have, or a `When` value is not `always` or `milestone` |
| active tasks indexed | a task file in `active/` is not in the task index |
| write-set collisions | two active tasks declare overlapping `touches` (a main task and its subtasks are one family and may overlap) |
| blocked tasks | a `BLOCKED` task carries no question, or a task carries the block marker without the status |
| subtasks | a subtask has no parent or its parent is not active, a main task is in progress with a subtask open, or a queued main task has every subtask done |
| task queue | a `## Queue` row has an unknown status, a reused `#`, an empty request, or names a subtask that is not this task's active subtask |
| backlog | a row in `.agent-kit/tasks/BACKLOG.md` has an unknown status, a reused ID, a missing cell, or an empty item, source or next step |
| rules are checkable | a rule file contains advice ("be careful", "try to", "consider") instead of a rule |
| rules indexed | a file in `.agent-kit/rules/` has no row in its `INDEX.md`, or a row names a missing file |
| archived tasks changelogged | a task is in `archive/` but has no file under `.agent-kit/logs/MM-YYYY/` |
| release notes | a file under `.agent-kit/releases/` does not start with `# Release vX.Y.Z` matching its filename; no folder is fine |
| release tags | WARN, not FAIL: a release note has no tag, so nothing can install that version (`agent-kit release --tag vX.Y.Z`) |
| commit guard | WARN, not FAIL: the optional `pre-commit` and `commit-msg` hooks are not wired in this clone |
| commit identity | a commit message carries AI attribution (FAIL); a commit author is not the configured identity (WARN) |

`harnesses` is not in this table: it reads the machine, so CI cannot reproduce it. Its output
is a report to the owner, not a gate.

`--json` prints the same rows as `{ ok, fails, warns, rows }` for a CI comment or a gate.
