import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Dashboard Page', () => {
  test('renders key dashboard sections/cards', () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );

    // Check for common headings or sections expected on dashboard
    // We make minimal assumptions based on typical dashboard content
    const headings = screen.getAllByRole('heading', { level: 1 }).concat(
      screen.queryAllByRole('heading', { level: 2 })
    );

    // Ensure at least one primary heading exists
    expect(headings.length).toBeGreaterThan(0);

    // Look for common card/section keywords
    const possibleSections = [
      /overview/i,
      /portfolio/i,
      /suggestions/i,
      /insights/i,
      /metrics/i,
      /summary/i
    ];

    // The test passes if at least one of the common section words appears
    const textContent = screen.getByTestId
      ? ''
      : (document.body.textContent || '').toLowerCase();

    const hasKnownSection =
      possibleSections.some((re) =>
        (document.body.textContent || '').match(re)
      ) || (textContent && possibleSections.some((re) => re.test(textContent)));

    expect(hasKnownSection).toBe(true);
  });
});
