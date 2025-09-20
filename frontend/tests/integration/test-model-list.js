import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModelList from '../../src/components/ModelList';

// Mock the API service
jest.mock('../../src/services/apiService', () => ({
  fetchModels: jest.fn(() =>
    Promise.resolve([
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: 'Fast and efficient model',
        pricing: { prompt: 0, completion: 0 },
        context_length: 4096
      }
    ])
  )
}));

describe('ModelList Integration', () => {
  it('loads and displays models on mount', async () => {
    render(<ModelList />);

    // Check loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for models to load
    await waitFor(() => {
      expect(screen.getByText('GPT-3.5 Turbo')).toBeInTheDocument();
    });

    // Check that model details are displayed
    expect(screen.getByText('Fast and efficient model')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    // Mock API failure
    const { fetchModels } = require('../../src/services/apiService');
    fetchModels.mockRejectedValue(new Error('API Error'));

    render(<ModelList />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});