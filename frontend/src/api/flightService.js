import api from './axios';

export const flightService = {
  getUpcomingFlights: async () => {
    // return api.get('/flights/upcoming').then(res => res.data);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 'VN123',
            airline: 'Vietnam Airlines',
            logo: '✈',
            route: { from: 'Hồ Chí Minh', to: 'Hà Nội' },
            departure: { time: '06:00', date: '15 Jul, 2024' },
            capacity: { booked: 280, total: 320 },
            status: 'BOARDING',
          },
          {
            id: 'VJ456',
            airline: 'Vietjet Air',
            logo: '✈',
            route: { from: 'Đà Nẵng', to: 'Tokyo' },
            departure: { time: '08:30', date: '15 Jul, 2024' },
            capacity: { booked: 190, total: 240 },
            status: 'SCHEDULED',
          },
          {
            id: 'QH789',
            airline: 'Bamboo Airways',
            logo: '✈',
            route: { from: 'Phú Quốc', to: 'Hồ Chí Minh' },
            departure: { time: '10:15', date: '15 Jul, 2024' },
            capacity: { booked: 85, total: 120 },
            status: 'CHECK-IN',
          },
        ]);
      }, 500);
    });
  },

  getAllFlights: async (filters) => {
    // return api.get('/flights', { params: filters }).then(res => res.data);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { id: 'VN123', flightNumber: 'VN123', from: 'SGN', to: 'HAN', departureTime: '06:00 15/07/2024', arrivalTime: '08:15 15/07/2024', status: 'ON_TIME', gate: '05' },
          { id: 'VJ456', flightNumber: 'VJ456', from: 'DAD', to: 'NRT', departureTime: '08:30 15/07/2024', arrivalTime: '15:45 15/07/2024', status: 'DELAYED', gate: '12' },
        ]);
      }, 500);
    });
  }
};
