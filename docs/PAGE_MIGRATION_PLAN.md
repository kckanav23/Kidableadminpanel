# Page Migration Plan - Mock Data to OpenAPI Generated API

This document outlines the step-by-step plan for migrating all pages currently using mock data to the OpenAPI generated API client.

## ✅ Completed Component Fixes

1. **AuthContext.tsx** ✅ - Migrated to use `StaffAuthService`
2. **AddClientDialog.tsx** ✅ - Now fetches therapists and parents from API
3. **HomeworkCompletionHistory.tsx** ✅ - Fixed type imports
4. **Sidebar.tsx** ✅ - Now uses `AuthContext` user instead of mock data

## ✅ Completed Page Migrations

1. **Dashboard.tsx** ✅ - Already fully migrated to use API
2. **Therapists.tsx** ✅ - Migrated to use `api.adminTherapists.list()` with search support and integrated access code management
3. **Parents.tsx** ✅ - Migrated to use `api.adminParents.list6()` with search support
4. **Resources.tsx** ✅ - Migrated to use `api.adminResourceLibrary.list3()` with search and type filtering
5. **Strategies.tsx** ✅ - Migrated to use `api.adminStrategyLibrary.list1()` with search and type filtering
6. **AuditLogs.tsx** ✅ - Migrated to use `api.adminAuditLog.list7()` with resource type filtering

## 📋 Pages Requiring Migration

### 1. Dashboard.tsx ✅
**Current State:** Uses mock data for all statistics and lists
**Priority:** 🔴 High (Main landing page)

**Mock Data Used:**
- `clients` - Client list
- `sessions` - Today's sessions, recent sessions
- `homework` - Pending/completed homework
- `goals` - Active goals and progress
- `auditLogs` - Recent activity
- `users` - For client assignments

**API Services Available:**
- `api.adminClients.listClients()` - For client list
- `api.adminSessions.getSessions()` - For sessions
- `api.adminHomework.getHomework()` - For homework
- `api.adminGoals.getGoals()` - For goals
- `api.adminAuditLog.*` - For audit logs
- `api.client.getDashboard()` - **May provide aggregated stats** (check if available)

**Migration Steps:**
1. Replace `clients` mock with `api.adminClients.listClients({ size: 10 })`
2. Replace `sessions` mock with `api.adminSessions.getSessions({ limit: 10 })` filtered by today
3. Replace `homework` mock with `api.adminHomework.getHomework({ active: true })`
4. Replace `goals` mock with `api.adminGoals.getGoals({ status: 'active' })`
5. Replace `auditLogs` mock with `api.adminAuditLog.*` (check available methods)
6. Add loading states for each data fetch
7. Add error handling with toast notifications
8. Consider using `api.client.getDashboard()` if it provides aggregated stats

**Estimated Time:** 2-3 hours

---

### 2. Therapists.tsx ✅ COMPLETED
**Status:** ✅ Fully migrated
- Replaced mock data with `api.adminTherapists.list()`
- Implemented search with debouncing using `q` parameter
- Added loading state and error handling
- Uses `useAuth()` for admin check
- Maps API response fields correctly (fullName, specialization, etc.)

---

### 3. Strategies.tsx ✅
**Current State:** Migrated to API
**Priority:** ✅ Completed

---

### 4. Resources.tsx ✅
**Current State:** Migrated to API
**Priority:** ✅ Completed

---

### 5. Parents.tsx ✅
**Current State:** Migrated to API
**Priority:** ✅ Completed

**Mock Data Used:**
- `parents` - Parent list
- `clients` - For showing associated clients

**API Services Available:**
- `api.adminParents.list6()` - List/search parents
- `api.adminParents.get4()` - Get parent details

**Migration Steps:**
1. Replace `parents` mock with `api.adminParents.list6()`
2. Implement search using `q` parameter: `api.adminParents.list6({ q: searchQuery })`
3. Add pagination if needed
4. Add loading state
5. Add error handling
6. For associated clients, may need to fetch separately or check if parent response includes client info

**Estimated Time:** 1-2 hours

---

### 6. AuditLogs.tsx ✅
**Current State:** Migrated to API
**Priority:** ✅ Completed

**Mock Data Used:**
- `auditLogs` - Audit log entries

**API Services Available:**
- `api.adminAuditLog.*` - Check available methods in `AdminAuditLogService`

**Migration Steps:**
1. Check `AdminAuditLogService` for available methods
2. Replace `auditLogs` mock with appropriate API call
3. Implement search/filter functionality
4. Add pagination (audit logs are typically paginated)
5. Add loading state
6. Add error handling
7. Implement date range filtering if supported

**Estimated Time:** 1-2 hours

---

### 7. AccessCodes.tsx ✅ MERGED
**Status:** ✅ Merged into Therapists.tsx
- Access code management is now integrated into the Therapists page
- Users can view, create, and revoke access codes for each therapist
- All functionality migrated to use `api.adminStaffAccessCodes.*` API

---

## 🔧 Common Migration Patterns

### Pattern 1: Simple List Replacement
```typescript
// Before
const items = mockData.items;

// After
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchItems = async () => {
    try {
      const api = getApiClient();
      const response = await api.adminService.list();
      setItems(response.items || []);
    } catch (error) {
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };
  fetchItems();
}, []);
```

### Pattern 2: Search Implementation
```typescript
const [searchQuery, setSearchQuery] = useState('');

useEffect(() => {
  const fetchItems = async () => {
    const api = getApiClient();
    const response = await api.adminService.list({ 
      q: searchQuery || undefined,
      size: 100 
    });
    setItems(response.items || []);
  };
  fetchItems();
}, [searchQuery]);
```

### Pattern 3: Pagination
```typescript
const [page, setPage] = useState(0);
const [totalPages, setTotalPages] = useState(0);

useEffect(() => {
  const fetchItems = async () => {
    const api = getApiClient();
    const response = await api.adminService.list({ 
      page,
      size: 20 
    });
    setItems(response.items || []);
    setTotalPages(response.totalPages || 0);
  };
  fetchItems();
}, [page]);
```

## 📝 Migration Checklist Template

For each page migration:

- [ ] Identify all mock data dependencies
- [ ] Find corresponding API services
- [ ] Replace mock data with API calls
- [ ] Add loading states
- [ ] Add error handling with toast notifications
- [ ] Update search/filter functionality to use API parameters
- [ ] Add pagination if needed
- [ ] Test all functionality
- [ ] Remove unused mock data imports
- [ ] Update types to use generated API types

## 🎯 Recommended Migration Order

1. **Dashboard.tsx** ✅ (High priority, main page) - COMPLETED
2. **Therapists.tsx** ✅ (Medium priority, frequently used) - COMPLETED (includes Access Codes)
3. **Parents.tsx** ✅ (Medium priority, frequently used) - COMPLETED
4. **Resources.tsx** (Medium priority, library page)
5. **Strategies.tsx** (Medium priority, library page)
6. **AuditLogs.tsx** (Low priority, log viewing)

## ⚠️ Important Notes

1. **Type Safety:** Always use types from `types/api` instead of local types
2. **Error Handling:** Use `handleApiError` from `api-client.ts` for consistent error handling
3. **Loading States:** Always show loading indicators during API calls
4. **Pagination:** Check if API responses include pagination info (`total`, `page`, `totalPages`)
5. **Search:** Most list endpoints support `q` parameter for search
6. **Filtering:** Check API documentation for available filter parameters
7. **Testing:** Test each page after migration to ensure functionality works

## 🔍 API Service Reference

All services are available via `getApiClient()`:
- `api.adminClients.*`
- `api.adminTherapists.*`
- `api.adminParents.*`
- `api.adminResourceLibrary.*`
- `api.adminStrategyLibrary.*`
- `api.adminAuditLog.*`
- `api.adminStaffAccessCodes.*`
- `api.adminSessions.*`
- `api.adminHomework.*`
- `api.adminGoals.*`

Check `src/lib/generated/services/` for full method signatures.


