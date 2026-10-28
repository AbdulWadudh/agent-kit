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
- `2026-10-28` [TASK-123](10-2026/2026-10-28-TASK-123-release-tag-cli.md) — release --tag reads its version from the flag, so the documented command runs
- `2026-10-28` [TASK-122](10-2026/2026-10-28-TASK-122-unescape-frontmatter.md) — a quoted task summary no longer leaks YAML escapes into the release note
- `2026-10-28` [TASK-121](10-2026/2026-10-28-TASK-121-release-tags.md) — a release gets its tag automatically, and the tag message is the release note
- `2026-10-28` [TASK-120](10-2026/2026-10-28-TASK-120-tag-based-install.md) — an install follows a release tag, so it never receives unreleased commits and can pick its version
- `2026-10-28` [TASK-119](10-2026/2026-10-28-TASK-119-upgrade-procedure.md) — "upgrade agent-kit" has a procedure: check the source, show the diff, pull as one task
<!-- RECENT:END -->
