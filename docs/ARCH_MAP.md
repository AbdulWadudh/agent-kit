# Module Responsibility Map

One row per directory that exists. Delete the rows that do not apply; an invented layer is
worse than a missing one.

| Path | Responsibility | Pure or side-effect | Import rules |
|---|---|---|---|
| <!-- FILL:arch-row --> | | | |

## Boundaries

- **Pure** modules take values and return values. No I/O, no clock, no randomness, no network.
- **Side-effect** modules own one kind of I/O. A module that owns two kinds is two modules.
- A boundary that is not written here does not exist; do not invent a layer while editing.

## What a row means

```
| src/core/  | domain rules, no I/O            | pure              | may import utils only |
| src/db/    | schema and queries              | side-effect (I/O) | imported by api, never the reverse |
| src/api/   | HTTP or event handlers          | side-effect (I/O) | imports core and db |
```

This block is an illustration, not this repo's layout. The table above is the truth.
