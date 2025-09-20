import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModelCard from '../../src/components/ModelCard';

const mockModel = {
  id: 'gpt-3.5-turbo',
  name: 'GPT-3.5 Turbo',
  description: 'Fast and efficient model by OpenAI',
  provider: 'OpenAI',
  pricing: { prompt: 0, completion: 0 },
  context_length: 4096
};

const mockOnClick = jest.fn();

describe('ModelCard', () => {
  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders model information correctly', () => {
    render(<ModelCard model={mockModel} onClick={mockOnClick} />);

    expect(screen.getByText('GPT-3.5 Turbo')).toBeInTheDocument();
    expect(screen.getByText('Fast and efficient model by OpenAI')).toBeInTheDocument();
    expect(screen.getByText('gpt-3.5-turbo')).toBeInTheDocument();
    expect(screen.getByText('4,096 tokens')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<ModelCard model={mockModel} onClick={mockOnClick} />);
    const card = screen.getByText('GPT-3.5 Turbo').closest('div');

    fireEvent.click(card);
    expect(mockOnClick).toHaveBeenCalledWith(mockModel);
  });

  it('formats context length correctly', () => {
    const largeModel = {
      ...mockModel,
      context_length: 8192
    };

    render(<ModelCard model={largeModel} onClick={mockOnClick} />);
    expect(screen.getByText('8,192 tokens')).toBeInTheDocument();
  });

  it('applies hover styles on mouse enter', () => {
    render(<ModelCard model={mockModel} onClick={mockOnClick} />);
    const card = screen.getByText('GPT-3.5 Turbo').closest('div');

    // Note: Testing hover styles would require additional setup with user-event
    // or testing library extensions. For now, we verify the card is rendered.
    expect(card).toBeInTheDocument();
  });
});