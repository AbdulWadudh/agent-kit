# Task Index and Routing

## Routing

1. **Check Active** below. If a task is in flight, open it and resume from its last recorded
   step. Do not start a second one.
2. **Otherwise open a task:** `agent-kit task new <slug> --lane quick|planned`.
3. **Never work from memory.** The task file is the state; if a fact is not in it, it did not
   happen.

## Lanes

| | QUICK | PLANNED |
|---|---|---|
| **Eligible when** | three files or fewer, one domain, reversible with `git revert`, no contract change | everything else |
| **G1 — plan** | record intent in the task and proceed | **halt** for approval before the first edit |
| **G2 — result** | `task close` runs the suite and closes | **halt** for approval after the suite, before close |
| **Typical** | typo, doc fix, one-file bug, a test | feature, refactor, schema, interface change |

## Gates

- **G1** and **G2** are the only two halts. A halt means: stop, present, wait. Not "proceed
  and note it".
- **Always halt, in every lane:** a destructive or irreversible action, a new dependency, a
  schema or migration change, deleting files outside the declared write set, or a red
  verification baseline.
- A rejection returns to the plan. An unapproved plan never reaches an edit.
- The pre-commit guard refuses a commit outside the declared write set. That is the same rule
  with teeth, not a second rule.

## Active

<!-- ACTIVE:START -->
_Nothing in flight._
<!-- ACTIVE:END -->

## Recent (last 5)

| Date | ID | Lane | Outcome | File |
|---|---|---|---|---|
<!-- RECENT:START -->
<!-- RECENT:END -->

## Archive

Closed tasks move to `.agents/tasks/archive/YYYY-MM/`. Do not read them unless the user asks
about history; the changelog already carries the one-line version.
