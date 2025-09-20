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
    name: 'GPT Model',
    created: 1600000000,
    context_length: 4096,
    provider: 'openai'
  },
  {
    id: '2',
    name: 'Claude Model',
    created: 1700000000,
    context_length: 8192,
    provider: 'anthropic'
  },
  {
    id: '3',
    name: 'Another GPT',
    created: 1650000000,
    context_length: 2048,
    provider: 'openai'
  }
];

describe('Sort with Search Active Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should maintain sort order when search filters results', async () => {
    // This test will fail until sorting is implemented
    const mockOnModelClick = jest.fn();
    const mockOnSearchChange = jest.fn();

    render(
      <div>
        <SearchBar onSearchChange={mockOnSearchChange} />
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
      expect(screen.getByText('GPT Model')).toBeInTheDocument();
    });

    // First, sort by created date (newest first)
    const dateSortButton = screen.getByLabelText(/sort by date/i);
    fireEvent.click(dateSortButton);

    // Verify initial sort order
    let modelElements = screen.getAllByRole('button');
    expect(modelElements[0]).toHaveTextContent('Claude Model'); // Newest
    expect(modelElements[1]).toHaveTextContent('Another GPT');
    expect(modelElements[2]).toHaveTextContent('GPT Model'); // Oldest

    // Now search for "GPT" to filter results
    const searchInput = screen.getByPlaceholderText(/search models/i);
    fireEvent.change(searchInput, { target: { value: 'GPT' } });

    // Verify filtered results maintain sort order
    await waitFor(() => {
      expect(screen.getByText('Another GPT')).toBeInTheDocument();
      expect(screen.getByText('GPT Model')).toBeInTheDocument();
      expect(screen.queryByText('Claude Model')).not.toBeInTheDocument();
    });

    // Filtered models should still be sorted by date
    modelElements = screen.getAllByRole('button');
    expect(modelElements[0]).toHaveTextContent('Another GPT'); // Newer GPT
    expect(modelElements[1]).toHaveTextContent('GPT Model'); // Older GPT
  });

  test('should apply sort to search results when sort changed after search', async () => {
    // This test will fail until sorting is implemented
    const mockOnModelClick = jest.fn();
    const mockOnSearchChange = jest.fn();

    render(
      <div>
        <SearchBar onSearchChange={mockOnSearchChange} />
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
      expect(screen.getByText('GPT Model')).toBeInTheDocument();
    });

    // First search for models
    const searchInput = screen.getByPlaceholderText(/search models/i);
    fireEvent.change(searchInput, { target: { value: 'GPT' } });

    // Then apply context sort
    const contextSortButton = screen.getByLabelText(/sort by context/i);
    fireEvent.click(contextSortButton);

    // Verify search results are sorted by context
    await waitFor(() => {
      const modelElements = screen.getAllByRole('button');
      expect(modelElements[0]).toHaveTextContent('Another GPT'); // Lower context first (2048)
      expect(modelElements[1]).toHaveTextContent('GPT Model'); // Higher context (4096)
    });
  });
});