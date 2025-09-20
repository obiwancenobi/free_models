export interface SortState {
  sortBy: 'created' | 'context_length';
  sortOrder: 'asc' | 'desc';
}

export type SortBy = SortState['sortBy'];
export type SortOrder = SortState['sortOrder'];