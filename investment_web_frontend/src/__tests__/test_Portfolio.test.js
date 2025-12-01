import React from 'react';
import { render, screen, waitFor, cleanup, waitForElementToBeRemoved } from '@testing-library/react';
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

  // Wait for initial Loading... to go away
  await waitForElementToBeRemoved(() => screen.getByText(/Loading.../i));

  // Then assert the portfolio name becomes "Default"
  await waitFor(() => expect(screen.getByTestId('portfolio-name')).toHaveTextContent(/Default/));

  // Optionally ensure API was called
  expect(mockGet).toHaveBeenCalled();
});
