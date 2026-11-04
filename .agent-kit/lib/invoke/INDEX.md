# invoke — procedures and the pointers that expose them

**Why** — one prompt per job; every harness gets a thin pointer, never a copy. A new client is an
adapter row, not a second procedure.

**Load it when** — adding a job, changing a pointer, or debugging `prompt` / `wire`.

| File | Holds | Open when |
|---|---|---|
| `config.mjs` | job ids, `invoke.json` read/write | adding a job or changing the saved selection |
| `prompt.mjs` | `agent-kit prompt <job>` and `--list` | a procedure does not print |
| `pointers.mjs` | command/skill pointers, refresh, stale-job prune | `/k79-*` is missing, stale or duplicated |
| `install.mjs` | the setup-time `--wire` decision and config write | an install did not create the harness folder |

A pointer is ours only when its body names `.agent-kit/skills/` or `.agent-kit/SKILL.md`; an
authored file with the same name is kept. `doctor` fails a pointer over 700 characters or one that
does not name the procedure file.
