import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from '../routes/ProtectedRoute';
import { AuthProvider } from '../context/AuthContext';

// Helper to inspect navigation state on redirected routes
function LoginPage() {
  const location = useLocation();
  return (
    <div>
      <div>Login Page</div>
      <div data-testid="from-path">{location.state?.from?.pathname || ''}</div>
    </div>
  );
}

function Secret() {
  return <div>Top Secret</div>;
}

describe('ProtectedRoute edges', () => {
  const renderWithRouter = (initialPath = '/secret') => {
    return render(
      <AuthProvider>
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route
              path="/secret"
              element={
                <ProtectedRoute>
                  <Secret />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );
  };

  test('unauthenticated users are redirected to /login and previous location is preserved', async () => {
    // Ensure no token present
    localStorage.clear();

    renderWithRouter('/secret');

    // Should be at Login Page
    expect(await screen.findByText(/login page/i)).toBeInTheDocument();
    // Original path should be captured in state
    expect(screen.getByTestId('from-path').textContent).toBe('/secret');
  });

  test('authenticated users render children content', async () => {
    // Simulate authenticated token present before first render
    localStorage.setItem('token', 'valid-token');

    // ProtectedRoute may not call /auth/me; we just ensure it renders children when token exists
    renderWithRouter('/secret');

    expect(await screen.findByText(/top secret/i)).toBeInTheDocument();
  });
});
