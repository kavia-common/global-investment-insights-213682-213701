import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Suggestions from '../pages/Suggestions';

jest.mock('../services/endpoints', () => ({
  SuggestionsAPI: {
    getSuggestions: jest.fn().mockResolvedValue({ items: [{ symbol: 'AAPL', summary: 'Apple Inc', score: 0.9 }] }),
  },
}));

test('renders suggestions list', async () => {
  const { getByText } = render(<Suggestions />);
  await waitFor(() => expect(getByText(/Apple Inc/i)).toBeInTheDocument());
});
