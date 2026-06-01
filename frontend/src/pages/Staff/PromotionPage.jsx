import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tag, CheckCircle2, XCircle, Eye, ChevronLeft, ChevronRight, Search, Loader2, AlertCircle, X, Calendar, Hash, Percent, DollarSign, BarChart3, Clock } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { voucherService } from '../../api/services/voucherService';
import { VOUCHERS as MOCK_VOUCHERS } from '../../data/adminMockData';

const PAGE_SIZE = 4;

// Map backend VoucherStatus enum → display label + style
const statusMap = {
  ACTIVE: { label: 'Hoạt động', cls: 'text-emerald-700 bg-emerald-50 border border-emerald-200' },
  EXPIRED: { label: 'Hết hạn', cls: 'text-red-600 bg-red-50 border border-red-200' },
  INACTIVE: { label: 'Vô hiệu', cls: 'text-[#6C5CE7] bg-[#E9E8FC] border border-[#D4D0F8]' },
};

function formatDiscount(v) {
  if (v.discountType === 'PERCENTAGE') return `${v.discountValue}%`;
  return `${Number(v.discountValue).toLocaleString('vi-VN')} đ`;
}

function formatDate(dt) {
  if (!dt) return '—';
  const d = new Date(dt);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function LoadingState() {
  return (
    <tr><td colSpan={7} className="py-16 text-center">
      <Loader2 className="w-6 h-6 animate-spin text-[#6C5CE7] mx-auto mb-2" />
      <p className="text-sm text-[#9CA3AF]">Đang tải dữ liệu...</p>
    </td></tr>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <tr><td colSpan={7} className="py-16 text-center">
      <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
      <p className="text-sm text-red-500 mb-3">{message}</p>
      <button onClick={onRetry} className="text-xs font-semibold text-[#6C5CE7] hover:underline">Thử lại</button>
    </td></tr>
  );
}

function EmptyState() {
  return (
    <tr><td colSpan={7} className="py-16 text-center text-[#9CA3AF] text-sm">Không có voucher nào</td></tr>
  );
}

function PromotionPage() {
  const [searchParams] = useSearchParams();
  const { data: vouchers, loading, error, refetch } = useApi(voucherService.getAll);
  const querySearch = searchParams.get('search') || '';
  const [search, setSearch] = useState(querySearch);
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  // Auto-refresh: poll every 30s + refetch when tab regains focus
  useEffect(() => {
    const interval = setInterval(() => { refetch(); }, 30000);
    const onFocus = () => { refetch(); };
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [refetch]);

  const list = (vouchers && vouchers.length > 0) ? vouchers : MOCK_VOUCHERS.map(v => ({
    id: v.id,
    voucherCode: v.code,
    name: v.code,
    discountType: v.type === 'PERCENT' ? 'PERCENTAGE' : 'FIXED',
    discountValue: v.value,
    minBookingAmount: v.minAmount,
    maxDiscountAmount: v.maxDiscount,
    usageLimit: v.usageLimit,
    usedCount: v.usedCount,
    startTime: v.validFrom,
    endTime: v.validTo,
    status: v.status,
  }));

  const filtered = useMemo(() => {
    return list.filter(v => {
      const q = search.toLowerCase();
      const matchSearch = !q || v.voucherCode?.toLowerCase().includes(q) || v.name?.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'All' || v.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [list, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const activeCount = list.filter(v => v.status === 'ACTIVE').length;
  const expiredCount = list.filter(v => v.status === 'EXPIRED').length;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-[#27273F]">Khuyến mãi</h1>
        <p className="text-sm text-[#6E7491] mt-1">Xem thông tin chi tiết các mã giảm giá.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#E8E8F0] p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#E9E8FC] flex items-center justify-center">
              <Tag className="w-5 h-5 text-[#6C5CE7]" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Tổng Voucher</p>
          <p className="text-2xl font-bold text-[#27273F] mt-0.5">{loading ? '—' : list.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8E8F0] p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Voucher Hoạt Động</p>
          <p className="text-2xl font-bold text-[#27273F] mt-0.5">{loading ? '—' : activeCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8E8F0] p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Voucher Hết Hạn</p>
          <p className="text-2xl font-bold text-[#27273F] mt-0.5">{loading ? '—' : expiredCount}</p>
        </div>
      </div>

      {/* Voucher Table */}
      <div className="bg-white rounded-2xl border border-[#E8E8F0] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E8E8F0] flex items-center justify-between">
          <h2 className="text-base font-bold text-[#27273F]">Danh sách Voucher</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Tìm voucher..."
                className="pl-9 pr-4 py-2 border border-[#E8E8F0] rounded-lg text-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 w-48"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-[#E8E8F0] rounded-lg text-sm text-[#6E7491] focus:outline-none cursor-pointer"
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="EXPIRED">Hết hạn</option>
              <option value="INACTIVE">Vô hiệu hóa</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E8E8F0] bg-[#FAFAFE] text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">
                <th className="px-6 py-4">Mã Voucher</th>
                <th className="px-6 py-4">Giá Trị Giảm</th>
                <th className="px-6 py-4">Ngày Hết Hạn</th>
                <th className="px-6 py-4">Trạng Thái</th>
                <th className="px-6 py-4">Hạn Mức</th>
                <th className="px-6 py-4">Đã Dùng</th>
                <th className="px-6 py-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0F5]">
              {loading ? (
                <LoadingState />
              ) : paginated.length === 0 ? (
                <EmptyState />
              ) : paginated.map(v => {
                const statusInfo = statusMap[v.status] || { label: v.status, cls: 'text-slate-500 bg-slate-100' };
                const usagePct = v.usageLimit ? Math.round((v.usedCount / v.usageLimit) * 100) : null;
                return (
                  <tr key={v.id} className="hover:bg-[#FAFAFE] transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-[#6C5CE7]">{v.voucherCode}</div>
                      <div className="text-xs text-[#9CA3AF] mt-0.5">{v.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#27273F]">{formatDiscount(v)}</td>
                    <td className="px-6 py-4 text-sm text-[#6E7491]">{formatDate(v.endTime)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${statusInfo.cls}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6E7491]">
                      {v.usageLimit ? v.usageLimit.toLocaleString() : 'Không giới hạn'}
                    </td>
                    <td className="px-6 py-4">
                      {usagePct !== null ? (
                        <div>
                          <div className="w-24 h-2 bg-[#E8E8F0] rounded-full overflow-hidden mb-1">
                            <div
                              className={`h-full rounded-full ${usagePct >= 90 ? 'bg-red-400' : usagePct >= 70 ? 'bg-amber-400' : 'bg-[#6C5CE7]'}`}
                              style={{ width: `${Math.min(usagePct, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-[#6E7491]">{v.usedCount?.toLocaleString()}/{v.usageLimit?.toLocaleString()}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-[#6E7491]">{v.usedCount?.toLocaleString() ?? '—'}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedVoucher(v)}
                        className="p-2 text-[#9CA3AF] hover:text-[#6C5CE7] hover:bg-[#E9E8FC] rounded-lg transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-[#E8E8F0] flex items-center justify-between">
          <p className="text-xs text-[#9CA3AF] font-medium">
            {filtered.length > 0
              ? `Hiện thị ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)} trên ${filtered.length} kết quả`
              : '0 kết quả'}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="p-2 rounded-lg border border-[#E8E8F0] disabled:opacity-30 hover:bg-[#F0EFFA] transition-colors">
              <ChevronLeft className="w-4 h-4 text-[#6E7491]" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
              <button key={i + 1} onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${currentPage === i + 1 ? 'bg-[#6C5CE7] text-white' : 'text-[#6E7491] hover:bg-[#F0EFFA]'}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-[#E8E8F0] disabled:opacity-30 hover:bg-[#F0EFFA] transition-colors">
              <ChevronRight className="w-4 h-4 text-[#6E7491]" />
            </button>
          </div>
        </div>
      </div>

      {/* Voucher Detail Modal */}
      {selectedVoucher && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          onClick={() => setSelectedVoucher(null)}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            style={{ animation: 'voucherFadeIn 0.2s ease-out' }}
          />
          {/* Modal */}
          <div
            className="relative bg-white rounded-2xl shadow-2xl border border-[#E8E8F0] w-[480px] max-w-[92vw] max-h-[90vh] overflow-y-auto"
            style={{ animation: 'voucherModalSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#6C5CE7] to-[#7E6FF2] px-6 py-5 rounded-t-2xl">
              <button
                onClick={() => setSelectedVoucher(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-xs font-medium">Mã Voucher</p>
                  <p className="text-white text-lg font-bold tracking-wide">{selectedVoucher.voucherCode}</p>
                </div>
              </div>
              <p className="text-white/80 text-sm">{selectedVoucher.name}</p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Trạng thái</span>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
                  (statusMap[selectedVoucher.status] || { cls: 'text-slate-500 bg-slate-100' }).cls
                }`}>
                  {selectedVoucher.status === 'ACTIVE' && <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />}
                  {selectedVoucher.status === 'EXPIRED' && <XCircle className="w-3.5 h-3.5 mr-1.5" />}
                  {(statusMap[selectedVoucher.status] || { label: selectedVoucher.status }).label}
                </span>
              </div>

              <hr className="border-[#F0F0F5]" />

              {/* Discount Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F8F7FF] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Percent className="w-4 h-4 text-[#6C5CE7]" />
                    <span className="text-xs font-bold text-[#9CA3AF] uppercase">Loại giảm</span>
                  </div>
                  <p className="text-sm font-bold text-[#27273F]">
                    {selectedVoucher.discountType === 'PERCENTAGE' ? 'Phần trăm (%)' : 'Số tiền cố định (đ)'}
                  </p>
                </div>
                <div className="bg-[#F0FDF4] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-[#9CA3AF] uppercase">Giá trị giảm</span>
                  </div>
                  <p className="text-sm font-bold text-emerald-600">{formatDiscount(selectedVoucher)}</p>
                </div>
              </div>

              {/* Amount Limits */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-[#E8E8F0] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-[#6E7491]" />
                    <span className="text-xs font-bold text-[#9CA3AF] uppercase">Đơn tối thiểu</span>
                  </div>
                  <p className="text-sm font-semibold text-[#27273F]">
                    {selectedVoucher.minBookingAmount
                      ? `${Number(selectedVoucher.minBookingAmount).toLocaleString('vi-VN')} đ`
                      : 'Không giới hạn'}
                  </p>
                </div>
                <div className="border border-[#E8E8F0] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-[#6E7491]" />
                    <span className="text-xs font-bold text-[#9CA3AF] uppercase">Giảm tối đa</span>
                  </div>
                  <p className="text-sm font-semibold text-[#27273F]">
                    {selectedVoucher.maxDiscountAmount
                      ? `${Number(selectedVoucher.maxDiscountAmount).toLocaleString('vi-VN')} đ`
                      : 'Không giới hạn'}
                  </p>
                </div>
              </div>

              {/* Date Range */}
              <div className="bg-[#FAFAFE] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-[#6C5CE7]" />
                  <span className="text-xs font-bold text-[#9CA3AF] uppercase">Thời gian hiệu lực</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 text-center">
                    <p className="text-xs text-[#9CA3AF] mb-1">Bắt đầu</p>
                    <p className="text-sm font-semibold text-[#27273F]">{formatDate(selectedVoucher.startTime)}</p>
                  </div>
                  <div className="w-8 h-[2px] bg-[#E8E8F0] rounded-full" />
                  <div className="flex-1 text-center">
                    <p className="text-xs text-[#9CA3AF] mb-1">Kết thúc</p>
                    <p className="text-sm font-semibold text-[#27273F]">{formatDate(selectedVoucher.endTime)}</p>
                  </div>
                </div>
              </div>

              {/* Usage */}
              <div className="bg-[#FAFAFE] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Hash className="w-4 h-4 text-[#6C5CE7]" />
                  <span className="text-xs font-bold text-[#9CA3AF] uppercase">Sử dụng</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#6E7491]">Số lượng đã dùng</span>
                  <span className="text-sm font-bold text-[#27273F]">
                    {selectedVoucher.usedCount?.toLocaleString() ?? 0}
                    {selectedVoucher.usageLimit ? ` / ${selectedVoucher.usageLimit.toLocaleString()}` : ''}
                  </span>
                </div>
                {selectedVoucher.usageLimit && (
                  <div>
                    <div className="w-full h-2.5 bg-[#E8E8F0] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          Math.round((selectedVoucher.usedCount / selectedVoucher.usageLimit) * 100) >= 90
                            ? 'bg-red-400'
                            : Math.round((selectedVoucher.usedCount / selectedVoucher.usageLimit) * 100) >= 70
                              ? 'bg-amber-400'
                              : 'bg-[#6C5CE7]'
                        }`}
                        style={{ width: `${Math.min(Math.round((selectedVoucher.usedCount / selectedVoucher.usageLimit) * 100), 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-[#9CA3AF] mt-1.5 text-right">
                      Còn lại: {(selectedVoucher.usageLimit - (selectedVoucher.usedCount || 0)).toLocaleString()} lượt
                    </p>
                  </div>
                )}
                {!selectedVoucher.usageLimit && (
                  <p className="text-xs text-[#9CA3AF]">Không giới hạn số lượt sử dụng</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-5">
              <button
                onClick={() => setSelectedVoucher(null)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E8F0] text-sm font-semibold text-[#6E7491] hover:bg-[#F0EFFA] transition-all duration-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal animations */}
      <style>{`
        @keyframes voucherFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes voucherModalSlideIn {
          from { opacity: 0; transform: scale(0.85) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default PromotionPage;
