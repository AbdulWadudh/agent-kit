# Rule file example — TypeScript and code style

Not installed. Copy this to `.agents/rules/typescript.md` when the repo is TypeScript, then
replace the rules with the ones that are true here. A rule you cannot check by reading a
diff does not belong in the file.

1. **No `any`.** Use a real type, a generic, or `unknown` plus a narrowing step. A cast that
   silences the compiler is a rule violation, not a fix.
2. **Named exports.** Default exports make a symbol hard to find and easy to rename badly.
3. **Handle `null` and `undefined` explicitly.** No non-null assertion to make an error go away.
4. **Every import resolves.** Verify the path in `docs/ARCH_MAP.md` before importing it. An
   import that does not exist is a hallucination, not a typo.
5. **No dead scaffolding.** Do not add a module, type or option "for later". Add it when it is used.
