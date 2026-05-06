import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`
});

/* Attach JWT token to every request */
api.interceptors.request.use(config => {
  const token = localStorage.getItem('mp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* Auto-logout on 401 */
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mp_token');
      localStorage.removeItem('mp_user');
    }
    return Promise.reject(err);
  }
);

/* ── AUTH ── */
export const login = (email, password) =>
  api.post('/auth/login', { email, password }).then(r => r.data);
export const getMe = () => api.get('/auth/me').then(r => r.data);
export const changePassword = (data) =>
  api.put('/auth/change-password', data).then(r => r.data);

/* ── HERO ── */
export const getHero = () => api.get('/hero').then(r => r.data);
export const updateHero = (data) => api.put('/hero', data).then(r => r.data);

/* ── CATEGORIES ── */
export const getCategories = () => api.get('/categories').then(r => r.data);
export const getCategoriesAdmin = () => api.get('/categories/admin').then(r => r.data);
export const getCategory = (id) => api.get(`/categories/${id}`).then(r => r.data);
export const createCategory = (formData) =>
  api.post('/categories', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
export const updateCategory = (id, formData) =>
  api.put(`/categories/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`).then(r => r.data);

/* ── PROJECTS ── */
export const getProjects = (params = {}) =>
  api.get('/projects', { params }).then(r => r.data);
export const getProjectsAdmin = () => api.get('/projects/admin').then(r => r.data);
export const getProject = (id) => api.get(`/projects/${id}`).then(r => r.data);
export const createProject = (formData) =>
  api.post('/projects', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
export const updateProject = (id, formData) =>
  api.put(`/projects/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
export const deleteProject = (id) => api.delete(`/projects/${id}`).then(r => r.data);

export default api;
