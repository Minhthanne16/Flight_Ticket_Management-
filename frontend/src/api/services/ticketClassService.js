import api from '../axios';

export const ticketClassService = {
  getAll: async () => {
    const res = await api.get('/admin/ticket-classes');
    return res.data?.data || res.data || [];
  },
  create: async (data) => {
    const res = await api.post('/admin/ticket-classes', data);
    return res.data?.data || res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/admin/ticket-classes/${id}`, data);
    return res.data?.data || res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/admin/ticket-classes/${id}`);
    return res.data?.data || res.data;
  },
};
