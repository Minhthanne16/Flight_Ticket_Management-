import { useState } from 'react';
import {
  BookOpen, Zap, Shield, Settings2, Clock, DollarSign, Percent,
  RefreshCw, AlertTriangle, ToggleLeft, ToggleRight, Plus,
  CheckCircle2, XCircle, Wifi, CloudLightning, Fuel, Globe,
  Bell, MessageSquare, Lock, ChevronRight, Info, Plane, Scale,
  FileWarning, Save, Eye,
} from 'lucide-react';

// ─── Role helper ─────────────────────────────────────────────────────────────
function getUserRole() {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.role || 'STAFF';
  } catch {
    return 'STAFF';
  }
}

// ─── Reusable Toggle ────────────────────────────────────────────────────────
function Toggle({ enabled, onChange, disabled }) {
  return (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${disabled ? 'cursor-not-allowed opacity-60' : ''} ${enabled ? 'bg-[#6C5CE7]' : 'bg-[#E8E8F0]'}`}
    >
      <span
        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${enabled ? 'left-6' : 'left-1'}`}
      />
    </button>
  );
}

// ─── Reusable Input Field ────────────────────────────────────────────────────
function InputField({ label, value, onChange, suffix, helper, icon: Icon, readOnly }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-[#6E7491] uppercase tracking-wider">{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Icon className="w-4 h-4 text-[#9CA3AF]" />
          </div>
        )}
        <input
          type="text"
          value={value}
          onChange={e => !readOnly && onChange(e.target.value)}
          readOnly={readOnly}
          className={`w-full ${Icon ? 'pl-9' : 'pl-3'} ${suffix ? 'pr-14' : 'pr-3'} py-2.5 border border-[#E8E8F0] rounded-xl text-sm font-semibold text-[#27273F] ${readOnly ? 'bg-[#FAFAFE] cursor-not-allowed' : 'bg-white'} focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 focus:border-[#6C5CE7]/50 transition-all`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#9CA3AF]">{suffix}</span>
        )}
      </div>
      {helper && <p className="text-[11px] text-[#9CA3AF]">{helper}</p>}
    </div>
  );
}

// ─── Toggle Row ──────────────────────────────────────────────────────────────
function ToggleRow({ icon: Icon, iconBg, iconColor, label, description, enabled, onChange, disabled }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-[#F0F0F5] last:border-0">
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#27273F]">{label}</p>
          <p className="text-xs text-[#9CA3AF] mt-0.5 max-w-xs">{description}</p>
        </div>
      </div>
      <Toggle enabled={enabled} onChange={onChange} disabled={disabled} />
    </div>
  );
}

// ─── Card ────────────────────────────────────────────────────────────────────
function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-[#E8E8F0] shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}

// ─── Card Title ──────────────────────────────────────────────────────────────
function CardTitle({ icon: Icon, iconBg, iconColor, title, description, action }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#27273F]">{title}</h3>
          {description && <p className="text-xs text-[#9CA3AF] mt-0.5">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

// ─── Integration Status Row ──────────────────────────────────────────────────
const integrations = [];

function IntegrationRow({ icon: Icon, name, sub, status }) {
  const isActive = status === 'active';
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-[#F0F0F5] last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isActive ? 'bg-emerald-50' : 'bg-red-50'}`}>
          <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-500' : 'text-red-400'}`} />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#27273F]">{name}</p>
          <p className="text-[11px] text-[#9CA3AF]">{sub}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isActive ? (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-600">Hoạt động</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs font-semibold text-red-500">Lỗi</span>
          </>
        )}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
function RegulationsPage() {
  const role = getUserRole();
  const isViewOnly = role === 'STAFF';

  // Booking Policy state
  const [holdTime, setHoldTime] = useState('24');
  const [lateFee, setLateFee] = useState('150');
  const [overbooking, setOverbooking] = useState('5');

  // Operational toggles
  const [preflightValidation, setPreflightValidation] = useState(true);
  const [notamScanning, setNotamScanning] = useState(true);
  const [weightBalance, setWeightBalance] = useState(false);
  const [groundStop, setGroundStop] = useState('45');

  // System preferences
  const [emailSummaries, setEmailSummaries] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [twoFA, setTwoFA] = useState(false);

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 pb-10">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#27273F]">Quy định</h1>
          <p className="text-sm text-[#6E7491] mt-1">
            Quản lý các quy định về đặt vé, hoàn tiền và khai thác chuyến bay.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isViewOnly && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#F0EFFA] border border-[#D4D0F8] rounded-xl">
              <Eye className="w-4 h-4 text-[#6C5CE7]" />
              <span className="text-xs font-semibold text-[#6C5CE7]">Chỉ xem</span>
            </div>
          )}
          {!isViewOnly && (
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${saved
                  ? 'bg-emerald-500 text-white shadow-emerald-200'
                  : 'bg-[#6C5CE7] hover:bg-[#5A4BD1] text-white shadow-[#6C5CE7]/20'
                }`}
            >
              {saved ? (
                <><CheckCircle2 className="w-4 h-4" /> Đã lưu!</>
              ) : (
                <><Save className="w-4 h-4" /> Lưu thay đổi</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Row 1: Booking Policy + System Integrations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Booking Policies — 2/3 width */}
        <Card className="lg:col-span-2">
          <CardTitle
            icon={BookOpen}
            iconBg="bg-[#E9E8FC]"
            iconColor="text-[#6C5CE7]"
            title="Chính sách đặt vé"
            description="Xác định quy tắc xuất vé, thời gian giữ chỗ và phí hủy"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
            <InputField
              label="Thời gian giữ chỗ tối đa"
              value={holdTime}
              onChange={setHoldTime}
              suffix="giờ"
              icon={Clock}
              helper="Thời gian tối đa trước khi vé chưa thanh toán tự động hủy"
              readOnly={isViewOnly}
            />
            <InputField
              label="Phí hủy muộn"
              value={lateFee}
              onChange={setLateFee}
              suffix="USD"
              icon={DollarSign}
              helper="Áp dụng khi hủy trong vòng 24h trước khi khởi hành"
              readOnly={isViewOnly}
            />
            <InputField
              label="Ngưỡng bán quá vé"
              value={overbooking}
              onChange={setOverbooking}
              suffix="%"
              icon={Percent}
              helper="Tỷ lệ phần trăm cho phép tự động bán quá số ghế mỗi chuyến"
              readOnly={isViewOnly}
            />
          </div>

          {/* Refund Rules */}
          <div className="bg-[#FAFAFE] rounded-xl border border-[#E8E8F0] p-4">
            <div className="flex items-center gap-2 mb-3">
              <RefreshCw className="w-4 h-4 text-[#6C5CE7]" />
              <span className="text-sm font-bold text-[#27273F]">Quy tắc hoàn tiền</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white rounded-xl border border-[#E8E8F0] p-3.5">
                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1">Thời gian hoàn tiền</p>
                <p className="text-sm font-bold text-[#27273F]">7 – 14 ngày làm việc</p>
                <p className="text-[11px] text-[#9CA3AF] mt-1">Thời gian xử lý sau khi yêu cầu hủy được phê duyệt</p>
              </div>
              <div className="bg-white rounded-xl border border-[#E8E8F0] p-3.5">
                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1">Tỷ lệ hoàn tiền</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-black text-emerald-600">80%</p>
                  <p className="text-xs text-[#6E7491]">nếu hủy &gt;48h trước chuyến bay</p>
                </div>
                <p className="text-[11px] text-[#9CA3AF] mt-1">Không bao gồm thuế và phí dịch vụ</p>
              </div>
            </div>
          </div>
        </Card>

        {/* System Integrations — 1/3 width */}
        <Card>
          <CardTitle
            icon={Wifi}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-500"
            title="Tích hợp hệ thống"
            description="Các dịch vụ bên thứ ba đã kết nối"
          />

          <div className="divide-y divide-[#F0F0F5]">
            {integrations.map(item => (
              <IntegrationRow key={item.name} {...item} />
            ))}
          </div>

          {!isViewOnly && (
            <button className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-[#E8E8F0] rounded-xl text-sm font-semibold text-[#6C5CE7] hover:border-[#6C5CE7]/40 hover:bg-[#F0EFFA] transition-all">
              <Plus className="w-4 h-4" />
              Thêm kết nối mới
            </button>
          )}
        </Card>
      </div>

      {/* Row 2: Operational Regulations + System Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Operational Regulations — 2/3 width */}
        <Card className="lg:col-span-2">
          <CardTitle
            icon={Plane}
            iconBg="bg-sky-50"
            iconColor="text-sky-500"
            title="Quy định khai thác chuyến bay"
            description="Kiểm tra an toàn và quy tắc xác thực trước khi khởi hành"
          />

          <div className="space-y-0">
            <ToggleRow
              icon={Shield}
              iconBg="bg-[#E9E8FC]"
              iconColor="text-[#6C5CE7]"
              label="Xác thực an toàn trước chuyến bay"
              description="Bắt buộc hoàn thành danh sách kiểm tra an toàn trước khi cấp phép khởi hành"
              enabled={preflightValidation}
              onChange={setPreflightValidation}
              disabled={isViewOnly}
            />
            <ToggleRow
              icon={FileWarning}
              iconBg="bg-amber-50"
              iconColor="text-amber-500"
              label="Quét NOTAM tự động"
              description="Tự động quét và đánh dấu các NOTAM liên quan cho mỗi chặng bay theo lịch trình"
              enabled={notamScanning}
              onChange={setNotamScanning}
              disabled={isViewOnly}
            />
            <ToggleRow
              icon={Scale}
              iconBg="bg-emerald-50"
              iconColor="text-emerald-500"
              label="Xác thực nghiêm ngặt Trọng tải & Cân bằng"
              description="Từ chối cho hành khách lên máy bay nếu tính toán W&B của máy bay vượt quá giới hạn chứng nhận"
              enabled={weightBalance}
              onChange={setWeightBalance}
              disabled={isViewOnly}
            />
          </div>

          {/* Ground Stop Duration */}
          <div className="mt-5 pt-5 border-t border-[#F0F0F5]">
            <div className="max-w-xs">
              <InputField
                label="Thời gian dừng trên mặt đất tối thiểu"
                value={groundStop}
                onChange={setGroundStop}
                suffix="phút"
                icon={Clock}
                helper="Thời gian dừng bắt buộc tối thiểu giữa các chuyến bay liên tiếp của cùng một máy bay"
                readOnly={isViewOnly}
              />
            </div>
          </div>
        </Card>

        {/* System Preferences — 1/3 width */}
        <Card>
          <CardTitle
            icon={Settings2}
            iconBg="bg-slate-100"
            iconColor="text-slate-500"
            title="Tùy chọn hệ thống"
            description="Cài đặt thông báo và bảo mật"
          />

          <div className="space-y-0">
            <ToggleRow
              icon={Bell}
              iconBg="bg-[#E9E8FC]"
              iconColor="text-[#6C5CE7]"
              label="Tóm tắt qua Email"
              description="Tóm tắt hàng ngày về thay đổi quy định và cảnh báo hệ thống"
              enabled={emailSummaries}
              onChange={setEmailSummaries}
              disabled={isViewOnly}
            />
            <ToggleRow
              icon={MessageSquare}
              iconBg="bg-emerald-50"
              iconColor="text-emerald-500"
              label="Cảnh báo SMS khẩn cấp"
              description="Gửi SMS ngay lập tức cho các lỗi hệ thống có mức độ nghiêm trọng KHẨN CẤP"
              enabled={smsAlerts}
              onChange={setSmsAlerts}
              disabled={isViewOnly}
            />
            <ToggleRow
              icon={Lock}
              iconBg="bg-amber-50"
              iconColor="text-amber-500"
              label="Bắt buộc 2FA"
              description="Yêu cầu xác thực hai yếu tố cho tất cả các hành động của quản trị viên"
              enabled={twoFA}
              onChange={setTwoFA}
              disabled={isViewOnly}
            />
          </div>
        </Card>
      </div>

      {/* Warning Banner */}
      <div className="flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4">
        <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-amber-800">Yêu cầu phê duyệt</p>
          <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
            Thay đổi các quy định này yêu cầu <span className="font-bold">Phê duyệt của Ban điều hành Cấp 3</span>. Tất cả các sửa đổi đều được ghi lại để theo dõi tuân thủ và kiểm toán của Cục Hàng không.
          </p>
        </div>
        <button className="ml-auto shrink-0 flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors">
          Tìm hiểu thêm <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}

export default RegulationsPage;
