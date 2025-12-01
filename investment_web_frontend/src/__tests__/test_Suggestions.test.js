import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Suggestions from '../pages/Suggestions';

// Ensure mock path matches import path in Suggestions component
jest.mock('../services/endpoints', () => ({
  SuggestionsAPI: {
    getSuggestions: jest.fn().mockResolvedValue({ items: [{ symbol: 'AAPL', summary: 'Apple Inc', score: 0.9 }] }),
  },
}));

test('renders suggestions list', async () => {
  render(<Suggestions />);

  // Wait for suggestion content to render
  await screen.findByText(/Apple Inc/i);

  // Assert suggestion content is rendered and stable
  await waitFor(() => {
    expect(screen.getByText(/Apple Inc/i)).toBeInTheDocument();
    expect(screen.getByText(/AAPL/i)).toBeInTheDocument();
  });
});
