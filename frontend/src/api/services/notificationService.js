import api from '../axios';

// Local storage helper
const getLocalNotifs = () => {
  const notifs = localStorage.getItem('local_notifications');
  if (!notifs) {
    const initial = [];
    localStorage.setItem('local_notifications', JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(notifs);
};

const saveLocalNotifs = (notifs) => {
  localStorage.setItem('local_notifications', JSON.stringify(notifs));
};

export const notificationService = {
  getAll: async () => {
    try {
      const res = await api.get('/notifications');
      return res.data?.data || res.data;
    } catch {
      return getLocalNotifs();
    }
  },
  getMy: async () => {
    try {
      const res = await api.get('/notifications/my');
      return res.data?.data || res.data;
    } catch {
      return getLocalNotifs();
    }
  },
  // Gửi thông báo (kèm email) cho toàn bộ hành khách của một chuyến bay.
  // KHÔNG nuốt lỗi: để UI báo cho staff khi gửi thất bại.
  notifyFlight: async (flightId, data) => {
    const res = await api.post(`/notifications/flight/${flightId}`, data);
    return res.data?.data || res.data;
  },
  create: async (data) => {
    try {
      const res = await api.post('/notifications', data);
      return res.data?.data || res.data;
    } catch {
      const notifs = getLocalNotifs();
      const newNotif = {
        id: Date.now(),
        title: data.title,
        content: data.content || data.message || '',
        sentAt: new Date().toISOString(),
        status: 'SENT',
        unread: true
      };
      notifs.unshift(newNotif);
      saveLocalNotifs(notifs);
      // Dispatch storage event to sync other tabs/components
      window.dispatchEvent(new Event('storage'));
      return newNotif;
    }
  },
  markAllRead: () => {
    const notifs = getLocalNotifs().map(n => ({ ...n, unread: false }));
    saveLocalNotifs(notifs);
    window.dispatchEvent(new Event('storage'));
  }
};
