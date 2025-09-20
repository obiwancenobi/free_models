import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModelList from '../../src/components/ModelList';
import SearchBar from '../../src/components/SearchBar';

// Mock the API service
jest.mock('../../src/services/apiService', () => ({
  Model: {},
}));

// Mock Fuse.js
jest.mock('fuse.js');

const mockModels = [
  {
    id: '1',
    name: 'Complete Model',
    created: 1600000000,
    context_length: 4096,
    provider: 'test'
  },
  {
    id: '2',
    name: 'No Created Date',
    created: undefined, // Missing created date
    context_length: 8192,
    provider: 'test'
  },
  {
    id: '3',
    name: 'No Context Length',
    created: 1700000000,
    context_length: undefined, // Missing context length
    provider: 'test'
  },
  {
    id: '4',
    name: 'Both Missing',
    created: undefined, // Missing created date
    context_length: undefined, // Missing context length
    provider: 'test'
  }
];

describe('Sort Missing Data Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should handle models with missing created date when sorting by date', async () => {
    // This test will fail until sorting is implemented
    const mockOnModelClick = jest.fn();

    render(
      <div>
        <SearchBar onSearchChange={() => {}} />
        <ModelList
          models={mockModels}
          loading={false}
          error={null}
          searchTerm=""
          onModelClick={mockOnModelClick}
        />
      </div>
    );

    // Wait for models to load
    await waitFor(() => {
      expect(screen.getByText('Complete Model')).toBeInTheDocument();
    });

    // Sort by created date (newest first)
    const dateSortButton = screen.getByLabelText(/sort by date/i);
    fireEvent.click(dateSortButton);

    // Verify models with missing dates are treated as oldest
    const modelElements = screen.getAllByRole('button');
    // Models with dates should come first (newest to oldest)
    expect(modelElements[0]).toHaveTextContent('No Context Length'); // Has date
    expect(modelElements[1]).toHaveTextContent('Complete Model'); // Has date
    // Models without dates should come last
    expect(modelElements[2]).toHaveTextContent('No Created Date');
    expect(modelElements[3]).toHaveTextContent('Both Missing');
  });

  test('should handle models with missing context length when sorting by context', async () => {
    // This test will fail until sorting is implemented
    const mockOnModelClick = jest.fn();

    render(
      <div>
        <SearchBar onSearchChange={() => {}} />
        <ModelList
          models={mockModels}
          loading={false}
          error={null}
          searchTerm=""
          onModelClick={mockOnModelClick}
        />
      </div>
    );

    // Wait for models to load
    await waitFor(() => {
      expect(screen.getByText('Complete Model')).toBeInTheDocument();
    });

    // Sort by context length (highest first)
    const contextSortButton = screen.getByLabelText(/sort by context/i);
    fireEvent.click(contextSortButton);

    // Verify models with missing context are treated as lowest
    const modelElements = screen.getAllByRole('button');
    // Models with context should come first (highest to lowest)
    expect(modelElements[0]).toHaveTextContent('No Created Date'); // Has context 8192
    expect(modelElements[1]).toHaveTextContent('Complete Model'); // Has context 4096
    // Models without context should come last
    expect(modelElements[2]).toHaveTextContent('No Context Length');
    expect(modelElements[3]).toHaveTextContent('Both Missing');
  });

  test('should handle all models having missing data gracefully', async () => {
    // This test will fail until sorting is implemented
    const modelsWithNoData = [
      { id: '1', name: 'Model 1', created: undefined, context_length: undefined, provider: 'test' },
      { id: '2', name: 'Model 2', created: undefined, context_length: undefined, provider: 'test' }
    ];

    const mockOnModelClick = jest.fn();

    render(
      <div>
        <SearchBar onSearchChange={() => {}} />
        <ModelList
          models={modelsWithNoData}
          loading={false}
          error={null}
          searchTerm=""
          onModelClick={mockOnModelClick}
        />
      </div>
    );

    // Wait for models to load
    await waitFor(() => {
      expect(screen.getByText('Model 1')).toBeInTheDocument();
    });

    // Sort buttons should still work without errors
    const dateSortButton = screen.getByLabelText(/sort by date/i);
    const contextSortButton = screen.getByLabelText(/sort by context/i);

    // These should not throw errors
    fireEvent.click(dateSortButton);
    fireEvent.click(contextSortButton);

    // Models should still be displayed
    expect(screen.getByText('Model 1')).toBeInTheDocument();
    expect(screen.getByText('Model 2')).toBeInTheDocument();
  });
});