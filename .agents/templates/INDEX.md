# templates — the seeds, and examples to copy

**Why** — a target repo authors its own docs. This folder holds the blank shapes `setup` copies
and one worked example per rule type, so no file has to be duplicated by hand.

**Load it when** — you are changing what an installed repo starts with, or adding a rule file.

| Path | Holds | Open when |
|---|---|---|
| `AGENTS.seed.md` | the target entry point: boundaries, layout, kit table | changing the installed contract |
| `CLAUDE.seed.md` | the Claude pointer to `AGENTS.md` | same |
| `tasks-INDEX.seed.md` | the task router, lane table, and last-five list | same |
| `logs-INDEX.seed.md` | the change-log model and last-five list | same |
| `learnings.seed.md` | the live-learnings shape and its cap | same |
| `task.md` | the per-task plan shape | `task new` reads it; you rarely need to |
| `rule-examples/INDEX.md` | one rule file per domain | adding a rule for a new domain |

## How to use

- Seeds are copied once, at setup. Editing a seed does not edit installed repos; `pull --seeds`
  is the explicit upgrade.
- Do not add a seed outside this folder. A new seed is a manifest `seeds` entry first.
- These files are machinery: a gate that fails is fixed in the gate, not in the seed.
