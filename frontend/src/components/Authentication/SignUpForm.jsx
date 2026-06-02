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
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        // Map input IDs to state properties
        const fieldMap = {
            'fullname': 'fullName',
            'signup-email': 'email',
            'signup-phone': 'phoneNumber',
            'signup-password': 'password',
            'confirm-password': 'confirmPassword'
        };
        setFormData(prev => ({
            ...prev,
            [fieldMap[id] || id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        // ===== Validate phía client, hiển thị thông báo cho người dùng =====
        if (!formData.fullName.trim()) {
            setErrorMsg('Vui lòng nhập họ và tên.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
            setErrorMsg('Email không hợp lệ. Vui lòng kiểm tra lại.');
            return;
        }

        // khớp với @Pattern ở backend: ^(0|\+84)[0-9]{9,10}$
        const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
        if (!phoneRegex.test(formData.phoneNumber.trim())) {
            setErrorMsg('Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678).');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrorMsg('Mật khẩu xác nhận không khớp!');
            return;
        }

        if (formData.password.length < 8) {
            setErrorMsg('Mật khẩu phải chứa ít nhất 8 ký tự!');
            return;
        }

        if (!agreeTerms) {
            setErrorMsg('Vui lòng đồng ý với Điều khoản & Chính sách.');
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
            } else {
                setErrorMsg(response.message || 'Đăng ký tài khoản thất bại.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrorMsg(
                error.response?.data?.message || 
                'Đã xảy ra lỗi khi kết nối tới máy chủ. Vui lòng thử lại!'
            );
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

                    {/* Form */}
                    <form className="signup-form-fields" onSubmit={handleSubmit} noValidate>

                        {/* Error and Success Alerts */}
                        {errorMsg && (
                            <div style={{
                                padding: '12px',
                                backgroundColor: '#FEE2E2',
                                color: '#991B1B',
                                borderRadius: '8px',
                                fontSize: '14px',
                                border: '1px solid #FCA5A5'
                            }}>
                                {errorMsg}
                            </div>
                        )}
                        {successMsg && (
                            <div style={{
                                padding: '12px',
                                backgroundColor: '#D1FAE5',
                                color: '#065F46',
                                borderRadius: '8px',
                                fontSize: '14px',
                                border: '1px solid #6EE7B7'
                            }}>
                                {successMsg}
                            </div>
                        )}

                        {/* Họ và Tên */}
                        <div className="form-group">
                            <label htmlFor="fullname">Họ và Tên</label>
                            <div className="input-wrapper">
                                <i className="fas fa-user input-icon"></i>
                                <input
                                    type="text"
                                    id="fullname"
                                    placeholder="Nhập họ và tên của bạn"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <label htmlFor="signup-email">Email</label>
                            <div className="input-wrapper">
                                <i className="fas fa-envelope input-icon"></i>
                                <input
                                    type="email"
                                    id="signup-email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Số điện thoại */}
                        <div className="form-group">
                            <label htmlFor="signup-phone">Số điện thoại</label>
                            <div className="input-wrapper">
                                <i className="fas fa-phone input-icon"></i>
                                <input
                                    type="tel"
                                    id="signup-phone"
                                    placeholder="Nhập số điện thoại (ví dụ: 0912345678)"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Mật khẩu */}
                        <div className="form-group">
                            <label htmlFor="signup-password">Mật khẩu</label>
                            <div className="input-wrapper">
                                <i className="fas fa-lock input-icon"></i>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="signup-password"
                                    placeholder="Tạo mật khẩu an toàn (tối thiểu 8 ký tự)"
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
                            <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
                            <div className="input-wrapper">
                                <i className="fas fa-rotate-left input-icon"></i>
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    id="confirm-password"
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
                            <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
                            <span>
                                Tôi đồng ý với{' '}
                                <button type="button" className="link-inline">Điều khoản &amp; Chính sách</button>
                            </span>
                        </label>

                        {/* Submit */}
                        <button type="submit" className="btn-create-account" disabled={loading}>
                            {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}{' '}
                            {!loading && <span className="btn-arrow">→</span>}
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