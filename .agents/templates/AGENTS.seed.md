<!--
AGENTS SEED — copied to <repo>/AGENTS.md by agent-kit setup, then authored by you.
This file is never overwritten by `pull`. Uppercase PLACEHOLDER markers and
FILL comment markers are the work that `doctor --strict` refuses to call done.
-->

# <PROJECT NAME> — Agent Entry Point

You are working in <PROJECT NAME>. Read this file once per session, then follow it.

<!-- FILL:project-summary — one sentence: what this product does, and for whom. -->

## Start here, in order

1. `.agents/project.md` — stack, commands, entry points, generated directories. Cite it; never restate it.
2. `.agents/tasks/INDEX.md` — resume the active task, or open a new one.
3. `.agents/rules/INDEX.md` — load only the rule files matching what you will touch.
4. `docs/INDEX.md` — find where the logic lives before searching the tree.

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
- Hand the user a command to run. Execute it, then report the result in one or two lines. If this
  environment cannot execute it, say so and stop — never hand over a script, and never claim the
  step passed.

## Core rules

<!-- FILL:rules-1-4 — the constraints that are true only in this repo.
     Examples: component variants, theme tokens, data-flow boundaries,
     destructive-action confirms, tenancy or auth invariants. -->

5. **Context discipline.** Search narrowly. Read at most three source files at a time.
6. **One home per fact.** A rule lives in exactly one file; everywhere else cites it.
7. **Planning.** Anything beyond the QUICK lane (three files or fewer, reversible, no contract change) needs a task file in `.agents/tasks/active/`, with the plan approved before the first edit.
8. **Subagents.** Every subagent prompt names the files to read and the deliverable. It never restates the plan.

## Done means

`agent-kit verify` exits 0, the task's evidence table holds real exit codes, `.agents/tasks/INDEX.md` is current, and `agent-kit doctor` reports no failures. Then `agent-kit task close`.

---

<!-- MACHINERY: everything below is the kit. Keep it as written. -->
## Kit

`bun scripts/agent-kit.mjs <command>` (fallback: `node scripts/agent-kit.mjs <command>`)

| Command | Use |
|---|---|
| `doctor` | truth checks over docs, declarations and tasks; `--strict` also fails on unfilled markers; `--fix` repairs encoding only; `--json` for CI |
| `task new <slug> --lane quick\|planned` | open a task **and record the baseline run** (`--no-baseline` to skip) |
| `task show` | print the active task's scope, plan and evidence — the thing G1/G2 asks a human to read |
| `task close` | run the suite, scope-check against git, record the inventory, archive, and file the changelog entry under the task's `type`; `--amend "<why>"` accepts a declared breach and writes the reason into the plan; `--no-verify` only when the suite cannot run here |
| `release <version> --summary "<what shipped>"` | promote the Unreleased block into release notes and start a fresh one |
| `verify` | mid-flight check; writes the evidence table and prints the delta against the baseline |
| `task guard` | the pre-commit hook: refuses a commit outside the declared write set. Silent when no task is open. **Opt-in per clone** via `git config core.hooksPath .githooks` |
| `check` / `pull --dry-run` / `pull` | drift against the template; `pull` never overwrites a locally modified file without `--force` |

The owner is not expected to type any of this. The agent runs `task new` and `task close`, and
`task close` is where the write set is checked — that check always runs. The commit guard is a
per-clone extra that warns earlier; it is off unless someone opts in, because it is git config
and a shared repo must not rewrite a teammate's git behaviour on install.

Harnesses that load project skills can also pick this up from `SKILL.md` at the repo root;
everything it says is already in this file. That path is the skill's one home: a harness with
its own skill directory gets a pointer in its own format, never a copy that drifts.
