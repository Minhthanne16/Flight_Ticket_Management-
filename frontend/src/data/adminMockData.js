// ─── Admin Mock Data ─────────────────────────────────────────────────────────

export const REVENUE_CHART = [
  { day: 'T2', revenue: 3200000000, tickets: 142 },
  { day: 'T3', revenue: 2800000000, tickets: 118 },
  { day: 'T4', revenue: 4100000000, tickets: 189 },
  { day: 'T5', revenue: 3700000000, tickets: 165 },
  { day: 'T6', revenue: 5200000000, tickets: 234 },
  { day: 'T7', revenue: 6800000000, tickets: 312 },
  { day: 'CN', revenue: 5900000000, tickets: 278 },
];

export const ADMIN_STATS = {
  totalRevenue: 31700000000,
  revenueGrowth: '+14.2%',
  totalTickets: 1438,
  ticketGrowth: '+8.5%',
  totalFlights: 42,
  flightGrowth: '+3',
  occupancyRate: 78,
  occupancyGrowth: '+2.1%',
};

export const AIRPORTS = [
  { id: 'SGN', code: 'SGN', name: 'Tân Sơn Nhất', city: 'TP. Hồ Chí Minh', country: 'Việt Nam', status: 'ACTIVE', terminals: 2 },
  { id: 'HAN', code: 'HAN', name: 'Nội Bài', city: 'Hà Nội', country: 'Việt Nam', status: 'ACTIVE', terminals: 2 },
  { id: 'DAD', code: 'DAD', name: 'Đà Nẵng', city: 'Đà Nẵng', country: 'Việt Nam', status: 'ACTIVE', terminals: 1 },
  { id: 'CXR', code: 'CXR', name: 'Cam Ranh', city: 'Khánh Hòa', country: 'Việt Nam', status: 'ACTIVE', terminals: 1 },
  { id: 'HPH', code: 'HPH', name: 'Cát Bi', city: 'Hải Phòng', country: 'Việt Nam', status: 'ACTIVE', terminals: 1 },
  { id: 'PQC', code: 'PQC', name: 'Phú Quốc', city: 'Kiên Giang', country: 'Việt Nam', status: 'ACTIVE', terminals: 1 },
  { id: 'VCA', code: 'VCA', name: 'Cần Thơ', city: 'Cần Thơ', country: 'Việt Nam', status: 'ACTIVE', terminals: 1 },
  { id: 'UIH', code: 'UIH', name: 'Phù Cát', city: 'Bình Định', country: 'Việt Nam', status: 'INACTIVE', terminals: 1 },
];

export const ROUTES = [
  { id: 'R001', from: 'SGN', fromCity: 'TP. HCM', to: 'HAN', toCity: 'Hà Nội', distance: 1137, duration: '2h 10m', status: 'ACTIVE', flightsThisMonth: 62 },
  { id: 'R002', from: 'HAN', fromCity: 'Hà Nội', to: 'SGN', toCity: 'TP. HCM', distance: 1137, duration: '2h 05m', status: 'ACTIVE', flightsThisMonth: 58 },
  { id: 'R003', from: 'SGN', fromCity: 'TP. HCM', to: 'DAD', toCity: 'Đà Nẵng', distance: 604, duration: '1h 15m', status: 'ACTIVE', flightsThisMonth: 44 },
  { id: 'R004', from: 'DAD', fromCity: 'Đà Nẵng', to: 'HAN', toCity: 'Hà Nội', distance: 568, duration: '1h 10m', status: 'ACTIVE', flightsThisMonth: 38 },
  { id: 'R005', from: 'SGN', fromCity: 'TP. HCM', to: 'PQC', toCity: 'Phú Quốc', distance: 285, duration: '0h 55m', status: 'ACTIVE', flightsThisMonth: 30 },
  { id: 'R006', from: 'HAN', fromCity: 'Hà Nội', to: 'CXR', toCity: 'Khánh Hòa', distance: 871, duration: '1h 45m', status: 'INACTIVE', flightsThisMonth: 0 },
];

export const ADMIN_FLIGHTS = [
  { id: 'VN201', airline: 'Vietnam Airlines', aircraft: 'A321neo', route: 'SGN → HAN', from: 'SGN', to: 'HAN', dep: '06:00', arr: '08:10', date: '2026-05-16', basePrice: 1250000, totalSeats: 200, bookedSeats: 178, status: 'BOARDING' },
  { id: 'VJ305', airline: 'VietJet Air', aircraft: 'B737-800', route: 'HAN → DAD', from: 'HAN', to: 'DAD', dep: '09:30', arr: '10:45', date: '2026-05-16', basePrice: 850000, totalSeats: 189, bookedSeats: 145, status: 'SCHEDULED' },
  { id: 'QH412', airline: 'Bamboo Airways', aircraft: 'A320', route: 'SGN → CXR', from: 'SGN', to: 'CXR', dep: '11:00', arr: '12:10', date: '2026-05-16', basePrice: 980000, totalSeats: 180, bookedSeats: 92, status: 'DELAYED' },
  { id: 'VN518', airline: 'Vietnam Airlines', aircraft: 'B787-9', route: 'DAD → SGN', from: 'DAD', to: 'SGN', dep: '13:15', arr: '14:25', date: '2026-05-16', basePrice: 790000, totalSeats: 300, bookedSeats: 267, status: 'SCHEDULED' },
  { id: 'VJ621', airline: 'VietJet Air', aircraft: 'A321', route: 'SGN → HAN', from: 'SGN', to: 'HAN', dep: '15:30', arr: '17:40', date: '2026-05-16', basePrice: 1100000, totalSeats: 230, bookedSeats: 198, status: 'SCHEDULED' },
  { id: 'VN730', airline: 'Vietnam Airlines', aircraft: 'A350', route: 'HAN → PQC', from: 'HAN', to: 'PQC', dep: '17:00', arr: '18:25', date: '2026-05-16', basePrice: 1450000, totalSeats: 350, bookedSeats: 312, status: 'ARRIVED' },
  { id: 'QH840', airline: 'Bamboo Airways', aircraft: 'A321neo', route: 'SGN → HPH', from: 'SGN', to: 'HPH', dep: '19:00', arr: '21:10', date: '2026-05-16', basePrice: 1050000, totalSeats: 200, bookedSeats: 54, status: 'CANCELLED' },
];

export const ADMIN_BOOKINGS = [
  { id: 'BK-2401', pnr: 'PNR-A7X9Q', passenger: 'Nguyễn Văn An', phone: '+84 901 234 567', email: 'an.nv@gmail.com', flight: 'VN201', route: 'SGN → HAN', date: '2026-05-16', seatClass: 'Thương gia', seat: '4A', amount: 3125000, status: 'CONFIRMED', paymentStatus: 'PAID', paymentMethod: 'Thẻ tín dụng', bookedAt: '2026-05-14 09:22' },
  { id: 'BK-2402', pnr: 'PNR-B4M8R', passenger: 'Trần Thị Bình', phone: '+84 932 456 789', email: 'binh.tt@outlook.com', flight: 'VJ305', route: 'HAN → DAD', date: '2026-05-16', seatClass: 'Phổ thông', seat: '21C', amount: 850000, status: 'PENDING', paymentStatus: 'UNPAID', paymentMethod: '', bookedAt: '2026-05-15 14:05' },
  { id: 'BK-2403', pnr: 'PNR-C9K2L', passenger: 'Lê Hoàng Cường', phone: '+84 977 111 222', email: 'cuong.lh@gmail.com', flight: 'QH412', route: 'SGN → CXR', date: '2026-05-16', seatClass: 'Phổ thông+', seat: '12F', amount: 1470000, status: 'CONFIRMED', paymentStatus: 'PAID', paymentMethod: 'Ví điện tử', bookedAt: '2026-05-13 11:30' },
  { id: 'BK-2404', pnr: 'PNR-D2P5W', passenger: 'Phạm Thu Dung', phone: '+84 918 909 121', email: 'dung.pt@gmail.com', flight: 'VN518', route: 'DAD → SGN', date: '2026-05-16', seatClass: 'Thương gia', seat: '2A', amount: 1975000, status: 'CONFIRMED', paymentStatus: 'PAID', paymentMethod: 'Chuyển khoản', bookedAt: '2026-05-12 16:45' },
  { id: 'BK-2405', pnr: 'PNR-E6R1T', passenger: 'Nguyễn Minh Trí', phone: '+84 901 555 666', email: 'tri.nm@gmail.com', flight: 'VJ621', route: 'SGN → HAN', date: '2026-05-16', seatClass: 'Phổ thông', seat: '33D', amount: 1100000, status: 'CANCELLED', paymentStatus: 'REFUNDED', paymentMethod: 'Thẻ tín dụng', bookedAt: '2026-05-10 08:15' },
  { id: 'BK-2406', pnr: 'PNR-F3S8Y', passenger: 'Lê Thị Mai', phone: '+84 923 876 543', email: 'mai.lt@gmail.com', flight: 'VN730', route: 'HAN → PQC', date: '2026-05-16', seatClass: 'Phổ thông', seat: '28B', amount: 1450000, status: 'CONFIRMED', paymentStatus: 'PAID', paymentMethod: 'Ví điện tử', bookedAt: '2026-05-15 20:00' },
  { id: 'BK-2407', pnr: 'PNR-G1U4J', passenger: 'Đỗ Minh Khoa', phone: '+84 966 554 321', email: 'khoa.dm@gmail.com', flight: 'QH412', route: 'SGN → CXR', date: '2026-05-16', seatClass: 'Phổ thông', seat: '15E', amount: 980000, status: 'PENDING', paymentStatus: 'UNPAID', paymentMethod: '', bookedAt: '2026-05-16 06:30' },
  { id: 'BK-2408', pnr: 'PNR-H9V7N', passenger: 'Vũ Thanh Hà', phone: '+84 912 334 556', email: 'ha.vt@gmail.com', flight: 'VN201', route: 'SGN → HAN', date: '2026-05-16', seatClass: 'Phổ thông+', seat: '7C', amount: 1875000, status: 'CONFIRMED', paymentStatus: 'PAID', paymentMethod: 'Thẻ tín dụng', bookedAt: '2026-05-14 13:00' },
];

export const ADMIN_STAFF = [
  { id: 'ST001', fullName: 'Nguyễn Văn Admin', email: 'admin@easyflight.vn', phone: '+84 901 000 001', role: 'ADMIN', department: 'Ban Giám đốc', status: 'ACTIVE', joinDate: '2022-01-15', lastLogin: '2026-05-16 08:00' },
  { id: 'ST002', fullName: 'Trần Thị Hoa', email: 'hoa.tt@easyflight.vn', phone: '+84 932 000 002', role: 'STAFF', department: 'Vận hành mặt đất', status: 'ACTIVE', joinDate: '2023-03-20', lastLogin: '2026-05-16 07:45' },
  { id: 'ST003', fullName: 'Lê Minh Đức', email: 'duc.lm@easyflight.vn', phone: '+84 977 000 003', role: 'STAFF', department: 'Check-in', status: 'ACTIVE', joinDate: '2023-06-10', lastLogin: '2026-05-15 17:30' },
  { id: 'ST004', fullName: 'Phạm Thu Hiền', email: 'hien.pt@easyflight.vn', phone: '+84 918 000 004', role: 'AGENT', department: 'Chăm sóc khách hàng', status: 'ACTIVE', joinDate: '2024-01-05', lastLogin: '2026-05-16 09:10' },
  { id: 'ST005', fullName: 'Hoàng Văn Toàn', email: 'toan.hv@easyflight.vn', phone: '+84 901 000 005', role: 'STAFF', department: 'Vận hành mặt đất', status: 'INACTIVE', joinDate: '2022-08-01', lastLogin: '2026-04-20 14:00' },
  { id: 'ST006', fullName: 'Ngô Thị Lan', email: 'lan.nt@easyflight.vn', phone: '+84 966 000 006', role: 'AGENT', department: 'Đặt vé', status: 'ACTIVE', joinDate: '2024-04-12', lastLogin: '2026-05-16 10:05' },
];

export const VOUCHERS = [
  { id: 'V001', code: 'SUMMER26', type: 'PERCENT', value: 15, minAmount: 2000000, maxDiscount: 500000, usageLimit: 200, usedCount: 87, validFrom: '2026-06-01', validTo: '2026-08-31', status: 'ACTIVE' },
  { id: 'V002', code: 'NEWUSER', type: 'FIXED', value: 200000, minAmount: 800000, maxDiscount: 200000, usageLimit: 500, usedCount: 312, validFrom: '2026-01-01', validTo: '2026-12-31', status: 'ACTIVE' },
  { id: 'V003', code: 'FLASH50', type: 'PERCENT', value: 50, minAmount: 3000000, maxDiscount: 1000000, usageLimit: 50, usedCount: 50, validFrom: '2026-05-01', validTo: '2026-05-15', status: 'EXPIRED' },
  { id: 'V004', code: 'PARTNER30', type: 'PERCENT', value: 30, minAmount: 1500000, maxDiscount: 750000, usageLimit: 100, usedCount: 23, validFrom: '2026-05-16', validTo: '2026-07-31', status: 'ACTIVE' },
];

export const REGULATIONS = [
  { id: 'R01', group: 'Chuyến bay', key: 'min_flight_duration', label: 'Thời gian bay tối thiểu (phút)', value: '30', type: 'NUMBER', description: 'Thời gian bay ngắn nhất được phép lên lịch' },
  { id: 'R02', group: 'Chuyến bay', key: 'max_stops', label: 'Số điểm dừng tối đa', value: '2', type: 'NUMBER', description: 'Số điểm dừng kỹ thuật tối đa cho một chuyến bay' },
  { id: 'R03', group: 'Chuyến bay', key: 'min_stop_duration', label: 'Thời gian dừng tối thiểu (phút)', value: '20', type: 'NUMBER', description: 'Thời gian dừng kỹ thuật tối thiểu tại mỗi điểm' },
  { id: 'R04', group: 'Chuyến bay', key: 'max_stop_duration', label: 'Thời gian dừng tối đa (phút)', value: '90', type: 'NUMBER', description: 'Thời gian dừng kỹ thuật tối đa tại mỗi điểm' },
  { id: 'R05', group: 'Đặt vé', key: 'cancel_before_hours', label: 'Hủy vé trước giờ bay (giờ)', value: '24', type: 'NUMBER', description: 'Khách hàng phải hủy vé trước bao nhiêu giờ để được hoàn tiền' },
  { id: 'R06', group: 'Đặt vé', key: 'max_tickets_per_booking', label: 'Số vé tối đa mỗi đơn', value: '9', type: 'NUMBER', description: 'Giới hạn vé trong một lần đặt' },
  { id: 'R07', group: 'Thanh toán', key: 'payment_timeout_minutes', label: 'Thời gian chờ thanh toán (phút)', value: '15', type: 'NUMBER', description: 'Sau thời gian này, đơn đặt chỗ sẽ bị hủy tự động nếu chưa thanh toán' },
  { id: 'R08', group: 'Thanh toán', key: 'refund_percent', label: 'Tỷ lệ hoàn tiền (%)', value: '80', type: 'NUMBER', description: 'Phần trăm hoàn tiền khi hủy vé hợp lệ' },
];
