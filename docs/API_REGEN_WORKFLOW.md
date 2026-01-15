# OpenAPI Regeneration Workflow (Systematic Mapping)

This project uses `openapi-typescript-codegen` to generate `src/lib/generated` from the backend OpenAPI spec (default: `/v3/api-docs`).

The goal of this workflow is to make API changes **visible and reviewable** (diff), and to make code updates **mechanical** (TypeScript compile errors point to every required fix).

## Principles (what makes this systematic)

- **Snapshot the spec**: diffing two JSON specs is the most reliable way to understand what changed.
- **Diff before you regenerate**: you want a clear “API surface change list” before touching app code.
- **Regenerate on a branch**: isolate the blast radius and keep PRs reviewable.
- **Use TypeScript as the checklist**: after regen, run a typecheck/build and fix errors top-to-bottom.
- **Minimize churn exposure**: prefer importing through a small API surface (e.g. `src/lib/api/client.ts`) rather than scattering direct imports from `src/lib/generated`.

## Recommended flow (day-to-day)

### 1) Snapshot the *current* spec (before backend change / before regen)

```bash
npm run api:snapshot -- --out openapi/openapi.before.json
```

### 2) Update backend `/v3/api-docs` (or switch to the new backend)

No action in this repo yet.

### 3) Snapshot the *new* spec

```bash
npm run api:snapshot -- --out openapi/openapi.after.json
```

### 4) Diff the specs (high-level change map)

In this repo, use the built-in diff command (works with OpenAPI 3.1 and doesn’t depend on external CLIs):

```bash
npm run api:diff
```

It reports:
- Added/removed operations (METHOD + path)
- Changed operation “signatures” (operationId/params/request/response)
- Added/removed/changed component schemas

Focus first on:
- Removed/renamed paths
- Method changes (GET → POST, etc.)
- Request/response schema changes
- Required/optional field changes
- Enum value changes

### 5) Regenerate the client/types

```bash
npm run generate:api
```

### 6) Fix app code using compiler errors as your checklist

After regen, do a typecheck/build and fix errors iteratively:

```bash
npx tsc -p tsconfig.json --noEmit
```

If you don’t currently use `tsc` day-to-day, you can also run:

```bash
npm run build
```

(Note: Vite builds don’t always catch all type errors depending on setup, so `tsc --noEmit` is the most systematic.)

### 7) Optional: Diff the generated output

This is useful when you want to see exactly what the generator changed:

```bash
git diff -- src/lib/generated
```

## Keeping changes easy to map (recommended conventions)

### Prefer a stable import surface

Try to import generated things through `src/lib/api/client.ts` (or a thin wrapper) rather than importing from `src/lib/generated` everywhere. This reduces the number of files that change when the generator output changes.

### Add mapping/adapters when UI shouldn’t churn

If the backend spec changes frequently, consider a small “domain” layer:

- `src/types/domain/*` (stable shapes the UI expects)
- `src/lib/api/mappers/*` (map generated DTOs → domain types)

Then most changes are localized to mapping functions when DTOs evolve.


