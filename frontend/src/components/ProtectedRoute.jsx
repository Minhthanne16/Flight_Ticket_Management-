import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const location = useLocation();

    // Lấy user từ localStorage (do AppRoutes tự tạo ở bước dưới)
    const user = JSON.parse(localStorage.getItem('user'));

    // Nếu không có user hoặc không đúng Role thì đá về trang chủ/login
    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
};