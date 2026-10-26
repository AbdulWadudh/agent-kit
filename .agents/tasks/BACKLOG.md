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

## Statuses

- `later` — real and wanted, not next.
- `not-now` — the timing is wrong or something external blocks it; the next step says what
  unblocks it.
- `not-important` — recorded so it stops being raised; revisit only if its cost changes.
