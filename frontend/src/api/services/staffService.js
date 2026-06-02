import api from '../axios';

export const staffService = {
  getAll: () => api.get('/staffs'),
  getById: (id) => api.get(`/staffs/${id}`),
  create: (data) => api.post('/staffs', data),
  update: (id, data) => api.put(`/staffs/${id}`, data),
  delete: (id) => api.delete(`/staffs/${id}`),
  search: (q) => api.get('/staffs/search', { params: { q } }),
};
