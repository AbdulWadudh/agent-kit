# rule-examples — one rule file per domain

**Why** — a rule is written once, in one file. These are patterns to copy, not rules that
apply here or in a target repo until a copy is installed.

**Load it when** — a repo has a domain that `.agent-kit/rules/` has no file for. Open the one
example you are copying, not the folder.

| File | Domain | Copy when |
|---|---|---|
| `typescript.md` | code rules (the `code` file) | the repo is TypeScript |
| `bun.md` | runtime and package manager | the repo runs Bun |
| `biome.md` | lint and format | the repo uses Biome |
| `api.md` | public interfaces and contracts | the repo exposes an API |
| `config.md` | configuration and environment | the repo has tunables |
| `database.md` | schema, queries and migrations | the repo owns a database |
| `security.md` | secrets, ownership, cache and idempotency | the repo has accounts, secrets or payments |
| `performance.md` | API calls, cache, jobs and UI cost | the repo has network or list work |
| `testing.md` | test shape and mocking | the repo has a test runner |
| `logging.md` | structured logs and redaction | the repo has a service or shared logger |
| `docs-lookup.md` | version and API lookups | documentation outranks memory |

After copying one, edit it to this repo's facts. The steps that make it a loaded rule — the
row, the trigger, the check — are in `../INDEX.md`.
