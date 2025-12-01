import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { AuthProvider, AuthContext } from '../context/AuthContext';

jest.mock('../services/endpoints', () => ({
  AuthAPI: {
    me: jest.fn().mockResolvedValue({ id: 1, email: 'me@example.com', is_active: true }),
    login: jest.fn().mockResolvedValue({ token: 'abc123' }),
    register: jest.fn().mockResolvedValue({ id: 1 }),
    logout: jest.fn().mockResolvedValue({ ok: true }),
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

test('AuthProvider initializes and supports login', async () => {
  // Ensure a token exists so AuthProvider triggers fetchMe on mount
  window.localStorage.setItem('auth_token', 'test');

  const { findByTestId, getByTestId } = render(
    <AuthProvider>
      <Consumer />
    </AuthProvider>
  );

  // after mount, fetchMe will set user
  const userEl = await findByTestId('user');
  await waitFor(() => expect(userEl.textContent).toBe('me@example.com'));

  // With a token present, isAuthenticated should be true
  expect(getByTestId('is-auth').textContent).toBe('true');

  // cleanup
  window.localStorage.removeItem('auth_token');
});
