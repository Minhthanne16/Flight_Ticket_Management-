const shifts = [
  { staff: 'Than Minh', shift: '06:00 - 14:00', area: 'Check-in A', status: 'On duty' },
  { staff: 'Ngoc Xuyen', shift: '08:00 - 16:00', area: 'Gate B04', status: 'On duty' },
  { staff: 'Hoang Phuc', shift: '14:00 - 22:00', area: 'Support Desk', status: 'Upcoming' },
  { staff: 'Phu Thuan', shift: '14:00 - 22:00', area: 'Support Desk', status: 'Upcoming' },
];

const shiftStatusClasses = {
  'On duty': 'bg-[#ECFDF3] text-[#16A34A]',
  Upcoming: 'bg-[#E9E8FC] text-[#605DEC]',
};

function WorkSchedulePanel() {
  return (
    <article className="rounded-2xl border border-[#CBD4E6] bg-white p-5 shadow-[0_6px_18px_rgba(28,5,77,0.06)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#27273F]">Work Schedule</h3>
        <button type="button" className="text-sm font-semibold text-[#605DEC] hover:underline">
          Chỉnh lịch
        </button>
      </div>

      <div className="space-y-3">
        {shifts.map((shift) => (
          <div key={`${shift.staff}-${shift.shift}`} className="rounded-xl border border-[#E5EAF4] p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-[#27273F]">{shift.staff}</p>
                <p className="text-sm text-[#6E7491]">{shift.shift}</p>
                <p className="text-xs text-[#7C8DB0]">{shift.area}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  shiftStatusClasses[shift.status] ?? 'bg-gray-100 text-gray-600'
                }`}
              >
                {shift.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default WorkSchedulePanel;
