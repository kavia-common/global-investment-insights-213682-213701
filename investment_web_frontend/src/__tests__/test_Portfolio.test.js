import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import Portfolio from '../pages/Portfolio';

// Explicitly mock PortfolioAPI and redefine per test
const mockGet = jest.fn();

jest.mock('../services/endpoints', () => ({
  PortfolioAPI: {
    get: (...args) => mockGet(...args),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockGet.mockResolvedValue({
    id: 1,
    name: 'Default',
    currency: 'USD',
    total_value: 0,
    holdings: [],
  });
});

afterEach(() => {
  // ensure mocks and DOM are reset after each test
  cleanup();
  jest.clearAllMocks();
});

test('renders portfolio summary', async () => {
  render(<Portfolio />);

  // Wait for the async effect to populate the summary field
  await waitFor(async () => {
    const nameEl = await screen.findByTestId('portfolio-name');
    expect(nameEl).toHaveTextContent(/Default/);
  });

  // Ensure API was called
  expect(mockGet).toHaveBeenCalled();
});
