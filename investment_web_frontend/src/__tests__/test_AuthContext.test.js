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
  const { getByTestId } = render(
    <AuthProvider>
      <Consumer />
    </AuthProvider>
  );

  // after mount, fetchMe will set user
  await waitFor(() => expect(getByTestId('user').textContent).toBe('me@example.com'));
  expect(getByTestId('is-auth').textContent).toBe('false');
});
