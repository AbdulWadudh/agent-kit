# Agent Changelog

A thin index: one line per closed task. The why lives in the plan each line links to, never
here. Newest last, so the last three lines are the recent-state signal `AGENTS.md` asks for.

`agent-kit task close` appends the line. Never hand-compose one.

## Index

- **2026-10-26** — `TASK-100` — bootstrapped the agent-kit template (setup, doctor, sync, task gates) — no plan, template init
- **2026-10-26** — `TEMPLATE` — added task show, verify --baseline, pull --dry-run, doctor --fix/--json, rule lint, close --amend, the project skill and a filled example — no plan, template history
- **2026-10-26** — `TASK-101` — prove the hook fires — [plan](../tasks/archive/2026-10/2026-10-26-TASK-101-hook-smoke.md)
- **2026-10-26** — `TEMPLATE` — dogfooding found five bugs in the gates (mojibake regex, porcelain trim, FILL regex, seed index leak, quoted summary); all fixed, each with an assertion — no plan, template history
- **2026-10-27** — `TEMPLATE` — commit guard became opt-in (setup no longer writes git config); the task index stopped duplicating the changelog; doctor now fails if an archived task has no changelog line — no plan, template history
