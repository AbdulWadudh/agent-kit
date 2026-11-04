# Rule file example — logging

Not installed. Copy this to `.agent-kit/rules/logging.md` when the repo has a service or a shared
logger. The error-handling policy is `.agent-kit/rules/errors.md`.

1. **One structured logger.** No raw `console.log` in application code; a single wrapper emits JSON
   or the logger the repo already uses.
2. **A leaf does not log.** Queries, API clients and helpers throw with context; the orchestrator
   logs once.
3. **Failure fields:** `{ event, action, userId, entityId, durationMs, errorCode, err }`.
4. **Fallback or retry fields:** `{ event, action, attempt, reason }`.
5. **Critical success fields:** `{ event, entityId, durationMs }` for a major mutation or job.
6. **Redact.** Passwords, tokens, API keys, raw payment details and personal data never reach a log
   or a span.
7. **One line per event.** No multi-line dumps of a payload; attach the id that finds the record.
