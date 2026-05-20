import axios from 'axios';

// ─── Smart base URL ────────────────────────────────────────────────────────────
// On the server (SSR) or PC browser → use localhost.
// On a mobile device on the same LAN → the env var will be the LAN IP.
// We detect mobile by checking if the hostname is NOT localhost/127.0.0.1.
function getBaseURL(): string {
  const envURL = process.env.NEXT_PUBLIC_API_URL;

  // Server-side rendering — always use localhost
  if (typeof window === 'undefined') {
    return 'http://localhost:5000/api/v1';
  }

  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

  if (isLocalhost) {
    // PC browser — use localhost regardless of what env says
    return 'http://localhost:5000/api/v1';
  }

  // Mobile / other device on LAN — use the env URL (which should be the LAN IP)
  return envURL || `http://${hostname}:5000/api/v1`;
}

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  // 5 seconds — fast enough to fall back to static data without hanging the UI
  timeout: 5000,
});

// ─── Request interceptor — attach JWT ─────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — handle 401 refresh ────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Network errors (timeout, connection refused) — fail silently so
    // components can show their fallback data without a toast spam
    if (!error.response) {
      return Promise.reject(error);
    }

    // 401 → try refresh token once
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(
          `${getBaseURL()}/auth/refresh-token`,
          {},
          { withCredentials: true, timeout: 5000 }
        );
        const newToken = data.data?.accessToken;
        if (newToken) {
          localStorage.setItem('accessToken', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch {
        localStorage.removeItem('accessToken');
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
