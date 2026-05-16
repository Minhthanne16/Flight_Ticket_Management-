import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Admin/Sidebar';
import AdminHeader from '../components/Admin/AdminHeader';

function AdminLayout() {
  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#F4F6F8' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <AdminHeader />
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
