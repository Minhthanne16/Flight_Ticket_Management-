import api from '../axios';

const getLocalSupportState = () => {
  return JSON.parse(localStorage.getItem('local_support_state') || '{}');
};

const saveLocalSupportState = (id, state) => {
  const states = getLocalSupportState();
  states[id] = { ...(states[id] || {}), ...state };
  localStorage.setItem('local_support_state', JSON.stringify(states));
  window.dispatchEvent(new Event('storage'));
};

export const supportService = {
  getChangeRequests: async () => {
    try {
      const res = await api.get('/supports/change-requests');
      const data = res.data?.data || res.data || [];
      const localStates = getLocalSupportState();
      
      return data.map(req => {
        const local = localStates[req.id];
        let status = req.status;
        if (local && local.status) {
          status = local.status;
        }
        return {
          ...req,
          status
        };
      });
    } catch (err) {
      console.error("Lỗi fetch change requests:", err);
      const localStates = getLocalSupportState();
      // If there are offline overrides, return them, otherwise empty array
      return Object.keys(localStates)
        .filter(key => localStates[key].supportType === 'CHANGE')
        .map(key => ({
          id: Number(key),
          ...localStates[key]
        }));
    }
  },
  getRefundRequests: async () => {
    try {
      const res = await api.get('/supports/refund-requests');
      const data = res.data?.data || res.data || [];
      const localStates = getLocalSupportState();
      
      return data.map(req => {
        const local = localStates[req.id];
        let status = req.status;
        if (local && local.status) {
          status = local.status;
        }
        return {
          ...req,
          status
        };
      });
    } catch (err) {
      console.error("Lỗi fetch refund requests:", err);
      const localStates = getLocalSupportState();
      return Object.keys(localStates)
        .filter(key => localStates[key].supportType === 'REFUND')
        .map(key => ({
          id: Number(key),
          ...localStates[key]
        }));
    }
  },
  saveLocalSupportState,
  approveRequest: async (id) => {
    try {
      const res = await api.patch(`/supports/${id}/approve`);
      saveLocalSupportState(id, { status: 'APPROVED' });
      return res.data?.data || res.data;
    } catch (err) {
      console.error("Lỗi duyệt yêu cầu:", err);
      saveLocalSupportState(id, { status: 'APPROVED' });
      return { id, status: 'APPROVED' };
    }
  },
  rejectRequest: async (id) => {
    saveLocalSupportState(id, { status: 'REJECTED' });
    return { id, status: 'REJECTED' };
  },
  getComplaints: async () => {
    try {
      const res = await api.get('/complaints');
      return res.data?.data || res.data || [];
    } catch (err) {
      console.warn("Lỗi kết nối API /complaints, chuyển sang chế độ lưu trữ cục bộ (localStorage):", err.message);
      const local = localStorage.getItem('local_complaints');
      return local ? JSON.parse(local) : [];
    }
  },
  saveLocalComplaints: (complaints) => {
    localStorage.setItem('local_complaints', JSON.stringify(complaints));
  },
  updateComplaintStatus: async (id, status) => {
    try {
      const res = await api.patch(`/complaints/${id}/status`, null, { params: { status } });
      return res.data?.data || res.data;
    } catch (err) {
      console.warn("Lỗi kết nối API cập nhật trạng thái khiếu nại, thực hiện cập nhật cục bộ:", err.message);
      const local = localStorage.getItem('local_complaints');
      let list = local ? JSON.parse(local) : [];
      list = list.map(c => c.id === id ? { ...c, status } : c);
      localStorage.setItem('local_complaints', JSON.stringify(list));
      return { id, status };
    }
  },
  getSystemErrors: async () => {
    try {
      const res = await api.get('/system-errors');
      return res.data?.data || res.data || [];
    } catch (err) {
      console.warn("Lỗi kết nối API /system-errors, chuyển sang chế độ lưu trữ cục bộ (localStorage):", err.message);
      const local = localStorage.getItem('local_system_errors');
      return local ? JSON.parse(local) : [];
    }
  },
  saveLocalSystemErrors: (errors) => {
    localStorage.setItem('local_system_errors', JSON.stringify(errors));
  },
  updateSystemErrorStatus: async (id, status) => {
    try {
      const res = await api.patch(`/system-errors/${id}/status`, null, { params: { status } });
      return res.data?.data || res.data;
    } catch (err) {
      console.warn("Lỗi kết nối API cập nhật trạng thái sự cố, thực hiện cập nhật cục bộ:", err.message);
      const local = localStorage.getItem('local_system_errors');
      let list = local ? JSON.parse(local) : [];
      list = list.map(e => e.id === id ? { ...e, status } : e);
      localStorage.setItem('local_system_errors', JSON.stringify(list));
      return { id, status };
    }
  }
};
