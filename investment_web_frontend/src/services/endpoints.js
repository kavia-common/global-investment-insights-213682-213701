import api from './apiClient';

/**
 * NOTE: Backend openapi only exposes "/" health check currently.
 * These endpoints are created as placeholders following common patterns.
 * Wire these paths to the backend once implemented.
 */

// PUBLIC_INTERFACE
export const AuthAPI = {
  /** Login with email and password; expects {token} */
  // PUBLIC_INTERFACE
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  /** Register user; expects {id} or {token} depending on backend */
  // PUBLIC_INTERFACE
  register: async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },
  /** Get current user profile */
  // PUBLIC_INTERFACE
  me: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },
  /** Logout (optional server call) */
  // PUBLIC_INTERFACE
  logout: async () => {
    const { data } = await api.post('/auth/logout');
    return data;
  },
};

// PUBLIC_INTERFACE
export const OnboardingAPI = {
  /** Save onboarding progress (experience, riskTolerance, goals, markets) */
  // PUBLIC_INTERFACE
  save: async (payload) => {
    const { data } = await api.post('/onboarding', payload);
    return data;
  },
  /** Fetch onboarding status/data */
  // PUBLIC_INTERFACE
  get: async () => {
    const { data } = await api.get('/onboarding');
    return data;
  },
};

// PUBLIC_INTERFACE
export const SuggestionsAPI = {
  /** Fetch investment suggestions for given input */
  // PUBLIC_INTERFACE
  getSuggestions: async (params) => {
    const { data } = await api.get('/suggestions', { params });
    return data;
  },
};

// PUBLIC_INTERFACE
export const PortfolioAPI = {
  /** Get portfolio summary/positions */
  // PUBLIC_INTERFACE
  get: async () => {
    const { data } = await api.get('/portfolio');
    return data;
  },
};

// PUBLIC_INTERFACE
export const PricingAPI = {
  /** Get pricing plans */
  // PUBLIC_INTERFACE
  getPlans: async () => {
    const { data } = await api.get('/pricing/plans');
    return data;
  },
};
