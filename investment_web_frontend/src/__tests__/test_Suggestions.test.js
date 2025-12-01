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

  // Wait for one of the idea fields to appear (summary or symbol)
  await waitFor(() => {
    expect(mockGetSuggestions).toHaveBeenCalled();
  });

  // The UI shows idea.symbol as the card title and idea.summary as label text
  expect(await screen.findByText(/AAPL/i)).toBeInTheDocument();
  expect(await screen.findByText(/Apple Inc/i)).toBeInTheDocument();
});
