# Backend Enum Value Issues

## Problem Summary

The backend is throwing errors when trying to deserialize enum values from the database that don't match the enum definitions in the Java code.

## Errors

### 1. PromptType Enum Issue
**Error:** `No enum constant in.kidable.common.model.PromptType.visual`

**Location:** Session activities endpoint (`GET /admin/clients/{clientId}/sessions`)

**Root Cause:** 
- Database contains value `"visual"` (lowercase)
- Backend enum expects: `FULL_PHYSICAL`, `PARTIAL_PHYSICAL`, `VERBAL`, `TEXTUAL`, `GESTURAL`, `INDEPENDENT`
- The value `"visual"` is not in the enum definition

**Valid API Enum Values:**
- `full_physical`
- `partial_physical`
- `verbal`
- `textual`
- `gestural`
- `independent`

### 2. HomeworkStatus Enum Issue
**Error:** `No enum constant in.kidable.common.model.HomeworkStatus.in_progress`

**Location:** Homework endpoint (`GET /admin/clients/{clientId}/homework`)

**Root Cause:**
- Database contains value `"in_progress"` (lowercase with underscore)
- Backend enum expects: `WORKED`, `NOT_WORKED`, `YET_TO_TRY`, `NOT_STARTED`
- The value `"in_progress"` is not in the enum definition

**Valid API Enum Values:**
- `worked`
- `not_worked`
- `yet_to_try`
- `not_started`

## Impact

- **GET requests fail** when trying to fetch sessions or homework with invalid enum values
- This is a **backend/database issue**, not a frontend issue
- The frontend is just trying to read data that the backend can't deserialize

## Frontend Fixes Applied

1. **SessionForm.tsx:**
   - Updated prompt type options to only use valid API enum values
   - Removed invalid options ("Visual", "Modeling")
   - Changed to use API enum values (`full_physical`, `partial_physical`, etc.) instead of display names

2. **ClientSessions.tsx:**
   - Added `normalizePromptType()` helper to map invalid values when editing
   - Added error handling to gracefully display invalid prompt types

## Required Backend/Database Fixes

### Option 1: Update Database (Recommended)
Run a migration script to update invalid enum values:

```sql
-- Fix PromptType values
UPDATE session_activity 
SET prompt_type = 'textual' 
WHERE prompt_type = 'visual';

UPDATE session_activity 
SET prompt_type = 'verbal' 
WHERE prompt_type = 'modeling';

-- Fix HomeworkStatus values
UPDATE homework 
SET status = 'yet_to_try' 
WHERE status = 'in_progress';
```

### Option 2: Update Backend Enum Definitions
Add the missing enum values to the Java enums (if they should be supported):

```java
// PromptType.java
public enum PromptType {
    FULL_PHYSICAL,
    PARTIAL_PHYSICAL,
    VERBAL,
    TEXTUAL,
    GESTURAL,
    INDEPENDENT,
    VISUAL,  // Add if needed
    MODELING  // Add if needed
}

// HomeworkStatus.java
public enum HomeworkStatus {
    WORKED,
    NOT_WORKED,
    YET_TO_TRY,
    NOT_STARTED,
    IN_PROGRESS  // Add if needed
}
```

### Option 3: Add Enum Deserialization Handler
Add a custom deserializer in the backend to handle legacy/invalid values gracefully.

## Recommendation

**Option 1 (Database Migration)** is recommended because:
- Keeps enum definitions clean
- Ensures data consistency
- Prevents future issues
- The frontend has been updated to only use valid values going forward

## Testing

After backend fixes:
1. Verify sessions with invalid prompt types can be fetched
2. Verify homework with invalid status can be fetched
3. Test creating new sessions/homework with valid enum values
4. Test editing existing sessions/homework


