import { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Ticket, Printer, Send, Plane, AlertCircle, User, Settings, X, MessageSquare, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { bookingService } from '../../api/services/bookingService';
import { flightService } from '../../api/services/flightService';
import { regulationService } from '../../api/services/regulationService';
import { ADMIN_BOOKINGS, ADMIN_FLIGHTS, REGULATIONS as INIT_REGS } from '../../data/adminMockData';

// Toast (local, minimal)
function Toast({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium text-white min-w-[240px] ${t.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="flex-1">{t.message}</span>
          <button onClick={() => onRemove(t.id)}><X className="w-4 h-4 opacity-70 hover:opacity-100" /></button>
        </div>
      ))}
    </div>
  );
}

function ConfirmDialog({ open, title, message, confirmLabel, confirmClass, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[380px] mx-4">
        <h3 className="text-base font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Hủy</button>
          <button onClick={onConfirm} className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${confirmClass}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

const STATUS_STYLES = {
  CONFIRMED: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  PENDING: 'text-amber-700 bg-amber-50 border-amber-200',
  CANCELLED: 'text-slate-500 bg-slate-100 border-slate-200',
  EXPIRED: 'text-red-700 bg-red-50 border-red-200'
};

const STATUS_LABELS = {
  CONFIRMED: 'Đã xác nhận',
  PENDING: 'Chờ thanh toán',
  CANCELLED: 'Đã hủy',
  EXPIRED: 'Đã hết hạn'
};

const PAYMENT_STATUS_LABELS = {
  PAID: 'ĐÃ THANH TOÁN',
  UNPAID: 'CHƯA THANH TOÁN',
  REFUNDED: 'ĐÃ HOÀN TIỀN',
  FAILED: 'GIAO DỊCH LỖI'
};

function BookingDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const getPassengerName = (t) => {
    if (!t) return 'Chưa rõ tên';
    if (typeof t.passenger === 'string') return t.passenger;
    return t.passengerName || t.passenger?.fullName || t.passenger?.name || 'Chưa rõ tên';
  };

  const getDocumentNumber = (t) => {
    if (!t) return '—';
    return t.documentNumber || t.passenger?.documentNumber || t.passenger?.cccd || '—';
  };

  const getNationality = (t) => {
    if (!t) return '—';
    return t.nationality || t.passenger?.nationality || 'Việt Nam';
  };

  const getSeatNumber = (t) => {
    if (!t) return 'Chưa xếp';
    return t.seatNumber || t.flightSeat?.seatNumber || t.seat || 'Chưa xếp';
  };

  const getTicketPrice = (t, bookingTotal = 0, ticketsCount = 1) => {
    if (!t) return 0;
    if (t.price) return t.price;
    if (t.amount) return t.amount;
    if (bookingTotal > 0 && ticketsCount > 0) return Math.round(bookingTotal / ticketsCount);
    return 0;
  };

  const getTicketId = (t, idx = 0) => {
    if (!t) return idx + 1;
    return t.ticketId || t.ticketNumber || `TKT-${idx + 1}`;
  };

  const { data: booking, loading: bookingLoading, error: bookingError, refetch: refetchBooking } = useApi(() => bookingService.getById(id), [id]);
  const { data: flights, loading: flightsLoading } = useApi(() => flightService.search({}), []);
  const { data: dbRegs } = useApi(regulationService.getAll, []);

  const [note, setNote] = useState('Khách hàng yêu cầu ghế ngồi sát cửa sổ để ngắm cảnh...');
  const [editingNote, setEditingNote] = useState(false);
  const [draftNote, setDraftNote] = useState(note);
  const [toasts, setToasts] = useState([]);
  const [confirm, setConfirm] = useState(null);

  // Normalize fetched booking, or fall back to mock data
  const mockBookingRaw = ADMIN_BOOKINGS.find(b => String(b.id) === String(id));
  const storedPayments = JSON.parse(localStorage.getItem('mock_payments') || '{}');
  const localStates = JSON.parse(localStorage.getItem('local_bookings_state') || '{}');
  const mockPaymentStatus = storedPayments[id] || (mockBookingRaw?.paymentStatus || 'UNPAID');
  const mockBookingStatus = mockPaymentStatus === 'PAID' ? 'CONFIRMED' : (mockBookingRaw?.status || 'PENDING');

  const mockBooking = mockBookingRaw ? (() => {
    const baseMock = {
      bookingId: mockBookingRaw.id,
      pnrCode: mockBookingRaw.pnr,
      flightId: mockBookingRaw.flight,
      totalAmount: mockBookingRaw.amount,
      status: mockBookingStatus,
      paymentStatus: mockPaymentStatus,
      paymentMethod: mockBookingRaw.paymentMethod,
      bookingDate: mockBookingRaw.bookedAt,
      expirationTime: null,
      tickets: [{
        ticketId: 1,
        passengerName: mockBookingRaw.passenger,
        documentNumber: 'CCCD-001234567',
        nationality: 'Việt Nam',
        seatNumber: mockBookingRaw.seat,
        status: 'ACTIVE',
        price: mockBookingRaw.amount,
      }]
    };
    const localState = localStates[mockBookingRaw.id];
    if (localState) {
      return { ...baseMock, ...localState };
    }
    return baseMock;
  })() : null;

  const resolvedBooking = booking || mockBooking;

  const refundPercent = (() => {
    if (dbRegs && dbRegs.length > 0) {
      const found = dbRegs.find(r => r.settingKey === 'refund_percent' || r.settingKey?.toLowerCase().includes('refund'));
      if (found && found.settingValue) {
        const val = parseFloat(found.settingValue);
        if (!isNaN(val)) return val > 1 ? val / 100 : val;
      }
    }
    const mockFound = INIT_REGS.find(r => r.key === 'refund_percent');
    if (mockFound && mockFound.value) {
      const val = parseFloat(mockFound.value);
      if (!isNaN(val)) return val > 1 ? val / 100 : val;
    }
    return 0.8;
  })();

  const mockFlightRaw = ADMIN_FLIGHTS.find(f => f.id === (resolvedBooking?.flightId));
  const mockFlight = mockFlightRaw ? {
    id: mockFlightRaw.id,
    flightCode: mockFlightRaw.id,
    airlineName: mockFlightRaw.airline,
    departureAirportCode: mockFlightRaw.from,
    arrivalAirportCode: mockFlightRaw.to,
    departureTime: `${mockFlightRaw.date}T${mockFlightRaw.dep}:00`,
    arrivalTime: `${mockFlightRaw.date}T${mockFlightRaw.arr}:00`,
    departureCity: '',
    arrivalCity: '',
    estimateDuration: 130,
  } : null;

  const flight = flights?.find(f => f.id === resolvedBooking?.flightId) || mockFlight;

  const addToast = useCallback((msg, type = 'success') => {
    const toastId = Date.now();
    setToasts(prev => [...prev, { id: toastId, message: msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== toastId)), 3500);
  }, []);

  const removeToast = (toastId) => setToasts(prev => prev.filter(t => t.id !== toastId));

  const handleConfirmPayment = () => {
    if (!resolvedBooking) return;
    const isMock = !booking;
    const bookingId = resolvedBooking.bookingId;
    const pnrCode = resolvedBooking.pnrCode;
    const totalAmount = resolvedBooking.totalAmount;

    setConfirm({
      title: 'Xác nhận thanh toán',
      message: `Bạn xác nhận đã nhận đủ số tiền ${totalAmount.toLocaleString('vi-VN')} đ cho mã đặt vé ${pnrCode}? Trạng thái vé sẽ chuyển sang ĐÃ THANH TOÁN.`,
      confirmLabel: 'Xác nhận',
      confirmClass: 'bg-emerald-600 hover:bg-emerald-700',
      onConfirm: async () => {
        try {
          if (isMock) {
            // Xác nhận thanh toán mock lưu vào localStorage
            const stored = JSON.parse(localStorage.getItem('mock_payments') || '{}');
            stored[bookingId] = 'PAID';
            localStorage.setItem('mock_payments', JSON.stringify(stored));
            addToast(`Xác nhận thanh toán thành công cho PNR ${pnrCode}!`, 'success');
            setTimeout(() => window.location.reload(), 1000);
          } else {
            await bookingService.confirmPayment(bookingId);
            addToast(`Xác nhận thanh toán thành công cho PNR ${pnrCode}!`, 'success');
            refetchBooking();
          }
        } catch (err) {
          addToast(err.response?.data?.message || err.message || 'Lỗi khi xác nhận thanh toán', 'error');
        } finally {
          setConfirm(null);
        }
      }
    });
  };

  const handleSendEticket = () => {
    const mainTicket = booking?.tickets?.[0];
    const email = mainTicket ? `${mainTicket.passengerName.toLowerCase().replace(/\s+/g, '')}@email.com` : 'khachhang@email.com';
    addToast(`Đã gửi vé điện tử (E-ticket) đến ${email}`, 'success');
  };

  const printContent = (htmlContent) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      addToast('Trình duyệt đã chặn cửa sổ pop-up! Vui lòng cấp quyền mở pop-up để xem và in PDF.', 'error');
      return;
    }
    
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Kích hoạt hộp thoại in sau khi viết xong tài liệu
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 250);
  };

  const handlePrint = () => {
    if (!resolvedBooking) return;
    
    let staffName = 'Nhân viên EasyFlight';
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const stored = localStorage.getItem('local_staff_profile');
      if (stored) {
        const profile = JSON.parse(stored);
        if (profile.email === user.email && profile.fullName) staffName = profile.fullName;
      } else {
        staffName = user.fullName || user.name || user.email || 'Nhân viên EasyFlight';
      }
    } catch {}

    const totalAmount = resolvedBooking.totalAmount || 0;
    const ticketCount = resolvedBooking.tickets?.length || 0;
    const ticketBasePrice = resolvedBooking.tickets?.reduce((acc, t) => acc + getTicketPrice(t, totalAmount, ticketCount), 0) || 0;
    const processFee = totalAmount > 0 ? 150000 : 0;
    const taxAndCharges = totalAmount > 0 ? Math.round(ticketBasePrice * 0.1) : 0; // 10% VAT mockup
    const grandTotal = totalAmount > 0 ? (ticketBasePrice + processFee + taxAndCharges) : 0;

    const invoiceHtml = `
      <html>
      <head>
        <title>HÓA ĐƠN THANH TOÁN - PNR ${resolvedBooking.pnrCode}</title>
        <style>
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            @page { size: A4; margin: 20mm; }
          }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #1E293B; margin: 0; padding: 0; background: #FFF; line-height: 1.5; }
          .invoice-box { max-width: 800px; margin: 0 auto; padding: 10px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #4F46E5; padding-bottom: 20px; margin-bottom: 30px; align-items: center; }
          .brand { font-size: 26px; font-weight: 800; color: #4F46E5; letter-spacing: 0.5px; }
          .brand span { color: #0F172A; }
          .invoice-details { text-align: right; }
          .invoice-details h2 { margin: 0 0 5px 0; color: #0F172A; font-size: 22px; font-weight: 700; }
          .invoice-details p { margin: 3px 0; font-size: 13px; color: #64748B; }
          .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
          .section-title { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #94A3B8; margin-bottom: 10px; border-bottom: 1px solid #E2E8F0; padding-bottom: 5px; letter-spacing: 0.5px; }
          .info-block p { margin: 5px 0; font-size: 14px; color: #334155; }
          .info-block strong { color: #0F172A; }
          .table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 30px; }
          .table th { background: #F8FAFC; border-bottom: 2px solid #E2E8F0; color: #475569; font-weight: 700; font-size: 12px; text-transform: uppercase; padding: 12px 10px; text-align: left; }
          .table td { border-bottom: 1px solid #F1F5F9; padding: 12px 10px; font-size: 14px; color: #334155; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .total-section { display: flex; justify-content: flex-end; margin-top: 20px; }
          .total-box { width: 300px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 15px; }
          .total-row { display: flex; justify-content: space-between; font-size: 13px; margin: 6px 0; color: #475569; }
          .total-row.grand { font-size: 16px; font-weight: bold; color: #4F46E5; border-top: 1px solid #E2E8F0; padding-top: 10px; margin-top: 10px; }
          .footer { text-align: center; margin-top: 60px; font-size: 12px; color: #94A3B8; border-top: 1px solid #F1F5F9; padding-top: 25px; }
          .signature-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 40px; margin-top: 40px; text-align: center; font-size: 14px; }
          .signature-block { height: 120px; display: flex; flex-direction: column; justify-content: space-between; }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="header">
            <div class="brand">EASYFLIGHT<span>.VN</span></div>
            <div class="invoice-details">
              <h2>HÓA ĐƠN THANH TOÁN</h2>
              <p>Mã hóa đơn: INV-${resolvedBooking.bookingId}-${Date.now().toString().slice(-4)}</p>
              <p>Ngày lập: ${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
          
          <div class="grid">
            <div class="info-block">
              <div class="section-title">Thông tin khách hàng</div>
              <p>Khách hàng: <strong>${getPassengerName(resolvedBooking.tickets?.[0])}</strong></p>
              <p>Phương thức: <strong>${resolvedBooking.paymentMethod || 'Chưa chọn'}</strong></p>
              <p>Mã PNR đặt vé: <strong style="color: #4F46E5; font-size: 16px;">${resolvedBooking.pnrCode}</strong></p>
              <p>Trạng thái: <strong>${resolvedBooking.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chờ thanh toán'}</strong></p>
            </div>
            <div class="info-block">
              <div class="section-title">Thông tin chuyến bay</div>
              <p>Chuyến bay: <strong>${flight?.flightCode || '—'}</strong> (${flight?.airlineName || 'EasyFlight'})</p>
              <p>Hành trình: <strong>${flight?.departureAirportCode || 'SGN'} &rarr; ${flight?.arrivalAirportCode || 'HAN'}</strong></p>
              <p>Khởi hành: <strong>${flight ? formatDateTime(flight.departureTime) : '—'}</strong></p>
              <p>Số lượng khách: <strong>${ticketCount} hành khách</strong></p>
            </div>
          </div>
          
          <table class="table">
            <thead>
              <tr>
                <th style="width: 50px;">STT</th>
                <th>Tên hành khách</th>
                <th class="text-center">Số ghế</th>
                <th class="text-center">Hạng vé</th>
                <th class="text-right">Đơn giá (VND)</th>
              </tr>
            </thead>
            <tbody>
              ${resolvedBooking.tickets?.map((t, index) => `
                <tr>
                  <td class="text-center">${index + 1}</td>
                  <td><strong>${getPassengerName(t)}</strong></td>
                  <td class="text-center">${getSeatNumber(t)}</td>
                  <td class="text-center">${t.status || 'PHỔ THÔNG'}</td>
                  <td class="text-right">${getTicketPrice(t, totalAmount, ticketCount).toLocaleString('vi-VN')} đ</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total-section">
            <div class="total-box">
              <div class="total-row">
                <span>Tiền vé (${ticketCount} khách):</span>
                <span>${ticketBasePrice.toLocaleString('vi-VN')} đ</span>
              </div>
              <div class="total-row">
                <span>Phí dịch vụ & Xử lý:</span>
                <span>${processFee.toLocaleString('vi-VN')} đ</span>
              </div>
              <div class="total-row">
                <span>Thuế giá trị gia tăng (10%):</span>
                <span>${taxAndCharges.toLocaleString('vi-VN')} đ</span>
              </div>
              <div class="total-row grand">
                <span>TỔNG CỘNG:</span>
                <span>${(resolvedBooking.totalAmount || grandTotal).toLocaleString('vi-VN')} đ</span>
              </div>
            </div>
          </div>
          
          <div class="signature-grid">
            <div class="signature-block">
              <span style="font-style: italic; color: #64748B;">Khách hàng ký nhận</span>
              <strong style="margin-top: 60px;">${getPassengerName(resolvedBooking.tickets?.[0])}</strong>
            </div>
            <div class="signature-block">
              <span style="font-style: italic; color: #64748B;">Nhân viên lập hóa đơn</span>
              <strong style="margin-top: 60px; color: #4F46E5;">${staffName}</strong>
            </div>
          </div>
          
          <div class="footer">
            <p>Cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ bay của EasyFlight Airlines!</p>
            <p style="font-size: 10px; color: #CBD5E1; margin-top: 5px;">EasyFlight JSC • Hotline: 1900 6868 • Địa chỉ: Khu công nghệ cao, TP. Thủ Đức, TP. Hồ Chí Minh</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    printContent(invoiceHtml);
    addToast('Đã xuất hóa đơn PDF thành công!', 'success');
  };

  const handlePrintTicket = (t) => {
    if (!resolvedBooking) return;

    const barcodeMock = `*EF-${resolvedBooking.bookingId}-${getTicketId(t, 100)}*`;

    const ticketHtml = `
      <html>
      <head>
        <title>THẺ LÊN TÀU - ${getPassengerName(t)}</title>
        <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+39&display=swap" rel="stylesheet">
        <style>
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            @page { size: landscape; margin: 15mm; }
          }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #1E293B; margin: 0; padding: 20px; background: #FFF; }
          .boarding-pass {
            max-width: 800px;
            margin: 0 auto;
            border: 2px dashed #94A3B8;
            border-radius: 12px;
            background: #F8FAFC;
            display: flex;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
          }
          .main-ticket {
            padding: 24px;
            flex: 3;
            border-right: 2px dashed #CBD5E1;
            position: relative;
          }
          .stub-ticket {
            padding: 24px;
            flex: 1.2;
            background: #EEF2FF;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          .brand {
            font-size: 20px;
            font-weight: 800;
            color: #4F46E5;
          }
          .brand span {
            color: #0F172A;
          }
          .ticket-label {
            font-size: 10px;
            font-weight: 700;
            background: #4F46E5;
            color: white;
            padding: 3px 10px;
            border-radius: 9999px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .flight-route {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 15px 0;
          }
          .airport {
            text-align: left;
          }
          .airport.right {
            text-align: right;
          }
          .airport h3 {
            font-size: 32px;
            font-weight: 800;
            margin: 0;
            color: #0F172A;
            line-height: 1;
          }
          .airport p {
            font-size: 12px;
            color: #64748B;
            margin: 3px 0 0 0;
          }
          .flight-icon-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 0 10px;
          }
          .flight-line {
            width: 100%;
            height: 1px;
            background: #CBD5E1;
            position: relative;
          }
          .flight-line::after {
            content: '✈';
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 16px;
            color: #4F46E5;
            background: #F8FAFC;
            padding: 0 6px;
          }
          .duration {
            font-size: 10px;
            color: #94A3B8;
            margin-top: 5px;
          }
          .details-grid {
            display: grid;
            grid-template-cols: repeat(4, 1fr);
            gap: 15px;
            margin-top: 20px;
            border-top: 1px solid #E2E8F0;
            padding-top: 15px;
          }
          .details-grid.stub {
            grid-template-cols: 1fr 1fr;
            gap: 10px;
            margin-top: 10px;
            border-top: 1px solid #C7D2FE;
            padding-top: 10px;
          }
          .detail-item {
            display: flex;
            flex-direction: column;
          }
          .detail-item span {
            font-size: 9px;
            color: #94A3B8;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 2px;
          }
          .detail-item strong {
            font-size: 14px;
            color: #0F172A;
            font-weight: 700;
          }
          .detail-item strong.highlight {
            color: #4F46E5;
            font-size: 16px;
          }
          .barcode-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 20px;
          }
          .barcode {
            font-family: 'Libre Barcode 39', cursive, sans-serif;
            font-size: 40px;
            color: #0F172A;
            line-height: 1;
            margin: 0;
            letter-spacing: 3px;
          }
          .barcode-label {
            font-size: 9px;
            color: #94A3B8;
            margin-top: 2px;
          }
          .stub-header {
            border-bottom: 1px solid #C7D2FE;
            padding-bottom: 8px;
            margin-bottom: 10px;
          }
          .stub-title {
            font-size: 14px;
            font-weight: 800;
            color: #4F46E5;
          }
          .stub-passenger {
            font-size: 12px;
            font-weight: 700;
            color: #0F172A;
            margin-top: 2px;
          }
        </style>
      </head>
      <body>
        <div class="boarding-pass">
          <div class="main-ticket">
            <div class="header">
              <div class="brand">EASYFLIGHT<span>.VN</span></div>
              <div class="ticket-label">BOARDING PASS • THẺ LÊN TÀU</div>
            </div>
            
            <div class="flight-route">
              <div class="airport">
                <h3>${flight?.departureAirportCode || 'SGN'}</h3>
                <p>${flight?.departureCity || 'Hồ Chí Minh'}</p>
              </div>
              <div class="flight-icon-container">
                <div class="flight-line"></div>
                <div class="duration">${flight ? `${Math.floor(flight.estimateDuration / 60)}h ${flight.estimateDuration % 60}m` : '—'}</div>
              </div>
              <div class="airport right">
                <h3>${flight?.arrivalAirportCode || 'HAN'}</h3>
                <p>${flight?.arrivalCity || 'Hà Nội'}</p>
              </div>
            </div>
            
            <div class="details-grid">
              <div class="detail-item">
                <span>Hành khách / Passenger</span>
                <strong>${getPassengerName(t)}</strong>
              </div>
              <div class="detail-item">
                <span>Chuyến bay / Flight</span>
                <strong class="highlight">${flight?.flightCode || '—'}</strong>
              </div>
              <div class="detail-item">
                <span>Cửa / Gate</span>
                <strong>GATE 4</strong>
              </div>
              <div class="detail-item">
                <span>Ghế / Seat</span>
                <strong class="highlight" style="color: #6366F1;">${getSeatNumber(t)}</strong>
              </div>
            </div>

            <div class="details-grid" style="border-top: none; padding-top: 0; margin-top: 10px;">
              <div class="detail-item">
                <span>Ngày bay / Date</span>
                <strong>${flight ? new Date(flight.departureTime).toLocaleDateString('vi-VN') : '—'}</strong>
              </div>
              <div class="detail-item">
                <span>Giờ bay / Dep Time</span>
                <strong>${flight ? new Date(flight.departureTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '—'}</strong>
              </div>
              <div class="detail-item">
                <span>Hạng ghế / Class</span>
                <strong>${t.status || 'PHỔ THÔNG'}</strong>
              </div>
              <div class="detail-item">
                <span>Số vé / Ticket No</span>
                <strong>TKT-${resolvedBooking.bookingId}-${getTicketId(t, 100)}</strong>
              </div>
            </div>
            
            <div class="barcode-section">
              <p class="barcode">${barcodeMock}</p>
              <span class="barcode-label">PNR: ${resolvedBooking.pnrCode} • TKT: ${getTicketId(t, 100)}</span>
            </div>
          </div>
          
          <div class="stub-ticket">
            <div>
              <div class="stub-header">
                <div class="stub-title">EasyFlight</div>
                <div class="stub-passenger">${getPassengerName(t)}</div>
              </div>
              
              <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: bold; color: #0F172A; margin: 10px 0;">
                <span>${flight?.departureAirportCode || 'SGN'}</span>
                <span>&rarr;</span>
                <span>${flight?.arrivalAirportCode || 'HAN'}</span>
              </div>
              
              <div class="details-grid stub">
                <div class="detail-item">
                  <span>Chuyến bay</span>
                  <strong style="font-size: 12px;">${flight?.flightCode || '—'}</strong>
                </div>
                <div class="detail-item">
                  <span>Ghế</span>
                  <strong style="font-size: 12px; color: #4F46E5;">${getSeatNumber(t)}</strong>
                </div>
                <div class="detail-item">
                  <span>Ngày bay</span>
                  <strong style="font-size: 12px;">${flight ? new Date(flight.departureTime).toLocaleDateString('vi-VN') : '—'}</strong>
                </div>
                <div class="detail-item">
                  <span>Hạng ghế</span>
                  <strong style="font-size: 11px;">${t.status || 'P.THÔNG'}</strong>
                </div>
              </div>
            </div>
            
            <div style="text-align: center; border-top: 1px solid #C7D2FE; padding-top: 10px; font-size: 9px; color: #64748B;">
              <strong>BOARDING PASS STUB</strong>
              <p style="margin: 2px 0 0 0;">Vui lòng có mặt tại cửa trước 30 phút</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    printContent(ticketHtml);
    addToast(`Đã xuất vé máy bay PDF cho ${getPassengerName(t)} thành công!`, 'success');
  };

  const handleSaveNote = () => {
    setNote(draftNote);
    setEditingNote(false);
    addToast('Đã cập nhật ghi chú nội bộ.', 'success');
  };

  const getPassengerInitials = (name) => {
    if (!name) return 'HK';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (bookingLoading || flightsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
        <p className="text-sm text-slate-500 font-medium">Đang tải thông tin đặt vé từ database...</p>
      </div>
    );
  }

  if (!resolvedBooking) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-md mx-auto my-12">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="font-bold text-red-800 mb-1">Không thể tải thông tin đặt vé</h3>
        <p className="text-sm text-red-600 mb-4">{bookingError || 'Không tìm thấy thông tin đặt vé phù hợp.'}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('/staff/booking')} className="px-4 py-2 border border-slate-200 text-sm font-semibold text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
            Quay lại
          </button>
          <button onClick={refetchBooking} className="px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-semibold hover:bg-sky-600 transition-colors">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!resolvedBooking) {
    return (
      <div className="text-center py-20 text-slate-400 italic">
        Không tìm thấy thông tin đặt vé phù hợp.
      </div>
    );
  }

  const primaryPassenger = resolvedBooking.tickets?.[0];
  const totalAmountVal = resolvedBooking.totalAmount || 0;
  const refundAmount = Math.round(totalAmountVal * refundPercent);

  return (
    <div className="space-y-5 max-w-5xl">
      <Toast toasts={toasts} onRemove={removeToast} />
      <ConfirmDialog
        open={!!confirm}
        title={confirm?.title}
        message={confirm?.message}
        confirmLabel={confirm?.confirmLabel}
        confirmClass={confirm?.confirmClass}
        onConfirm={confirm?.onConfirm}
        onCancel={() => setConfirm(null)}
      />

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-slate-400">
        <button onClick={() => navigate('/staff/booking')} className="hover:text-sky-500 transition-colors font-medium">Danh sách đặt vé</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-slate-700">{resolvedBooking.pnrCode}</span>
        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${STATUS_STYLES[resolvedBooking.status] || 'text-slate-500 bg-slate-50'}`}>
          {STATUS_LABELS[resolvedBooking.status] || resolvedBooking.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left */}
        <div className="space-y-5">
          {/* Passenger */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-11 h-11 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-base">
                {getPassengerInitials(getPassengerName(primaryPassenger))}
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">{getPassengerName(primaryPassenger)}</h2>
                <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {getNationality(primaryPassenger)}
                </span>
              </div>
            </div>
            <div className="space-y-2.5 text-sm text-slate-500">
              <p className="flex items-center gap-2.5"><span>📞</span> {getDocumentNumber(primaryPassenger)}</p>
              <p className="flex items-center gap-2.5"><span>✉</span> {getPassengerName(primaryPassenger) !== 'Chưa rõ tên' ? `${getPassengerName(primaryPassenger).toLowerCase().replace(/\s+/g, '')}@email.com` : 'Chưa cung cấp'}</p>
              <p className="flex items-center gap-2.5"><span>📍</span> Quốc tịch: {getNationality(primaryPassenger)}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2 text-sm">
              <Ticket className="w-4 h-4 text-sky-500" /> Thông tin thanh toán
            </h3>
            <div className="mb-5">
              <p className="text-xs text-slate-400 mb-1">Tổng cộng</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-slate-800">{totalAmountVal.toLocaleString('vi-VN')} đ</span>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 border ${
                  resolvedBooking.paymentStatus === 'PAID' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-700 bg-amber-50 border-amber-200'
                }`}>
                  <CheckCircle2 className="w-3 h-3" /> {PAYMENT_STATUS_LABELS[resolvedBooking.paymentStatus] || resolvedBooking.paymentStatus}
                </span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-500"><span>Phương thức</span><span className="font-semibold">{resolvedBooking.paymentMethod || 'Chưa chọn'}</span></div>
              <div className="flex justify-between text-slate-500"><span>Ngày đặt</span><span>{formatDateTime(resolvedBooking.bookingDate)}</span></div>
              <div className="flex justify-between text-slate-500"><span>Hết hạn</span><span>{formatDateTime(resolvedBooking.expirationTime)}</span></div>
            </div>
          </div>

          {/* Internal Note */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-slate-400" /> Ghi chú nội bộ
              </h3>
              {!editingNote && (
                <button onClick={() => { setDraftNote(note); setEditingNote(true); }} className="text-xs text-sky-500 hover:underline">Sửa</button>
              )}
            </div>
            {editingNote ? (
              <div className="space-y-2">
                <textarea
                  value={draftNote}
                  onChange={e => setDraftNote(e.target.value)}
                  rows={3}
                  className="w-full text-sm text-slate-600 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 resize-none"
                />
                <div className="flex gap-2">
                  <button onClick={handleSaveNote} className="px-3 py-1.5 bg-sky-500 text-white rounded-lg text-xs font-semibold hover:bg-sky-600">Lưu</button>
                  <button onClick={() => setEditingNote(false)} className="px-3 py-1.5 border border-slate-200 text-slate-500 rounded-lg text-xs hover:bg-slate-50">Hủy</button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">"{note}"</p>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-2 space-y-5">
          {/* Flight Card */}
          <div className="bg-[#0F1629] rounded-2xl text-white p-6 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 opacity-[0.05]">
              <Plane className="w-48 h-48 text-white" />
            </div>
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Mã chuyến bay</p>
                <h2 className="text-3xl font-bold">{flight?.flightCode || '...'}</h2>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Giờ khởi hành</p>
                <p className="text-base font-semibold">{flight ? formatDateTime(flight.departureTime) : '—'}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h3 className="text-4xl font-bold">{flight?.departureAirportCode || 'SGN'}</h3>
                <p className="text-sm text-white/40 mt-1">{flight?.departureCity || 'Hồ Chí Minh'}</p>
              </div>
              <div className="flex-1 px-8 flex flex-col items-center">
                <p className="text-xs text-white/40 mb-2">
                  {flight ? `${Math.floor(flight.estimateDuration / 60)}h ${flight.estimateDuration % 60}m` : '—'}
                </p>
                <div className="w-full flex items-center gap-2">
                  <div className="h-px flex-1 bg-white/20" />
                  <Plane className="w-4 h-4 text-sky-400" />
                  <div className="h-px flex-1 bg-white/20" />
                </div>
                <p className="text-xs text-white/30 mt-2">Bay thẳng</p>
              </div>
              <div className="text-right">
                <h3 className="text-4xl font-bold">{flight?.arrivalAirportCode || 'HAN'}</h3>
                <p className="text-sm text-white/40 mt-1">{flight?.arrivalCity || 'Hà Nội'}</p>
              </div>
            </div>

            <div className="flex gap-8 relative z-10 border-t border-white/10 pt-5">
              {[
                ['Ghế đã chọn', resolvedBooking.tickets?.map(t => getSeatNumber(t)).filter(s => s && s !== 'Chưa xếp').join(', ') || 'Chưa xếp'],
                ['Hãng bay', flight?.airlineName || 'Vietnam Airlines'],
                ['Thời gian đến', flight ? formatDateTime(flight.arrivalTime) : '—']
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">{label}</p>
                  <p className="text-base font-bold">{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tickets Detail List */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2 text-sm">
              <Ticket className="w-4 h-4 text-sky-500" /> Chi tiết từng hành khách & Ghế ngồi ({resolvedBooking.tickets?.length || 0})
            </h3>
            <div className="space-y-3">
              {resolvedBooking.tickets?.map((t, idx) => (
                <div key={getTicketId(t, idx)} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between hover:bg-slate-100/50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-800">{getPassengerName(t)}</p>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 uppercase">
                        {t.status || 'ACTIVE'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">CCCD/Hộ chiếu: {getDocumentNumber(t)} • Quốc tịch: {getNationality(t)}</p>
                    <button
                      onClick={() => handlePrintTicket(t)}
                      className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 inline-flex"
                    >
                      <Printer className="w-3.5 h-3.5" /> In vé máy bay (PDF)
                    </button>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-violet-600 bg-violet-50 border border-violet-200 px-3 py-1 rounded-lg">
                      Ghế: {getSeatNumber(t)}
                    </span>
                    <p className="text-xs font-bold text-slate-700 mt-2">{getTicketPrice(t, resolvedBooking.totalAmount, resolvedBooking.tickets?.length).toLocaleString('vi-VN')} đ</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-semibold text-slate-700 mb-4 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" /> Điều khoản hoàn hủy vé
            </h3>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-5 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-800 text-sm">Hỗ trợ hủy hoàn vé</h4>
                <p className="text-xs text-emerald-700 mt-0.5">Vé này cho phép hoàn hủy trước giờ khởi hành theo quy định. Tỷ lệ hoàn tiền áp dụng là {Math.round(refundPercent * 100)}% giá trị vé.</p>
              </div>
            </div>
            <div className="space-y-3.5 text-sm">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Chi tiết phí</p>
              {[
                { label: `Khấu trừ hủy vé (${Math.round(100 - refundPercent * 100)}%)`, sub: 'Áp dụng theo quy định vận chuyển', val: `${Math.round(totalAmountVal * (1 - refundPercent)).toLocaleString('vi-VN')} đ`, valClass: 'text-red-500 font-semibold' },
                { label: 'Phí phạt hủy bổ sung', sub: 'Miễn phí cho khách hàng của EasyFlight', val: '0 đ', valClass: 'text-emerald-600' },
              ].map(({ label, sub, val, valClass }) => (
                <div key={label} className="flex justify-between items-start border-b border-slate-100 pb-3.5">
                  <div>
                    <p className="font-medium text-slate-700">{label}</p>
                    <p className="text-xs text-slate-400">{sub}</p>
                  </div>
                  <span className={`font-medium ${valClass}`}>{val}</span>
                </div>
              ))}
              <div className="flex justify-between items-start pt-1">
                <div>
                  <p className="font-bold text-slate-800">Số tiền dự kiến hoàn</p>
                  <p className="text-xs text-slate-400">Hoàn lại phương thức thanh toán ban đầu</p>
                </div>
                <span className="text-lg font-bold text-sky-600">{refundAmount.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-2">
              {resolvedBooking.paymentStatus !== 'PAID' && resolvedBooking.status !== 'CANCELLED' && (
                <button
                  onClick={handleConfirmPayment}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Xác nhận đã nhận tiền
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> In hóa đơn
              </button>
              <button
                onClick={handleSendEticket}
                className="px-5 py-2.5 bg-sky-500 text-white rounded-lg text-sm font-semibold hover:bg-sky-600 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Gửi E-Ticket
              </button>
            </div>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-3 gap-4 pt-4 mt-1 border-t border-slate-100">
            <div>
              <p className="text-[10px] uppercase text-slate-400 font-semibold mb-1">Mã đặt vé</p>
              <p className="text-xs text-sky-600 font-bold">#{resolvedBooking.bookingId}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-400 font-semibold mb-1">Phương thức</p>
              <p className="text-xs text-slate-700 font-medium">{resolvedBooking.paymentMethod || 'Chưa thanh toán'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-400 font-semibold mb-1">Hạn thanh toán</p>
              <p className="text-xs text-red-500 font-bold">{formatDateTime(resolvedBooking.expirationTime)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingDetailPage;