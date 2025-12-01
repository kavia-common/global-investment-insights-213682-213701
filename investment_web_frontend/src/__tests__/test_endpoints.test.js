import api from '../services/apiClient';
import { AuthAPI, OnboardingAPI, SuggestionsAPI, PortfolioAPI, PricingAPI } from '../services/endpoints';

jest.mock('../services/apiClient', () => {
  const mock = {
    get: jest.fn((url, config) => Promise.resolve({ data: { url, method: 'get', config: config || {}, ok: true } })),
    post: jest.fn((url, body, config) => Promise.resolve({ data: { url, method: 'post', body: body || {}, config: config || {}, ok: true } })),
    interceptors: {
      request: { handlers: [], use: jest.fn(function (fulfilled, rejected) { this.handlers.push({ fulfilled, rejected }); }) },
      response: { handlers: [], use: jest.fn(function (fulfilled, rejected) { this.handlers.push({ fulfilled, rejected }); }) },
    },
    defaults: { baseURL: 'http://test-base' },
  };
  return mock;
});

describe('endpoints exports and stability', () => {
  test('AuthAPI exports: login/register/me/logout defined', () => {
    expect(AuthAPI).toBeDefined();
    expect(typeof AuthAPI.login).toBe('function');
    expect(typeof AuthAPI.register).toBe('function');
    expect(typeof AuthAPI.me).toBe('function');
    expect(typeof AuthAPI.logout).toBe('function');
  });

  test('OnboardingAPI exports: save/get defined', () => {
    expect(OnboardingAPI).toBeDefined();
    expect(typeof OnboardingAPI.save).toBe('function');
    expect(typeof OnboardingAPI.get).toBe('function');
  });

  test('SuggestionsAPI exports: getSuggestions defined', () => {
    expect(SuggestionsAPI).toBeDefined();
    expect(typeof SuggestionsAPI.getSuggestions).toBe('function');
  });

  test('PortfolioAPI exports: get defined', () => {
    expect(PortfolioAPI).toBeDefined();
    expect(typeof PortfolioAPI.get).toBe('function');
  });

  test('PricingAPI exports: getPlans defined', () => {
    expect(PricingAPI).toBeDefined();
    expect(typeof PricingAPI.getPlans).toBe('function');
  });

  test('AuthAPI.login posts to /auth/login with email and password', async () => {
    const result = await AuthAPI.login('user@example.com', 'secret');
    expect(api.post).toHaveBeenCalledWith('/auth/login', { email: 'user@example.com', password: 'secret' });
    expect(result).toBeDefined();
    expect(result.ok).toBe(true);
  });

  test('AuthAPI.register posts to /auth/register with payload', async () => {
    const payload = { email: 'a@b.com', password: 'topsecret' };
    const result = await AuthAPI.register(payload);
    expect(api.post).toHaveBeenCalledWith('/auth/register', payload);
    expect(result).toBeDefined();
    expect(result.ok).toBe(true);
  });

  test('AuthAPI.me gets /auth/me', async () => {
    const result = await AuthAPI.me();
    expect(api.get).toHaveBeenCalledWith('/auth/me');
    expect(result).toBeDefined();
    expect(result.ok).toBe(true);
  });

  test('OnboardingAPI.save posts to /onboarding', async () => {
    const payload = { experience: 'beginner' };
    const result = await OnboardingAPI.save(payload);
    expect(api.post).toHaveBeenCalledWith('/onboarding', payload);
    expect(result).toBeDefined();
    expect(result.ok).toBe(true);
  });

  test('OnboardingAPI.get gets /onboarding', async () => {
    const result = await OnboardingAPI.get();
    expect(api.get).toHaveBeenCalledWith('/onboarding');
    expect(result).toBeDefined();
    expect(result.ok).toBe(true);
  });

  test('SuggestionsAPI.getSuggestions gets /suggestions with query params', async () => {
    const params = { market: 'US', limit: 5 };
    const result = await SuggestionsAPI.getSuggestions(params);
    expect(api.get).toHaveBeenCalledWith('/suggestions', { params });
    expect(result).toBeDefined();
    expect(result.ok).toBe(true);
  });

  test('PortfolioAPI.get gets /portfolio', async () => {
    const result = await PortfolioAPI.get();
    expect(api.get).toHaveBeenCalledWith('/portfolio');
    expect(result).toBeDefined();
    expect(result.ok).toBe(true);
  });

  test('PricingAPI.getPlans gets /pricing/plans', async () => {
    const result = await PricingAPI.getPlans();
    expect(api.get).toHaveBeenCalledWith('/pricing/plans');
    expect(result).toBeDefined();
    expect(result.ok).toBe(true);
  });
});
