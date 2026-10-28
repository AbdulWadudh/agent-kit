# notely — Agent Entry Point

You are working in notely, a small HTTP API for shared notes. Read this file once per
session, then follow it.

## Start here, in order

1. `.agent-kit/project.md` — stack, commands, entry points. Cite it; never restate it.
2. `.agent-kit/tasks/INDEX.md` — resume the active task, or open a new one.
3. `.agent-kit/rules/INDEX.md` — load only the rule files matching what you will touch.
4. `.agent-kit/docs/INDEX.md` — find where the logic lives before searching the tree.

## Boundary protocol

**Always**
- Read before writing. Keep every edit inside the task's declared `touches`.
- Run `agent-kit verify` before and after edits. Evidence goes in the task file; memory does not count.
- Take the smallest complete change: reuse what exists, delete before adding, no speculative abstraction.

**Ask first**
- New dependency, schema or migration, public interface change.
- Deleting files, rewriting generated output, or anything irreversible.

**Never**
- Invent a path, a command or an export. If it is not in `project.md` or in the tree, it does not exist.
- Edit a generated directory (listed in `project.md`).
- Close a task with edits it does not record.

## Core rules

1. **Every note belongs to exactly one owner.** A query that returns notes must filter by
   `ownerId` or by an explicit share row. There is no "admin sees all" path.
2. **Deletes are soft.** `notes.deletedAt` is set; nothing issues `DELETE`. A hard delete
   needs the owner to ask for it in the conversation.
3. **The API surface is frozen.** Adding or changing a route or a response field is a
   contract change: PLANNED lane, approved before the first edit.
4. **Timestamps come from the database.** Never `new Date()` in a handler; the column
   default is the only clock.

5. **Context discipline.** Search narrowly. Read at most three source files at a time.
6. **One home per fact.** A rule lives in exactly one file; everywhere else cites it.
7. **Planning.** Anything beyond the QUICK lane (reversible, one domain, no contract
   change) needs a task file in `.agent-kit/tasks/active/`, with the plan approved before the first edit.
8. **Subagents.** Every subagent prompt names the files to read and the deliverable. It never
   restates the plan.
9. **Shell output.** Prefix commands with `rtk` (`rtk git status`, `rtk npm test`); `rtk bypass
   <cmd>` when the full output is the evidence. Name the active task ID with any savings you
   report — the detail is in `.agent-kit/SKILL.md` §Shell output.

## Done means

`agent-kit verify` exits 0, the task's evidence table holds real exit codes,
`.agent-kit/tasks/INDEX.md` is current, and `agent-kit doctor` reports no failures. Then
`agent-kit task close`.

---

<!-- MACHINERY: everything below is the kit. Keep it as written. -->
## Kit

`bun .agent-kit/agent-kit.mjs <command>` (fallback: `node .agent-kit/agent-kit.mjs <command>`)

| Command | Use |
|---|---|
| `doctor` | truth checks over docs, declarations and tasks; `--strict` also fails on unfilled markers; `--fix` repairs encoding only |
| `harnesses` | list the coding agents installed on this machine (HOME, PATH, repo) — the repo may show none; a report, not a gate |
| `task new <slug> --lane quick\|planned` | open a task and record the baseline run |
| `task show` | print the active task's scope, plan and evidence |
| `task close` | run the suite, scope-check against git, record the inventory, archive, write the change file |
| `verify` | mid-flight check; writes the evidence table and prints the delta |
| `check` / `pull --dry-run` / `pull` | drift against the template; `pull` never overwrites a locally modified file without `--force` |
