import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import Suggestions from '../pages/Suggestions';

// Define SuggestionsAPI mock and reassign per test
const mockGetSuggestions = jest.fn();

jest.mock('../services/endpoints', () => ({
  SuggestionsAPI: {
    getSuggestions: (...args) => mockGetSuggestions(...args),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockGetSuggestions.mockResolvedValue({
    items: [{ symbol: 'AAPL', summary: 'Apple Inc', score: 0.9 }],
  });
});

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

test('renders suggestions list', async () => {
  render(<Suggestions />);

  // Wait for the summary text to appear
  const summaryEl = await screen.findByText(/Apple Inc/i);
  expect(summaryEl).toBeInTheDocument();

  // Assert that the symbol is rendered too
  await waitFor(() => {
    expect(screen.getByText(/AAPL/i)).toBeInTheDocument();
  });

  // Ensure API called on mount
  expect(mockGetSuggestions).toHaveBeenCalled();
});
