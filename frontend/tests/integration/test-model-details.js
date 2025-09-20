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
        supported_features: ['chat', 'completion'],
        created: 1699228800
      }
    ])
  )
}));

describe('Model Details Bottom Sheet Integration', () => {
  it('opens bottom sheet when model is clicked', async () => {
    render(<App />);

    // Wait for models to load
    await waitFor(() => {
      expect(screen.getByText('GPT-3.5 Turbo')).toBeInTheDocument();
    });

    // Click on the model
    const modelItem = screen.getByText('GPT-3.5 Turbo');
    fireEvent.click(modelItem);

    // Check that bottom sheet opens with details
    await waitFor(() => {
      expect(screen.getByText('Fast and efficient model by OpenAI')).toBeInTheDocument();
      expect(screen.getByText('Context Length: 4096')).toBeInTheDocument();
      expect(screen.getByText('Free')).toBeInTheDocument();
    });
  });

  it('closes bottom sheet when close button is clicked', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('GPT-3.5 Turbo')).toBeInTheDocument();
    });

    // Click on the model
    const modelItem = screen.getByText('GPT-3.5 Turbo');
    fireEvent.click(modelItem);

    // Wait for bottom sheet to open
    await waitFor(() => {
      expect(screen.getByText('Fast and efficient model by OpenAI')).toBeInTheDocument();
    });

    // Find and click close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    // Check that bottom sheet is closed
    await waitFor(() => {
      expect(screen.queryByText('Fast and efficient model by OpenAI')).not.toBeInTheDocument();
    });
  });

  it('closes bottom sheet when clicking outside', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('GPT-3.5 Turbo')).toBeInTheDocument();
    });

    // Click on the model
    const modelItem = screen.getByText('GPT-3.5 Turbo');
    fireEvent.click(modelItem);

    // Wait for bottom sheet to open
    await waitFor(() => {
      expect(screen.getByText('Fast and efficient model by OpenAI')).toBeInTheDocument();
    });

    // Click on backdrop (outside the sheet)
    const backdrop = screen.getByRole('presentation'); // Material-UI backdrop
    fireEvent.click(backdrop);

    // Check that bottom sheet is closed
    await waitFor(() => {
      expect(screen.queryByText('Fast and efficient model by OpenAI')).not.toBeInTheDocument();
    });
  });
});