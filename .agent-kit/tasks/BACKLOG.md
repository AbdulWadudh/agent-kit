# Backlog — parked work

Candidates the owner has decided not to do now. A row is **not** a task: it has no lane, no
write set and no gates, and no session resumes from it. Work starts when the owner picks a
row: `agent-kit task new`, then delete the row here. `task close` writes the record; this file
is not a changelog.

`agent-kit doctor` fails a row with an unknown status, a reused ID, fewer than five cells, or
an empty item, source or next step.

| ID | Status | Item | Source | Next step |
|---|---|---|---|---|
| `B-04` | `later` | adopt an existing repo's agent files at setup (inventory, clean or migrate) | 2026-10-26 design session (cinevo probe) | re-open as a PLANNED task from the plan in project memory; start with `setup --inventory` |
| `B-05` | `later` | derive task ids from active and archive, drop the `.counter` file | 2026-10-27 owner ask | re-open as a PLANNED task: `nextId()` scans active + archive; the manifest `owned` list and `AGENTS.md` drop `.counter`; selftest asserts the file is never written |
| `B-06` | `later` | rewrite the `rule-examples/config.md` example | 2026-10-27 TASK-107 answer | owner states the rewrite; open a task with `.agent-kit/templates/rule-examples/config.md` in its write set, then delete this row |
| `B-07` | `not-important` | runtime telemetry for rule cost (tokens read, time per rule) | 2026-10-28 owner ask, kit-review limits | nothing: the kit already stores characters, exit codes and `LOOP n`; a token count estimates a harness read the kit cannot see. Revisit only if a harness exposes real counts |
| `B-08` | `later` | `doctor` names the recent task that looped, instead of waiting for a session to notice | 2026-10-28 owner ask; every archived card carries `<!-- LOOP {"n":…} -->` | open a task: a WARN row over the last ten archived cards where `n >= 2`, naming the task and its failing set; `selftest` plants a card with `n:2` and asserts WARN |
| `B-09` | `not-important` | let an installed repo patch its own `.agent-kit/` machinery | 2026-10-28 owner ask | nothing: `pull --force` reverts machinery and `check` reports the drift, so upstream is the only path that survives. Revisit only if the manifest gains a per-file override |

## Statuses

- `later` — real and wanted, not next.
- `not-now` — the timing is wrong or something external blocks it; the next step says what
  unblocks it.
- `not-important` — recorded so it stops being raised; revisit only if its cost changes.
