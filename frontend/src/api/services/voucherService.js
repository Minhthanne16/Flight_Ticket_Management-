import api from '../axios';

export const voucherService = {
  getAll: () => api.get('/vouchers'),
  create: (data) => api.post('/vouchers', data),
  apply: (data) => api.post('/vouchers/apply', data),
};
