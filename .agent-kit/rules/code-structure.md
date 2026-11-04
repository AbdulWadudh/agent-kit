# Code Structure & Splitting

**Why** — a file that outgrows its job is read by every later session and edited by none. Structure is a gate here, not a preference.

**Load it when** — you create, move, rename or split a file, or a `doctor` row names `source cap`, `folder density` or `feature barrels`.

## Caps

- 250 lines is the target; 300 is the hard ceiling. A file at 251 warns; a file past 300 fails `doctor`.
- Test files are exempt from proactive splitting. A suite stays one file until it becomes hard to navigate; then split by scenario, never to hit a line count.
- Generated and vendored paths listed under `Never edit (generated)` in `project.md` are exempt. `.agent-kit/` machinery has its own 300-line ceiling.
- Split by responsibility: helpers, queries, api, actions, components, hooks, types. Never one file per function.
- Past the cap, the file becomes a folder with files by area, or moves one concern into an existing `helpers/`, `queries/` or `api/`.
- 8 files in one folder is the ceiling. A ninth file splits the folder into narrower subdomains.
- The check reads `Source roots` in `project.md`; a folder outside those roots is not judged.

## Barrels

- A feature folder has no `index` that only re-exports. Import the module by path.
- A package's own entry at the source root may re-export its public surface.
- `config/index` is the one exception: it exports the client-safe configuration surface.

## Feature layout

- `<feature>.controller` parses input and calls actions.
- `<feature>.types` holds types, interfaces, schemas and DTOs.
- `queries/` holds database reads and writes; `api/` holds third-party calls.
- `actions/` orchestrates queries, api and helpers; it holds the workflow.
- `components/` is presentation; `hooks/` is state and effects; `helpers/` is pure logic.
- A single file becomes a folder when it crosses the cap, never before.

## Naming

- Directories are kebab-case. Logic files are kebab-case with a role suffix. UI components are PascalCase.
- Functions are verb-first: `createInvoiceAction`, `getInvoiceById`, `calculateTaxAndTotals`. No noun-only names, no `handleData`, `processInfo` or `doWork`.
- Booleans start with `is`, `has`, `can` or `should`.
- Collections are plural nouns. Numbers carry their unit: `timeoutMs`, `amountCents`, `cacheTtlSeconds`.
- Constants are UPPER_SNAKE_CASE; types are PascalCase with no `I` prefix; database columns are snake_case.
- No `data`, `res`, `val`, `temp`, `obj`, `info` or `flag` as a variable name.

## Dependencies

- Flow is one way: controller to actions to queries/api/helpers to types to shared to config.
- `queries`, `api` and `helpers` are leaves: never actions, components or hooks; never each other.
- An action never imports another action. Shared logic moves to `helpers/`.
- A child component never imports its parent. Code used by two features moves to `shared/`, never copied.

## Split protocol

1. Extract pure logic into `helpers/`.
2. Extract database work into `queries/` and external calls into `api/`.
3. Keep step-by-step orchestration in `actions/`.
4. For UI, move formatting into `helpers/`, state into `hooks/`, and sections into `components/`.
5. Run the compiler or type checker, then fix only the reported `file:line`.

## Check

`doctor` rows: `declared roots`, `source cap`, `folder density`, `feature barrels`. `selftest` proves each row can fail and can pass.
