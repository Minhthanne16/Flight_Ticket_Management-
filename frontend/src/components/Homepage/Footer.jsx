import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import logoImg from '../../assets/logo.png';

function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    
                    {/* Brand Info */}
                    <div>
                        <Link to="/" className="inline-block mb-6 focus:outline-none">
                            <img src={logoImg} alt="EasyFlight Logo" className="h-24 sm:h-32 md:h-40 w-auto object-contain max-w-[400px]" />
                        </Link>
                        <p className="text-slate-400 mb-6 leading-relaxed">
                            Nền tảng đặt vé máy bay hàng đầu Việt Nam, mang đến cho bạn trải nghiệm du lịch tuyệt vời với mức giá tốt nhất.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                                <i className="fab fa-facebook-f text-lg"></i>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-colors">
                                <i className="fab fa-twitter text-lg"></i>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors">
                                <i className="fab fa-instagram text-lg"></i>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                                <i className="fab fa-youtube text-lg"></i>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6">Về EasyFlight</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Cách đặt vé máy bay</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Chính sách hoàn tiền</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Quy định hành lý</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Trung tâm trợ giúp</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Tuyển dụng</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6">Liên hệ</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                                <span>Khu phố 6, Phường Linh Trung, Thành phố Thủ Đức, TP.HCM</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-slate-500 shrink-0" />
                                <span>1900 1234</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-slate-500 shrink-0" />
                                <span>support@easyflight.vn</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6">Đăng ký nhận tin</h3>
                        <p className="text-slate-400 mb-4">Nhận thông tin ưu đãi vé máy bay mới nhất qua email của bạn.</p>
                        <form className="flex flex-col space-y-3">
                            <input 
                                type="email" 
                                placeholder="Địa chỉ email của bạn" 
                                className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-white placeholder-slate-500"
                            />
                            <button type="submit" className="px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                                Đăng ký
                            </button>
                        </form>
                    </div>

                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                    <p>&copy; 2026 EasyFlight. Bảo lưu mọi quyền.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a>
                        <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
