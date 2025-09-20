import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '../../src/components/SearchBar';

const mockOnChange = jest.fn();

describe('SearchBar', () => {
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with default placeholder', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    const input = screen.getByPlaceholderText('Search AI models...');
    expect(input).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(<SearchBar value="" onChange={mockOnChange} placeholder="Find models..." />);
    expect(screen.getByPlaceholderText('Find models...')).toBeInTheDocument();
  });

  it('displays the current value', () => {
    render(<SearchBar value="GPT" onChange={mockOnChange} />);
    const input = screen.getByDisplayValue('GPT');
    expect(input).toBeInTheDocument();
  });

  it('calls onChange when user types', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    const input = screen.getByPlaceholderText('Search AI models...');

    fireEvent.change(input, { target: { value: 'test' } });
    expect(mockOnChange).toHaveBeenCalledWith('test');
  });

  it('shows search icon', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    const searchIcon = screen.getByTestId('SearchIcon');
    expect(searchIcon).toBeInTheDocument();
  });

  it('does not show clear button when input is empty', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    const clearButton = screen.queryByTestId('ClearIcon');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('shows clear button when input has value', () => {
    render(<SearchBar value="test" onChange={mockOnChange} />);
    const clearButton = screen.getByTestId('ClearIcon');
    expect(clearButton).toBeInTheDocument();
  });

  it('clears input when clear button is clicked', () => {
    render(<SearchBar value="test" onChange={mockOnChange} />);
    const clearButton = screen.getByTestId('ClearIcon');

    fireEvent.click(clearButton);
    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('has proper accessibility attributes', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    const input = screen.getByPlaceholderText('Search AI models...');

    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('aria-label'); // Material-UI adds this automatically
  });

  it('handles special characters in search', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    const input = screen.getByPlaceholderText('Search AI models...');

    fireEvent.change(input, { target: { value: 'GPT-3.5 & Claude!' } });
    expect(mockOnChange).toHaveBeenCalledWith('GPT-3.5 & Claude!');
  });

  it('maintains focus after typing', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    const input = screen.getByPlaceholderText('Search AI models...');

    fireEvent.change(input, { target: { value: 'test' } });
    expect(input).toHaveFocus();
  });
});