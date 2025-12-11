# Clients API Integration

## Overview

The Clients page now fetches data from the KidAble backend API with full support for filtering, searching, and pagination.

## Features Implemented

### 1. **API Integration**
- ✅ Fetches clients from `GET /admin/clients`
- ✅ Includes `X-Staff-Access-Code` header automatically
- ✅ Falls back to mock data on API errors
- ✅ TypeScript interfaces matching API schema

### 2. **Filtering**
- **My Clients / All Clients**: Uses `mine=true/false` parameter
  - Therapists see "My Clients" by default
  - Admins see all clients by default
- **Status Filter**: active, inactive, suspended
- **Search**: Real-time search by client name (debounced 500ms)

### 3. **Pagination**
- Page size: 20 clients per page
- 0-indexed pagination (API standard)
- Previous/Next navigation buttons
- Shows current page, total pages, and total count
- Pagination controls only show when multiple pages exist

### 4. **User Experience**
- **Loading State**: Spinner with message during API calls
- **Empty State**: Clear message when no clients found
- **Error Handling**: Toast notifications on errors, falls back to mock data
- **Debounced Search**: Waits 500ms before triggering API call
- **Auto-Reset**: Page resets to 1 when filters or search changes

## API Endpoint

```typescript
GET /admin/clients

Query Parameters:
- status?: string (active, inactive, suspended)
- q?: string (search query, max 100 chars)
- therapy?: string (ABA, Speech, OT)
- page?: number (0-indexed, default: 0)
- size?: number (default: 20, max: 100, min: 1)
- mine?: boolean (default: false)

Response:
{
  items: ClientSummaryResponse[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}
```

## Client Summary Response

```typescript
interface ClientSummaryResponse {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  status: 'active' | 'inactive' | 'suspended';
  therapies: ('ABA' | 'Speech' | 'OT')[];
  photoUrl?: string;
}
```

## Code Structure

### API Service (`/lib/api.ts`)

```typescript
export const clientsApi = {
  async listClients(params?: ListClientsParams): Promise<PageResponseClientSummaryResponse> {
    // Builds query string from parameters
    // Includes auth header automatically via getHeaders()
    // Returns paginated response
  }
};
```

### Clients Page (`/pages/Clients.tsx`)

**State Management:**
- `searchQuery`: Immediate user input
- `debouncedSearchQuery`: Debounced search (500ms delay)
- `statusFilter`: Selected status filter
- `viewMode`: 'my' or 'all' clients
- `currentPage`: Current page number (0-indexed)
- `apiClients`: Data from API
- `loading`: Loading state
- `total`, `totalPages`: Pagination metadata

**Effects:**
1. **Debounce Effect**: Delays search API calls
2. **Fetch Effect**: Triggers API call on filter/page changes

**Rendering:**
- Shows API data if available
- Falls back to mock data on errors
- Separate rendering logic for API vs mock data (different field names)

## Usage Examples

### Filter by Status
```typescript
// User selects "active" from dropdown
handleFilterChange('status', 'active')
// → API call with status=active
// → Page resets to 0
```

### Search Clients
```typescript
// User types "John"
setSearchQuery('John')
// → Wait 500ms
// → API call with q=John
// → Page resets to 0
```

### Toggle View Mode
```typescript
// Therapist clicks "All Clients"
handleFilterChange('viewMode', 'all')
// → API call with mine=false
// → Page resets to 0
```

### Navigate Pages
```typescript
// User clicks "Next"
handlePageChange(currentPage + 1)
// → API call with page=1
// → Shows page 2 of results
```

## Error Handling

1. **Network Errors**: Shows toast, falls back to mock data
2. **401/403 Errors**: Automatically logs user out (handled in api.ts)
3. **Empty Results**: Shows friendly message with "Clear Filters" button

## Performance Optimizations

1. **Debounced Search**: Reduces API calls during typing
2. **Page Reset**: Smart reset on filter changes
3. **Conditional Rendering**: Only shows pagination when needed
4. **Loading States**: Prevents multiple simultaneous requests

## Future Enhancements

- [ ] Therapy type filter dropdown
- [ ] Sort options (name, age, date added)
- [ ] Bulk actions (export, assign therapist)
- [ ] Client quick actions (edit, archive)
- [ ] Advanced search (age range, date range)
- [ ] Saved filter presets
