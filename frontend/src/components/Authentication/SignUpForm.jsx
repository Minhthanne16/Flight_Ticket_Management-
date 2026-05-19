import '../../css/Authentication/SignUpForm.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import airplaneWindow from '../../assets/airplane_window.png';
import logoImg from '../../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import authService from '../../api/authService';

function SignUpForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.register(formData);
            if (response && response.status === 'success') {
                setSuccessMsg('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
                setTimeout(() => {
                    navigate('/signin');
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-wrapper">
            {/* ===== CỘT TRÁI: Hình ảnh ===== */}
            <div className="signup-hero">
                <img src={airplaneWindow} alt="Airplane window view" className="signup-hero__img" />
                <div className="signup-hero__overlay">
                    <p className="signup-hero__tagline">Khám phá thế giới,<br />không giới hạn.</p>
                </div>
            </div>

            {/* ===== CỘT PHẢI: Form ===== */}
            <div className="signup-panel">
                <div className="signup-panel__inner">

                    {/* Brand */}
                    <div className="signup-brand">
                        <div className="signup-brand__logo-box">
                            <img src={logoImg} alt="EasyFlight Logo" className="signup-brand__logo" />
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="signup-heading">Bắt đầu hành trình của bạn</h1>
                    <p className="signup-subtext">Tạo tài khoản để trải nghiệm dịch vụ hàng không đẳng cấp.</p>

                    {error && <div className="alert alert-danger" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
                    {successMsg && <div className="alert alert-success" style={{ color: 'green', marginBottom: '1rem' }}>{successMsg}</div>}

                    {/* Form */}
                    <form className="signup-form-fields" onSubmit={handleSubmit}>

                        {/* Họ và Tên */}
                        <div className="form-group">
                            <label htmlFor="fullName">Họ và Tên</label>
                            <div className="input-wrapper">
                                <i className="fas fa-user input-icon"></i>
                                <input
                                    type="text"
                                    id="fullName"
                                    placeholder="Nhập họ và tên của bạn"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <div className="input-wrapper">
                                <i className="fas fa-envelope input-icon"></i>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Số điện thoại */}
                        <div className="form-group">
                            <label htmlFor="phoneNumber">Số điện thoại</label>
                            <div className="input-wrapper">
                                <i className="fas fa-phone input-icon"></i>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    placeholder="Nhập số điện thoại"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Mật khẩu */}
                        <div className="form-group">
                            <label htmlFor="password">Mật khẩu</label>
                            <div className="input-wrapper">
                                <i className="fas fa-lock input-icon"></i>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    placeholder="Tạo mật khẩu an toàn"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(v => !v)}
                                    aria-label="Toggle password visibility"
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        {/* Xác nhận mật khẩu */}
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                            <div className="input-wrapper">
                                <i className="fas fa-rotate-left input-icon"></i>
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    id="confirmPassword"
                                    placeholder="Nhập lại mật khẩu"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowConfirm(v => !v)}
                                    aria-label="Toggle confirm password visibility"
                                >
                                    <i className={`fas ${showConfirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        {/* Checkbox */}
                        <label className="terms-checkbox">
                            <input type="checkbox" required />
                            <span>
                                Tôi đồng ý với{' '}
                                <button type="button" className="link-inline">Điều khoản &amp; Chính sách</button>
                            </span>
                        </label>

                        {/* Submit */}
                        <button type="submit" className="btn-create-account" disabled={loading}>
                            {loading ? 'Đang tạo tài khoản...' : (
                                <>Tạo tài khoản <span className="btn-arrow">→</span></>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="divider">
                            <span>HOẶC ĐĂNG KÝ BẰNG</span>
                        </div>

                        {/* Social buttons */}
                        <div className="social-buttons">
                            <button type="button" className="social-btn">
                                <img
                                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                                    alt="Google"
                                    width="20"
                                />
                                Google
                            </button>
                            <button type="button" className="social-btn">
                                <i className="fab fa-apple social-btn__apple-icon"></i>
                                Apple
                            </button>
                        </div>

                        {/* Sign in link */}
                        <p className="signin-prompt">
                            Đã có tài khoản?{' '}
                            <Link to="/signin" className="signin-link">Đăng nhập</Link>
                        </p>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUpForm;