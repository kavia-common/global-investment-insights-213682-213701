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
  // Wait until the portfolio name is populated
  await waitFor(async () => {
    const nameEl = await screen.findByTestId('portfolio-name');
    expect(nameEl).toHaveTextContent(/Default/);
  });
});
