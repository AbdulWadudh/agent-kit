# .githooks — the optional commit guard

**Why** — a commit that leaves the active task's write set is a scope breach. This hook reports
it before the commit exists, but only in clones that opted in; the same check always runs at
`task close`.

**Load it when** — you are wiring or changing the guard. Otherwise:
`git config core.hooksPath .githooks`.

| Path | Holds | Open when |
|---|---|---|
| `pre-commit` | the hook: calls `agent-kit task guard` and exits with its verdict | wiring or debugging the guard |

## How it behaves

- Silent when no task is active: a human's commit is never blocked by the kit.
- Refuses a staged file outside the active task's `touches`; prints the uncovered paths.
- **Never** bypass with `--no-verify`; close the task or amend the write set instead.
- Opt-in per clone. `setup` prints the command; it does not rewrite your git config.
