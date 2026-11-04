# Commits

Read before the first commit of a task. The subject has a hook; the split is kept by review.

- The author is the repo's configured identity. Never pass `-c user.name` or `-c user.email`,
  and never invent one from session context. No identity configured: stop and ask.
- No `Co-Authored-By`, no "Generated with ...", no AI attribution in commits, PR bodies,
  issues or release notes.
- One commit is one change — a feature, a fix, a doc update or a test — never a sitting's bulk
  work. Group by the feature or the issue each commit serves, so one commit can be reverted
  without the other. Work for a different feature or issue does not share a commit.
- **20 staged files is the cap.** Past it the pre-commit guard refuses. Split by concern, or make
  an explicit `K79_ALLOW_BULK=1` exception and say why in the body.
- Run `agent-kit guard plan` before staging a large change. It prints one `git add -- <paths>` line
  per concern and flags a group over the cap.
- A task carries as many commits as it has changes. Every commit names the same task id; the
  task file is the delivery, its commits are the steps. Do not hold the work back for one bulk
  commit at close.
- A micro fix names its `PATCH-N` id in the same position. The lane changes the ceremony, not
  the record: one task file, however many commits.
- Stage by path. `git add -A`, `git add .` and `git commit -a` sweep in work that belongs to
  another commit; a path that is not part of this commit stays unstaged.
- The subject carries the type and the task:
  `type (TASK-ID|PATCH-ID): imperative summary` — lower-case type, one space before the
  parenthesis, no full stop. Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`,
  `build`, `ci`, `style`, `revert`.
- The body carries three labels after one blank line: `Why:`, `What:` and `Verification:`. At
  close, the task's `**Summary**` paragraph is the closing commit's body. A commit with no body
  is not finished.
- `.agent-kit/githooks/commit-msg` prints the expected shape when a message misses it and exits 0;
  with `K79_GUARD=strict` it exits 1 and refuses. It never blocks an owner by default, so this
  rule is the session's alone to keep. `.agent-kit/githooks/pre-commit` checks the cap and the
  write set. The one commit without a task ID is the setup fill commit, made before the first
  task exists.
- `K79_SKIP_GUARD=1` bypasses both hooks for a broken guard or an emergency. It prints a warning;
  never use it to pass a red gate.
- Every closed task leaves its task file under `.agent-kit/tasks/archive/`, however many
  commits it carried; `task close` archives it and the release note is derived from it. Never
  keep a second ledger.
- A failing scope hook gets its cause fixed. `--no-verify` is not an option.
