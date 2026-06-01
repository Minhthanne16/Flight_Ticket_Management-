import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function Payment() {
  const { state } = useLocation();

  const {
    flight,
    passengers,
    cabinClass,
    totalPrice,
    passengerCount,
    fromCode,
    toCode
  } = state || {};

  const [paymentMethod, setPaymentMethod] =
    useState('VNPAY');

  const handlePayment = async () => {
    try {
      const payload = {
        flightId: flight.id,
        cabinClass,
        passengers,
        paymentMethod
      };

      console.log(payload);

      // gọi API backend ở đây

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="payment-page">

      <h2>Payment</h2>

      <div className="summary-card">
        <h3>Flight Summary</h3>

        <p>
          {fromCode} → {toCode}
        </p>

        <p>
          Class: {cabinClass}
        </p>

        <p>
          Passengers: {passengerCount}
        </p>

        <p>
          Total:
          {' '}
          {new Intl.NumberFormat('vi-VN')
            .format(totalPrice)}
          {' '}
          VND
        </p>
      </div>

      <div className="payment-methods">

        <h3>Select Payment Method</h3>

        <label>
          <input
            type="radio"
            value="VNPAY"
            checked={paymentMethod === 'VNPAY'}
            onChange={(e) =>
              setPaymentMethod(e.target.value)
            }
          />
          VNPay
        </label>

        <label>
          <input
            type="radio"
            value="MOMO"
            checked={paymentMethod === 'MOMO'}
            onChange={(e) =>
              setPaymentMethod(e.target.value)
            }
          />
          MoMo
        </label>

      </div>

      <button
        className="btn-pay"
        onClick={handlePayment}
      >
        Pay Now
      </button>

    </div>
  );
}

export default Payment;