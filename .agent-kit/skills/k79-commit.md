# Commit

Use `.agent-kit/rules/commits.md`. Read it only if it is not already in this session; do not re-read a loaded rule.

1. Run `agent-kit guard plan`.
2. More than one concern: split into one commit per concern. Stage explicit paths only; never `git add .`, `git add -A` or `git commit -a`.
3. Subject: `type (TASK-N|PATCH-N): imperative summary`. Types are in `rules/commits.md`.
4. Body, after one blank line:

   ```
   Why:
   - the cause or constraint

   What:
   - the modules, functions or contracts changed

   Verification:
   - the exact command and its exit code
   ```

5. Commit. The scope guard blocks a file outside the active task's `touches`; fix the task's write set or unstage the file. Do not use `--no-verify`.
6. Report the commit hash, the subject, and the files in it.

`K79_SKIP_GUARD=1` is an emergency escape for a broken hook, not a way past a red gate. Say so when it is used.
