<!--
AGENTS SEED — copied to <repo>/AGENTS.md by agent-kit setup, then authored by you.
This file is never overwritten by `pull`. Uppercase PLACEHOLDER markers and
FILL comment markers are the work that `doctor --strict` refuses to call done.
-->

# <PROJECT NAME> — Agent Entry Point

You are working in <PROJECT NAME>. Read this file once per session, then follow it.

<!-- FILL:project-summary — one sentence: what this product does, and for whom. -->

## Start here, in order

1. `.agent-kit/SKILL.md` — the work loop: classify, open, gate, verify, close, report. Follow its order.
2. `.agent-kit/project.md` — stack, commands, entry points, generated directories. Cite it; never restate it.
3. `.agent-kit/tasks/INDEX.md` — resume the active task, or open a new one.
4. `.agent-kit/rules/INDEX.md` — load only the rule files matching what you will touch.
5. `.agent-kit/docs/INDEX.md` — find where the logic lives before searching the tree.
6. Any other directory you open has an `INDEX.md`: read that first, then the one file it names.

## Boundary protocol

**Always**
- Read before writing. Keep every edit inside the task's declared `touches`.
- Run `agent-kit verify` before and after edits; it is the quick suite. The full one runs at the
  baseline and at `task close`. Evidence goes in the task file; memory does not count.
- Take the smallest complete change: reuse what exists, delete before adding, no speculative abstraction.

**Ask first**
- New dependency, schema or migration, public interface change.
- Deleting files, rewriting generated output, or anything irreversible.

**Never**
- Invent a path, a command or an export. If it is not in `project.md` or in the tree, it does not exist.
- Edit a generated directory (listed in `project.md`).
- Close a task with edits it does not record.
- Commit as the session. Git's configured identity is the author — never `-c user.name`, never
  `-c user.email`, never a name from the conversation — and no `Co-Authored-By`, "Generated with",
  or any other AI attribution in a commit, PR or changelog. It is `.agent-kit/rules/commits.md`.
- Hand the user a command to run. Execute it, then report the result in one or two lines. If this
  environment cannot execute it, say so and stop — never hand over a script, and never claim the
  step passed.

## Core rules

<!-- FILL:rules-1-4 — the constraints that are true only in this repo.
     Examples: component variants, theme tokens, data-flow boundaries,
     destructive-action confirms, tenancy or auth invariants. -->

5. **Context discipline.** Every directory the kit owns carries an `INDEX.md`: read it, then the one file it points at — never list a folder. Search narrowly; read at most three source files at a time. History is read only when the user asks; `agent-kit start` prints the five newest closes.
6. **One home per fact, one lane per change.** A rule lives in exactly one file; everywhere else cites it. MICRO is one file, reversible with `git revert`, one domain, and no public interface, schema, dependency, env, security or `.agent-kit/` change; QUICK is reversible, one domain, no contract change; everything else is PLANNED. QUICK keeps its task file; MICRO keeps the record (one task file, one `PATCH-N` card) and replaces the open/close ceremony, not the record.
7. **Planning.** Anything beyond QUICK needs a task file in `.agent-kit/tasks/active/`, with the plan approved before the first edit.
8. **Subagents.** Every subagent prompt names the files to read and the deliverable. It never restates the plan.
9. **Shell output.** Prefix commands with `rtk` (`rtk git status`, `rtk npm test`); `rtk bypass <cmd>` when the full output is evidence. Name the task ID with any savings — detail in `.agent-kit/SKILL.md` §Shell output.

## Done means

The quick suite and the full one are green (the full one is `verify --full`, which `task close`
runs itself), the task's evidence table holds real exit codes, `.agent-kit/tasks/INDEX.md` is
current, and `agent-kit doctor` reports no failures. Then `agent-kit task close`.

A request that arrives while a task is open goes in its `## Queue` and becomes its subtask
(`task new --parent TASK-N`); only a separate delivery earns a new task, and the owner chooses
that. Work too big for one sitting splits the same way. A subtask closes on the quick suite:
`task close` marks it DONE and keeps it in `active/`. The main task's close is the milestone —
it refuses while a subtask is open, runs the full suite, and build failures are fixed right
there before it closes; green, it archives the family under one change file.

---

<!-- MACHINERY: everything below is the kit. Keep it as written. -->
## Kit

`bun .agent-kit/agent-kit.mjs <command>` (fallback: `node .agent-kit/agent-kit.mjs <command>`)

| Command | Use |
|---|---|
| `doctor` | truth checks over docs, declarations and tasks; `--strict` also fails unfilled markers; `--fix` repairs encoding; `--json` for CI |
| `harnesses` | list the coding agents installed here (HOME, PATH, repo); a report, not a gate |
| `start` | read-only session brief: branch, commands and tiers, five newest closes, active tasks, gate, last evidence, stale state, next action |
| `task new <slug> --lane micro\|quick\|planned [--summary "<one clause>"] [--intent "<paragraph>"] [--parent TASK-N] [--from <issue>]` | open a task **and record the baseline run** — full, or always-tier for `--lane micro` (`--no-baseline` skips it); `--summary` titles the card and, in `ids: issue`, the issue; `--intent` seeds Intent and the issue body; `--parent` opens `TASK-N.M` and queues the main task; in `ids: issue` it mints the issue, and `--from` imports one. `--lane micro` is a top-level `PATCH-N` task: no issue, no G1/G2 |
| `task show` | print the active task's scope, plan and evidence — what G1/G2 asks a human to read |
| `task publish [--id TASK-N]` | issue ids only: send the approved plan to its issue (front matter stays in the repo) |
| `task migrate [--dry-run]` | backfill: one **closed** issue per archived task, titled `TASK-N — summary` with the card's paragraph, for a repo that ran on local ids first; a second run adds nothing |
| `task renumber <old> <new> \| <old> --next [--file <name>]` | local ids only: move an id after a collision, rewriting the file name, a parent's children and every `depends_on`; `--file` picks one of two same-id files |
| `task block "<question>"` | park the in-progress task on an owner decision; the question waits in the file and the slot frees |
| `task resume [<id>]` | continue a blocked task; pass the id when more than one is waiting |
| `task close` | a micro task runs the always-tier commands, scope-checks and writes a `PATCH-N` card; a subtask runs the **quick** suite and stays DONE in `active/`; the main task refuses while a subtask is open, runs the **full** suite, scope-checks against git (its write set plus every subtask's), archives the family, writes one card under `.agent-kit/logs/MM-YYYY/`, and prints the commit message; `--pr` adds a PR body; `--amend "<why>"` accepts a breach; `--no-verify` when the suite cannot run; `--sync` (issue ids) closes the issue after the local close |
| `hotfix "<summary>" --files <a,b>` | one micro fix as open + verify + close, printing the commit message; no auto-commit and no new state |
| `release <version>` | write `.agent-kit/releases/<version>.md` from the cards no earlier release claims; `verify --full` runs first and a red suite refuses the cut (`--no-verify` is the deliberate cut); `--tag <version>` makes the annotated tag whose message is the note |
| `verify` | the inner loop: runs the `always` rows and writes the evidence table; `--full` adds the `milestone` rows; at three identical red runs it refuses until the Plan changes |
| `task guard [--message <file>]` | the hooks: `pre-commit` refuses a commit outside the declared write set (silent when no task is open); `commit-msg` warns — never blocks — on a subject that is not `type (TASK-ID\|PATCH-ID): summary` or a body with no summary. **Opt-in per clone** via `git config core.hooksPath .agent-kit/githooks` |
| `learnings archive` | move entries past the 30 cap into `.agent-kit/learnings/archive/`; the live list is what a session reads |
| `check` / `pull --dry-run` / `pull [--ref <tag>]` | the release tag this repo tracks and whether a newer one exists, plus drift against it; `pull` never overwrites a local edit without `--force` |

The owner is not expected to type any of this. The agent runs `task new` and `task close`, and
`task close` always checks the write set. The hooks are a per-clone extra that warns earlier;
they are off unless someone opts in, because a shared repo must not rewrite a teammate's git
config.

`.agent-kit/SKILL.md` is the work loop; this file is the contract it runs under. A harness with a
skill folder gets a pointer, never a copied loop.
