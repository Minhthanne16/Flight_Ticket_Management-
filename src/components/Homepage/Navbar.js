import "../../css/Homepage/Navbar.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      {/* Khối 1: Logo */}
      <div className="logo-container">
        <Link to="/">
          <img src="/images/logo.png" alt="logo" />
        </Link>
      </div>

      {/* Khối 2: Menu giữa */}
      <ul className="nav-menu-wrapper">
        <li><Link href="#">Về chúng tôi</Link></li>
        <li><Link href="#">Đặt vé</Link></li>
        <li><Link href="#">Chuyến bay của tôi</Link></li>
        <li><Link href="#">Khuyến mãi</Link></li>
      </ul>

      {/* Khối 3: Authen phải */}
      <div className="authen">
        <Link to="/signup" className="auth-link">Đăng ký</Link>
        <Link to="/signin" className="auth-link login-btn">
          Đăng nhập
          <i class="fa fa-user-circle-o" aria-hidden="true"></i>
        </Link>
      
      </div>
    </nav>
  );
}

export default Navbar;