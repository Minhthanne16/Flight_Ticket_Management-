import api from '../axios';

export const routeService = {
  getAll: async () => {
    const res = await api.get('/routes');
    return res.data?.data || res.data || [];
  },
  create: async (data) => {
    const res = await api.post('/routes', data);
    return res.data?.data || res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/routes/${id}`, data);
    return res.data?.data || res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/routes/${id}`);
    return res.data?.data || res.data;
  },
};
