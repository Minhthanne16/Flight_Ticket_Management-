import api from '../axios';

export const routeService = {
  getAll: async () => {
    const res = await api.get('/routes');
    return res.data?.data || res.data || [];
  }
};
