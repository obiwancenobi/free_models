import { renderHook } from '@testing-library/react';
import { useSorting } from '../../src/hooks/useSorting';

// Mock Fuse.js
jest.mock('fuse.js');

describe('Sorting Logic Unit Tests', () => {
  const mockModels = [
    {
      id: '1',
      name: 'Old Model',
      created: 1600000000, // Older
      context_length: 4096,
      provider: 'test'
    },
    {
      id: '2',
      name: 'New Model',
      created: 1700000000, // Newer
      context_length: 8192,
      provider: 'test'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should sort by created date descending by default', () => {
    const { result } = renderHook(() => useSorting(mockModels, ''));

    // Default sort should be by created date, newest first
    expect(result.current.sortedModels[0].name).toBe('New Model');
    expect(result.current.sortedModels[1].name).toBe('Old Model');
    expect(result.current.isSortingByDate).toBe(true);
    expect(result.current.isDescending).toBe(true);
  });

  test('should sort by context length when sortByContextLength is called', () => {
    const { result } = renderHook(() => useSorting(mockModels, ''));

    // Trigger context sort
    result.current.sortByContextLength();

    // Should now be sorted by context length, highest first
    expect(result.current.sortedModels[0].name).toBe('New Model'); // 8192 context
    expect(result.current.sortedModels[1].name).toBe('Old Model'); // 4096 context
    expect(result.current.isSortingByContext).toBe(true);
  });

  test('should toggle sort order when same sort type is clicked', () => {
    const { result } = renderHook(() => useSorting(mockModels, ''));

    // Initially descending
    expect(result.current.isDescending).toBe(true);

    // Click date sort again to toggle
    result.current.sortByDate();

    // Should now be ascending
    expect(result.current.isAscending).toBe(true);
  });

  test('should handle models with missing created date', () => {
    const modelsWithMissingData = [
      { id: '1', name: 'Has Date', created: 1600000000, context_length: 4096, provider: 'test' },
      { id: '2', name: 'No Date', created: undefined, context_length: 8192, provider: 'test' }
    ];

    const { result } = renderHook(() => useSorting(modelsWithMissingData, ''));

    // Model with missing date should be sorted last (oldest)
    expect(result.current.sortedModels[0].name).toBe('Has Date');
    expect(result.current.sortedModels[1].name).toBe('No Date');
  });

  test('should handle models with missing context length', () => {
    const modelsWithMissingData = [
      { id: '1', name: 'Has Context', created: 1600000000, context_length: 4096, provider: 'test' },
      { id: '2', name: 'No Context', created: 1700000000, context_length: undefined, provider: 'test' }
    ];

    const { result } = renderHook(() => useSorting(modelsWithMissingData, ''));

    // Switch to context sorting
    result.current.sortByContextLength();

    // Model with missing context should be sorted last (lowest)
    expect(result.current.sortedModels[0].name).toBe('Has Context');
    expect(result.current.sortedModels[1].name).toBe('No Context');
  });
});