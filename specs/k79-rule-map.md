# k79 → agent-kit Rule Preservation Map

Every rule from the nine k79 skills gets one row. A row without a destination is not allowed; a rule is retired only with a written reason. The k79 repository is not deleted or trimmed until every row is `KEEP`, `MERGE` or `RETIRE` with a reason.

**Status:** `KEEP` copied/adapted into a home; `MERGE` folded into an existing agent-kit rule; `RETIRE` not applicable or superseded, reason required.

## Conductor (`k79-conductor`)

| ID | Rule | agent-kit home | Status |
| :--- | :--- | :--- | :--- |
| C-1 | Lifecycle order: spec, structure/evidence, verify, commit | `.agent-kit/SKILL.md` (classify → task → G1 → work → verify → G2 → close) | MERGE |
| C-2 | Suite self-update protocol and install approval | `check` / `pull` / release tags | RETIRE — agent-kit owns upgrades |
| C-3 | A prompt request is an interview, not code | `.agent-kit/skills/k79-prompt-craft.md` | KEEP |
| C-4 | Stop for spec approval before source edits | `SKILL.md` G1 + `rules/_behavior.md` §11 | MERGE |
| C-5 | Load only the skills matched to the files touched | `rules/INDEX.md` "read when" column | MERGE |
| C-6 | Adversarial verification; proof for every done claim | `SKILL.md` §6 + `rules/verification.md` + evidence table | MERGE |
| C-7 | Logical commits, one task record, zero AI tags | `rules/commits.md` + `task close` + `release` | MERGE |
| C-8 | Optional efficiency skills; project rules win conflicts | `rules/_behavior.md` §12 | MERGE |
| C-9 | k79 suite versioning and release protocol | `template.json` + tags + `release` | RETIRE — superseded |

## Spec-Driven (`k79-spec-driven`)

| ID | Rule | agent-kit home | Status |
| :--- | :--- | :--- | :--- |
| S-1 | New feature or contract change: write the spec, then stop | `rules/_behavior.md` §11 + `SKILL.md` G1 | MERGE |
| S-2 | Small bug fix with no contract change proceeds without a spec | `SKILL.md` MICRO/QUICK lanes | MERGE |
| S-3 | Environment setup needs no spec or changelog | `setup` is its own command | RETIRE — not a task |
| S-4 | Spec file location, 250-line scaling, 8 files per folder | `.agent-kit/templates/task.md` + docs ceiling | RETIRE — task file replaces the artifact |
| S-5 | Spec sections: goal, I/O contract, acceptance criteria, scope lock | `templates/task.md` + `rules/verification.md` | MERGE |
| S-6 | Six status markers; `[DONE]` needs proof; no `- [x]` | task evidence table + `task show` STALE + close refusal | MERGE |
| S-7 | `@quirk:` inline shield plus a spec entry | `rules/learnings.md` + exception-comment pass in `skills/k79-docs-populate.md` | KEEP |
| S-8 | Never remove quirk-protected code without checking its reason | `rules/anti-patterns.md` | KEEP |

## Code Structure (`k79-code-structure`)

| ID | Rule | agent-kit home | Status |
| :--- | :--- | :--- | :--- |
| CS-1 | 250-line target, 300-line hard ceiling; split on crossing | `rules/code-structure.md` + `doctor` WARN/FAIL | KEEP |
| CS-2 | Max 8 files per folder; split the feature when exceeded | `rules/code-structure.md` + `doctor` density (source roots) | KEEP |
| CS-3 | No barrel files; client-safe config entry is the only exception | `rules/code-structure.md` + `doctor` barrel check | KEEP |
| CS-4 | Feature blueprint: controller, types, queries, api, actions, components, hooks, helpers | `rules/code-structure.md` + `templates/rule-examples/typescript.md` | KEEP |
| CS-5 | File-to-folder scaling when a file crosses the cap | `rules/code-structure.md` | KEEP |
| CS-6 | File/directory casing and role suffixes | `rules/code-structure.md` | KEEP |
| CS-7 | Verb-first functions; no noun-only or vague verbs | `rules/code-structure.md` | KEEP |
| CS-8 | Variable/type/constant naming; booleans; units; no vague names | `rules/code-structure.md` | KEEP |
| CS-9 | Split by responsibility: helpers, queries, actions, hooks, components | `rules/code-structure.md` | KEEP |
| CS-10 | One-way dependency flow, controller to config | `rules/code-structure.md` | KEEP |
| CS-11 | Leaf and peer isolation; no circular imports | `rules/code-structure.md` | KEEP |
| CS-12 | Cross-feature sharing is promoted to `shared/` | `rules/code-structure.md` | KEEP |
| CS-13 | Compiler-guided refactor: run the checker, fix only reported paths | `rules/code-structure.md` + `SKILL.md` §6 | KEEP |

## Evidence & Simplicity (`k79-evidence-and-simplicity`)

| ID | Rule | agent-kit home | Status |
| :--- | :--- | :--- | :--- |
| ES-1 | Verify signatures and schemas before calling them | `rules/_behavior.md` §1 + `rules/anti-patterns.md` | MERGE |
| ES-2 | Cite `file:line`, compiler output or a failing test | `rules/_behavior.md` §1 | MERGE |
| ES-3 | Ask one direct question when requirements conflict | `rules/_behavior.md` §11 | MERGE |
| ES-4 | Rule of 2+: deduplicate repeated boilerplate | `rules/_behavior.md` §8 | MERGE |
| ES-5 | No speculative abstraction; no classes/factories for a function | `rules/_behavior.md` §8 | MERGE |
| ES-6 | Minimum viable diff; never refactor unrelated working code | `rules/_behavior.md` §8 | MERGE |
| ES-7 | ponytail ladder is a tie-breaker, never an override | `rules/_behavior.md` §12 | MERGE |
| ES-8 | Debug by reproducing and tracing the exact divergence | `rules/_behavior.md` new 2-strike bullet | KEEP |
| ES-9 | Two failed fix attempts: stop, revert, report | `rules/_behavior.md` new 2-strike bullet | KEEP |
| ES-10 | Report evidence, root-cause hypothesis, two options | `SKILL.md` report section | KEEP |

## Config & Security (`k79-config-and-security`)

| ID | Rule | agent-kit home | Status |
| :--- | :--- | :--- | :--- |
| CFG-1 | Three-tier config; one tier per value, grouped by concern | `templates/rule-examples/config.md` | KEEP |
| CFG-2 | Named constant only across a file boundary or 2+ uses | `templates/rule-examples/config.md` | KEEP |
| CFG-3 | Env validated at startup; one default; no call-site fallback | `templates/rule-examples/config.md` | KEEP |
| CFG-4 | Zero raw env reads outside the env module | `templates/rule-examples/config.md` | KEEP |
| CFG-5 | Runtime settings invalidate caches across processes | `templates/rule-examples/config.md` | KEEP |
| CFG-6 | Only the client-safe config barrel; env/paths never re-exported | `templates/rule-examples/config.md` | KEEP |
| CFG-7 | Never import env/paths into a client or shared bundle | `templates/rule-examples/config.md` | KEEP |
| CFG-8 | Pass config into helpers; keep helpers pure | `templates/rule-examples/config.md` | KEEP |
| CFG-9 | Secrets never in constants, settings, responses, HTML, logs or spans | `templates/rule-examples/security.md` | KEEP |
| CFG-10 | User-scoped cache keys; private/no-store on authenticated responses | `templates/rule-examples/security.md` | KEEP |
| CFG-11 | Ownership check on every mutation | `templates/rule-examples/security.md` | KEEP |
| CFG-12 | Idempotency keys on payments and critical creates | `templates/rule-examples/security.md` | KEEP |

## Performance & DB (`k79-performance-and-db`)

| ID | Rule | agent-kit home | Status |
| :--- | :--- | :--- | :--- |
| PDB-1 | Select only needed columns; no `SELECT *` | `templates/rule-examples/database.md` | KEEP |
| PDB-2 | Zero N+1; join, eager-load or batch | `templates/rule-examples/database.md` | KEEP |
| PDB-3 | Cursor pagination with a default and a hard limit | `templates/rule-examples/database.md` | KEEP |
| PDB-4 | `.lean()` on read-only Mongoose queries | `templates/rule-examples/database.md` | KEEP |
| PDB-5 | Transactions for 2+ writes; no HTTP inside a transaction | `templates/rule-examples/database.md` | KEEP |
| PDB-6 | One shared connection pool per process | `templates/rule-examples/database.md` | KEEP |
| PDB-7 | Index filter/join/sort columns; concurrent index builds; no destructive migration without approval | `templates/rule-examples/database.md` | KEEP |
| PDB-8 | Parallelize independent awaits | `templates/rule-examples/performance.md` | KEEP |
| PDB-9 | Explicit API timeouts; retry idempotent calls only | `templates/rule-examples/performance.md` | KEEP |
| PDB-10 | Cache-aside with TTL, invalidation and DB fallback | `templates/rule-examples/performance.md` | KEEP |
| PDB-11 | Background jobs over 1s; streaming with abort | `templates/rule-examples/performance.md` | KEEP |
| PDB-12 | Search debounce, 2+ characters, cancel stale requests | `templates/rule-examples/performance.md` | KEEP |
| PDB-13 | Deduplicate in-flight GETs; disable pending submits | `templates/rule-examples/performance.md` | KEEP |
| PDB-14 | Image/font/bundle rules: dimensions, lazy below fold, LCP priority, virtualization | `templates/rule-examples/performance.md` | KEEP |

## Verification & Testing (`k79-verification-testing`)

| ID | Rule | agent-kit home | Status |
| :--- | :--- | :--- | :--- |
| VT-1 | Tests mirror `src/` under top-level `tests/` | `rules/verification.md` + `doctor` test mirror | KEEP |
| VT-2 | Test files honor the 250/300 cap; split by scenario | `rules/verification.md` | KEEP |
| VT-3 | No tautological tests; never mock the function under test | `rules/verification.md` | KEEP |
| VT-4 | Zero mocks in `helpers/` | `rules/verification.md` | KEEP |
| VT-5 | Mock only I/O boundaries; never mock helpers | `rules/verification.md` | KEEP |
| VT-6 | 1:2 happy-to-breaking ratio | `rules/verification.md` | KEEP |
| VT-7 | Breaking inputs: empty, null, boundary, malformed, unauthorized | `rules/verification.md` | KEEP |
| VT-8 | Downstream failure tests: null, throw, timeout, 4xx/5xx, no partial writes | `rules/verification.md` | KEEP |
| VT-9 | Map each spec criterion to a test before calling it done | `rules/verification.md` + task evidence | KEEP |
| VT-10 | Dual mode: runner configured vs legacy repo; report static vs runtime | `rules/verification.md` | KEEP |

## Logging, Errors & Git (`k79-logging-errors-git`)

| ID | Rule | agent-kit home | Status |
| :--- | :--- | :--- | :--- |
| LEG-1 | Never swallow an error or return null without context | `rules/errors.md` | KEEP |
| LEG-2 | Leaves throw with context; boundaries log once | `rules/errors.md` | KEEP |
| LEG-3 | No raw console logging; one structured logger | `rules/errors.md` + `templates/rule-examples/logging.md` | KEEP |
| LEG-4 | Mandatory log fields per severity | `rules/errors.md` | KEEP |
| LEG-5 | Redact secrets, tokens and payment data | `rules/errors.md` + `security.md` | KEEP |
| LEG-6 | No bulk commits; group by concern; explicit paths | `rules/commits.md` + guard | MERGE |
| LEG-7 | Commit body: Why, What, Verification | `rules/commits.md` + guard | MERGE |
| LEG-8 | Zero AI attribution | `rules/commits.md` | MERGE |
| LEG-9 | One record per logical change; no aggregate changelog | `task close` archives the task; no `logs/` | MERGE |
| LEG-10 | Entry schema, path/date match, append-only, required sections | task front matter + `**Summary**` + `rules/releases.md` | MERGE |
| LEG-11 | Release sequence; never rewrite a released note | `release` from archived tasks + tag promise | MERGE |
| LEG-12 | Changelog anti-patterns (aggregate, rewritten entries, commit-subject-only) | `rules/releases.md` (release notes) | MERGE |
| LEG-13 | 20-file cap, concern warning, message shape, bypass policy | `rules/commits.md` + merged guard | KEEP |

## Prompt Craft (`k79-prompt-craft`)

| ID | Rule | agent-kit home | Status |
| :--- | :--- | :--- | :--- |
| PC-1 | Turn a vague request into one focused outcome prompt | `.agent-kit/skills/k79-prompt-craft.md` | KEEP |
| PC-2 | Interview until the goal is agreed; challenge scope | `.agent-kit/skills/k79-prompt-craft.md` | KEEP |
| PC-3 | Emit one copy-pasteable prompt, not a plan | `.agent-kit/skills/k79-prompt-craft.md` | KEEP |

## Machinery (not rules)

| Source | Disposition |
| :--- | :--- |
| `release-notes.mjs`, `changelog/`, `release-notes/`, `VERSION` | Superseded by archived tasks, `releases/`, tags and `release`. The *rules* they encoded are LEG-9..12. |
| `sync-agents.mjs`, `list-skills.mjs`, `validate-skills.mjs` | Superseded by `setup`, `check`/`pull`, `doctor`. |
| `commit-guard.mjs`, `commit-plan.mjs`, `commit-message.mjs` | Merged into `lib/guard.mjs`; the behaviours are LEG-13 and the guard selftest cases. |
| `install-hooks.mjs` | Replaced by `agent-kit guard install [--check]`. |
| `k79-reminder.mjs`, `opencode-reminder.js` | RETIRE — agent-kit forbids per-turn plugins; `AGENTS.md` + the skill pointer carry the loop. |

## Audit rule

A row is only closed when its destination exists and a reviewer has compared the rule text, not the summary. `doctor` cannot prove prose preservation; the G2 review of the merge task is where this map is checked line by line. No k79 file is deleted before that review passes.
