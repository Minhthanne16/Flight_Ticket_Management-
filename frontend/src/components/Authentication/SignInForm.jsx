import '../../css/Authentication/SignInForm.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import signinHero from '../../assets/signin_hero.png';
import logoImg from '../../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import authService from '../../api/authService';
import { ADMIN_STAFF } from '../../data/adminMockData';

function SignInForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (errorMsg) setErrorMsg('');
    }, [email, password]);

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');
        const cleanEmail = email.trim();
        try {
            const response = await authService.login({ email: cleanEmail, password });
            // Backend trả về { status: "success", message: "...", data: { email, role, accessToken } }
            if (response.status === 'success' && response.data) {
                const { data } = response;
                localStorage.setItem('token', data.accessToken);
                localStorage.setItem('user', JSON.stringify({
                    email: data.email,
                    role: data.role,
                    fullName: data.fullName
                }));

                // Chuyển hướng dựa trên role
                if (data.role === 'ADMIN') {
                    navigate('/admin/dashboard');
                } else if (data.role === 'STAFF') {
                    navigate('/staff/dashboard');
                } else {
                    navigate('/customer/home');
                }
            } else {
                setErrorMsg(response.message || 'Đăng nhập thất bại');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (!error.response) {
                // Tự động fallback sang Mock login nếu không kết nối được server (offline)
                const storedLogins = JSON.parse(localStorage.getItem('local_staff_logins') || '{}');
                const adminPass = storedLogins['admin@easyflight.vn'] || 'admin123';
                const staffPass = storedLogins['staff@easyflight.vn'] || 'staff123';
                const customerPass = storedLogins['customer@gmail.com'] || '123';

                const mockUsers = {
                    'admin@easyflight.vn': { password: 'admin123', role: 'ADMIN', token: 'mock-admin-token', fullName: 'Quản trị viên' },
                    'staff@easyflight.vn': { password: 'staff123', role: 'STAFF', token: 'mock-staff-token', fullName: 'Nhân viên EasyFlight' },
                    'customer@gmail.com': { password: '123', role: 'CUSTOMER', token: 'mock-customer-token', fullName: 'Khách hàng mẫu' }
                };

                ADMIN_STAFF.forEach(staff => {
                    mockUsers[staff.email] = {
                        password: storedLogins[staff.email] || 'staff123',
                        role: staff.role,
                        token: `mock-${staff.role.toLowerCase()}-token`,
                        fullName: staff.fullName
                    };
                });

                const matchedUser = mockUsers[cleanEmail];
                if (matchedUser && matchedUser.password === password) {
                    console.log('Server offline. Falling back to local mock login for:', cleanEmail);
                    localStorage.setItem('token', matchedUser.token);
                    localStorage.setItem('user', JSON.stringify({
                        email: cleanEmail,
                        role: matchedUser.role,
                        fullName: matchedUser.fullName
                    }));
                    if (matchedUser.role === 'ADMIN') {
                        navigate('/admin/dashboard');
                    } else if (matchedUser.role === 'STAFF') {
                        navigate('/staff/dashboard');
                    } else {
                        navigate('/customer/home');
                    }
                    return;
                }
                setErrorMsg('Không thể kết nối đến server. Vui lòng kiểm tra xem Backend đã khởi động chưa (cổng 5000)!');
            } else {
                let msg = error.response?.data?.message || 'Sai email hoặc mật khẩu!';
                const lowerMsg = msg.toLowerCase();
                if (lowerMsg.includes('bad credentials') || lowerMsg.includes('password') || lowerMsg.includes('credentials')) {
                    msg = 'Mật khẩu không đúng!';
                } else if (lowerMsg.includes('user not found') || lowerMsg.includes('email not found')) {
                    msg = 'Email không tồn tại trong hệ thống!';
                } else if (lowerMsg.includes('email')) {
                    msg = 'Email không hợp lệ hoặc không đúng!';
                } else if (msg === error.response?.data?.message && !msg.includes(' ')) {
                    msg = 'Sai email hoặc mật khẩu!'; 
                }
                setErrorMsg(msg);
            }
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="signin-wrapper">

            {/* ===== CỘT TRÁI: Hero ===== */}
            <div className="signin-hero">
                <img src={signinHero} alt="Sky view" className="signin-hero__img" />
                <div className="signin-hero__overlay">
                    <div className="signin-hero__content">
                        <h2 className="signin-hero__title">
                            Khám phá thế giới<br />cùng EasyFlight.
                        </h2>
                        <p className="signin-hero__desc">
                            Trải nghiệm đặt vé máy bay liền mạch, minh bạch và đẳng cấp.
                            Hành trình của bạn bắt đầu từ đây.
                        </p>
                    </div>
                </div>
            </div>

            {/* ===== CỘT PHẢI: Form ===== */}
            <div className="signin-panel">
                <div className="signin-card">

                    {/* Brand */}
                    <div className="signin-brand">
                        <div className="signin-brand__logo-box">
                            <img src={logoImg} alt="EasyFlight Logo" className="signin-brand__logo" />
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="signin-heading">Chào mừng bạn trở lại!</h1>
                    <p className="signin-subtext">
                        Vui lòng đăng nhập để tiếp tục hành trình của bạn.
                    </p>

                    {errorMsg && (
                        <div className="flex items-start gap-2 p-3 mb-5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{errorMsg}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form className="signin-form-fields" onSubmit={handleLogin}>

                        {/* Email */}
                        <div className="si-form-group">
                            <label htmlFor="signin-email">Email</label>
                            <div className="si-input-wrapper">
                                <i className="fas fa-envelope si-input-icon"></i>
                                <input
                                    type="email"
                                    id="signin-email"
                                    placeholder="Nhập địa chỉ email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Mật khẩu */}
                        <div className="si-form-group">
                            <label htmlFor="signin-password">Mật khẩu</label>
                            <div className="si-input-wrapper">
                                <i className="fas fa-lock si-input-icon"></i>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="signin-password"
                                    placeholder="Nhập mật khẩu"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="si-toggle-pwd"
                                    onClick={() => setShowPassword(v => !v)}
                                    aria-label="Hiện/ẩn mật khẩu"
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                </button>
                            </div>
                        </div>

                        {/* Options row */}
                        <div className="si-options-row">
                            <label className="si-remember">
                                <input type="checkbox" />
                                <span>Ghi nhớ đăng nhập</span>
                            </label>
                            <button type="button" className="si-forgot">Quên mật khẩu?</button>
                        </div>

                        {/* Submit */}
                        <button type="submit" className="btn-signin-new" disabled={isLoading}>
                            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>



                        {/* Signup link */}
                        <p className="si-signup-prompt">
                            Chưa có tài khoản?{' '}
                            <Link to="/signup" className="si-signup-link">Đăng ký ngay</Link>
                        </p>

                    </form>
                </div>
            </div>

        </div>
    );
}

export default SignInForm;