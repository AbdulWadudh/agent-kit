# Rule file example — tests

Not installed. Copy this to `.agent-kit/rules/testing.md` when the repo has a test runner. The
cross-cutting policy is `.agent-kit/rules/verification.md`; this file holds the stack-specific
shape.

1. **Mirror the source path.** `src/<area>/<file>.ts` maps to `tests/<area>/<file>.test.ts` under
   the test root declared in `.agent-kit/project.md`.
2. **One happy path, two breaking cases.** Empty, null, boundary, malformed or unauthorized input;
   for an action, one downstream failure (null, throw, timeout, 4xx/5xx) with no partial write.
3. **Mock only the boundary.** A helper has zero mocks; a query or API client is mocked only when a
   real database or sandbox is unavailable.
4. **Never mock the unit under test.** A test that asserts only that a mock was called is not a
   test.
5. **Name the case, not the function:** `rejects an expired token`, not `test auth`.
6. **Test files do not split to hit a line count.** Split by scenario when the file becomes hard to
   navigate.
7. **Record the command and exit code** in the task evidence; a green suite that was already green
   proves nothing.
