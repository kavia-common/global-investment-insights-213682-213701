import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Portfolio from '../pages/Portfolio';

jest.mock('../services/endpoints', () => ({
  PortfolioAPI: {
    get: jest.fn().mockResolvedValue({ id: 1, name: 'Default', currency: 'USD', total_value: 0, holdings: [] }),
  },
}));

test('renders portfolio summary', async () => {
  render(<Portfolio />);
  // Wait for "Loading..." state to disappear
  await waitFor(() =>
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  );

  // Assert against a field we know is rendered within JSON
  expect(screen.getByText(/Default/)).toBeInTheDocument();
});
