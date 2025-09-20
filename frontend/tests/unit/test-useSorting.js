import { renderHook, act } from '@testing-library/react';
import { useSorting } from '../../src/hooks/useSorting';

// Mock Fuse.js
jest.mock('fuse.js');

describe('useSorting Hook Unit Tests', () => {
  const mockModels = [
    {
      id: '1',
      name: 'Model A',
      created: 1600000000,
      context_length: 4096,
      provider: 'test'
    },
    {
      id: '2',
      name: 'Model B',
      created: 1700000000,
      context_length: 8192,
      provider: 'test'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with correct default state', () => {
    const { result } = renderHook(() => useSorting(mockModels, ''));

    expect(result.current.isSortingByDate).toBe(true);
    expect(result.current.isDescending).toBe(true);
    expect(result.current.sortedModels).toHaveLength(2);
  });

  test('should return correct sort functions', () => {
    const { result } = renderHook(() => useSorting(mockModels, ''));

    expect(typeof result.current.sortByDate).toBe('function');
    expect(typeof result.current.sortByContextLength).toBe('function');
  });

  test('should update sorting state when sortByDate is called', () => {
    const { result } = renderHook(() => useSorting(mockModels, ''));

    act(() => {
      result.current.sortByDate();
    });

    // Should still be sorting by date but toggled to ascending
    expect(result.current.isSortingByDate).toBe(true);
    expect(result.current.isAscending).toBe(true);
  });

  test('should update sorting state when sortByContextLength is called', () => {
    const { result } = renderHook(() => useSorting(mockModels, ''));

    act(() => {
      result.current.sortByContextLength();
    });

    // Should switch to context sorting with descending
    expect(result.current.isSortingByContext).toBe(true);
    expect(result.current.isDescending).toBe(true);
  });

  test('should handle empty models array', () => {
    const { result } = renderHook(() => useSorting([], ''));

    expect(result.current.sortedModels).toHaveLength(0);
    expect(result.current.isSortingByDate).toBe(true);
  });

  test('should handle search term filtering', () => {
    const { result } = renderHook(() => useSorting(mockModels, 'Model A'));

    // Should filter to only Model A
    expect(result.current.sortedModels).toHaveLength(1);
    expect(result.current.sortedModels[0].name).toBe('Model A');
  });

  test('should maintain sort state across re-renders', () => {
    const { result, rerender } = renderHook(() => useSorting(mockModels, ''));

    act(() => {
      result.current.sortByContextLength();
    });

    expect(result.current.isSortingByContext).toBe(true);

    // Re-render should maintain state
    rerender();

    expect(result.current.isSortingByContext).toBe(true);
  });
});