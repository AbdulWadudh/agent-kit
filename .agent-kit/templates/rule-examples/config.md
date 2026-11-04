# Rule file example — configuration and environment

Not installed. Copy this to `.agent-kit/rules/config.md` when the repo has tunables beyond a few
constants.

1. **Every tunable is declared once, in one tier.** A constant is a domain invariant in a plain
   module. Environment is infrastructure, endpoints and secrets: validated at startup, fail loud,
   immutable for the process. A runtime setting is anything an operator may tune: in the database,
   changed through an admin API, no restart.
2. **Group by concern, not by case:** `image.width`, `api.prefix`, in all three tiers.
3. **A value earns a name when it crosses a file boundary or would be written twice.** A literal
   used once in the module that owns it stays inline.
4. **A default lives with its schema, once.** Never a second `??` or `||` fallback at a call site.
5. **Read the environment in one module.** `process.env` or `Bun.env` outside the env module is a
   bug; callers import the validated value.
6. **The client-safe config entry is the only barrel.** It re-exports pure constants only. The env
   module and server paths are never re-exported into a client or shared bundle.
7. **Pass settings in as parameters** so helpers stay pure and testable.
8. **A change reaches every process:** publish an invalidation, do not wait for per-process caches
   to expire.
9. **Secrets stay in environment.** Never a runtime setting, never in an API response, HTML, log or
   span.
