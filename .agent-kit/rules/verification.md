# Verification & Tests

**Why** — a green suite that cannot fail is not evidence. Tests prove the change; the gate proves the tests.

**Load it when** — you write or change a test, or you are about to report a task done.

## Mirror

- Tests live under the test root declared in `project.md` (`tests/` by default) and mirror the source path: `src/<feature>/<file>.ts` becomes `tests/<feature>/<file>.test.ts`.
- Test files are exempt from proactive splitting. Split by scenario only when the file becomes hard to navigate, never to satisfy a line count.
- A test outside a mirrored folder is integration/e2e; the mirror check ignores it.
- The `test mirror` row fails a test whose mirrored source file does not exist. It does not prove coverage; it proves the path is real.

## What to write

- One happy path per function.
- At least two breaking cases: empty, null, boundary, malformed or unauthorized input.
- For an action, one downstream failure: null, throw, timeout, 4xx or 5xx. Assert the exact error and that no partial write landed.
- Ratio: one happy test to two breaking tests.
- Name the case, not the function: `rejects an expired token`, not `test auth`.

## Mocking

- `helpers/` has zero mocks. Test real inputs and exact outputs.
- `queries` and `api` are mocked only when a test database or sandbox is unavailable.
- Never mock the function under test. Never mock a helper that an action calls.
- A test that asserts only that a mock was called is not a test.

## Traceability

- Every acceptance criterion maps to a test block before the task closes.
- Record the exact command and exit code in the task evidence table.
- A criterion no command can reach is marked as wording-only. Never mark it verified.
- A green run is not proof of a fix when the same suite was green before the change.

## Dual mode

- Runner configured: run the declared test command for the touched files.
- Legacy repo without a runner: extract the pure logic into a helper, verify valid and breaking inputs, and report which criteria were checked statically.

## Check

`doctor` rows: `declared roots`, `test mirror`. `selftest` proves the mirror row can fail and can pass. Test quality is a review rule: no command can prove the 1:2 ratio or the absence of a mock inside a helper.
