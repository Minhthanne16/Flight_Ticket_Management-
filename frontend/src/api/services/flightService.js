import api from '../axios';

const getLocalFlightStatuses = () => {
  return JSON.parse(localStorage.getItem('local_flight_statuses') || '{}');
};

const saveLocalFlightStatus = (id, status) => {
  const statuses = getLocalFlightStatuses();
  statuses[id] = status;
  localStorage.setItem('local_flight_statuses', JSON.stringify(statuses));
  window.dispatchEvent(new Event('storage'));
};

export const flightService = {
  create: async (data) => {
    const res = await api.post('/flights', data);
    return res.data?.data || res.data;
  },
  getAll: async () => {
    const res = await api.get('/flights');
    const flights = res.data?.data || res.data || [];
    const statuses = getLocalFlightStatuses();
    return flights.map(f => ({ ...f, status: statuses[f.id] || f.status }));
  },
  getById: async (id) => {
    const res = await api.get(`/flights/${id}`);
    const flight = res.data?.data || res.data;
    const statuses = getLocalFlightStatuses();
    if (flight) {
      flight.status = statuses[flight.id] || flight.status;
    }
    return flight;
  },
  search: async (params) => {
    const res = await api.get('/flights/search', { params });
    const flights = res.data?.data || res.data || [];
    const statuses = getLocalFlightStatuses();
    return flights.map(f => ({ ...f, status: statuses[f.id] || f.status }));
  },
  updateStatus: async (id, status) => {
    try {
      const res = await api.put(`/flights/${id}/status`, null, { params: { status } });
      saveLocalFlightStatus(id, status);
      return res.data?.data || res.data;
    } catch {
      saveLocalFlightStatus(id, status);
      return { id, status };
    }
  }
};
