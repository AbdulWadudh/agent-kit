# Codebase Knowledge Hub

Read this before searching the tree. It is the map, not the territory: when it disagrees
with the code, the code wins and this file is the bug.

## Navigation protocol

1. **Where does the logic live?** `ARCH_MAP.md` first. Not a recursive file listing.
2. **What is the signature?** `API_SKELETON.md` gives the exported shape without the body.
3. **How does it start?** `ENTRY_POINTS.md` gives the boot and request flow.
4. Read at most three source files at a time. If you need more, the map is thin — fix the map.

## Pages

| Page | Content |
|---|---|
| [ARCH_MAP.md](ARCH_MAP.md) | directory boundaries, responsibilities, pure vs side-effect, import rules |
| [API_SKELETON.md](API_SKELETON.md) | exported types and function signatures |
| [ENTRY_POINTS.md](ENTRY_POINTS.md) | boot sequence and request or event flow |

<!-- FILL:extra-pages — add a row per domain that earns one (payments, auth, jobs, ...).
     A page nobody reads is a page that will drift. -->

## Keeping this true

- A change that moves a boundary updates `ARCH_MAP.md` in the same task.
- A change to an exported signature updates `API_SKELETON.md` in the same task.
- `agent-kit doctor` fails when a page here points at a file that does not exist, and when a
  path named in these docs is not real. That is the only maintenance this map gets for free.
