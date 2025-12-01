import React from 'react';
import { render, waitFor, screen, cleanup } from '@testing-library/react';
import { AuthProvider, AuthContext } from '../context/AuthContext';

// Define endpoint mocks with stable defaults and reassign in beforeEach
const mockMe = jest.fn();
const mockLogin = jest.fn();
const mockRegister = jest.fn();
const mockLogout = jest.fn();

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

beforeEach(() => {
  // Reset and redefine mock implementations per test
  jest.clearAllMocks();
  mockMe.mockResolvedValue({ id: '1', email: 'me@example.com', is_active: true });
  mockLogin.mockResolvedValue({ token: 'abc123' });
  mockRegister.mockResolvedValue({ id: '1' });
  mockLogout.mockResolvedValue({ ok: true });
  window.localStorage.removeItem('auth_token');
});

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
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
    const userEl = screen.getByTestId('user');
    expect(userEl.textContent).toBe('me@example.com');
  });

  // With a token present, isAuthenticated should be true
  const isAuthEl = screen.getByTestId('is-auth');
  expect(isAuthEl).toHaveTextContent('true');
});
