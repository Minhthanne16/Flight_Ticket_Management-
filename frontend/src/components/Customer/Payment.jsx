import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingService } from '../../api/services/bookingService';
import { voucherService } from '../../api/services/voucherService';
import '../../css/Customer/Payment.css';

// Tài khoản nhận tiền (VietQR)
const BANK_ID = 'MB';
const ACCOUNT_NO = '0796553236';
const ACCOUNT_NAME = 'CAO HOANG PHUC';

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price || 0);

function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const {
    flight,
    fromCode,
    toCode,
    cabinClass,
    ticketClassId,
    totalPrice,
    finalTotal,
    voucherCode,
    discount,
    passengerCount,
    passengers
  } = state || {};

  // Số tiền phải trả = tổng sau giảm (nếu có voucher), mặc định = tạm tính
  const payable = finalTotal != null ? finalTotal : totalPrice;

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!flight || !passengers || passengers.length === 0) {
    return (
      <div className="payment-page">
        <div className="pay-card">
          <p>Không có thông tin đặt vé. Vui lòng quay lại và chọn chuyến bay.</p>
          <button className="pay-btn-secondary" onClick={() => navigate('/customer/home')}>Về trang chủ</button>
        </div>
      </div>
    );
  }

  const transferContent = `EASYFLIGHT ${fromCode || ''}${toCode || ''}`.trim();
  const qrUrl =
    `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png` +
    `?amount=${Math.round(Number(payable) || 0)}` +
    `&addInfo=${encodeURIComponent(transferContent)}` +
    `&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  const handleConfirmTransfer = async () => {
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        flightId: flight.id,
        ticketClassId: ticketClassId,
        paymentMethod: 'BANK_TRANSFER',
        passengers: passengers.map((p) => ({
          fullName: p.fullName,
          email: p.email || '',
          gender: p.gender,
          nationality: p.nationality,
          documentNumber: p.documentNumber,
          dateOfBirth: p.dateOfBirth
        }))
      };

      const res = await bookingService.create(payload);
      const bookingId = res?.data?.data?.bookingId || res?.data?.bookingId;

      // Áp mã giảm giá vào đơn vừa tạo (nếu có)
      if (voucherCode && bookingId) {
        try {
          await voucherService.apply({ voucherCode, bookingId });
        } catch {
          // Không chặn luồng nếu áp voucher lỗi (đơn vẫn đã tạo)
        }
      }

      // Đơn đã được tạo (chờ staff xác nhận) -> sang trang Chuyến bay của tôi
      navigate('/customer/my-flights', { replace: true });
    } catch (e) {
      setError(
        e?.response?.data?.message ||
        e?.message ||
        'Tạo đơn đặt vé thất bại. Vui lòng thử lại.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="pay-container">
        <h2 className="pay-title">Thanh toán bằng chuyển khoản VietQR</h2>
        <p className="pay-subtitle">
          Quét mã QR bên dưới bằng ứng dụng ngân hàng để thanh toán. Số tiền và nội dung đã được điền sẵn.
        </p>

        <div className="pay-grid">
          {/* QR */}
          <div className="pay-qr-box">
            <img src={qrUrl} alt="VietQR" className="pay-qr-img" />
            <p className="pay-qr-hint">Mở app ngân hàng → Quét mã QR</p>
          </div>

          {/* Thông tin chuyển khoản */}
          <div className="pay-info">
            <div className="pay-row">
              <span>Ngân hàng</span>
              <strong>MB Bank (MBBank)</strong>
            </div>
            <div className="pay-row">
              <span>Số tài khoản</span>
              <strong>{ACCOUNT_NO}</strong>
            </div>
            <div className="pay-row">
              <span>Chủ tài khoản</span>
              <strong>{ACCOUNT_NAME}</strong>
            </div>
            <div className="pay-row">
              <span>Nội dung</span>
              <strong>{transferContent}</strong>
            </div>
            {voucherCode && discount > 0 && (
              <>
                <div className="pay-row">
                  <span>Tạm tính</span>
                  <strong>{formatPrice(totalPrice)} VND</strong>
                </div>
                <div className="pay-row">
                  <span>Mã giảm giá ({voucherCode})</span>
                  <strong style={{ color: '#16a34a' }}>- {formatPrice(discount)} VND</strong>
                </div>
              </>
            )}
            <div className="pay-row pay-amount-row">
              <span>Số tiền cần chuyển</span>
              <strong className="pay-amount">{formatPrice(payable)} VND</strong>
            </div>

            <div className="pay-summary">
              <p><i className="fa-solid fa-plane"></i> {fromCode} → {toCode} · {flight.flightCode}</p>
              <p>Hạng vé: <strong>{cabinClass}</strong> · {passengerCount} hành khách</p>
            </div>

            {error && <div className="pay-error">{error}</div>}

            <button
              className="pay-btn-confirm"
              onClick={handleConfirmTransfer}
              disabled={submitting}
            >
              {submitting ? 'Đang xử lý...' : 'Xác nhận đã chuyển khoản'}
            </button>
            <p className="pay-note">
              Sau khi bấm xác nhận, đơn của bạn sẽ được gửi đến nhân viên để kiểm tra.
              Vé sẽ xuất hiện trong mục <strong>Chuyến bay của tôi</strong> với trạng thái chờ xác nhận.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
