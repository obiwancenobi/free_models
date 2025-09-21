import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';
import ReactGA from 'react-ga4';

// Mock react-ga4
jest.mock('react-ga4', () => ({
  initialize: jest.fn(),
  send: jest.fn(),
  event: jest.fn(),
}));

// Mock apiService
jest.mock('../../src/services/apiService', () => ({
  apiService: {
    fetchModels: jest.fn().mockResolvedValue([
      {
        id: 'test-model-1',
        name: 'Test Model 1',
        description: 'A test model',
        created: new Date().toISOString(),
        context_length: 4096,
      },
    ]),
  },
  Model: {},
}));

describe('GA Model Selection Event Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REACT_APP_GA_MEASUREMENT_ID = 'G-TEST123';
  });

  afterEach(() => {
    delete process.env.REACT_APP_GA_MEASUREMENT_ID;
  });

  test('should track model selection event when user clicks on model card', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Wait for models to load
    await screen.findByText('Test Model 1');

    // Find and click on model card
    const modelCard = screen.getByText('Test Model 1');
    await user.click(modelCard);

    // Check that model_select event was tracked
    expect(ReactGA.event).toHaveBeenCalledWith('model_select', {
      model_id: 'test-model-1',
    });
  });
});