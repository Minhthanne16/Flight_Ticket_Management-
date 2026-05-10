import { useState } from 'react';
import { User, Mail, Phone, MapPin, Lock, Bell, Shield, Save, CheckCircle2, X } from 'lucide-react';
import { STAFF_USER } from '../../data/sharedData';

function Toast({ toasts, onRemove }) {
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
            {toasts.map(t => (
                <div key={t.id} className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium text-white min-w-[240px] bg-violet-600">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="flex-1">{t.message}</span>
                    <button onClick={() => onRemove(t.id)}><X className="w-4 h-4 opacity-70" /></button>
                </div>
            ))}
        </div>
    );
}

function ProfilePage() {
    const [form, setForm] = useState({
        name: STAFF_USER.fullName,
        email: STAFF_USER.email,
        phone: STAFF_USER.phone,
        address: STAFF_USER.address,
        role: STAFF_USER.role,
        department: STAFF_USER.department,
    });
    const [toasts, setToasts] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');
    const [notifSettings, setNotifSettings] = useState([true, true, true, true]);

    const addToast = (msg) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message: msg }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };

    return (
        <div className="max-w-3xl space-y-5">
            <Toast toasts={toasts} onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

            <div>
                <h1 className="text-xl font-bold text-slate-800">Thông tin cá nhân</h1>
                <p className="text-sm text-slate-400 mt-0.5">Quản lý tài khoản và cài đặt cá nhân.</p>
            </div>

            {/* Profile card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-lg shadow-violet-500/20">
                    LM
                </div>
                <div className="flex-1">
                    <h2 className="text-base font-bold text-slate-800">{form.name}</h2>
                    <p className="text-sm text-slate-400">{form.role} · {form.department}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{form.email}</p>
                </div>
                <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                    Đổi ảnh
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
                {[
                    { id: 'profile', label: 'Hồ sơ', icon: User },
                    { id: 'security', label: 'Bảo mật', icon: Lock },
                    { id: 'notifications', label: 'Thông báo', icon: Bell },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'profile' && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                    <h3 className="text-sm font-bold text-slate-700">Thông tin cá nhân</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { key: 'name', label: 'Họ và tên', icon: User, type: 'text' },
                            { key: 'email', label: 'Email', icon: Mail, type: 'email' },
                            { key: 'phone', label: 'Số điện thoại', icon: Phone, type: 'tel' },
                            { key: 'address', label: 'Địa chỉ', icon: MapPin, type: 'text' },
                        ].map(({ key, label, icon: Icon, type }) => (
                            <div key={key}>
                                <label className="text-xs font-semibold text-slate-500 block mb-1.5">{label}</label>
                                <div className="relative">
                                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                    <input
                                        type={type}
                                        value={form[key]}
                                        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                                        className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { key: 'role', label: 'Vai trò' },
                            { key: 'department', label: 'Bộ phận' },
                        ].map(({ key, label }) => (
                            <div key={key}>
                                <label className="text-xs font-semibold text-slate-500 block mb-1.5">{label}</label>
                                <input value={form[key]} disabled
                                    className="w-full px-3 py-2.5 border border-slate-100 rounded-lg text-sm text-slate-400 bg-slate-50 cursor-not-allowed" />
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end pt-2 border-t border-slate-100">
                        <button onClick={() => addToast('Đã cập nhật thông tin cá nhân.')}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors">
                            <Save className="w-4 h-4" /> Lưu thay đổi
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'security' && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                    <h3 className="text-sm font-bold text-slate-700">Đổi mật khẩu</h3>
                    <div className="space-y-4 max-w-sm">
                        {['Mật khẩu hiện tại', 'Mật khẩu mới', 'Xác nhận mật khẩu mới'].map(label => (
                            <div key={label}>
                                <label className="text-xs font-semibold text-slate-500 block mb-1.5">{label}</label>
                                <input type="password" placeholder="••••••••"
                                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all" />
                            </div>
                        ))}
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                        <p className="text-xs text-slate-400 mb-3">Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.</p>
                        <button onClick={() => addToast('Đã cập nhật mật khẩu thành công.')}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors">
                            <Shield className="w-4 h-4" /> Cập nhật mật khẩu
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'notifications' && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                    <h3 className="text-sm font-bold text-slate-700">Cài đặt thông báo</h3>
                    {[
                        { label: 'Cảnh báo chuyến bay delay', sub: 'Nhận thông báo khi chuyến bay bạn phụ trách bị delay' },
                        { label: 'Booking mới được phân công', sub: 'Nhận cảnh báo khi có booking mới giao cho bạn' },
                        { label: 'Yêu cầu hỗ trợ khách hàng', sub: 'Tin nhắn chat đến từ khách hàng' },
                        { label: 'Nhắc nhở ca làm việc', sub: 'Nhắc nhở 1 giờ trước khi ca của bạn bắt đầu' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                            <div>
                                <p className="text-sm font-medium text-slate-700">{item.label}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setNotifSettings(prev => prev.map((v, idx) => idx === i ? !v : v));
                                    addToast('Đã cập nhật cài đặt thông báo.');
                                }}
                                className={`w-10 h-6 rounded-full relative transition-colors ${notifSettings[i] ? 'bg-violet-600' : 'bg-slate-200'}`}
                            >
                                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${notifSettings[i] ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProfilePage;