import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import Portfolio from '../pages/Portfolio';

// Explicitly mock PortfolioAPI to return deterministic data
jest.mock('../services/endpoints', () => ({
  PortfolioAPI: {
    get: jest.fn().mockResolvedValue({
      id: 1,
      name: 'Default',
      currency: 'USD',
      total_value: 0,
      holdings: [],
    }),
  },
}));

afterEach(() => {
  // ensure mocks and DOM are reset after each test
  cleanup();
  jest.clearAllMocks();
  jest.resetModules();
});

test('renders portfolio summary', async () => {
  render(<Portfolio />);
  // Wait for the portfolio-name element to be populated with "Default"
  const nameEl = await screen.findByTestId('portfolio-name');
  await waitFor(() => expect(nameEl).toHaveTextContent(/Default/));
});
