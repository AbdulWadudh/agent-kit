# API and Type Skeleton

Signatures only. Bodies belong in the source, not here. This page exists so an agent can
learn the exported shape without reading three files to find one function.

Add a line when you add or change an export. Delete a line when the export goes away.

## Shape

```
// src/utils/validation.ts
export function validateEmail(email: string): boolean;

// src/core/types.ts
export interface Session {
  userId: string;
  roles: string[];
}
```

That block shows the format. The sections below are this repo's real surface.

## Exports

<!-- FILL:exports — one fenced block per module group, real signatures only. -->

## Types shared across boundaries

<!-- FILL:shared-types — the types that appear in more than one module's signature. -->

## Removed

Nothing yet. When a public export is removed, note it here for one release, then delete the
note.
