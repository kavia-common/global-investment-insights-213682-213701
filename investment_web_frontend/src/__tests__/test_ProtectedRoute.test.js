import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../routes/ProtectedRoute';
import { AuthContext } from '../context/AuthContext';

function renderWithAuth(value, initialEntries=['/app']) {
  return render(
    <AuthContext.Provider value={value}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<div>App Page</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

test('redirects unauthenticated users to login', () => {
  const { getByText } = renderWithAuth({ isAuthenticated: false, loading: false });
  expect(getByText('Login Page')).toBeInTheDocument();
});

test('renders outlet when authenticated', () => {
  const { getByText } = renderWithAuth({ isAuthenticated: true, loading: false });
  expect(getByText('App Page')).toBeInTheDocument();
});

test('shows loading state when loading', () => {
  const { getByText } = renderWithAuth({ isAuthenticated: false, loading: true });
  expect(getByText('Loading...')).toBeInTheDocument();
});
