const axios = {
  create: jest.fn(function (config = {}) {
    const instance = {
      defaults: { ...config },
      interceptors: {
        request: { use: jest.fn((fn) => fn && fn({ headers: {} })) },
        response: { use: jest.fn((success, error) => success || error) },
      },
      get: jest.fn((url, opts) => Promise.resolve({ data: {} })),
      post: jest.fn((url, body, opts) => Promise.resolve({ data: {} })),
      put: jest.fn((url, body, opts) => Promise.resolve({ data: {} })),
      delete: jest.fn((url, opts) => Promise.resolve({ data: {} })),
    };
    return instance;
  }),
  get: jest.fn((url, opts) => Promise.resolve({ data: {} })),
  post: jest.fn((url, body, opts) => Promise.resolve({ data: {} })),
  put: jest.fn((url, body, opts) => Promise.resolve({ data: {} })),
  delete: jest.fn((url, opts) => Promise.resolve({ data: {} })),
};

module.exports = axios;
