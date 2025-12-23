## Goal
Make `src/pages/*` thin route wrappers and move real functionality into `src/features/*` modules (same style as `features/clients`, `features/strategyLibrary`, `features/resourceLibrary`).

This keeps API churn localized, improves testability, and enforces consistent caching + UI patterns.

## Target end-state
- **Pages are wrappers** (ideally < 10 LOC):
  - `src/pages/X.tsx` -> `return <XPage />`
- **Feature owns implementation**:
  - `src/features/<feature>/...`

## Feature module structure (recommended)
```
src/features/<feature>/
  index.ts
  <Feature>Page.tsx
  hooks/
    <feature>Keys.ts
    use<Feature>List.ts
    use<Feature>.ts            # detail hook (optional)
    useCreate<Feature>.ts
    useUpdate<Feature>.ts
    useDelete<Feature>.ts
  components/
    <Feature>Filters.tsx
    <Feature>FormDialog.tsx
    <Feature>ViewDialog.tsx
    ...
  utils/
    mappers.ts                 # form <-> DTO conversions
    formatters.ts              # date/number formatting (optional)
  types.ts                     # UI form state types (optional)
```

## Best practices / guidelines

### Page responsibilities
- **Do**:
  - Render the feature entry component
  - Provide route params (e.g. `clientId`) via props
- **Don’t**:
  - Call `getApiClient()` directly
  - `useEffect` to fetch server data
  - Hold server state in local `useState`

### Data fetching (React Query)
- **Use `useQuery` for server state**:
  - Treat `query.data` as the source of truth
  - Use `isLoading || isFetching` for loading UX
  - Prefer `keepPreviousData` when filters/pagination change
- **Use `useMutation` for writes**:
  - On success: `invalidateQueries` using feature keys (not `refetch()` everywhere)
  - Keep user-facing toasts inside the mutation hook for consistency

### Query keys
- One key namespace per backend concept:
  - Example: Strategy library uses `strategyLibraryKeys`, not duplicated keys scattered across features.
- Keys should be:
  - **Stable**: `list(params)` where `params` is a small plain object
  - **Scoped**: include filter params (e.g. `scope`, `page`, `q`, `type`)
- If two UIs hit the same endpoint and should share cache, **reuse the same keys**.

### DTO mapping
- Keep form state separate from DTOs:
  - UI uses simple unions/strings (`'antecedent' | ...`)
  - `utils/mappers.ts` converts to generated enums/DTO shapes
- Don’t spread enum conversion logic throughout components.

### Small components
- Extract:
  - Filters (search/type selectors)
  - Dialogs (create/edit/view)
  - Tables/cards/list rows
- Feature page composes these pieces.

### Minimal blast radius refactor checklist
For a given page `X.tsx`:
1. Move the current page implementation into `features/x/XPage.tsx` (no behavior changes).
2. Extract hooks/keys from that page into `features/x/hooks/*`.
3. Extract dialogs/filters into `features/x/components/*`.
4. Replace `src/pages/X.tsx` with a thin wrapper.
5. `npm run build` after each major step.

## Notes for this repo
- Generated API types live in `src/lib/generated` and are re-exported from `src/types/api.ts`.
- Prefer importing DTOs from `@/types/api` in app code.
- Prefer shared-cache hooks for library endpoints (we already unified resource/strategy library caches).


