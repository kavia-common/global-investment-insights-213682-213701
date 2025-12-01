 /**
  * Robust Axios mock for Jest.
  * - Provides axios.create(config) returning an instance with:
  *   - defaults (including baseURL)
  *   - interceptors.request/response.use jest.fn() storing handlers array
  *   - get/post methods resolving to { data: ... }
  * - Also exposes top-level get/post consistent with instance
  */
function makeInstance(config = {}) {
  const handlers = {
    request: [],
    response: [],
  };

  const instance = {
    defaults: {
      ...(config || {}),
      baseURL: config?.baseURL,
    },
    interceptors: {
      request: {
        handlers: handlers.request,
        use: jest.fn((fulfilled, rejected) => {
          handlers.request.push({ fulfilled, rejected });
          return handlers.request.length - 1;
        }),
      },
      response: {
        handlers: handlers.response,
        use: jest.fn((fulfilled, rejected) => {
          handlers.response.push({ fulfilled, rejected });
          return handlers.response.length - 1;
        }),
      },
    },
    get: jest.fn((url, cfg) => {
      const path = typeof url === 'string' ? url : (url && url.url) || '';
      // Minimal canned routes; tests often only verify shape
      if (path.includes('/auth/me')) {
        return Promise.resolve({ data: { id: 1, email: 'me@example.com', is_active: true, full_name: 'Test User' } });
      }
      if (path.includes('/portfolio')) {
        return Promise.resolve({
          data: {
            id: 1,
            name: 'Default',
            currency: 'USD',
            total_value: 100000,
            holdings: [{ id: 1, portfolio_id: 1, symbol: 'AAPL', quantity: 10, average_price: 150, market: 'US' }],
          },
        });
      }
      if (path.includes('/suggestions')) {
        return Promise.resolve({
          data: {
            items: [
              {
                id: 1,
                user_id: 1,
                symbol: 'AAPL',
                action: 'buy',
                rationale: 'Apple Inc growth',
                target_price: 200.0,
                market: 'US',
                name: 'Apple Inc',
              },
            ],
          },
        });
      }
      return Promise.resolve({ data: { url: path, method: 'get', config: cfg || {} } });
    }),
    post: jest.fn((url, payload, cfg) => {
      const path = typeof url === 'string' ? url : (url && url.url) || '';
      if (path.includes('/auth/login')) {
        return Promise.resolve({ data: { access_token: 'test-token', token_type: 'bearer' } });
      }
      if (path.includes('/auth/signup') || path.includes('/auth/register')) {
        const email = payload?.email || 'me@example.com';
        return Promise.resolve({ data: { id: 1, email, is_active: true, full_name: payload?.full_name || 'User' } });
      }
      if (path.includes('/suggestions')) {
        const symbol = payload?.symbol || 'AAPL';
        return Promise.resolve({
          data: {
            id: 2,
            user_id: 1,
            symbol,
            action: payload?.action || 'buy',
            rationale: payload?.rationale || 'Based on mock data',
            target_price: payload?.target_price ?? 200.0,
            market: payload?.market || 'US',
            name: symbol === 'AAPL' ? 'Apple Inc' : 'Company',
          },
        });
      }
      if (path.includes('/portfolio/holdings')) {
        return Promise.resolve({
          data: {
            id: 2,
            portfolio_id: 1,
            symbol: payload?.symbol || 'AAPL',
            quantity: payload?.quantity ?? 1,
            average_price: payload?.average_price ?? 100.0,
            market: payload?.market || 'US',
          },
        });
      }
      if (path.includes('/onboarding')) {
        return Promise.resolve({
          data: {
            id: 1,
            user_id: 1,
            experience_level: payload?.experience_level ?? 'beginner',
            risk_tolerance: payload?.risk_tolerance ?? 'low',
            goals: payload?.goals ?? 'wealth',
            markets: payload?.markets ?? 'US',
          },
        });
      }
      if (path.includes('/subscription')) {
        return Promise.resolve({
          data: {
            id: 1,
            user_id: 1,
            is_active: payload?.is_active ?? true,
            plan: payload?.plan ?? 'free',
          },
        });
      }
      if (path.includes('/integrations')) {
        return Promise.resolve({
          data: {
            id: 1,
            user_id: 1,
            provider: payload?.provider ?? 'alpaca',
            access_key: payload?.access_key ?? null,
          },
        });
      }
      return Promise.resolve({ data: { url: path, method: 'post', body: payload || {}, config: cfg || {} } });
    }),
  };
  return instance;
}

const axiosMock = makeInstance();

axiosMock.create = jest.fn((config) => {
  const inst = makeInstance(config);
  return inst;
});

// Top-level get/post for modules importing axios directly
axiosMock.get = axiosMock.get;
axiosMock.post = axiosMock.post;

module.exports = axiosMock;
