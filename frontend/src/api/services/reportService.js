import api from '../axios';

export const reportService = {
  getRevenue: (month, year) => api.get('/reports/revenue', { params: { month, year } }),
  getOccupancy: (flightId) => api.get('/reports/occupancy', { params: { flightId } }),
};
