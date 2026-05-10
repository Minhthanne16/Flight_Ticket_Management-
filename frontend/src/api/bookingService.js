import api from './axios';

export const bookingService = {
  getRecentBookings: async () => {
    // return api.get('/bookings/recent').then(res => res.data);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { id: 'BK7829', customer: 'Nguyễn Văn A', flight: 'VN123', date: '14 Jul, 2024', status: 'CONFIRMED', total: '2,500,000 đ' },
          { id: 'BK7830', customer: 'Trần Thị B', flight: 'VJ456', date: '14 Jul, 2024', status: 'PENDING', total: '1,200,000 đ' },
          { id: 'BK7831', customer: 'Lê Văn C', flight: 'QH789', date: '13 Jul, 2024', status: 'CANCELLED', total: '3,100,000 đ' }
        ]);
      }, 500);
    });
  },
  
  getBookingDetails: async (id) => {
    // return api.get(`/bookings/${id}`).then(res => res.data);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          id: id,
          pnr: 'XYZ123',
          status: 'CONFIRMED',
          bookingDate: '12 Jul 2024 14:30',
          customer: {
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@email.com',
            phone: '+84 901 234 567',
            type: 'Thành viên Vàng'
          },
          flight: {
            id: 'VN123',
            airline: 'Vietnam Airlines',
            departure: { city: 'Hồ Chí Minh', code: 'SGN', time: '06:00', date: '15 Jul 2024' },
            arrival: { city: 'Hà Nội', code: 'HAN', time: '08:15', date: '15 Jul 2024' },
            class: 'Phổ thông (Y)'
          },
          passengers: [
            { name: 'Nguyễn Văn A', type: 'Người lớn', seat: '12A', baggage: '20kg Ký gửi' },
            { name: 'Nguyễn Thị B', type: 'Người lớn', seat: '12B', baggage: '20kg Ký gửi' }
          ],
          payment: {
            method: 'Thẻ tín dụng (Visa)',
            last4: '4242',
            amount: '5,000,000 đ',
            status: 'Đã thanh toán',
            transactionId: 'TXN-987654321'
          }
        });
      }, 500);
    });
  }
};
