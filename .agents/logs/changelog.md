# Changelog

Release notes. `task close` files each task under its `type`; `release <version> --summary "..."` promotes the block. Never hand-compose an entry.

## 🚧 Unreleased

### 🟢 Added
- `TEMPLATE`: README `Start here` — a paste-ready setup prompt that makes the agent ask five questions first (harnesses to wire, commit guard, off-limits paths, first task, skills), then set up, install them, wire the skill per harness, and report
- `TEMPLATE`: `_behavior.md` §10-12 — commits belong to the owner, expensive decisions surface before building, and sources beat memory
- `TEMPLATE`: rule examples for Bun, Biome, API versioning, config tiers and library docs; the TypeScript example now carries the owner's code conventions
- `TEMPLATE`: `doctor` row `commit identity` — a commit carrying AI attribution fails, and a commit author other than the configured identity warns
- `TEMPLATE`: `SETUP.md` §3 — the four companion skills and why each earns its place, the separate agent-browser opt-in, and "use the configured MCP servers before writing the equivalent"

### 🔵 Changed
- `TEMPLATE`: the changelog is release notes: `task close` files each entry under its change type, `release` promotes the batch
- `TEMPLATE`: chat-only operation is a rule, not a hope — the agent runs every command, `task show` answers "nothing in flight", and an unexecutable environment must say so instead of handing over a script
- `TEMPLATE`: `setup`'s next-step list says to ask the owner for rules 1-4 instead of inventing them; the checklist replaces a terminal wizard
- `TEMPLATE`: the skill is harness-neutral at root `SKILL.md`; `doctor` requires it, and the setup prompt writes a pointer per named harness instead of shipping one harness's folder
- `TEMPLATE`: `SKILL.md` is now the work loop — classify, open, G1, work, verify, G2, close, report, with the failure branches — not an install guide; `AGENTS.md` lists it as step 1, so it is read even without skill support
- `TEMPLATE`: the setup prompt says exactly how to wire a harness (its frontmatter, one-line body), and `doctor` has a `skill pointers` row that fails a copy
- `TEMPLATE`: the setup prompt carries the real template URL and reads the repo before asking — harnesses and matching rule examples come from evidence, not from the user's memory
- `TEMPLATE`: the repository is `agent-kit` — every install URL now matches the name the CLI, the README title and the skill already used
- `TEMPLATE`: `SKILL.md` checks the installed skills and MCP servers before planning, names the one it uses, and points at `_behavior.md` §12 to keep them current
- `TEMPLATE`: `SETUP.md` §2 names the rules setup installs — `code`, `config`, `api`, and `simplicity`, which needs no file because it ships as `_behavior.md` §8
- `TEMPLATE`: the seed `AGENTS.md` and the commit step in `SETUP.md` §5 both say it outright — the repo's configured identity is the author, never the session's, and no co-author or AI trailer — so the rule arrives with the install, not with the first violation
- `TEMPLATE`: the changelog is explained in four lines, not sixty — `task close` and `release` do the work, so the README says what the file is and how a batch ships
- `TEMPLATE`: installing a skill is a question, not a default — setup asks "shall I install the recommended skills?", a no is final for that repo, and agent-browser is asked separately

### 🛠️ Fixed
_None yet._

### ⚠️ Deprecated / Removed
- `TEMPLATE`: `INIT_PROMPT.md` — the README prompt is the single paste site now, and its manual-copy fallback moved into `SETUP.md` §0
- `TEMPLATE`: the `.opencode/` folder — the skill no longer ships inside one harness's directory

---

## 🚀 Release [v0.1.0] — 2026-10-27

### 🚀 Summary
Bootstrap of the agent-kit template: install, truth checks, drift sync, and the two-lane task
gates that make an agent's work checkable.

---

### 🟢 Added
- `TASK-100`: the template itself — `setup`, `doctor`, `check`/`pull`, task files and lanes
- `TEMPLATE`: `task show`, `verify --baseline`, `pull --dry-run`, `doctor --fix`/`--json`, the rule lint, `task close --amend`, the project skill, a filled example

### 🔵 Changed
- `TASK-101`: the workflow runs itself — `task new` records the baseline, `task close` runs the suite and refuses a red result

### 🛠️ Fixed
- `TEMPLATE`: five gate bugs found by dogfooding — mojibake regex, porcelain trim, FILL regex, seed index leak, quoted summary

---
