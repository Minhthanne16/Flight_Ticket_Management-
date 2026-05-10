import api from './axios';

export const dashboardService = {
  getMetrics: async () => {
    // return api.get('/dashboard/metrics').then(res => res.data);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          revenue: {
            total: '19.820.000 đ',
            trend: '+12.5%',
            isPositive: true
          },
          bookings: {
            today: 6,
            label: 'Hôm nay'
          },
          flights: {
            today: 6,
            active: 4,
            arrived: 2
          },
          occupancy: {
            percentage: 88,
            booked: 1274,
            total: 1500
          }
        });
      }, 500);
    });
  }
};
