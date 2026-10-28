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
- The last five closes are listed here as changes and in `.agent-kit/tasks/INDEX.md` as archived plans; neither index scans a folder.
- `agent-kit release <version>` folds the cards no earlier release claims into `.agent-kit/releases/<version>.md`, a note for git and people; it never runs git itself.

## Recent

<!-- RECENT:START -->
- `2026-10-28` [TASK-115](10-2026/2026-10-28-TASK-115-context-budget-gate.md) — the files a session reads before it plans now have a cap, and doctor fails past it
- `2026-10-28` [TASK-114](10-2026/2026-10-28-TASK-114-trim-prompt-wires-homes.md) — the trim moves each fact to its home and wires the pointer that reaches it
- `2026-10-28` [TASK-113](10-2026/2026-10-28-TASK-113-prompts-folder.md) — prompts have their own folder, and AGENTS.md has a trim pass
- `2026-10-28` [TASK-112](10-2026/2026-10-28-TASK-112-release-procedure-own-file.md) — the release procedure lives in its own rule file, one pointer in the loop
- `2026-10-28` [TASK-111](10-2026/2026-10-28-TASK-111-release-version-rule-and-v1.md) — the release rule says who picks the number, and v1.0.0 is cut
<!-- RECENT:END -->
