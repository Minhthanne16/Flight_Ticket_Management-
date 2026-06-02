import api from '../axios';

export const regulationService = {
  getAll: () => api.get('/configs'),
  getById: (id) => api.get(`/configs/${id}`),
  create: (data) => api.post('/configs', data),
  update: (id, data) => api.put(`/configs/${id}`, data),
  getByKey: (key) => api.get('/configs/search', { params: { key } }),
};
