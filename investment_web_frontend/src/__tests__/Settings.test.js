import React from 'react';
import { render, screen } from '@testing-library/react';
import Settings from '../pages/Settings';
import { ThemeProvider } from '../context/ThemeContext';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Settings Page', () => {
  const renderWithProviders = (ui) => {
    return render(
      <Router>
        <ThemeProvider>{ui}</ThemeProvider>
      </Router>
    );
  };

  test('renders settings page heading', () => {
    renderWithProviders(<Settings />);
    const heading = screen.getByRole('heading', { name: /settings/i });
    expect(heading).toBeInTheDocument();
  });

  test('renders descriptive info text', () => {
    renderWithProviders(<Settings />);
    const info = screen.getByText(/Profile, subscriptions, and preferences will appear here\./i);
    expect(info).toBeInTheDocument();
  });
});
