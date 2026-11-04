# Rule file example — security and data isolation

Not installed. Copy this to `.agent-kit/rules/security.md` when the repo handles accounts, secrets,
payments or private user data.

1. **Secrets stay out of every surface.** No secret, token, key or password hash in a constant, a
   runtime setting, an API response, SSR HTML, a log line or an OpenTelemetry span.
2. **Every mutation checks ownership.** A query that changes a resource verifies `userId` or
   `accountId` first. There is no "admin sees all" path unless the owner asked for one.
3. **Cache keys are user-scoped.** Prefix a user-specific key with the account id, and send
   `Cache-Control: private` or `no-store` on an authenticated response.
4. **Critical creates are idempotent.** Payments, charges and create endpoints that a retry can
   repeat require an idempotency key.
5. **Validate at the trust boundary.** Parse input once, reject unknown fields, and pass only the
   validated shape inward.
6. **Least privilege by default.** A token, database role or worker gets the narrowest scope that
   does the job.

The general errors and logging rules live in `.agent-kit/rules/errors.md`; this file does not
repeat them.
