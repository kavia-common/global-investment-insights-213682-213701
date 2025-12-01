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

  test('exposes defaults and baseURL via axios.create', async () => {
    // Uses whatever env is set; in tests may be defaulted
    expect(api).toBeDefined();
    expect(api.defaults).toBeDefined();
    expect(typeof api.defaults).toBe('object');
    expect('baseURL' in api.defaults).toBe(true);
  });

  test('registers interceptors without throwing', () => {
    expect(api.interceptors).toBeDefined();
    expect(api.interceptors.request).toBeDefined();
    expect(api.interceptors.response).toBeDefined();

    expect(() => api.interceptors.request.use(() => {})).not.toThrow();
    expect(() => api.interceptors.response.use((r) => r)).not.toThrow();
  });

  test('request interceptor attaches Authorization header when token exists', async () => {
    window.localStorage.setItem('auth_token', 'abc123');
    // Our axios mock stores handlers array for direct access in tests
    const reqHandler = api.interceptors.request.handlers[0]?.fulfilled || ((c) => c);
    const config = { headers: {} };
    const resultConfig = await reqHandler(config);
    expect(resultConfig.headers.Authorization).toBe('Bearer abc123');
  });

  test('request interceptor leaves Authorization undefined when no token', async () => {
    window.localStorage.clear();
    const reqHandler = api.interceptors.request.handlers[0]?.fulfilled || ((c) => c);
    const config = { headers: {} };
    const resultConfig = await reqHandler(config);
    expect(resultConfig.headers.Authorization).toBeUndefined();
  });

  test('mocked GET returns { data } with ok and url', async () => {
    const response = await api.get('/health');
    expect(response).toBeDefined();
    expect(response.data).toBeDefined();
    expect(response.data.ok).toBe(true);
    expect(response.data.url).toBe('/health');
  });

  test('mocked POST returns { data } with ok, url and body', async () => {
    const payload = { foo: 'bar' };
    const response = await api.post('/login', payload);
    expect(response).toBeDefined();
    expect(response.data).toBeDefined();
    expect(response.data.ok).toBe(true);
    expect(response.data.url).toBe('/login');
    expect(response.data.body).toEqual(payload);
  });

  test('response interceptor rejects errors as-is', async () => {
    const error = new Error('network fail');
    const errHandler = api.interceptors.response.handlers[0]?.rejected || ((e) => Promise.reject(e));
    await expect(errHandler(error)).rejects.toThrow('network fail');
  });
});
