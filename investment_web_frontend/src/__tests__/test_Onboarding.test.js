import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Onboarding from '../pages/Onboarding';

jest.mock('../services/endpoints', () => ({
  OnboardingAPI: {
    get: jest.fn().mockResolvedValue(null),
    save: jest.fn().mockResolvedValue({ ok: true }),
  },
}));

test('onboarding navigates through steps and submits', async () => {
  const { getByText } = render(<Onboarding />);

  // Step 1 -> 2
  fireEvent.click(getByText('Next'));
  // Step 2 -> 3
  fireEvent.click(getByText('Next'));
  // Step 3 -> 4
  fireEvent.click(getByText('Next'));
  // Submit
  expect(getByText('Finish')).toBeInTheDocument();
});
