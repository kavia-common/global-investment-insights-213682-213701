import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import Suggestions from '../pages/Suggestions';

// Mock SuggestionsAPI to deterministically return Apple Inc
const mockGetSuggestions = jest.fn().mockResolvedValue({
  items: [{ symbol: 'AAPL', summary: 'Apple Inc', score: 0.9 }],
});

jest.mock('../services/endpoints', () => ({
  SuggestionsAPI: {
    getSuggestions: (...args) => mockGetSuggestions(...args),
  },
}));

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
  jest.resetModules();
});

test('renders suggestions list', async () => {
  render(<Suggestions />);

  // Wait until the summary "Apple Inc" shows up
  const summaryEl = await screen.findByText(/Apple Inc/i);
  await waitFor(() => {
    expect(summaryEl).toBeInTheDocument();
    expect(screen.getByText(/AAPL/i)).toBeInTheDocument();
  });

  // Ensure API called at least once on mount with some params
  expect(mockGetSuggestions).toHaveBeenCalled();
});
