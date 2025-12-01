import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { AuthAPI } from '../services/endpoints';

export const AuthContext = createContext(null);

/**
 * Handles auth token persistence and user fetching.
 * Provides login, register, logout, and auth state.
 */
// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  const setAuthToken = useCallback((tkn) => {
    if (tkn) {
      localStorage.setItem('auth_token', tkn);
    } else {
      localStorage.removeItem('auth_token');
    }
    setToken(tkn);
  }, []);

  const fetchMe = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await AuthAPI.me();
      setUser(me);
    } catch (e) {
      // invalid token likely
      setAuthToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token, setAuthToken]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = useCallback(async (email, password) => {
    const data = await AuthAPI.login(email, password);
    if (data?.token) {
      setAuthToken(data.token);
      await fetchMe();
    }
    return data;
  }, [fetchMe, setAuthToken]);

  const register = useCallback(async (payload) => {
    const data = await AuthAPI.register(payload);
    // If backend returns token on register, set it
    if (data?.token) {
      setAuthToken(data.token);
      await fetchMe();
    }
    return data;
  }, [fetchMe, setAuthToken]);

  const logout = useCallback(async () => {
    try {
      await AuthAPI.logout();
    } catch (e) {
      // ignore if endpoint not implemented
    }
    setAuthToken(null);
    setUser(null);
  }, [setAuthToken]);

  const value = useMemo(() => ({
    token,
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  }), [token, user, loading, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
