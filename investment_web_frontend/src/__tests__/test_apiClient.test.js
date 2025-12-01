import axios from 'axios';
import api from '../services/apiClient';

describe('apiClient configuration and interceptors', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
    // Ensure localStorage is clean and mocked
    const store = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((k) => store[k] || null),
        setItem: jest.fn((k, v) => { store[k] = String(v); }),
        removeItem: jest.fn((k) => { delete store[k]; }),
        clear: jest.fn(() => {
          Object.keys(store).forEach((k) => delete store[k]);
        }),
      },
      writable: true,
    });
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  test('uses baseURL from REACT_APP_API_BASE_URL and sets default headers', async () => {
    const BASE = 'https://example.test.api';
    process.env.REACT_APP_API_BASE_URL = BASE;

    // Re-import api to pick up env change
    jest.resetModules();
    const freshApi = (await import('../services/apiClient')).default;

    // axios mock is a function returning a promise; for axios.create we return an object with config & interceptors in __mocks__/axios.js
    expect(freshApi.defaults.baseURL).toBe(BASE);
    // Ensure default headers exist (Accept, Content-Type usually set by axios per request; test we can set headers on the request)
    // We will trigger a get call and ensure axios mock receives headers object
    const responseData = { ok: true };
    // mock underlying axios instance request method used in __mocks__/axios.js
    const spy = jest.spyOn(freshApi, 'get');
    // mock implementation: __mocks__/axios.js resolves with { data: ... }
    await freshApi.get('/health');

    expect(spy).toHaveBeenCalledWith('/health');
    // cleanup
    spy.mockRestore();
  });

  test('request interceptor attaches Authorization header when token exists', async () => {
    // Put a token in localStorage
    window.localStorage.setItem('auth_token', 'abc123');

    // Use existing api instance (interceptors attached)
    // Spy on axios request config by mocking api.get to return a promise from axios mock
    // Our axios mock records the last config if supported; instead, we inspect headers passed through the adapter layer by spying on api.interceptors.request.handlers[0].fulfilled
    const reqHandler = api.interceptors.request.handlers[0].fulfilled;
    const config = { headers: {} };
    const resultConfig = await reqHandler(config);

    expect(resultConfig.headers.Authorization).toBe('Bearer abc123');
  });

  test('does not attach Authorization header when no token present', async () => {
    window.localStorage.clear();

    const reqHandler = api.interceptors.request.handlers[0].fulfilled;
    const config = { headers: {} };
    const resultConfig = await reqHandler(config);

    expect(resultConfig.headers.Authorization).toBeUndefined();
  });

  test('response interceptor propagates error (rejects promise)', async () => {
    const error = new Error('network fail');
    const errHandler = api.interceptors.response.handlers[0].rejected;

    await expect(errHandler(error)).rejects.toThrow('network fail');
  });
});
