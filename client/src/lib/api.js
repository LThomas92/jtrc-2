import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jts_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jts_token');
      localStorage.removeItem('jts_user');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── ENDPOINT HELPERS ─────────────────────────────────────

export const menuAPI = {
  getAll:  (params)    => api.get('/menu', { params }),
  getOne:  (id)        => api.get(`/menu/${id}`),
  create:  (data)      => api.post('/menu', data),
  update:  (id, data)  => api.patch(`/menu/${id}`, data),
  remove:  (id)        => api.delete(`/menu/${id}`),
};

export const packagesAPI = {
  getAll:  ()          => api.get('/packages'),
  getOne:  (id)        => api.get(`/packages/${id}`),
  create:  (data)      => api.post('/packages', data),
  update:  (id, data)  => api.patch(`/packages/${id}`, data),
  remove:  (id)        => api.delete(`/packages/${id}`),
};

export const searchAPI = {
  query: (q) => api.get('/search', { params: { q } }),
};

export const ordersAPI = {
  create:         (data)       => api.post('/orders', data),
  confirmPayment: (id)         => api.post(`/orders/${id}/confirm-payment`),
  getMine:        ()           => api.get('/orders/mine'),
  getAll:         ()           => api.get('/orders'),
  getOne:         (id)         => api.get(`/orders/${id}`),
  updateStatus:   (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

export const authAPI = {
  login:  (email, password) => api.post('/auth/login', { email, password }),
  me:     ()                => api.get('/auth/me'),
  logout: ()                => api.post('/auth/logout'),
};

export const includesAPI = {
  getAll: ()     => api.get('/includes'),
  update: (data) => api.put('/includes', data),
};

export const reviewsAPI = {
  getFeatured: () => api.get('/reviews/featured'),
  getAll:      () => api.get('/reviews'),
};

// siteContentAPI.update uses native fetch instead of Axios.
// Axios has a known issue with PUT + FormData where it can strip
// the multipart boundary, causing multer to silently skip files.
// fetch() passes FormData through untouched with the correct boundary.
export const siteContentAPI = {
  get: () => api.get('/site-content'),

  update: (formData) => {
    const token   = localStorage.getItem('jts_token');
    const baseUrl = API_URL.replace(/\/api$/, '');
    // Construct full URL — API_URL may be '/api' or 'http://localhost:4000/api'
    const url = API_URL.startsWith('http')
      ? `${API_URL}/site-content`
      : `${window.location.origin}${API_URL}/site-content`;

    return fetch(url, {
      method:  'PUT',
      headers: {
        // Do NOT set Content-Type — browser sets it automatically with boundary
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw Object.assign(new Error(data.message || 'Save failed'), { response: { data } });
      return { data };
    });
  },
};

export const contactAPI = {
  send:     (data) => api.post('/contact', data),
  getAll:   ()     => api.get('/contact'),
  markRead: (id)   => api.patch(`/contact/${id}/read`),
  remove:   (id)   => api.delete(`/contact/${id}`),
};
