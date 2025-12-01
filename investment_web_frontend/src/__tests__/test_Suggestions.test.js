import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Suggestions from '../pages/Suggestions';

// Ensure mock path matches import path in Suggestions component
jest.mock('../services/endpoints', () => ({
  SuggestionsAPI: {
    // Component expects either an array or an object with { items: [...] }
    getSuggestions: jest.fn().mockResolvedValue({ items: [{ symbol: 'AAPL', summary: 'Apple Inc', score: 0.9 }] }),
  },
}));

test('renders suggestions list', async () => {
  render(<Suggestions />);

  // Wait for suggestion summary text to appear
  const summaryEl = await screen.findByText(/Apple Inc/i);

  // Assert suggestion content is rendered and stable
  await waitFor(() => {
    expect(summaryEl).toBeInTheDocument();
    expect(screen.getByText(/AAPL/i)).toBeInTheDocument();
  });
});
