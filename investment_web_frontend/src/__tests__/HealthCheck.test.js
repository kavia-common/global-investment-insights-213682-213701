import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import HealthCheck from '../pages/HealthCheck';
import axios from 'axios';

// axios is already mocked via __mocks__/axios.js through setupTests/jest.setup
jest.mock('axios');

describe('HealthCheck Page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('shows OK status when health endpoint returns success', async () => {
    axios.get.mockResolvedValueOnce({ data: { status: 'ok' } });

    render(<HealthCheck />);

    // Wait for OK text to appear
    await waitFor(() => {
      const okText = screen.getByText(/ok/i);
      expect(okText).toBeInTheDocument();
    });
  });

  test('shows error status when health endpoint fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    render(<HealthCheck />);

    // Wait for error indication to appear
    await waitFor(() => {
      // Look for common error keywords
      const errorPossible = screen.queryByText(/error/i) || screen.queryByText(/unhealthy/i) || screen.queryByText(/failed/i);
      expect(errorPossible).toBeInTheDocument();
    });
  });
});
