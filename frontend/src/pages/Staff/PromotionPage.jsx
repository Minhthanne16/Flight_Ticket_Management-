import { useState, useMemo } from 'react';
import { Tag, CheckCircle2, XCircle, Eye, ChevronLeft, ChevronRight, Search, Plus } from 'lucide-react';
import { VOUCHERS } from '../../data/sharedData';

const PAGE_SIZE = 4;

const statusStyle = {
  'Hoạt động': 'text-emerald-700 bg-emerald-50 border border-emerald-200',
  'Hết hạn': 'text-red-600 bg-red-50 border border-red-200',
  'Vô hiệu hóa': 'text-[#6C5CE7] bg-[#E9E8FC] border border-[#D4D0F8]',
};

function PromotionPage() {
  const [vouchers] = useState(VOUCHERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return vouchers.filter(v => {
      const q = search.toLowerCase();
      const matchSearch = !q || v.id.toLowerCase().includes(q) || v.name.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'All' || v.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [vouchers, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const totalVouchers = vouchers.length;
  const activeVouchers = vouchers.filter(v => v.status === 'Hoạt động').length;
  const expiredVouchers = vouchers.filter(v => v.status === 'Hết hạn').length;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-[#27273F]">Promotion</h1>
        <p className="text-sm text-[#6E7491] mt-1">Xem thông tin chi tiết các mã giảm giá.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Vouchers */}
        <div className="bg-white rounded-2xl border border-[#E8E8F0] p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#E9E8FC] flex items-center justify-center">
              <Tag className="w-5 h-5 text-[#6C5CE7]" />
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12% vs last month</span>
          </div>
          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">TỔNG VOUCHER</p>
          <p className="text-2xl font-bold text-[#27273F] mt-0.5">{totalVouchers}</p>
        </div>

        {/* Active Vouchers */}
        <div className="bg-white rounded-2xl border border-[#E8E8F0] p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-xs font-semibold text-[#6E7491]">Đang hiệu lực</span>
          </div>
          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">VOUCHER HOẠT ĐỘNG</p>
          <p className="text-2xl font-bold text-[#27273F] mt-0.5">{activeVouchers}</p>
        </div>

        {/* Expired Vouchers */}
        <div className="bg-white rounded-2xl border border-[#E8E8F0] p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <span className="text-xs font-semibold text-[#6E7491]">Đã kết thúc</span>
          </div>
          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">VOUCHER HẾT HẠN</p>
          <p className="text-2xl font-bold text-[#27273F] mt-0.5">{expiredVouchers}</p>
        </div>
      </div>

      {/* Voucher Table */}
      <div className="bg-white rounded-2xl border border-[#E8E8F0] shadow-sm overflow-hidden">
        {/* Table Header */}
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
                className="pl-9 pr-4 py-2 border border-[#E8E8F0] rounded-lg text-sm text-[#27273F] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 focus:border-[#6C5CE7]/40 transition-all w-48"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-[#E8E8F0] rounded-lg text-sm text-[#6E7491] focus:outline-none cursor-pointer"
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="Hoạt động">Hoạt động</option>
              <option value="Hết hạn">Hết hạn</option>
              <option value="Vô hiệu hóa">Vô hiệu hóa</option>
            </select>
          </div>
        </div>

        {/* Table */}
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
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-[#9CA3AF] text-sm">Không có voucher nào</td>
                </tr>
              ) : paginated.map((v) => {
                const usagePct = v.limit ? Math.round((v.used / v.limit) * 100) : null;
                return (
                  <tr key={v.id} className="hover:bg-[#FAFAFE] transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-[#6C5CE7]">{v.id}</div>
                      <div className="text-xs text-[#9CA3AF] mt-0.5">{v.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#27273F]">{v.discount}</td>
                    <td className="px-6 py-4 text-sm text-[#6E7491]">{v.expiry}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${statusStyle[v.status] || 'text-slate-500 bg-slate-100'}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6E7491]">
                      {v.limit ? v.limit.toLocaleString() : 'Không giới hạn'}
                    </td>
                    <td className="px-6 py-4">
                      {usagePct !== null ? (
                        <div>
                          <div className="w-24 h-2 bg-[#E8E8F0] rounded-full overflow-hidden mb-1">
                            <div
                              className={`h-full rounded-full transition-all ${usagePct >= 90 ? 'bg-red-400' : usagePct >= 70 ? 'bg-amber-400' : 'bg-[#6C5CE7]'}`}
                              style={{ width: `${Math.min(usagePct, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-[#6E7491] font-medium">{v.used.toLocaleString()}/{v.limit.toLocaleString()}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-[#6E7491]">{v.used.toLocaleString()}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="p-2 text-[#9CA3AF] hover:text-[#6C5CE7] hover:bg-[#E9E8FC] rounded-lg transition-all">
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
            Hiện thị {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} trên {filtered.length} kết quả
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-[#E8E8F0] disabled:opacity-30 hover:bg-[#F0EFFA] transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-[#6E7491]" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${currentPage === pageNum
                      ? 'bg-[#6C5CE7] text-white shadow-sm'
                      : 'text-[#6E7491] hover:bg-[#F0EFFA]'
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 5 && <span className="px-1 text-[#9CA3AF]">...</span>}
            {totalPages > 5 && (
              <button
                onClick={() => setPage(totalPages)}
                className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${currentPage === totalPages ? 'bg-[#6C5CE7] text-white' : 'text-[#6E7491] hover:bg-[#F0EFFA]'}`}
              >
                {totalPages}
              </button>
            )}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-[#E8E8F0] disabled:opacity-30 hover:bg-[#F0EFFA] transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-[#6E7491]" />
            </button>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center transition-all hover:scale-105">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}

export default PromotionPage;
