import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, Shield, Save, CheckCircle2, X, Loader2, AlertCircle, Eye, EyeOff, KeyRound } from 'lucide-react';
import authService from '../../api/authService';

function Toast({ toasts, onRemove }) {
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
            {toasts.map(t => (
                <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium text-white min-w-[240px] ${t.type === 'success' ? 'bg-emerald-600' : 'bg-red-500'}`}>
                    {t.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                    <span className="flex-1">{t.message}</span>
                    <button onClick={() => onRemove(t.id)}><X className="w-4 h-4 opacity-70 hover:opacity-100" /></button>
                </div>
            ))}
        </div>
    );
}

// Password strength checker
function getPasswordStrength(pwd) {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score, label: 'Rất yếu', color: 'bg-red-500' };
    if (score === 2) return { score, label: 'Yếu', color: 'bg-orange-400' };
    if (score === 3) return { score, label: 'Trung bình', color: 'bg-amber-400' };
    if (score === 4) return { score, label: 'Mạnh', color: 'bg-emerald-400' };
    return { score, label: 'Rất mạnh', color: 'bg-emerald-600' };
}

function PasswordInput({ value, onChange, placeholder = '••••••••', label }) {
    const [show, setShow] = useState(false);
    return (
        <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1.5">{label}</label>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                    type={show ? 'text' : 'password'}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="w-full pl-9 pr-10 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                />
                <button
                    type="button"
                    onClick={() => setShow(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
}

function AdminProfile() {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
    const displayName = user.fullName || user.username || 'Admin';

    const [form, setForm] = useState({ fullName: displayName, phoneNumber: user.phoneNumber || '' });
    const [pwdForm, setPwdForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [isSubmittingPwd, setIsSubmittingPwd] = useState(false);
    const [toasts, setToasts] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');

    const addToast = (msg, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message: msg, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };

    const handleSaveProfile = () => {
        try {
            // Cập nhật local storage cho Admin
            const updatedUser = { ...user, fullName: form.fullName, phoneNumber: form.phoneNumber };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            window.dispatchEvent(new Event('storage'));
            addToast('Cập nhật thông tin hồ sơ thành công!', 'success');
        } catch (err) {
            addToast('Lỗi khi cập nhật hồ sơ', 'error');
        }
    };

    const handleChangePassword = async () => {
        const { oldPassword, newPassword, confirmPassword } = pwdForm;

        if (!oldPassword || !newPassword || !confirmPassword) {
            addToast('Vui lòng điền đầy đủ tất cả các trường mật khẩu.', 'error');
            return;
        }
        if (newPassword.length < 8) {
            addToast('Mật khẩu mới phải có ít nhất 8 ký tự.', 'error');
            return;
        }
        if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/\d/.test(newPassword)) {
            addToast('Mật khẩu mới phải có chữ hoa, chữ thường và số.', 'error');
            return;
        }
        if (newPassword !== confirmPassword) {
            addToast('Mật khẩu xác nhận không khớp.', 'error');
            return;
        }
        if (oldPassword === newPassword) {
            addToast('Mật khẩu mới không được trùng mật khẩu cũ.', 'error');
            return;
        }

        setIsSubmittingPwd(true);
        try {
            await authService.changePassword({ oldPassword, newPassword, confirmPassword });
            addToast('Đổi mật khẩu thành công!', 'success');
            setPwdForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Mật khẩu cũ không đúng hoặc có lỗi xảy ra.';
            addToast(msg, 'error');
        } finally {
            setIsSubmittingPwd(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'A';
        const words = name.trim().split(/\s+/);
        if (words.length >= 2) {
            return (words[0][0] + words[words.length - 1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const strength = getPasswordStrength(pwdForm.newPassword);

    return (
        <div className="max-w-3xl space-y-5 p-2">
            <Toast toasts={toasts} onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

            <div>
                <h1 className="text-xl font-bold text-slate-800 font-sans">Thông tin cá nhân</h1>
                <p className="text-sm text-slate-400 mt-0.5">Quản lý tài khoản và cài đặt cá nhân của Quản trị viên.</p>
            </div>

            {/* Profile card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-lg shadow-violet-500/20">
                    {getInitials(displayName)}
                </div>
                <div className="flex-1">
                    <h2 className="text-base font-bold text-slate-800">{displayName}</h2>
                    <p className="text-sm text-slate-400">Vai trò: {user.role || 'ADMIN'} · Quản trị hệ thống</p>
                    <p className="text-xs text-slate-400 mt-0.5">{user.email || user.username || 'admin@easyflight.vn'}</p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-full uppercase tracking-wider">
                    Đang hoạt động
                </span>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
                {[
                    { id: 'profile', label: 'Hồ sơ', icon: User },
                    { id: 'security', label: 'Bảo mật', icon: Lock },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Tab: Profile ── */}
            {activeTab === 'profile' && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                    <h3 className="text-sm font-bold text-slate-700">Thông tin chi tiết</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 block mb-1.5">Họ và tên</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                <input
                                    type="text"
                                    value={form.fullName}
                                    onChange={e => setForm(prev => ({ ...prev, fullName: e.target.value }))}
                                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-500 block mb-1.5">Số điện thoại</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                <input
                                    type="tel"
                                    value={form.phoneNumber}
                                    onChange={e => setForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-500 block mb-1.5">Địa chỉ Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                <input type="email" value={user.email || 'admin@easyflight.vn'} disabled
                                    className="w-full pl-9 pr-3 py-2.5 border border-slate-100 rounded-lg text-sm text-slate-400 bg-slate-50 cursor-not-allowed" />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-500 block mb-1.5">Vai trò hệ thống</label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                <input type="text" value={user.role || 'ADMIN'} disabled
                                    className="w-full pl-9 pr-3 py-2.5 border border-slate-100 rounded-lg text-sm text-slate-400 bg-slate-50 cursor-not-allowed" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-slate-100">
                        <button onClick={handleSaveProfile} disabled={!form.fullName}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors disabled:opacity-50">
                            <Save className="w-4 h-4" /> Lưu thay đổi
                        </button>
                    </div>
                </div>
            )}

            {/* ── Tab: Security ── */}
            {activeTab === 'security' && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                        <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                            <KeyRound className="w-5 h-5 text-violet-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">Đổi mật khẩu</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Nhập mật khẩu hiện tại và mật khẩu mới để cập nhật bảo mật tài khoản.</p>
                        </div>
                    </div>

                    <div className="space-y-4 max-w-sm">
                        <PasswordInput
                            label="Mật khẩu hiện tại"
                            value={pwdForm.oldPassword}
                            onChange={e => setPwdForm(prev => ({ ...prev, oldPassword: e.target.value }))}
                            placeholder="Nhập mật khẩu hiện tại"
                        />

                        <div>
                            <PasswordInput
                                label="Mật khẩu mới"
                                value={pwdForm.newPassword}
                                onChange={e => setPwdForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                placeholder="Ít nhất 8 ký tự"
                            />
                            {pwdForm.newPassword && (
                                <div className="mt-2">
                                    <div className="flex gap-1 h-1.5">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div
                                                key={i}
                                                className={`flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-slate-100'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className={`text-[11px] mt-1 font-medium ${strength.score <= 2 ? 'text-red-500' : strength.score === 3 ? 'text-amber-500' : 'text-emerald-600'}`}>
                                        Độ mạnh: {strength.label}
                                    </p>
                                </div>
                            )}
                        </div>

                        <PasswordInput
                            label="Xác nhận mật khẩu mới"
                            value={pwdForm.confirmPassword}
                            onChange={e => setPwdForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            placeholder="Nhập lại mật khẩu mới"
                        />

                        {pwdForm.confirmPassword && (
                            <div className={`flex items-center gap-1.5 text-xs font-medium ${pwdForm.newPassword === pwdForm.confirmPassword ? 'text-emerald-600' : 'text-red-500'}`}>
                                {pwdForm.newPassword === pwdForm.confirmPassword
                                    ? <><CheckCircle2 className="w-3.5 h-3.5" /> Mật khẩu khớp</>
                                    : <><X className="w-3.5 h-3.5" /> Mật khẩu chưa khớp</>
                                }
                            </div>
                        )}
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                        <button
                            onClick={handleChangePassword}
                            disabled={isSubmittingPwd || !pwdForm.oldPassword || !pwdForm.newPassword || !pwdForm.confirmPassword}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors disabled:opacity-50"
                        >
                            {isSubmittingPwd ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Đang cập nhật...</>
                            ) : (
                                <><Shield className="w-4 h-4" /> Cập nhật mật khẩu</>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminProfile;
