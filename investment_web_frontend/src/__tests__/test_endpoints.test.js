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
    const data = await AuthAPI.login('user@example.com', 'secret');
    expect(api.post).toHaveBeenCalledWith('/auth/login', { email: 'user@example.com', password: 'secret' });
    expect(data.url).toBe('/auth/login');
    expect(data.method).toBe('post');
    expect(data.body).toEqual({ email: 'user@example.com', password: 'secret' });
  });

  test('AuthAPI.register posts to /auth/register with payload', async () => {
    const payload = { email: 'a@b.com', password: 'topsecret' };
    const data = await AuthAPI.register(payload);
    expect(api.post).toHaveBeenCalledWith('/auth/register', payload);
    expect(data.url).toBe('/auth/register');
    expect(data.method).toBe('post');
    expect(data.body).toEqual(payload);
  });

  test('AuthAPI.me gets /auth/me', async () => {
    const data = await AuthAPI.me();
    expect(api.get).toHaveBeenCalledWith('/auth/me');
    expect(data.url).toBe('/auth/me');
    expect(data.method).toBe('get');
  });

  test('OnboardingAPI.save posts to /onboarding', async () => {
    const payload = { experience: 'beginner' };
    const data = await OnboardingAPI.save(payload);
    expect(api.post).toHaveBeenCalledWith('/onboarding', payload);
    expect(data.url).toBe('/onboarding');
    expect(data.method).toBe('post');
    expect(data.body).toEqual(payload);
  });

  test('OnboardingAPI.get gets /onboarding', async () => {
    const data = await OnboardingAPI.get();
    expect(api.get).toHaveBeenCalledWith('/onboarding');
    expect(data.url).toBe('/onboarding');
    expect(data.method).toBe('get');
  });

  test('SuggestionsAPI.getSuggestions gets /suggestions with query params', async () => {
    const params = { market: 'US', limit: 5 };
    const data = await SuggestionsAPI.getSuggestions(params);
    expect(api.get).toHaveBeenCalledWith('/suggestions', { params });
    expect(data.url).toBe('/suggestions');
    expect(data.method).toBe('get');
    expect(data.config).toEqual({ params });
  });

  test('PortfolioAPI.get gets /portfolio', async () => {
    const data = await PortfolioAPI.get();
    expect(api.get).toHaveBeenCalledWith('/portfolio');
    expect(data.url).toBe('/portfolio');
    expect(data.method).toBe('get');
  });

  test('PricingAPI.getPlans gets /pricing/plans', async () => {
    const data = await PricingAPI.getPlans();
    expect(api.get).toHaveBeenCalledWith('/pricing/plans');
    expect(data.url).toBe('/pricing/plans');
    expect(data.method).toBe('get');
  });
});
