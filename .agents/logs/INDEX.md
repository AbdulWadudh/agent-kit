# logs — what changed, in order

**Why** — a change is recorded once, as its own small file, at the moment the task closes.
Nothing is folded into a running document, so nothing has to be kept in sync.

**Load it when** — someone asks what changed, or you are about to record a change. Recent
answers most of it; open one file only when its line is not enough.

## The shape

One folder per month, `MM-YYYY/`, one file per closed task:
`YYYY-MM-DD-TASK-N-slug.md`. Front matter holds `id`, `type`, `date` and `summary`; the
category heading is one of 🟢 Added, 🔵 Changed, 🛠️ Fixed, ⚠️ Deprecated / Removed; the
bullets are the files git reported.

- `agent-kit task close` writes the file. Do not hand-write one, and do not add a second ledger.
- A month folder is an archive, not a directory to list. Open the one file Recent links.
- The last five closes are listed here as changes and in `.agents/tasks/INDEX.md` as archived plans; neither index scans a folder.

## Recent

<!-- RECENT:START -->
- `2026-10-26` [TASK-101](10-2026/2026-10-26-TASK-101-hook-smoke.md) — The workflow runs itself
<!-- RECENT:END -->
