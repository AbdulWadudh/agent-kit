# Changelog

Release notes, one block per release. `agent-kit task close` appends each finished task to
🚧 Unreleased under its `type`; `agent-kit release <version> --summary "<what shipped>"`
promotes that block into a release and starts a fresh one. Never hand-compose an entry.

## 🚧 Unreleased

### 🟢 Added
_None yet._

### 🔵 Changed
- `TEMPLATE`: the changelog is release notes: `task close` files each entry under its change type, `release` promotes the batch
- `TEMPLATE`: chat-only operation is a rule, not a hope — the agent runs every command, `task show` answers "nothing in flight", and an unexecutable environment must say so instead of handing over a script
- `TEMPLATE`: `setup`'s next-step list says to ask the owner for rules 1-4 instead of inventing them; the checklist replaces a terminal wizard

### 🛠️ Fixed
_None yet._

### ⚠️ Deprecated / Removed
_None yet._

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
