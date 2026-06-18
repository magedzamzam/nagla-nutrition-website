const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('drnagla_token') || '';
}

export function setToken(token) {
  if (token) localStorage.setItem('drnagla_token', token);
  else localStorage.removeItem('drnagla_token');
}

async function request(path, opts = {}) {
  const headers = { ...(opts.headers || {}) };
  if (!(opts.body instanceof FormData)) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers,
    body: opts.body instanceof FormData ? opts.body : (opts.body ? JSON.stringify(opts.body) : undefined),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  // auth
  login: (username, password) => request('/auth/login', { method: 'POST', body: { username, password } }),
  me: () => request('/auth/me'),
  changePassword: (currentPassword, newPassword) =>
    request('/auth/change-password', { method: 'POST', body: { currentPassword, newPassword } }),

  // media
  listMedia: (category) => request(`/media${category && category !== 'all' ? `?category=${category}` : ''}`),
  uploadMedia: (formData) => request('/media', { method: 'POST', body: formData }),
  updateMedia: (id, patch) => request(`/media/${id}`, { method: 'PATCH', body: patch }),
  deleteMedia: (id) => request(`/media/${id}`, { method: 'DELETE' }),
};
