import '../../css/Authentication/SignInForm.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import signinHero from '../../assets/signin_hero.png';
import logoImg from '../../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import authService from '../../api/authService';

function SignInForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        try {
            const response = await authService.login({ email, password });
            if (response.success) {
                const { data } = response;
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({
                    email: data.email,
                    role: data.role
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
                alert(response.message || 'Đăng nhập thất bại');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (!error.response) {
                alert('Không thể kết nối đến server. Vui lòng kiểm tra xem Backend đã khởi động chưa (cổng 5000)!');
            } else {
                alert(error.response?.data?.message || 'Sai email hoặc mật khẩu!');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickLogin = (role) => {
        let testEmail = '';
        let testPassword = '123'; // Mặc định hoặc từ database

        if (role === 'ADMIN') {
            testEmail = 'admin@easyflight.vn';
            testPassword = 'admin123';
        } else if (role === 'STAFF') {
            testEmail = 'staff@easyflight.vn';
            testPassword = 'staff123';
        } else {
            testEmail = 'customer@gmail.com';
            testPassword = '123';
        }

        setEmail(testEmail);
        setPassword(testPassword);
        
        // Tự động nhấn nút đăng nhập sau khi điền thông tin
        setTimeout(() => {
            const submitBtn = document.querySelector('.btn-signin-new');
            if (submitBtn) submitBtn.click();
        }, 100);
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

                        {/* Divider */}
                        <div className="si-divider">
                            <span>Hoặc đăng nhập nhanh (Test)</span>
                        </div>

                        {/* Social / Quick Login */}
                        <div className="si-social-buttons" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button type="button" className="si-social-btn" onClick={() => handleQuickLogin('CUSTOMER')} style={{ padding: '8px 10px', fontSize: '13px' }}>
                                Khách hàng
                            </button>
                            <button type="button" className="si-social-btn" onClick={() => handleQuickLogin('STAFF')} style={{ padding: '8px 10px', fontSize: '13px' }}>
                                Staff
                            </button>
                            <button type="button" className="si-social-btn" onClick={() => handleQuickLogin('ADMIN')} style={{ padding: '8px 10px', fontSize: '13px' }}>
                                Admin
                            </button>
                        </div>

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