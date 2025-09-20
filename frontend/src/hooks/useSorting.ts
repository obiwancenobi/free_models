import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { SortState, SortBy, SortOrder } from '../types/sorting';
import { Model } from '../services/apiService';

export const useSorting = (models: Model[], searchTerm: string) => {
  const [sortState, setSortState] = useState<SortState>({
    sortBy: 'created',
    sortOrder: 'desc'
  });

  // Configure Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(models, {
      keys: ['name', 'description', 'provider'],
      threshold: 0.3,
      includeScore: true
    });
  }, [models]);

  // Filter models based on search term
  const filteredModels = useMemo(() => {
    if (!searchTerm.trim()) {
      return models;
    }

    const results = fuse.search(searchTerm);
    return results.map(result => result.item);
  }, [models, searchTerm, fuse]);

  // Sort function for created date
  const sortByCreated = (a: Model, b: Model, order: SortOrder): number => {
    const aDate = a.created ? new Date(typeof a.created === 'number' ? a.created * 1000 : a.created).getTime() : 0;
    const bDate = b.created ? new Date(typeof b.created === 'number' ? b.created * 1000 : b.created).getTime() : 0;

    if (order === 'asc') {
      return aDate - bDate;
    } else {
      return bDate - aDate;
    }
  };

  // Sort function for context length
  const sortByContext = (a: Model, b: Model, order: SortOrder): number => {
    const aContext = a.context_length || 0;
    const bContext = b.context_length || 0;

    if (order === 'asc') {
      return aContext - bContext;
    } else {
      return bContext - aContext;
    }
  };

  // Main sort function
  const sortModels = (modelsToSort: Model[]): Model[] => {
    return [...modelsToSort].sort((a, b) => {
      if (sortState.sortBy === 'created') {
        return sortByCreated(a, b, sortState.sortOrder);
      } else {
        return sortByContext(a, b, sortState.sortOrder);
      }
    });
  };

  // Sorted and filtered models (memoized for performance)
  const sortedModels = useMemo(() => {
    return sortModels(filteredModels);
  }, [filteredModels, sortState]);

  // Toggle sort order for current sort type
  const toggleSortOrder = () => {
    setSortState(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Set sort by created date
  const sortByDate = () => {
    if (sortState.sortBy === 'created') {
      toggleSortOrder();
    } else {
      setSortState({ sortBy: 'created', sortOrder: 'desc' });
    }
  };

  // Set sort by context length
  const sortByContextLength = () => {
    if (sortState.sortBy === 'context_length') {
      toggleSortOrder();
    } else {
      setSortState({ sortBy: 'context_length', sortOrder: 'desc' });
    }
  };

  return {
    sortedModels,
    sortState,
    sortByDate,
    sortByContextLength,
    isSortingByDate: sortState.sortBy === 'created',
    isSortingByContext: sortState.sortBy === 'context_length',
    isAscending: sortState.sortOrder === 'asc',
    isDescending: sortState.sortOrder === 'desc'
  };
};