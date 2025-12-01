const jestGlobal = typeof jest !== "undefined" ? jest : { fn: () => () => {} };

/**
 * Minimal but robust axios Jest mock supporting:
 * - axios.create(config) -> returns instance with defaults, interceptors, get/post
 * - top-level axios.get/post behaving similarly
 * - Interceptor registration via interceptors.request.use / interceptors.response.use
 * - Defaults containing baseURL and headers pulled from config
 *
 * All calls resolve with a predictable shape: { data: { ok: true, url, body? } }
 */
function buildInstance(config = {}) {
  const instance = {
    defaults: {
      baseURL: config?.baseURL || "",
      headers: config?.headers || {},
    },
    interceptors: {
      request: {
        use: jestGlobal.fn(),
        handlers: [],
      },
      response: {
        use: jestGlobal.fn(),
        handlers: [],
      },
    },
    // Mocked HTTP methods
    get: jestGlobal.fn((url, cfg) =>
      Promise.resolve({
        data: { ok: true, url },
        status: 200,
        statusText: "OK",
        headers: {},
        config: cfg || {},
      })
    ),
    post: jestGlobal.fn((url, body, cfg) =>
      Promise.resolve({
        data: { ok: true, url, body },
        status: 200,
        statusText: "OK",
        headers: {},
        config: cfg || {},
      })
    ),
  };
  return instance;
}

const axiosMock = buildInstance();

axiosMock.create = (config) => buildInstance(config);

// Provide top-level get/post as well for code that imports axios directly
axiosMock.get = axiosMock.get || jestGlobal.fn((url, cfg) =>
  Promise.resolve({
    data: { ok: true, url },
    status: 200,
    statusText: "OK",
    headers: {},
    config: cfg || {},
  })
);

axiosMock.post = axiosMock.post || jestGlobal.fn((url, body, cfg) =>
  Promise.resolve({
    data: { ok: true, url, body },
    status: 200,
    statusText: "OK",
    headers: {},
    config: cfg || {},
  })
);

module.exports = axiosMock;
