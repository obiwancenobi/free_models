# Data Model: Add Sorting Feature

**Feature**: Add Sorting Feature  
**Date**: 2025-09-20  
**Purpose**: Define data structures and validation rules for sorting functionality

## Existing Model Entity

The `Model` entity is already defined in the system with the following structure:

```typescript
interface Model {
  id: string;
  name: string;
  description?: string;
  provider: string;
  context_length: number;
  created?: number | string; // Unix timestamp or ISO string
  pricing?: {
    prompt: string;
    completion: string;
  };
}
```

**Source**: `frontend/src/services/apiService.ts`

## New Sort State Entity

```typescript
interface SortState {
  sortBy: 'created' | 'context_length';
  sortOrder: 'asc' | 'desc';
}
```

**Purpose**: Track current sorting configuration in the UI

## Validation Rules

### Model Entity Validation
- `id`: Required, string, unique identifier
- `name`: Required, string, display name
- `description`: Optional, string
- `provider`: Required, string
- `context_length`: Required, number, must be > 0
- `created`: Optional, number (Unix timestamp) or string (ISO date)
- `pricing`: Optional, object with prompt/completion pricing

### Sort State Validation
- `sortBy`: Must be either 'created' or 'context_length'
- `sortOrder`: Must be either 'asc' or 'desc'

## Data Relationships

### Model Collection
- Models are fetched from `/api/models` endpoint
- Stored as array in frontend state
- Sorted client-side based on SortState

### Sort Logic Relationships
- Sort functions operate on Model array
- Missing `created` dates treated as Unix timestamp 0 (1970-01-01)
- Missing `context_length` treated as 0
- Sort preserves original array order for equal values

## State Transitions

### Sort State Transitions
```
Initial: { sortBy: 'created', sortOrder: 'desc' } (newest first)

User clicks date sort button:
- If sortBy === 'created': toggle sortOrder
- If sortBy !== 'created': set sortBy = 'created', sortOrder = 'desc'

User clicks context sort button:
- If sortBy === 'context_length': toggle sortOrder
- If sortBy !== 'context_length': set sortBy = 'context_length', sortOrder = 'desc'
```

## Data Flow

1. **Fetch**: Models loaded from API
2. **Filter**: Search term applied (existing functionality)
3. **Sort**: SortState applied to filtered results
4. **Render**: Sorted models displayed in ModelList

## Edge Cases

### Missing Data Handling
- Models without `created`: Sorted as oldest (Unix 0)
- Models without `context_length`: Sorted as lowest (0)
- Empty model array: No sorting applied
- Single model: No sorting needed

### Type Handling
- `created` as number: Direct comparison
- `created` as string: Convert to Date for comparison
- `context_length` as number: Direct comparison

## Performance Considerations

- Sort operation: O(n log n) for n models
- Re-sort on state change: Triggered by user interaction
- Memory: No additional storage beyond SortState
- Optimization: Use `useMemo` to prevent unnecessary re-sorts

## Testing Data

### Sample Models for Testing
```javascript
const testModels = [
  { id: '1', name: 'GPT-4', context_length: 8192, created: 1678900000 },
  { id: '2', name: 'Claude', context_length: 100000, created: 1680000000 },
  { id: '3', name: 'Old Model', context_length: 4096, created: undefined },
  { id: '4', name: 'New Model', context_length: 0, created: 1690000000 }
];
```

### Expected Sort Results
- By created desc: [4, 2, 1, 3]
- By created asc: [3, 1, 2, 4]
- By context desc: [2, 1, 3, 4]
- By context asc: [4, 3, 1, 2]