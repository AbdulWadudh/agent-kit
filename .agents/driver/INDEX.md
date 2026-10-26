# ⚙️ Driver & Verification Hub

## 🛠️ TASK COMPLETION PROTOCOL (Execute When Code Edits Are Done)
1. **Run Verification**: Execute `./.agents/driver/verify_task.sh` (or `pnpm build && pnpm test`). Fix any errors before proceeding.
2. **Compress Scratchpad ($O(1)$)**: Edit your active task file to remove raw terminal outputs/notes and replace them with a concise 3-line completion summary.
3. **Archive Task File**: Move the active task file from `.agents/tasks/active/` to `.agents/tasks/archive/YYYY-MM/`.
4. **Update Indexes**:
   - Clear `Current Active Task` in `.agents/tasks/INDEX.md` and add entry to `Recent Tasks`.
   - Append a 1-line bullet to `.agents/changelog/active.md` (e.g. `- [TASK-101]: Summary`).
   - If public signatures changed, update `docs/API_SKELETON.md`.
