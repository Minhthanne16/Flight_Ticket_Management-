import api from '../axios';

export const airplaneModelService = {
  getAll: async () => {
    const res = await api.get('/admin/airplane-models');
    return res.data?.data || res.data || [];
  },
  create: async (data) => {
    const res = await api.post('/admin/airplane-models', data);
    return res.data?.data || res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/admin/airplane-models/${id}`);
    return res.data?.data || res.data;
  },
};
