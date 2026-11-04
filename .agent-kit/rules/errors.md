# Errors & Logging

**Why** — an error swallowed at the bottom is a failure nobody can find; a log emitted at every
layer is the same failure with noise. One throw with context, one log at the boundary.

**Load it when** — handling an error, adding a log, or a failure crosses a module boundary.

## Errors

- Never swallow: no empty `catch`, no `return null`/`false` that hides a failure.
- A leaf worker (`queries`, `api`, `helpers`) throws with context and does not log. Use
  `new Error("what failed", { cause })` or the repo's typed error.
- The orchestrator or boundary catches once, logs once, and returns a clean client-safe result.
- Fail loud at startup, gracefully at runtime. A missing config value stops the process; a failed
  request returns an error response.

## Logging

- One structured logger. No raw `console.log` in application code.
- Failure: `{ event, action, userId, entityId, durationMs, errorCode, err }`.
- Fallback or retry: `{ event, action, attempt, reason }`.
- Critical success: `{ event, entityId, durationMs }` for a major mutation or job.
- One line per event, with the id that finds the record.

## Redaction

Never log passwords, tokens, API keys, raw payment details or personal data. A secret in a log is a
leak with a retention policy.

## Check

The repo's logger and error type live in `project.md` or `docs/ARCH_MAP.md`; this rule names the
shape, not a library. `doctor` cannot prove a log is redacted; the diff review does.
