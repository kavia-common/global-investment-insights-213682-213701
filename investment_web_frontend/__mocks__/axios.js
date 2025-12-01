/**
 * Axios mock to be used by Jest via moduleNameMapper.
 * Provides minimal get/post implementations that return promises with expected shapes.
 */
const axiosMock = {
  // Default interceptors structure
  interceptors: {
    request: { use: () => {} },
    response: { use: () => {} },
  },
  defaults: {},
  get: jest.fn((url) => {
    const path = typeof url === 'string' ? url : (url && url.url) || '';

    if (path.includes('/auth/me')) {
      return Promise.resolve({ data: { id: 1, email: 'me@example.com', is_active: true, full_name: 'Test User' } });
    }

    if (path.includes('/portfolio')) {
      // Portfolio GET default
      return Promise.resolve({
        data: {
          id: 1,
          name: 'Default',
          currency: 'USD',
          total_value: 100000,
          holdings: [
            { id: 1, portfolio_id: 1, symbol: 'AAPL', quantity: 10, average_price: 150, market: 'US' },
          ],
        },
      });
    }

    if (path.includes('/suggestions')) {
      // Suggestions list default with Apple Inc
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

    // Fallback
    return Promise.resolve({ data: {} });
  }),
  post: jest.fn((url, payload) => {
    const path = typeof url === 'string' ? url : (url && url.url) || '';

    if (path.includes('/auth/login')) {
      return Promise.resolve({ data: { access_token: 'test-token', token_type: 'bearer' } });
    }

    if (path.includes('/auth/signup')) {
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

    return Promise.resolve({ data: {} });
  }),
  create: jest.fn(() => axiosMock),
};

module.exports = axiosMock;
