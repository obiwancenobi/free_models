import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../src/App';

// Mock the API service
jest.mock('../../src/services/apiService', () => ({
  fetchModels: jest.fn(() =>
    Promise.resolve([
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: 'Fast and efficient model by OpenAI',
        pricing: { prompt: 0, completion: 0 },
        context_length: 4096,
        created: 1699228800
      },
      {
        id: 'claude-2',
        name: 'Claude 2',
        description: 'Advanced model by Anthropic',
        pricing: { prompt: 0, completion: 0 },
        context_length: 8192,
        created: 1689033600
      }
    ])
  )
}));

describe('Search Functionality Integration', () => {
  it('filters models based on search input', async () => {
    render(<App />);

    // Wait for models to load
    await waitFor(() => {
      expect(screen.getByText('GPT-3.5 Turbo')).toBeInTheDocument();
      expect(screen.getByText('Claude 2')).toBeInTheDocument();
    });

    // Find search input
    const searchInput = screen.getByPlaceholderText(/search/i) || screen.getByRole('textbox');

    // Search for "GPT"
    fireEvent.change(searchInput, { target: { value: 'GPT' } });

    // Check that only GPT model is shown
    await waitFor(() => {
      expect(screen.getByText('GPT-3.5 Turbo')).toBeInTheDocument();
      expect(screen.queryByText('Claude 2')).not.toBeInTheDocument();
    });

    // Search for "Anthropic"
    fireEvent.change(searchInput, { target: { value: 'Anthropic' } });

    // Check that only Claude model is shown
    await waitFor(() => {
      expect(screen.queryByText('GPT-3.5 Turbo')).not.toBeInTheDocument();
      expect(screen.getByText('Claude 2')).toBeInTheDocument();
    });

    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });

    // Check that all models are shown again
    await waitFor(() => {
      expect(screen.getByText('GPT-3.5 Turbo')).toBeInTheDocument();
      expect(screen.getByText('Claude 2')).toBeInTheDocument();
    });
  });

  it('handles empty search results', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('GPT-3.5 Turbo')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search/i) || screen.getByRole('textbox');

    // Search for non-existent model
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    // Check that no models are shown
    await waitFor(() => {
      expect(screen.queryByText('GPT-3.5 Turbo')).not.toBeInTheDocument();
      expect(screen.queryByText('Claude 2')).not.toBeInTheDocument();
      expect(screen.getByText(/no models found/i)).toBeInTheDocument();
    });
  });
});