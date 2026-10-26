# Changelog

Release notes, one block per release. `agent-kit task close` appends each finished task to
🚧 Unreleased under its `type`; `agent-kit release <version> --summary "<what shipped>"`
promotes that block into a release and starts a fresh one. Never hand-compose an entry.

## 🚧 Unreleased

### 🟢 Added
- `TEMPLATE`: README `Start here` — a paste-ready setup prompt that makes the agent ask four questions first (harnesses to wire, commit guard, off-limits paths, first task), then set up, wire the skill per harness, and report

### 🔵 Changed
- `TEMPLATE`: the changelog is release notes: `task close` files each entry under its change type, `release` promotes the batch
- `TEMPLATE`: chat-only operation is a rule, not a hope — the agent runs every command, `task show` answers "nothing in flight", and an unexecutable environment must say so instead of handing over a script
- `TEMPLATE`: `setup`'s next-step list says to ask the owner for rules 1-4 instead of inventing them; the checklist replaces a terminal wizard
- `TEMPLATE`: the skill is harness-neutral at root `SKILL.md`; `doctor` requires it, and the setup prompt writes a pointer per named harness instead of shipping one harness's folder

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
