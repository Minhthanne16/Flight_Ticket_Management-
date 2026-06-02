import api from '../axios';

export const airlineService = {
  getAll: async () => {
    const res = await api.get('/admin/airlines');
    return res.data?.data || res.data || [];
  },
  create: async (data) => {
    const res = await api.post('/admin/airlines', data);
    return res.data?.data || res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/admin/airlines/${id}`, data);
    return res.data?.data || res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/admin/airlines/${id}`);
    return res.data?.data || res.data;
  },
};
