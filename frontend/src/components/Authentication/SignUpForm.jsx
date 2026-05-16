import '../../css/Authentication/SignUpForm.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import airplaneWindow from '../../assets/airplane_window.png';
import logoImg from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function SignUpForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

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
                    <form className="signup-form-fields" onSubmit={(e) => e.preventDefault()}>

                        {/* Họ và Tên */}
                        <div className="form-group">
                            <label htmlFor="fullname">Họ và Tên</label>
                            <div className="input-wrapper">
                                <i className="fas fa-user input-icon"></i>
                                <input
                                    type="text"
                                    id="fullname"
                                    placeholder="Nhập họ và tên của bạn"
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
                                    placeholder="Tạo mật khẩu an toàn"
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
                        <button type="submit" className="btn-create-account">
                            Tạo tài khoản <span className="btn-arrow">→</span>
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