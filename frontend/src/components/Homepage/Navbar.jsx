import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import logoImg from '../../assets/logo.png';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Khối 1: Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link to="/" className="inline-block focus:outline-none">
            <img 
              src={logoImg} 
              alt="EasyFlight Logo" 
              className={`w-auto object-contain transition-all duration-300 ${
                isScrolled 
                  ? 'h-20 sm:h-24 md:h-28 max-w-[250px] sm:max-w-[300px]' 
                  : 'h-32 sm:h-44 md:h-56 lg:h-64 max-w-[350px] sm:max-w-[450px] md:max-w-[550px]'
              }`} 
            />
          </Link>
        </div>

        {/* Khối 2: Menu giữa */}
        <ul className="hidden lg:flex items-center space-x-8">
          <li><Link to="/" className={`font-medium transition-colors hover:text-blue-600 ${isScrolled ? 'text-slate-700' : 'text-white'}`}>Về chúng tôi</Link></li>
          <li><Link to="/" className={`font-medium transition-colors hover:text-blue-600 ${isScrolled ? 'text-slate-700' : 'text-white'}`}>Đặt vé</Link></li>
          <li><Link to="/" className={`font-medium transition-colors hover:text-blue-600 ${isScrolled ? 'text-slate-700' : 'text-white'}`}>Chuyến bay của tôi</Link></li>
          <li><Link to="/" className={`font-medium transition-colors hover:text-orange-600 ${isScrolled ? 'text-orange-500' : 'text-orange-400'}`}>Khuyến mãi 🔥</Link></li>
        </ul>

        {/* Khối 3: Authen phải */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className={`flex items-center space-x-1 mr-4 cursor-pointer hover:text-blue-600 transition-colors ${isScrolled ? 'text-slate-700' : 'text-white'}`}>
             <Globe className="w-4 h-4" />
             <span className="font-medium text-sm">VND | VN</span>
          </div>

          {user ? (
            <div className="flex items-center space-x-4">
              <span className={`font-medium text-sm ${isScrolled ? 'text-slate-700' : 'text-white'}`}>
                Xin chào, <span className="font-bold text-blue-600">{user.fullName || user.email}</span>
              </span>
              {user.role === 'ADMIN' && (
                <Link to="/admin/dashboard" className="px-3 py-1.5 bg-purple-600 text-white text-xs rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                  Quản trị
                </Link>
              )}
              {user.role === 'STAFF' && (
                <Link to="/staff/dashboard" className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg font-semibold hover:bg-green-700 transition-colors">
                  Nhân viên
                </Link>
              )}
              <button
                onClick={handleLogout}
                className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                  isScrolled 
                    ? 'text-red-600 hover:bg-red-50' 
                    : 'text-white hover:bg-white/20 bg-red-600/80 hover:bg-red-600'
                }`}
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <>
              <Link to="/signin" className={`px-4 py-2 rounded-xl font-semibold transition-colors ${isScrolled ? 'text-blue-600 hover:bg-blue-50' : 'text-white hover:bg-white/20'}`}>
                Đăng nhập
              </Link>
              <Link to="/signup" className="px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;