import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

  test('renders settings page heading or key sections', () => {
    renderWithProviders(<Settings />);

    const heading =
      screen.queryByRole('heading', { name: /settings/i }) ||
      screen.queryByText(/settings/i) ||
      screen.queryByRole('heading');

    expect(heading).toBeTruthy();
  });

  test('toggles a sample control if present (e.g., theme or notifications)', () => {
    renderWithProviders(<Settings />);

    // Try to find a checkbox, switch, or toggle-like control on the page.
    // We search common labels; if not found, fall back to any checkbox.
    const possibleLabels = [/theme/i, /dark mode/i, /notifications?/i, /enable/i, /toggle/i];

    let control = null;
    for (const label of possibleLabels) {
      const el = screen.queryByLabelText(label);
      if (el) {
        control = el;
        break;
      }
    }

    if (!control) {
      // fallback: any checkbox present in settings
      const checkboxes = screen.queryAllByRole('checkbox');
      if (checkboxes.length > 0) {
        control = checkboxes[0];
      }
    }

    // If there is a control, we toggle it
    if (control) {
      const initialChecked = control.checked;
      fireEvent.click(control);
      expect(control.checked).toBe(!initialChecked);
    } else {
      // If no toggle exists, ensure at least interactive inputs render
      const anyInput = screen.queryByRole('textbox') || screen.queryByRole('combobox') || screen.queryByRole('switch');
      expect(anyInput).toBeTruthy();
    }
  });
});
