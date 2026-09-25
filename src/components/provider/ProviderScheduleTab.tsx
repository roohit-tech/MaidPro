import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  AlertCircle,
  Plus,
  MapPin,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LeaveType } from '../../types';

export const ProviderScheduleTab: React.FC = () => {
  const {
    currentProvider,
    attendanceRecords,
    leaveRequests,
    applyLeave,
    bookings,
    t,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'schedule' | 'attendance' | 'leaves'>('attendance');
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // Leave form state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveType, setLeaveType] = useState<LeaveType>('personal');
  const [reason, setReason] = useState('');

  // Filter provider records
  const myAttendance = attendanceRecords.filter((a) => a.providerId === currentProvider.id);
  const myLeaves = leaveRequests.filter((l) => l.providerId === currentProvider.id);
  const myBookings = bookings.filter(
    (b) => b.providerId === currentProvider.id && (b.status === 'accepted' || b.status === 'in_progress')
  );

  const handleApplyLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;

    applyLeave({
      startDate,
      endDate,
      leaveType,
      reason: reason || 'Personal domestic commitment',
    });

    setIsLeaveModalOpen(false);
    setReason('');
    setStartDate('');
    setEndDate('');
    setActiveSubTab('leaves');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Sub Tabs navigation */}
      <div className="flex rounded-2xl bg-slate-200/80 p-1 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('attendance')}
          className={`flex-1 py-2 rounded-xl transition text-center ${
            activeSubTab === 'attendance'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Daily Attendance (हाजिरी)
        </button>
        <button
          onClick={() => setActiveSubTab('schedule')}
          className={`flex-1 py-2 rounded-xl transition text-center ${
            activeSubTab === 'schedule'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Weekly Roster (शेड्यूल)
        </button>
        <button
          onClick={() => setActiveSubTab('leaves')}
          className={`flex-1 py-2 rounded-xl transition text-center ${
            activeSubTab === 'leaves'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Leave (छुट्टी)
        </button>
      </div>

      {/* 1. ATTENDANCE LOG */}
      {activeSubTab === 'attendance' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                Attendance Records ({myAttendance.length})
              </h2>
              <p className="text-xs text-slate-500">Auto-logged with GPS check-in/out stamps</p>
            </div>
          </div>

          <div className="space-y-3">
            {myAttendance.map((rec) => (
              <div
                key={rec.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:border-slate-300 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{rec.customerName}</span>
                      <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {rec.serviceCategory}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{rec.date}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                      rec.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : rec.status === 'in_progress'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {rec.status === 'completed' ? '✓ Verified Present' : 'In Progress'}
                  </span>
                </div>

                {/* Timestamps */}
                <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-2.5 text-xs border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Punch In</span>
                    <span className="font-bold text-slate-700">{rec.checkInTime || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Punch Out</span>
                    <span className="font-bold text-slate-700">{rec.checkOutTime || 'Active Duty'}</span>
                  </div>
                </div>

                {rec.checkInLocation && (
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <MapPin className="h-3 w-3 text-emerald-600" />
                    <span>{rec.checkInLocation}</span>
                  </div>
                )}

                {rec.completedTasks.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {rec.completedTasks.map((t, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        ✓ {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. WEEKLY ROSTER */}
      {activeSubTab === 'schedule' && (
        <div className="space-y-3">
          <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-2">Weekly Working Schedule</h3>
            <p className="text-xs text-slate-500 mb-3">
              Standard recurring slots across Mon-Sat. Customers book you in open slots.
            </p>

            <div className="grid grid-cols-7 gap-1 text-center mb-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => {
                const isActive = currentProvider.schedule.days.includes(d as any);
                return (
                  <div
                    key={d}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <div>{d}</div>
                    <div className="text-[9px] mt-0.5">{isActive ? 'Open' : 'Off'}</div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Configured Daily Slots:
              </span>
              {currentProvider.schedule.dailySlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-emerald-600" />
                    <span className="font-bold text-slate-800">
                      {slot.start} - {slot.end}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">{slot.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-800 text-sm">Active Recurring Contracts</h3>
            {myBookings
              .filter((b) => b.bookingType === 'recurring')
              .map((b) => (
                <div key={b.id} className="p-3 bg-white rounded-2xl border border-slate-200 text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{b.customerName}</span>
                    <span className="text-emerald-600">₹{b.providerEarnings.toLocaleString()}/mo</span>
                  </div>
                  <div className="text-slate-500 mt-1">
                    {b.timeSlot} • {b.recurringDays?.join(', ')}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 3. LEAVE APPLICATIONS */}
      {activeSubTab === 'leaves' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                Leave Applications ({myLeaves.length})
              </h2>
              <p className="text-xs text-slate-500">Plan leaves ahead to avoid customer inconvenience</p>
            </div>
            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Apply Leave</span>
            </button>
          </div>

          <div className="space-y-3">
            {myLeaves.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                No leave requests filed yet. Tap &apos;Apply Leave&apos; to submit.
              </div>
            ) : (
              myLeaves.map((leave) => (
                <div key={leave.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm capitalize">
                          {leave.leaveType} Leave
                        </span>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                            leave.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : leave.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {leave.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>
                          {leave.startDate} to {leave.endDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    &quot;{leave.reason}&quot;
                  </p>

                  {leave.adminRemarks && (
                    <div className="mt-2 text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                      <strong>Admin Note:</strong> {leave.adminRemarks}
                    </div>
                  )}

                  <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Applied on {leave.appliedAt}</span>
                    <span>{leave.affectedBookingsCount} recurring customer(s) notified</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* APPLY LEAVE MODAL */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Apply for Leave (छुट्टी)</h3>
              <button
                onClick={() => setIsLeaveModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleApplyLeaveSubmit} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Leave Type (प्रकार)</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs bg-white outline-none"
                >
                  <option value="festival">Festival / Religious Holiday (त्योहार)</option>
                  <option value="personal">Personal / Family Commitment (घरेलू काम)</option>
                  <option value="sick">Health / Sick Leave (तबीयत खराब)</option>
                  <option value="emergency">Family Emergency (आपातकाल)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason (कारण)</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Village temple festival / Sister visiting"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs outline-none"
                />
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-[11px] text-blue-700 border border-blue-200">
                Notice: When approved, MaidPro automatically messages your regular households so they can adjust timing or request temporary backup.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="w-1/3 rounded-xl border border-slate-300 py-2.5 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-200"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
