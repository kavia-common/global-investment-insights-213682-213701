import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Portfolio from '../pages/Portfolio';

// Ensure mock path matches import path in Portfolio component
jest.mock('../services/endpoints', () => ({
  PortfolioAPI: {
    get: jest.fn().mockResolvedValue({ id: 1, name: 'Default', currency: 'USD', total_value: 0, holdings: [] }),
  },
}));

test('renders portfolio summary', async () => {
  render(<Portfolio />);
  // Wait for explicit portfolio name element
  const nameEl = await screen.findByTestId('portfolio-name');
  await waitFor(() => expect(nameEl).toHaveTextContent(/Default/));
});
