import { create } from 'zustand';
import { authAPI } from '@lib/api';

export const useAuth = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('jts_user') || 'null'),
  token: localStorage.getItem('jts_token') || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.login(email, password);
      localStorage.setItem('jts_token', data.token);
      localStorage.setItem('jts_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    }
  },

  logout: () => {
    localStorage.removeItem('jts_token');
    localStorage.removeItem('jts_user');
    set({ user: null, token: null });
  },

  isAuthenticated: () => !!get().token,
  isAdmin: () => get().user?.role === 'admin',
}));
