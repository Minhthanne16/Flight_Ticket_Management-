import api from '../axios';

const getLocalBookingsState = () => {
  return JSON.parse(localStorage.getItem('local_bookings_state') || '{}');
};

const saveLocalBookingState = (id, state) => {
  const states = getLocalBookingsState();
  states[id] = { ...(states[id] || {}), ...state };
  localStorage.setItem('local_bookings_state', JSON.stringify(states));
  window.dispatchEvent(new Event('storage'));
};

export const bookingService = {
  getAll: async () => {
    const res = await api.get('/bookings');
    const bookings = res.data?.data || res.data || [];
    const localStates = getLocalBookingsState();
    return bookings.map(b => {
      // Map flat backend properties if they are nested in raw entities
      const flightId = b.flight?.id || b.flightId;
      const paymentStatus = b.payment?.status || b.paymentStatus || 'UNPAID';
      const paymentMethod = b.payment?.paymentMethod || b.paymentMethod || 'CASH';
      
      const mapped = {
        ...b,
        bookingId: b.id || b.bookingId,
        flightId,
        paymentStatus,
        paymentMethod,
      };

      const localState = localStates[mapped.bookingId];
      if (localState) {
        return { ...mapped, ...localState };
      }
      return mapped;
    });
  },
  getById: async (id) => {
    const res = await api.get(`/bookings/${id}`);
    const b = res.data?.data || res.data;
    if (!b) return null;

    const flightId = b.flight?.id || b.flightId;
    const paymentStatus = b.payment?.status || b.paymentStatus || 'UNPAID';
    const paymentMethod = b.payment?.paymentMethod || b.paymentMethod || 'CASH';

    const mapped = {
      ...b,
      bookingId: b.id || b.bookingId,
      flightId,
      paymentStatus,
      paymentMethod,
    };

    const localStates = getLocalBookingsState();
    const localState = localStates[mapped.bookingId];
    if (localState) {
      return { ...mapped, ...localState };
    }
    return mapped;
  },
  create: (data) => api.post('/bookings', data),
  expire: async (id) => {
    try {
      const res = await api.put(`/bookings/${id}/expire`);
      saveLocalBookingState(id, { status: 'EXPIRED' });
      return res.data?.data || res.data;
    } catch {
      saveLocalBookingState(id, { status: 'EXPIRED' });
      return { id, status: 'EXPIRED' };
    }
  },
  cancel: async (id) => {
    try {
      const res = await api.delete(`/bookings/${id}`);
      saveLocalBookingState(id, { status: 'CANCELLED' });
      return res.data?.data || res.data;
    } catch {
      saveLocalBookingState(id, { status: 'CANCELLED' });
      return { id, status: 'CANCELLED' };
    }
  },
  confirmPayment: async (bookingId) => {
    try {
      const res = await api.post(`/payments/booking/${bookingId}/success`);
      saveLocalBookingState(bookingId, { paymentStatus: 'PAID', status: 'CONFIRMED' });
      return res.data?.data || res.data;
    } catch {
      saveLocalBookingState(bookingId, { paymentStatus: 'PAID', status: 'CONFIRMED' });
      return { bookingId, paymentStatus: 'PAID', status: 'CONFIRMED' };
    }
  }
};
