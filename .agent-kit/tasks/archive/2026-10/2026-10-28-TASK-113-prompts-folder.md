---
id: TASK-113
parent: ""
lane: QUICK
status: DONE
closed: 2026-10-28
created: 2026-10-28
baseline: bdac2f61222e79684c318eb6ebc4aac67a5cec38
touches: [".agent-kit/prompts/", ".agent-kit/templates/", ".agent-kit/INDEX.md", ".agent-kit/docs/INDEX.md", ".agent-kit/sync-manifest.json", ".agent-kit/agent-kit.mjs", "AGENTS.md", "README.md", "SETUP.md"]
depends_on: []
type: added  # added | changed | fixed | removed
summary: prompts have their own folder, and AGENTS.md has a trim pass
---
# TASK-113 — prompts folder

## Scope (frozen once approved)

**Intent** — The owner: "create another folder called prompts in this we have the prompts for
different enhancements and optimizations, example an prompt for analyze the current repo where
agent-kit is installing make that AGENTS.md file migrate and compressing the content while
preserving its soul to the minimize the context load".

**In scope**
- `.agent-kit/prompts/` with its `INDEX.md` and the first prompt, `trim-agents-md.md`.
- `docs-populate.md` moves there, so the folder is the one home for prompts rather than a second
  one beside `templates/`.
- The manifest entry, the `.agent-kit/INDEX.md` row, the `AGENTS.md` "what goes where" row and
  layout, and every reference to the old path.

**Out of scope**
- New prompts beyond the one asked for. The index carries a row for each, added when it exists.
- A gate over prompt length or wording: a prompt is a procedure, and the checks it must satisfy
  are the ones it names (`doctor --strict`, the character count).

**Decisions** — only choices a later session would otherwise re-open, each with the pointer it
rests on (`path:line`, a command's result, or the owner's words). No explanation.
- Prompts leave `templates/` because that folder's job is seeds the repo authors from;
  `AGENTS.md`'s "what goes where" row now names `.agent-kit/prompts/`, and `templates/INDEX.md`
  loses the row (`AGENTS.md` table).
- The prompt is PLANNED: it edits four directories, and the trim cannot be judged without the
  owner's answer on the lines that have no home yet.
- The trim keeps a hand check — old file against new, one constraint at a time. `doctor` proves
  paths and indexes, never that a constraint survived, and that survival is the whole job.

## Plan

1. Write `prompts/INDEX.md` and `prompts/trim-agents-md.md`.
2. `git mv` `templates/docs-populate.md` into `prompts/` and fix the six references to it.
3. Declare `prompts` in the manifest, both indexes, `AGENTS.md` and `README.md`.

**Test plan** — command → expected; a new check also shows its failing run.
- `node .agent-kit/agent-kit.mjs doctor --strict` → exit 0; a missing `prompts/INDEX.md` fails
  `directory indexes`.
- `git grep "templates/docs-populate"` → only archived task cards, which are history.

## Baseline (before the change)

<!-- BASELINE:START -->
| Action | Command | Scope | Expected | Observed | Exit |
|---|---|---|---|---|---|
| test | `node .agent-kit/agent-kit.mjs selftest` | full | exit 0 | exit 0 | 0 |
| lint | `node .agent-kit/agent-kit.mjs doctor` | full | exit 0 | exit 0 | 0 |
<!-- BASELINE:END -->

## Verification

<!-- VERIFY:START -->
| Action | Command | Scope | Expected | Observed | Exit |
|---|---|---|---|---|---|
| test | `node .agent-kit/agent-kit.mjs selftest` | full | exit 0 | exit 0 | 0 |
| lint | `node .agent-kit/agent-kit.mjs doctor` | full | exit 0 | exit 0 | 0 |
<!-- LOOP {"n":0,"fail":"","diff":"9b4476d43eaa4dca","plan":"6e9d378ca2b2d930"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — `.agent-kit/prompts/` now holds the long jobs a session runs instead of improvising:
`docs-populate.md`, moved out of `templates/` so prompts have one home, and the new
`trim-agents-md.md`, which inventories a filled `AGENTS.md` line by line, moves each fact to the
file that owns it, rewrites the rest against the seed, and proves the result with `doctor --strict`
plus a character count. The folder ships with the machinery, and both indexes name it.

**Docs updated** — `.agent-kit/prompts/INDEX.md`, `.agent-kit/templates/INDEX.md`,
`.agent-kit/INDEX.md`, `AGENTS.md`, `README.md`, `SETUP.md`, `.agent-kit/docs/INDEX.md`.

**Follow-ups** — none

<!-- FILES:START -->
- `.agent-kit/INDEX.md`
- `.agent-kit/agent-kit.mjs`
- `.agent-kit/docs/INDEX.md`
- `.agent-kit/prompts/docs-populate.md`
- `.agent-kit/sync-manifest.json`
- `.agent-kit/templates/INDEX.md`
- `AGENTS.md`
- `README.md`
- `SETUP.md`
- `.agent-kit/prompts/INDEX.md`
- `.agent-kit/prompts/trim-agents-md.md`
<!-- FILES:END -->
