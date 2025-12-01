import React from 'react';
import { render, waitFor, screen, cleanup } from '@testing-library/react';
import { AuthProvider, AuthContext } from '../context/AuthContext';

// Ensure endpoints mock matches import path in AuthContext and returns deterministic user
const mockMe = jest.fn().mockResolvedValue({ id: '1', email: 'me@example.com', is_active: true });
const mockLogin = jest.fn().mockResolvedValue({ token: 'abc123' });
const mockRegister = jest.fn().mockResolvedValue({ id: '1' });
const mockLogout = jest.fn().mockResolvedValue({ ok: true });

jest.mock('../services/endpoints', () => ({
  AuthAPI: {
    me: (...args) => mockMe(...args),
    login: (...args) => mockLogin(...args),
    register: (...args) => mockRegister(...args),
    logout: (...args) => mockLogout(...args),
  },
}));

function Consumer() {
  const ctx = React.useContext(AuthContext);
  return (
    <div>
      <div data-testid="is-auth">{String(ctx.isAuthenticated)}</div>
      <div data-testid="user">{ctx.user ? ctx.user.email : ''}</div>
    </div>
  );
}

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
  jest.resetModules();
  window.localStorage.removeItem('auth_token');
});

test('AuthProvider initializes and supports login', async () => {
  // Seed token so AuthProvider fetches on mount
  window.localStorage.setItem('auth_token', 'test');

  render(
    <AuthProvider>
      <Consumer />
    </AuthProvider>
  );

  // Wait for me() to resolve and user to be populated
  await waitFor(() => {
    expect(screen.getByTestId('user').textContent).toBe('me@example.com');
  });

  // With a token present, isAuthenticated should be true
  expect(screen.getByTestId('is-auth').textContent).toBe('true');
});
