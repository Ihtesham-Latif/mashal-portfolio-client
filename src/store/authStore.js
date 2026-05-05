import { create } from 'zustand';
import { login as apiLogin, getMe } from '../services/api';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('mp_user') || 'null'),
  token: localStorage.getItem('mp_token') || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await apiLogin(email, password);
      localStorage.setItem('mp_token', data.token);
      localStorage.setItem('mp_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed', loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('mp_token');
    localStorage.removeItem('mp_user');
    set({ user: null, token: null });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
