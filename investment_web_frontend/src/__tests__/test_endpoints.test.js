import axios from 'axios';
import api from '../services/apiClient';
import { AuthAPI, OnboardingAPI, SuggestionsAPI, PortfolioAPI, PricingAPI } from '../services/endpoints';

jest.mock('../services/apiClient', () => {
  // Create a lightweight mock axios instance compatible with endpoints usage
  const mock = {
    get: jest.fn((url, config) => Promise.resolve({ data: { url, method: 'get', config: config || {} } })),
    post: jest.fn((url, body, config) => Promise.resolve({ data: { url, method: 'post', body: body || {}, config: config || {} } })),
    interceptors: {
      request: { handlers: [], use: jest.fn() },
      response: { handlers: [], use: jest.fn() },
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
    const res = await AuthAPI.login('user@example.com', 'secret');
    expect(api.post).toHaveBeenCalledWith('/auth/login', { email: 'user@example.com', password: 'secret' });
    expect(res.url).toBe('/auth/login');
    expect(res.method).toBe('post');
    expect(res.body).toEqual({ email: 'user@example.com', password: 'secret' });
  });

  test('AuthAPI.register posts to /auth/register with payload', async () => {
    const payload = { email: 'a@b.com', password: 'topsecret' };
    const res = await AuthAPI.register(payload);
    expect(api.post).toHaveBeenCalledWith('/auth/register', payload);
    expect(res.url).toBe('/auth/register');
    expect(res.method).toBe('post');
    expect(res.body).toEqual(payload);
  });

  test('AuthAPI.me gets /auth/me', async () => {
    const res = await AuthAPI.me();
    expect(api.get).toHaveBeenCalledWith('/auth/me');
    expect(res.url).toBe('/auth/me');
    expect(res.method).toBe('get');
  });

  test('OnboardingAPI.save posts to /onboarding', async () => {
    const payload = { experience: 'beginner' };
    const res = await OnboardingAPI.save(payload);
    expect(api.post).toHaveBeenCalledWith('/onboarding', payload);
    expect(res.url).toBe('/onboarding');
    expect(res.method).toBe('post');
    expect(res.body).toEqual(payload);
  });

  test('OnboardingAPI.get gets /onboarding', async () => {
    const res = await OnboardingAPI.get();
    expect(api.get).toHaveBeenCalledWith('/onboarding');
    expect(res.url).toBe('/onboarding');
    expect(res.method).toBe('get');
  });

  test('SuggestionsAPI.getSuggestions gets /suggestions with query params', async () => {
    const params = { market: 'US', limit: 5 };
    const res = await SuggestionsAPI.getSuggestions(params);
    expect(api.get).toHaveBeenCalledWith('/suggestions', { params });
    expect(res.url).toBe('/suggestions');
    expect(res.method).toBe('get');
    expect(res.config).toEqual({ params });
  });

  test('PortfolioAPI.get gets /portfolio', async () => {
    const res = await PortfolioAPI.get();
    expect(api.get).toHaveBeenCalledWith('/portfolio');
    expect(res.url).toBe('/portfolio');
    expect(res.method).toBe('get');
  });

  test('PricingAPI.getPlans gets /pricing/plans', async () => {
    const res = await PricingAPI.getPlans();
    expect(api.get).toHaveBeenCalledWith('/pricing/plans');
    expect(res.url).toBe('/pricing/plans');
    expect(res.method).toBe('get');
  });
});
