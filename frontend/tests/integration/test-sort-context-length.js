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
    name: 'Small Model',
    created: 1600000000,
    context_length: 1024, // Small context
    provider: 'test'
  },
  {
    id: '2',
    name: 'Large Model',
    created: 1700000000,
    context_length: 32768, // Large context
    provider: 'test'
  },
  {
    id: '3',
    name: 'Medium Model',
    created: 1650000000,
    context_length: 4096, // Medium context
    provider: 'test'
  }
];

describe('Sort by Context Length Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should sort models by context length highest first when sort button clicked', async () => {
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
      expect(screen.getByText('Small Model')).toBeInTheDocument();
    });

    // Find and click the context sort button (will be added in implementation)
    const contextSortButton = screen.getByLabelText(/sort by context/i);
    fireEvent.click(contextSortButton);

    // Verify models are sorted by context length (highest first)
    const modelElements = screen.getAllByRole('button');
    expect(modelElements[0]).toHaveTextContent('Large Model'); // Highest context first
    expect(modelElements[1]).toHaveTextContent('Medium Model');
    expect(modelElements[2]).toHaveTextContent('Small Model'); // Lowest context last
  });

  test('should toggle sort order when context sort button clicked twice', async () => {
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
      expect(screen.getByText('Small Model')).toBeInTheDocument();
    });

    // Click context sort button twice
    const contextSortButton = screen.getByLabelText(/sort by context/i);
    fireEvent.click(contextSortButton); // Highest first
    fireEvent.click(contextSortButton); // Lowest first

    // Verify models are sorted lowest first
    const modelElements = screen.getAllByRole('button');
    expect(modelElements[0]).toHaveTextContent('Small Model'); // Lowest first
    expect(modelElements[1]).toHaveTextContent('Medium Model');
    expect(modelElements[2]).toHaveTextContent('Large Model'); // Highest last
  });
});