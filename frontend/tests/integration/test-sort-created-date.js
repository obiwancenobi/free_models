import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModelList from '../../src/components/ModelList';
import SearchBar from '../../src/components/SearchBar';
import { Model } from '../../src/services/apiService';

// Mock the API service
jest.mock('../../src/services/apiService', () => ({
  Model: {},
}));

// Mock Fuse.js
jest.mock('fuse.js');

const mockModels = [
  {
    id: '1',
    name: 'Old Model',
    created: 1600000000, // Older date
    context_length: 4096,
    provider: 'test'
  },
  {
    id: '2',
    name: 'New Model',
    created: 1700000000, // Newer date
    context_length: 8192,
    provider: 'test'
  },
  {
    id: '3',
    name: 'Medium Model',
    created: 1650000000, // Medium date
    context_length: 2048,
    provider: 'test'
  }
];

describe('Sort by Created Date Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should sort models by created date newest first when sort button clicked', async () => {
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
      expect(screen.getByText('Old Model')).toBeInTheDocument();
    });

    // Find and click the date sort button (will be added in implementation)
    // This will fail until the button is implemented
    const dateSortButton = screen.getByLabelText(/sort by date/i);
    fireEvent.click(dateSortButton);

    // Verify models are sorted by created date (newest first)
    const modelElements = screen.getAllByRole('button'); // Assuming ModelCard is a button
    expect(modelElements[0]).toHaveTextContent('New Model'); // Newest first
    expect(modelElements[1]).toHaveTextContent('Medium Model');
    expect(modelElements[2]).toHaveTextContent('Old Model'); // Oldest last
  });

  test('should toggle sort order when date sort button clicked twice', async () => {
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
      expect(screen.getByText('Old Model')).toBeInTheDocument();
    });

    // Click date sort button twice
    const dateSortButton = screen.getByLabelText(/sort by date/i);
    fireEvent.click(dateSortButton); // Newest first
    fireEvent.click(dateSortButton); // Oldest first

    // Verify models are sorted oldest first
    const modelElements = screen.getAllByRole('button');
    expect(modelElements[0]).toHaveTextContent('Old Model'); // Oldest first
    expect(modelElements[1]).toHaveTextContent('Medium Model');
    expect(modelElements[2]).toHaveTextContent('New Model'); // Newest last
  });
});