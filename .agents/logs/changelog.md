# Changelog

Release notes. `task close` files each task under its `type`; `release <version> --summary "..."` promotes the block. Never hand-compose an entry.

## 🚧 Unreleased

### 🟢 Added
- `TEMPLATE`: README setup prompt — five questions, then install, fill, wire the skill
- `TEMPLATE`: `_behavior.md` §10-12 and the `commit identity` row — commits, decisions, sources
- `TEMPLATE`: rule examples — Bun, Biome, API, config, docs lookup, code style
- `TEMPLATE`: `SETUP.md` §3 — companion skills, with agent-browser asked separately

### 🔵 Changed
- `TEMPLATE`: the changelog is release notes; `task close` files each entry under its type
- `TEMPLATE`: chat-only — the agent runs every command and never hands over a script
- `TEMPLATE`: `SKILL.md` is the work loop at the root; each harness gets a pointer
- `TEMPLATE`: the setup prompt reads the repo, asks for rules 1-4, and installs only approved skills
- `TEMPLATE`: every install URL is `AbdulWadudh/agent-kit`
- `TEMPLATE`: `SETUP.md` §2 names the installed rules — code, config, api, simplicity
- `TEMPLATE`: the seed `AGENTS.md` and `SETUP.md` §5 ban session names and co-author trailers
- `TEMPLATE`: size counts characters, not lines — modules and skill pointers
- `TEMPLATE`: the README explains the changelog in four lines, not sixty
- `TEMPLATE`: a release note is one clause — 140 characters, refused at close and failed by `doctor`

### 🛠️ Fixed
_None yet._

### ⚠️ Deprecated / Removed
- `TEMPLATE`: `INIT_PROMPT.md` — its manual-copy fallback is `SETUP.md` §0
- `TEMPLATE`: `.opencode/` — the skill no longer ships in one harness's folder

---

## 🚀 Release [v0.1.0] — 2026-10-27

### 🚀 Summary
Bootstrap of the agent-kit template: install, truth checks, drift sync, and the two-lane task
gates that make an agent's work checkable.

---

### 🟢 Added
- `TASK-100`: the template itself — `setup`, `doctor`, `check`/`pull`, task files and lanes
- `TEMPLATE`: `task show`, `verify --baseline`, `pull --dry-run`, `doctor --fix`/`--json`, the rule lint, the project skill

### 🔵 Changed
- `TASK-101`: the workflow runs itself — `task new` records the baseline, `task close` runs the suite and refuses a red result

### 🛠️ Fixed
- `TEMPLATE`: five gate bugs found by dogfooding — mojibake regex, porcelain trim, FILL regex, seed index leak, quoted summary

---
