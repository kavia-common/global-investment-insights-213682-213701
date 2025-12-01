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

    // Wait for OK text to appear (component stringifies response object)
    await waitFor(() => {
      // It renders as a JSON string, e.g., {"status":"ok"}
      const okText = screen.getByText(/\"status\"\s*:\s*\"ok\"/i);
      expect(okText).toBeInTheDocument();
    });
  });

  test('shows error status when health endpoint fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    render(<HealthCheck />);

    // Wait for actual error UI text shown by component
    await waitFor(() => {
      const errorText = screen.getByText(/backend not reachable/i);
      expect(errorText).toBeInTheDocument();
    });
  });
});
