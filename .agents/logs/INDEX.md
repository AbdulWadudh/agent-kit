# logs — what changed, in order

**Why** — a change is recorded once, as its own small file, at the moment the task closes.
Nothing is folded into a running document, so nothing has to be kept in sync.

**Load it when** — someone asks what changed, or you are about to record a change. Recent
answers most of it; open one file only when its line is not enough.

## The shape

One folder per month, `MM-YYYY/`, one file per closed task:
`YYYY-MM-DD-TASK-N-slug.md`. Front matter holds `id`, `type`, `date` and `summary`. The body
is the completion record: `# TASK-N — <summary>`, `**Task:**` (a relative link to the archived
plan), `**Scope:**` (the top-level areas touched), then `## What changed` — the close-out
paragraph. No date line (the front matter has it), no file list (the task's `FILES` block has
it), and nothing from the plan: the link is the pointer.

- `agent-kit task close` writes the file. Do not hand-write one, and do not add a second ledger.
- A month folder is an archive, not a directory to list. Open the one file Recent links.
- The last five closes are listed here as changes and in `.agents/tasks/INDEX.md` as archived plans; neither index scans a folder.
- `agent-kit release <version>` folds the cards no earlier release claims into `releases/vX.Y.Z.md`, a note for git and people; it never runs git itself.

## Recent

<!-- RECENT:START -->
- `2026-10-27` [TASK-106](10-2026/2026-10-27-TASK-106-character-cost.md) — a session pays for characters, not lines
- `2026-10-27` [TASK-105](10-2026/2026-10-27-TASK-105-changelog-shape.md) — a changelog entry carries the task summary, and each version gets a release file
- `2026-10-27` [TASK-104](10-2026/2026-10-27-TASK-104-subtask-close.md) — subtasks close quick with lint; the main task runs build at close
- `2026-10-26` [TASK-103](10-2026/2026-10-26-TASK-103-session-ergonomics.md) — one command for session state, tiered verify, blocked tasks, close artifacts
- `2026-10-26` [TASK-101](10-2026/2026-10-26-TASK-101-hook-smoke.md) — The workflow runs itself
<!-- RECENT:END -->
