# 🚫 Anti-Patterns & Hallucination Guardrails

1. **NO Default Exports**: Use explicit named exports.
2. **NO Non-Existent Imports**: Check `docs/ARCH_MAP.md` or `docs/API_SKELETON.md` before importing.
3. **NO Direct DB Access in API Handlers**: Pass through query abstraction files.
4. **NO Raw Scratchpad Leftovers**: Compress active task file before archiving.
