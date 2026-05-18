// ─── Shared Data Store — dùng chung toàn bộ ứng dụng ────────────────────────
// Import file này ở tất cả các page cần dữ liệu

export const STAFF_USER = {
    name: 'Nguyen Van A',
    fullName: 'Nguyen Van A',
    role: 'STAFF',
    department: 'Ground Operations',
    email: 'leminh.staff@easyflight.vn',
    phone: '+84 901 234 567',
    address: 'Ho Chi Minh City, Vietnam',
    avatarSeed: 'Felix',
};

export const FLIGHTS = [
    {
        id: 'VN123',
        code: 'VN123',
        airline: 'Vietnam Airlines',
        logo: '✈',
        route: 'SGN → HAN',
        type: 'Nội địa',
        dep: '06:00',
        arr: '08:30',
        aircraft: 'A321neo',
        price: '1.450.000 đ',
        seats: { available: 47, total: 200, booked: 153 },
        capacity: { booked: 153, total: 200 },
        departure: { time: '06:00', date: 'Hôm nay' },
        status: 'BOARDING',
        flightStatus: 'Boarding',
        notified: false,
    },
    {
        id: 'VJ456',
        code: 'VJ456',
        airline: 'VietJet Air',
        logo: '🛫',
        route: 'DAD → ICN',
        type: 'Quốc tế',
        dep: '08:30',
        arr: '14:15',
        aircraft: 'B787-9',
        price: '5.500.000 đ',
        seats: { available: 10, total: 300, booked: 290 },
        capacity: { booked: 290, total: 300 },
        departure: { time: '08:30', date: 'Hôm nay' },
        status: 'SCHEDULED',
        flightStatus: 'Scheduled',
        notified: false,
    },
    {
        id: 'QH789',
        code: 'QH789',
        airline: 'Bamboo Airways',
        logo: '🎋',
        route: 'CXR → NRT',
        type: 'Quốc tế',
        dep: '10:15',
        arr: '18:00',
        aircraft: 'A350-900',
        price: '7.200.000 đ',
        seats: { available: 35, total: 305, booked: 270 },
        capacity: { booked: 270, total: 305 },
        departure: { time: '10:15', date: 'Hôm nay' },
        status: 'DELAYED',
        flightStatus: 'Delayed',
        notified: false,
        delayInfo: { delay: '45 phút', reason: 'Thời tiết xấu tại sân bay Cam Ranh' },
    },
    {
        id: 'VN321',
        code: 'VN321',
        airline: 'Vietnam Airlines',
        logo: '✈',
        route: 'HAN → SIN',
        type: 'Quốc tế',
        dep: '13:45',
        arr: '17:15',
        aircraft: 'B787-9',
        price: '4.200.000 đ',
        seats: { available: 90, total: 300, booked: 210 },
        capacity: { booked: 210, total: 300 },
        departure: { time: '13:45', date: 'Hôm nay' },
        status: 'CHECK-IN',
        flightStatus: 'On Time',
        notified: false,
    },
    {
        id: 'VN550',
        code: 'VN550',
        airline: 'Vietnam Airlines',
        logo: '✈',
        route: 'SGN → PQC',
        type: 'Nội địa',
        dep: '15:00',
        arr: '16:15',
        aircraft: 'A321neo',
        price: '950.000 đ',
        seats: { available: 18, total: 200, booked: 182 },
        capacity: { booked: 182, total: 200 },
        departure: { time: '15:00', date: 'Hôm nay' },
        status: 'SCHEDULED',
        flightStatus: 'On Time',
        notified: false,
    },
    {
        id: 'BL101',
        code: 'BL101',
        airline: 'Bamboo Airways',
        logo: '🎋',
        route: 'SGN → HAN',
        type: 'Nội địa',
        dep: '17:30',
        arr: '20:00',
        aircraft: 'A321neo',
        price: '1.100.000 đ',
        seats: { available: 60, total: 200, booked: 140 },
        capacity: { booked: 140, total: 200 },
        departure: { time: '17:30', date: 'Hôm nay' },
        status: 'SCHEDULED',
        flightStatus: 'Scheduled',
        notified: false,
    },
    {
        id: 'BL202',
        code: 'BL202',
        airline: 'Bamboo Airways',
        logo: '🎋',
        route: 'HAN → SGN',
        type: 'Nội địa',
        dep: '20:00',
        arr: '22:30',
        aircraft: 'A321neo',
        price: '1.050.000 đ',
        seats: { available: 45, total: 200, booked: 155 },
        capacity: { booked: 155, total: 200 },
        departure: { time: '20:00', date: 'Hôm nay' },
        status: 'SCHEDULED',
        flightStatus: 'Scheduled',
        notified: false,
    },
    {
        id: 'VN922',
        code: 'VN922',
        airline: 'Vietnam Airlines',
        logo: '✈',
        route: 'SGN → BKK',
        type: 'Quốc tế',
        dep: '09:00',
        arr: '11:30',
        aircraft: 'A350-900',
        price: '3.800.000 đ',
        seats: { available: 10, total: 305, booked: 295 },
        capacity: { booked: 295, total: 305 },
        departure: { time: '09:00', date: 'Hôm nay' },
        status: 'DELAYED',
        flightStatus: 'Delayed',
        notified: false,
        delayInfo: { delay: '30 phút', reason: 'Chờ máy bay từ chuyến trước' },
    },
];

export const BOOKINGS = [
    { id: 'BK-1024', name: 'Nguyen Van Anh', phone: '+84 908 111 233', flight: 'VN123', route: 'SGN → HAN', class: 'Business', seat: '12A', price: '2.900.000 đ', status: 'Confirmed', payment: 'Paid' },
    { id: 'BK-1025', name: 'Tran Thi Bich', phone: '+84 932 456 899', flight: 'VJ456', route: 'DAD → ICN', class: 'Economy', seat: '21C', price: '3.040.000 đ', status: 'Pending', payment: 'Unpaid' },
    { id: 'BK-1026', name: 'Le Hoang Cuong', phone: '+84 977 123 455', flight: 'QH789', route: 'CXR → NRT', class: 'Premium Economy', seat: '14F', price: '9.380.000 đ', status: 'Confirmed', payment: 'Paid' },
    { id: 'BK-1027', name: 'Pham Thu Dung', phone: '+84 918 909 121', flight: 'VN321', route: 'HAN → SIN', class: 'Business', seat: '8A', price: '7.560.000 đ', status: 'Confirmed', payment: 'Paid' },
    { id: 'BK-1028', name: 'Nguyen Minh Tri', phone: '+84 901 234 567', flight: 'VN550', route: 'SGN → PQC', class: 'Economy', seat: '22B', price: '950.000 đ', status: 'Pending', payment: 'Unpaid' },
    { id: 'BK-1029', name: 'Le Thi Mai', phone: '+84 923 876 543', flight: 'BL101', route: 'SGN → HAN', class: 'Economy', seat: '31D', price: '1.200.000 đ', status: 'Confirmed', payment: 'Paid' },
    { id: 'BK-1030', name: 'Do Minh Khoa', phone: '+84 966 554 321', flight: 'BL202', route: 'HAN → SGN', class: 'Economy', seat: '15E', price: '0 đ', status: 'Cancelled', payment: 'Refunded' },
    { id: 'BK-1031', name: 'Nguyen Van A', phone: '+84 911 222 333', flight: 'VN922', route: 'SGN → BKK', class: 'Economy', seat: '28C', price: '3.800.000 đ', status: 'Confirmed', payment: 'Paid' },
];

export const WORK_SHIFTS = [
    { id: 'S001', staff: 'Le Minh', role: 'Check-in Agent', date: '2025-06-09', start: '06:00', end: '14:00', gate: 'A1', flight: 'VN123', status: 'Active' },
    { id: 'S002', staff: 'Hoang Phuc', role: 'Boarding Agent', date: '2025-06-09', start: '07:30', end: '15:30', gate: 'B3', flight: 'VJ456', status: 'Active' },
    { id: 'S003', staff: 'Tran Lan Anh', role: 'Ground Handler', date: '2025-06-09', start: '09:00', end: '17:00', gate: 'C2', flight: 'QH789', status: 'Scheduled' },
    { id: 'S004', staff: 'Nguyen Duc Minh', role: 'Customer Service', date: '2025-06-09', start: '13:00', end: '21:00', gate: 'A2', flight: 'VN321', status: 'Scheduled' },
    { id: 'S005', staff: 'Pham Quynh', role: 'Check-in Agent', date: '2025-06-10', start: '06:00', end: '14:00', gate: 'B1', flight: 'VN550', status: 'Scheduled' },
];

export const SUPPORT_TICKETS = [
    {
        id: 'TK-001', customer: 'Tran Thi Bich', email: 'bich@gmail.com', phone: '+84 932 456 899', subject: 'Hoàn vé chuyến VJ456', booking: 'BK-1025', priority: 'High', status: 'Open', created: '09:15 hôm nay', messages: [
            { from: 'customer', text: 'Tôi muốn hoàn vé vì lý do cá nhân.', time: '09:15' },
            { from: 'staff', text: 'Chào bạn, chúng tôi đã nhận được yêu cầu. Vui lòng cung cấp lý do cụ thể.', time: '09:22' },
        ]
    },
    {
        id: 'TK-002', customer: 'Hoang Phuc', email: 'hphuc@outlook.com', phone: '+84 966 789 012', subject: 'Đổi ghế ngồi chuyến QH789', booking: 'BK-1026', priority: 'Medium', status: 'In Progress', created: '10:30 hôm nay', messages: [
            { from: 'customer', text: 'Tôi cần đổi từ ghế cửa sổ sang ghế lối đi.', time: '10:30' },
        ]
    },
    {
        id: 'TK-003', customer: 'Nguyen Minh Tri', email: 'tri.nm@gmail.com', phone: '+84 901 234 567', subject: 'Chuyến bay bị delay, yêu cầu bồi thường', booking: 'BK-1028', priority: 'High', status: 'Open', created: '11:05 hôm nay', messages: [
            { from: 'customer', text: 'Chuyến VN550 của tôi bị delay, tôi bị mất cuộc họp quan trọng.', time: '11:05' },
        ]
    },
    {
        id: 'TK-004', customer: 'Nguyen Van Anh', email: 'vananh@gmail.com', phone: '+84 908 111 233', subject: 'Không nhận được email xác nhận', booking: 'BK-1024', priority: 'Low', status: 'Resolved', created: '08:00 hôm nay', messages: [
            { from: 'customer', text: 'Tôi chưa nhận được email xác nhận đặt vé.', time: '08:00' },
            { from: 'staff', text: 'Chúng tôi đã gửi lại email. Vui lòng kiểm tra hộp thư spam.', time: '08:10' },
            { from: 'customer', text: 'Đã nhận được. Cảm ơn!', time: '08:15' },
        ]
    },
];

export const DASHBOARD_METRICS = {
    revenue: { total: '4.2 tỷ đ', trend: '+12.4%', isPositive: true },
    bookings: { today: 128, label: '+18 so với hôm qua' },
    flights: { today: FLIGHTS.length, active: 2, arrived: 3 },
    occupancy: {
        percentage: 78,
        booked: BOOKINGS.filter(b => b.status !== 'Cancelled').length * 200,
        total: 2000,
    },
};

export const ACTIVITY_LOG = [
    { id: 1, type: 'booking', text: 'Booking BK-1031 mới từ Nguyen Van A', time: '2 phút trước', color: 'bg-violet-500' },
    { id: 2, type: 'delay', text: 'Chuyến QH789 bị delay 45 phút', time: '8 phút trước', color: 'bg-red-500' },
    { id: 3, type: 'checkin', text: 'Check-in hoàn tất: VN321 (210 khách)', time: '15 phút trước', color: 'bg-emerald-500' },
    { id: 4, type: 'support', text: 'Yêu cầu hỗ trợ mới từ Hoang Phuc', time: '22 phút trước', color: 'bg-amber-500' },
    { id: 5, type: 'booking', text: 'Booking BK-1030 bị huỷ — hoàn tiền', time: '1 giờ trước', color: 'bg-slate-400' },
];

// ─── Promotion / Voucher Data ───────────────────────────────────────────────
export const VOUCHERS = [
    { id: 'VC-EASY2024', name: 'Tết Nguyên Đán', discount: '20% (Max 500k)', expiry: '15/02/2024', status: 'Hoạt động', limit: 1000, used: 742 },
    { id: 'SUMMER-OFF', name: 'Hè Rực Rỡ', discount: '150.000 đ', expiry: '30/08/2023', status: 'Hết hạn', limit: 5000, used: 5000 },
    { id: 'NEWBIE50', name: 'Khách hàng mới', discount: '50.000 đ', expiry: '31/12/2024', status: 'Vô hiệu hóa', limit: null, used: 1203 },
    { id: 'INT-FEST', name: 'Đường bay quốc tế', discount: '10%', expiry: '25/12/2024', status: 'Hoạt động', limit: 500, used: 48 },
    { id: 'VIP-GOLD', name: 'Ưu đãi thành viên vàng', discount: '15% (Max 1tr)', expiry: '31/03/2025', status: 'Hoạt động', limit: 200, used: 89 },
    { id: 'FLASH-FRI', name: 'Flash Friday', discount: '100.000 đ', expiry: '28/02/2024', status: 'Hết hạn', limit: 3000, used: 3000 },
    { id: 'XMAS-2024', name: 'Giáng sinh 2024', discount: '25% (Max 800k)', expiry: '26/12/2024', status: 'Hoạt động', limit: 1500, used: 234 },
    { id: 'LOYAL-VN', name: 'Khách hàng trung thành', discount: '200.000 đ', expiry: '30/06/2025', status: 'Hoạt động', limit: 800, used: 156 },
];

// ─── Customer Support — Cancel Requests ─────────────────────────────────────
export const CANCEL_REQUESTS = [
    { id: '#EF-90821', customer: 'Trần Lam', email: 'tranlam@gmail.com', avatar: 'TL', flight: 'SGN → HAN', flightCode: 'VJ-123', flightDate: '24/10/2023', reason: 'Lịch trình cá nhân', requestDate: '20/10/2023', refundAmount: '2.450.000đ', status: 'Đang chờ' },
    { id: '#EF-90742', customer: 'Nguyễn Huy', email: 'huy.ng@gmail.com', avatar: 'NH', flight: 'DAD → SGN', flightCode: 'VN-245', flightDate: '22/10/2023', reason: 'Lý do sức khỏe', requestDate: '19/10/2023', refundAmount: '1.120.000đ', status: 'Đã duyệt' },
    { id: '#EF-89541', customer: 'Phan Tú', email: 'tu.phan@gmail.com', avatar: 'PT', flight: 'HAN → CXR', flightCode: 'QH-442', flightDate: '15/10/2023', reason: 'Sai thông tin', requestDate: '12/10/2023', refundAmount: '0đ', status: 'Bị từ chối' },
    { id: '#EF-90111', customer: 'Lê Kim', email: 'lekim@gmail.com', avatar: 'LK', flight: 'SGN → PQC', flightCode: '', flightDate: '', reason: 'Hủy chuyến bay', requestDate: '21/10/2023', refundAmount: '3.200.000đ', status: 'Đang chờ' },
];

// ─── Customer Support — Refund Requests ─────────────────────────────────────
export const REFUND_REQUESTS = [
    { id: 'EF-98231', customer: 'Nguyễn Văn A', paymentMethod: 'Visa ending in 4421', paymentIcon: '💳', amount: '2.450.000đ', refundStatus: 'Đã hoàn', processStatus: 'N/A' },
    { id: 'EF-98245', customer: 'Lê Thị B', paymentMethod: 'Ví MoMo', paymentIcon: '📱', amount: '1.200.000đ', refundStatus: 'Chờ hoàn', processStatus: 'Đang duyệt' },
    { id: 'EF-98256', customer: 'Trần Minh C', paymentMethod: 'Chuyển khoản (BIDV)', paymentIcon: '🏦', amount: '5.800.000đ', refundStatus: 'Từ chối', processStatus: 'Lưu trữ' },
    { id: 'EF-98288', customer: 'Phạm Thu D', paymentMethod: 'Mastercard ending in 0092', paymentIcon: '💳', amount: '850.000đ', refundStatus: 'Chờ hoàn', processStatus: 'Đã phê duyệt' },
];

// ─── Customer Support — Complaints ──────────────────────────────────────────
export const COMPLAINTS = [
    { id: '#CMP-9281', customer: 'Trần Hoàng Nam', email: 'nam.tran@gmail.com', avatar: 'TH', subject: 'Hành lý thất lạc chuyến VN-122', flightInfo: 'Flight: SGN-HAN', date: '12/10/2023 14:30', status: 'OPEN' },
    { id: '#CMP-9275', customer: 'Lê Thị Mai', email: 'mai.le@gmail.com', avatar: 'LT', subject: 'Hoàn phí suất ăn không sử dụng', flightInfo: 'Booking: AXJ981', date: '12/10/2023 11:15', status: 'IN PROGRESS' },
    { id: '#CMP-9268', customer: 'Phạm Văn Đức', email: 'duc.pham@gmail.com', avatar: 'PV', subject: 'Thay đổi ghế ngồi không báo trước', flightInfo: 'Flight: QH-452', date: '11/10/2023 09:45', status: 'RESOLVED' },
    { id: '#CMP-9250', customer: 'Nguyễn Kim Chi', email: 'chi.ng@gmail.com', avatar: 'NK', subject: 'Trễ chuyến bay do lỗi check-in', flightInfo: 'Ticket: TA210982', date: '10/10/2023 16:20', status: 'CLOSED' },
];

// ─── Customer Support — System Errors ───────────────────────────────────────
export const SYSTEM_ERRORS = [
    { id: 'EF-982341', type: 'Thanh toán thất bại', typeIcon: '💳', description: 'API Gateway timeout while processing 3C', time: '14:20:05', timeLabel: 'Hôm nay', severity: 'CRITICAL', status: 'Chờ xử lý' },
    { id: 'EF-982339', type: 'Lỗi trùng lặp', typeIcon: '🔄', description: 'Duplicate seat assignment detected for F', time: '13:45:12', timeLabel: 'Hôm nay', severity: 'HIGH', status: 'Đang xử lý' },
    { id: 'EF-982335', type: 'Lỗi đồng bộ', typeIcon: '🔗', description: 'PNR sync error with Sabre GDS for interna', time: '11:10:30', timeLabel: 'Hôm nay', severity: 'MEDIUM', status: 'Đã xử lý' },
    { id: 'EF-982320', type: 'Mất kết nối', typeIcon: '📡', description: 'Loss of connectivity to seat-map microse', time: '09:15:00', timeLabel: 'Hôm nay', severity: 'CRITICAL', status: 'Chờ xử lý' },
];