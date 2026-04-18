
import "../../css/Authentication/SignInForm.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

function SignInForm() {
  return (
    <div className='signin-page'>
      <div className="signin-card">
        <img src="/images/logo.png" alt="Logo" className="signin-logo" />
        <h2>Đăng nhập Masupilami Club</h2>
        
        <form className="signin-form-fields">
          <div className="input-group">
            <label htmlFor="email">
              <i class="fa fa-envelope" aria-hidden="true"></i>
              Email
            </label>
            <input type="email" id="email" placeholder="Email, ví dụ: phuthuan323@gmail.com" required />
          </div>

          <div className="input-group">
            <label htmlFor="password"> 
              <i class="fa fa-key" aria-hidden="true"></i>
                Mật khẩu
            </label>
            <div className="password-wrapper">
                <input type="password" id="password" placeholder="Mật khẩu, ví dụ: 12345667" required />
                <i className="fa fa-eye-slash"></i> 
            </div>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Lưu thông tin
            </label>
            <a href="#" className="forgot-password">Quên mật khẩu?</a>
          </div>

          <button type="submit" className="btn-signin">Đăng nhập</button>
        </form>
      </div>
    </div>
  );
}

export default SignInForm;