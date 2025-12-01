import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Helper component to use the AuthContext hooks within tests
function Consumer() {
  const { user, token, loading, error, login, register, logout } = useAuth();

  return (
    <div>
      <div data-testid="user">{user ? user.email : ''}</div>
      <div data-testid="token">{token || ''}</div>
      <div data-testid="loading">{loading ? 'true' : 'false'}</div>
      <div data-testid="error">{error || ''}</div>

      <button onClick={() => login('user@example.com', 'password')} data-testid="login-btn">
        login
      </button>
      <button
        onClick={() => register('new@example.com', 'newpass', 'New User')}
        data-testid="register-btn"
      >
        register
      </button>
      <button onClick={logout} data-testid="logout-btn">
        logout
      </button>
    </div>
  );
}

// Utility: Mock fetch globally per test and restore after
const originalFetch = global.fetch;

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('AuthContext end-to-end flows', () => {
  beforeEach(() => {
    // Clear any localStorage artifacts between tests
    localStorage.clear();
    jest.spyOn(Storage.prototype, 'setItem');
    jest.spyOn(Storage.prototype, 'getItem');
    jest.spyOn(Storage.prototype, 'removeItem');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    if (originalFetch) {
      global.fetch = originalFetch;
    }
  });

  function setup() {
    return render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );
  }

  test('login success stores token and user, clears error', async () => {
    // Mock API: login -> token; me -> user
    global.fetch = jest
      .fn()
      // login
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'abc123', token_type: 'bearer' }),
      })
      // me
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, email: 'user@example.com', is_active: true }),
      });

    const user = userEvent.setup();
    setup();

    expect(screen.getByTestId('loading').textContent).toBe('false');

    await act(async () => {
      await user.click(screen.getByTestId('login-btn'));
    });

    // token saved to state and localStorage
    await waitFor(() => expect(screen.getByTestId('token').textContent).toBe('abc123'));
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'abc123');
    expect(screen.getByTestId('user').textContent).toBe('user@example.com');
    expect(screen.getByTestId('error').textContent).toBe('');
  });

  test('login failure sets error and does not store token', async () => {
    global.fetch = jest
      .fn()
      // login error
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ detail: 'Invalid credentials' }),
      });

    const user = userEvent.setup();
    setup();

    await act(async () => {
      await user.click(screen.getByTestId('login-btn'));
      await flushPromises();
    });

    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toMatch(/invalid/i);
    });

    // Ensure token not set
    expect(screen.getByTestId('token').textContent).toBe('');
    expect(localStorage.setItem).not.toHaveBeenCalledWith('token', expect.any(String));
  });

  test('register success then auto-login stores token and user', async () => {
    global.fetch = jest
      .fn()
      // signup ok
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 2, email: 'new@example.com', is_active: true }),
      })
      // login after register -> token
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'newtoken', token_type: 'bearer' }),
      })
      // me
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 2, email: 'new@example.com', is_active: true }),
      });

    const user = userEvent.setup();
    setup();

    await act(async () => {
      await user.click(screen.getByTestId('register-btn'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('token').textContent).toBe('newtoken');
      expect(screen.getByTestId('user').textContent).toBe('new@example.com');
    });
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'newtoken');
    expect(screen.getByTestId('error').textContent).toBe('');
  });

  test('register failure surfaces error and does not set token', async () => {
    global.fetch = jest
      .fn()
      // signup fails
      .mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: async () => ({ detail: 'Email already exists' }),
      });

    const user = userEvent.setup();
    setup();

    await act(async () => {
      await user.click(screen.getByTestId('register-btn'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toMatch(/email/i);
    });

    expect(screen.getByTestId('token').textContent).toBe('');
    expect(localStorage.setItem).not.toHaveBeenCalledWith('token', expect.any(String));
  });

  test('logout clears token and user and localStorage', async () => {
    // Prime with a token and user using prior successful login calls
    global.fetch = jest
      .fn()
      // login
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'will-be-cleared', token_type: 'bearer' }),
      })
      // me
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, email: 'user@example.com', is_active: true }),
      });

    const user = userEvent.setup();
    setup();

    await act(async () => {
      await user.click(screen.getByTestId('login-btn'));
    });

    await waitFor(() => expect(screen.getByTestId('token').textContent).toBe('will-be-cleared'));
    expect(screen.getByTestId('user').textContent).toBe('user@example.com');

    await act(async () => {
      await user.click(screen.getByTestId('logout-btn'));
    });

    expect(screen.getByTestId('token').textContent).toBe('');
    expect(screen.getByTestId('user').textContent).toBe('');
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  test('token-expired path: me returns 401 -> clears token and user', async () => {
    // Set existing token in localStorage to simulate persisted session
    localStorage.setItem('token', 'expired-token');

    // On mount, AuthProvider likely tries to validate token by calling /auth/me
    global.fetch = jest
      .fn()
      // me -> 401
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ detail: 'Token expired' }),
      });

    setup();

    // After initial effect, token should be cleared
    await waitFor(() => {
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    });

    expect(screen.getByTestId('token').textContent).toBe('');
    expect(screen.getByTestId('user').textContent).toBe('');
  });
});
