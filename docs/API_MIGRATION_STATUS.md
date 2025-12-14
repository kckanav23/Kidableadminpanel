# OpenAPI Generated API Migration Status

This document tracks where the OpenAPI generated API client is being used and where migration is still pending.

## ✅ Fully Migrated (Using Generated API)

### Pages
- **`src/pages/Clients.tsx`** ✅
  - Uses: `api.adminClients.listClients()`
  - Status: Complete

- **`src/pages/ClientDetail.tsx`** ✅
  - Uses: `api.adminClients.getClient()`
  - Status: Complete

### Client Components (All Tabs)
- **`src/components/client/ClientProfile.tsx`** ✅
  - Uses: Receives `ClientProfileResponse` from API
  - Status: Complete

- **`src/components/client/ClientGoals.tsx`** ✅
  - Uses: `api.adminGoals.getGoals()`, `createGoal()`, `updateGoal()`, `deleteGoal()`, `api.adminGoalProgress.addProgress()`
  - Status: Complete

- **`src/components/client/ClientSessions.tsx`** ✅
  - Uses: `api.adminSessions.getSessions()`, `createSession()`, `updateSession()`
  - Status: Complete

- **`src/components/client/ClientHomework.tsx`** ✅
  - Uses: `api.adminHomework.getHomework()`, `createHomework()`, `deleteHomework()`, `logCompletion1()`
  - Status: Complete

- **`src/components/client/ClientResources.tsx`** ✅
  - Uses: `api.adminClientResources.getResources1()`, `unassign2()`
  - Status: Complete

- **`src/components/client/ClientStrategies.tsx`** ✅
  - Uses: `api.adminStrategies.getAll1()`, `unassign1()`
  - Status: Complete

- **`src/components/client/ClientTeam.tsx`** ✅
  - Uses: `api.adminClientTherapists.list4()`, `unassign()`, `api.adminClientParents.list5()`, `delete()`
  - Status: Complete

- **`src/components/client/ClientMoodJournal.tsx`** ✅
  - Uses: `api.adminClientMood.getMoodEntries1()`, `api.adminClientJournal.getJournalEntries()`
  - Status: Complete

## ❌ Pending Migration (Still Using Mock Data or Old API)

### Pages Using Mock Data
- **`src/pages/Dashboard.tsx`** ❌
  - Current: Uses `mockData` (clients, sessions, homework, goals, auditLogs, users)
  - Needs: `api.adminClients.listClients()`, `api.adminSessions.getSessions()`, `api.adminHomework.getHomework()`, `api.adminGoals.getGoals()`, `api.adminAuditLogService.*`
  - Available Services: `AdminClientsService`, `AdminSessionsService`, `AdminHomeworkService`, `AdminGoalsService`, `AdminAuditLogService`, `ClientService.getDashboard()`

- **`src/pages/Therapists.tsx`** ❌
  - Current: Uses `mockData.users`
  - Needs: `api.adminTherapists.*`
  - Available Services: `AdminTherapistsService` (list, get, create, update, delete)

- **`src/pages/Strategies.tsx`** ❌
  - Current: Uses `mockData.strategies`
  - Needs: `api.adminStrategyLibrary.*` or `api.adminStrategies.*`
  - Available Services: `AdminStrategyLibraryService`, `AdminStrategiesService`

- **`src/pages/Resources.tsx`** ❌
  - Current: Uses `mockData.resources`
  - Needs: `api.adminResourceLibrary.*`
  - Available Services: `AdminResourceLibraryService` (list, get, create, update, delete)

- **`src/pages/Parents.tsx`** ❌
  - Current: Uses `mockData.parents`
  - Needs: `api.adminParents.list6()`
  - Available Services: `AdminParentsService` (list6, get4)

- **`src/pages/AuditLogs.tsx`** ❌
  - Current: Uses `mockData.auditLogs`
  - Needs: `api.adminAuditLog.*`
  - Available Services: `AdminAuditLogService`

- **`src/pages/AccessCodes.tsx`** ❌
  - Current: Uses hardcoded mock data
  - Needs: `api.adminStaffAccessCodes.*`
  - Available Services: `AdminStaffAccessCodesService`

### Components Using Old API or Mock Data
- **`src/context/AuthContext.tsx`** ⚠️
  - Current: Uses `authApi` from `lib/api.ts` (old API)
  - Needs: `api.staffAuth.*` or `api.auth.*`
  - Available Services: `StaffAuthService`, `AuthService`
  - Note: Still uses `getAccessCode()` from old API (this is fine, it's just a utility)

- **`src/components/homework/HomeworkCompletionHistory.tsx`** ⚠️
  - Current: Imports `HomeworkResponse` from `lib/api.ts` (old type)
  - Needs: Import from `types/api` (generated types)
  - Status: Minor - just needs type import update

- **`src/components/AddClientDialog.tsx`** ⚠️
  - Current: Uses `mockData` for users and parents (for dropdowns)
  - Needs: `api.adminTherapists.*` for therapists, `api.adminParents.*` for parents
  - Status: Form submission uses API, but dropdowns use mock data

- **`src/components/layout/Sidebar.tsx`** ⚠️
  - Current: Uses `mockData.currentUser`
  - Needs: Get user from `AuthContext` (which should use API)
  - Status: Minor - depends on AuthContext migration

## 📊 Migration Summary

### Statistics
- **Fully Migrated:** 10 files (9 client components + 2 pages)
- **Pending Migration:** 8 pages
- **Partial Migration:** 4 components (need minor updates)

### Available Generated Services (Not Yet Used)

#### Admin Services
- `AdminAuditLogService` - For AuditLogs page
- `AdminTherapistsService` - For Therapists page
- `AdminParentsService` - For Parents page
- `AdminResourceLibraryService` - For Resources page
- `AdminStrategyLibraryService` - For Strategies page
- `AdminStaffAccessCodesService` - For AccessCodes page

#### Client Services
- `ClientService.getDashboard()` - For Dashboard stats

## 🔄 Migration Priority

### High Priority
1. **Dashboard.tsx** - Main landing page, needs real data
2. **AuthContext.tsx** - Core authentication, affects all pages
3. **Therapists.tsx** - Directory page, likely frequently used

### Medium Priority
4. **Parents.tsx** - Directory page
5. **Resources.tsx** - Resource library
6. **Strategies.tsx** - Strategy library
7. **AddClientDialog.tsx** - Form dropdowns need real data

### Low Priority
8. **AuditLogs.tsx** - Log viewing
9. **AccessCodes.tsx** - Access code management
10. **HomeworkCompletionHistory.tsx** - Just needs type import fix
11. **Sidebar.tsx** - Just needs to use AuthContext user

## 📝 Notes

- All client detail tabs are fully migrated ✅
- Client listing and detail pages are fully migrated ✅
- Most directory/library pages still use mock data ❌
- Authentication still uses old API (but works) ⚠️
- Type imports need cleanup in a few places ⚠️

## 🚀 Next Steps

1. Migrate `AuthContext.tsx` to use `StaffAuthService`
2. Migrate `Dashboard.tsx` to use generated API services
3. Migrate directory pages (Therapists, Parents, Resources, Strategies)
4. Update type imports in components
5. Remove mock data dependencies


