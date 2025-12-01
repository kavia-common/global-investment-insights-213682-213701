import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Suggestions from '../pages/Suggestions';

jest.mock('../services/endpoints', () => ({
  SuggestionsAPI: {
    getSuggestions: jest.fn().mockResolvedValue({ items: [{ symbol: 'AAPL', summary: 'Apple Inc', score: 0.9 }] }),
  },
}));

test('renders suggestions list', async () => {
  render(<Suggestions />);

  // Wait for "Loading..." on the Refresh button to clear
  await waitFor(() =>
    expect(screen.getByRole('button', { name: /Refresh/i })).toBeEnabled()
  );

  // Assert suggestion content is rendered
  expect(screen.getByText(/Apple Inc/i)).toBeInTheDocument();
  expect(screen.getByText(/AAPL/i)).toBeInTheDocument();
});
