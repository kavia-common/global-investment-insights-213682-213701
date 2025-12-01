import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Portfolio from '../pages/Portfolio';

jest.mock('../services/endpoints', () => ({
  PortfolioAPI: {
    get: jest.fn().mockResolvedValue({ id: 1, name: 'Default', currency: 'USD', total_value: 0, holdings: [] }),
  },
}));

test('renders portfolio summary', async () => {
  const { getByText } = render(<Portfolio />);
  await waitFor(() => expect(getByText(/Default/)).toBeInTheDocument());
});
