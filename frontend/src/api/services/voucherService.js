import api from '../axios';

export const voucherService = {
  getAll: () => api.get('/vouchers'),
  create: (data) => api.post('/vouchers', data),
  update: (id, data) => api.put(`/vouchers/${id}`, data),
  remove: (id) => api.delete(`/vouchers/${id}`),
  apply: (data) => api.post('/vouchers/apply', data),
  preview: (data) => api.post('/vouchers/preview', data),
};
