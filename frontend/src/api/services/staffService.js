import api from '../axios';

export const staffService = {
  getAll: () => api.get('/staffs'),
  getById: (id) => api.get(`/staffs/${id}`),
  update: (id, data) => api.put(`/staffs/${id}`, data),
  search: (q) => api.get('/staffs/search', { params: { q } }),
};
