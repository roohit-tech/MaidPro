import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Phone,
  Volume2,
  VolumeX,
  Play,
  Square,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Repeat,
  DollarSign,
  User,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';

export const ProviderJobsTab: React.FC = () => {
  const {
    currentProvider,
    bookings,
    activeJob,
    activeJobElapsed,
    startWork,
    endWork,
    acceptBooking,
    rejectBooking,
    speakText,
    isSpeaking,
    stopSpeech,
    toggleProviderAvailability,
    t,
  } = useApp();

  const [rejectModalBookingId, setRejectModalBookingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Schedule overlap / Not available during this time slot');
  const [completedTasksChecklist, setCompletedTasksChecklist] = useState<string[]>([]);
  const [workNotes, setWorkNotes] = useState('');
  const [isFinishingModalOpen, setIsFinishingModalOpen] = useState(false);

  // Filter bookings for current provider
  const myBookings = bookings.filter((b) => b.providerId === currentProvider.id);
  const pendingRequests = myBookings.filter((b) => b.status === 'pending');
  const todayActiveOrAccepted = myBookings.filter(
    (b) => b.status === 'accepted' || b.status === 'in_progress'
  );

  const activeBooking = activeJob
    ? bookings.find((b) => b.id === activeJob.bookingId)
    : null;

  // Format active job seconds
  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOpenFinishModal = (booking: Booking) => {
    setCompletedTasksChecklist([...booking.specificTasks]);
    setIsFinishingModalOpen(true);
  };

  const handleConfirmFinish = () => {
    if (activeJob) {
      endWork(activeJob.bookingId, completedTasksChecklist, workNotes);
      setIsFinishingModalOpen(false);
      setWorkNotes('');
    }
  };

  const handlePlayAudioRequest = (booking: Booking) => {
    const textToSpeak =
      booking.audioNoteText ||
      `New job request from ${booking.customerName} for ${booking.category}. Timing: ${booking.timeSlot} at ${booking.customerArea}. Rate is ${booking.totalAmount} rupees.`;
    speakText(textToSpeak);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Provider Hero Greeting Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 p-5 text-white shadow-xl">
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentProvider.photo}
                alt={currentProvider.name}
                className="h-16 w-16 rounded-2xl object-cover border-2 border-white/80 shadow-md"
              />
              {currentProvider.kyc.status === 'verified' && (
                <div
                  className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 p-1 text-white shadow-xs"
                  title="Verified Partner"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-black tracking-tight">{currentProvider.name}</h1>
              </div>
              <p className="text-xs text-emerald-100 flex items-center gap-1 capitalize">
                <span>{currentProvider.categories.join(' • ')}</span>
                <span>• {currentProvider.experienceYears} yrs exp</span>
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="flex items-center text-xs font-bold text-amber-300">
                  ★ {currentProvider.rating}
                </span>
                <span className="text-[11px] text-emerald-200">
                  ({currentProvider.totalJobsDone} jobs done)
                </span>
              </div>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="text-right">
            <button
              onClick={() => toggleProviderAvailability(currentProvider.id)}
              className={`rounded-2xl px-3 py-1.5 text-xs font-bold transition shadow-sm flex items-center gap-1.5 ${
                currentProvider.schedule.isAvailable
                  ? 'bg-emerald-400/30 text-white border border-emerald-300'
                  : 'bg-red-500/40 text-red-100 border border-red-300'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  currentProvider.schedule.isAvailable ? 'bg-emerald-300 animate-ping' : 'bg-red-300'
                }`}
              />
              <span>{currentProvider.schedule.isAvailable ? 'Online (Duty On)' : 'Offline'}</span>
            </button>
            <div className="text-[10px] text-emerald-200 mt-1">Tap to toggle</div>
          </div>
        </div>

        {/* Quick summary stats pill bar */}
        <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-black/15 p-2.5 backdrop-blur-xs text-center">
          <div>
            <div className="text-[10px] uppercase font-bold text-emerald-200">Today Jobs</div>
            <div className="text-sm font-extrabold">{todayActiveOrAccepted.length}</div>
          </div>
          <div className="border-x border-white/10">
            <div className="text-[10px] uppercase font-bold text-emerald-200">Requests</div>
            <div className="text-sm font-extrabold text-amber-300">{pendingRequests.length}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-emerald-200">Balance</div>
            <div className="text-sm font-extrabold">₹{currentProvider.walletBalance.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* ACTIVE JOB TIMER CARD (If punched in) */}
      {activeJob && activeBooking && (
        <div className="rounded-3xl border-2 border-emerald-500 bg-emerald-50/90 p-5 shadow-lg animate-pulse-subtle">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                Work In Progress (Active Duty)
              </span>
            </div>
            <div className="text-base font-black font-mono text-emerald-900 bg-emerald-200/80 px-3 py-1 rounded-xl">
              ⏱ {formatTimer(activeJobElapsed)}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-emerald-200 mb-3 shadow-xs">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{activeBooking.customerName}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>{activeBooking.customerAddress}</span>
                </p>
              </div>
              <a
                href={`tel:${activeBooking.customerPhone}`}
                className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-xl transition"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Call</span>
              </a>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {activeBooking.specificTasks.map((task, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-emerald-50 border border-emerald-200 px-2 py-1 text-[11px] font-semibold text-emerald-800"
                >
                  ✓ {task}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleOpenFinishModal(activeBooking)}
            className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 py-3.5 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition"
          >
            <Square className="h-4 w-4 fill-white" />
            <span>Finish Work & Punch Out (काम समाप्त करें)</span>
          </button>
        </div>
      )}

      {/* NEW JOB REQUESTS SECTION */}
      {pendingRequests.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">
                New Booking Requests ({pendingRequests.length})
              </h2>
            </div>
            <span className="text-xs text-amber-700 font-semibold bg-amber-100 px-2 py-0.5 rounded-full">
              Action Required
            </span>
          </div>

          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="rounded-3xl border border-amber-300 bg-gradient-to-b from-amber-50/50 to-white p-4 shadow-sm"
              >
                {/* Header of request card */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{req.customerName}</span>
                      {req.bookingType === 'recurring' ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-extrabold text-blue-800">
                          <Repeat className="h-3 w-3" />
                          <span>Daily ({req.recurringFrequency})</span>
                        </span>
                      ) : (
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                          One-Time
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{req.customerArea}</span>
                    </p>
                  </div>

                  {/* Audio Listen Button (for low literacy) */}
                  <button
                    onClick={() => handlePlayAudioRequest(req)}
                    className="flex items-center gap-1 rounded-xl bg-amber-100 hover:bg-amber-200 px-2.5 py-1 text-xs font-bold text-amber-900 border border-amber-300 transition"
                    title="Listen request details in voice"
                  >
                    <Volume2 className="h-3.5 w-3.5 text-amber-700" />
                    <span>Listen</span>
                  </button>
                </div>

                {/* Details */}
                <div className="rounded-2xl bg-white p-3 border border-slate-100 space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>Slot: <strong>{req.timeSlot}</strong></span>
                    </span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>Start: <strong>{req.startDate}</strong></span>
                    </span>
                  </div>

                  {req.notes && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 italic">
                      &quot;{req.notes}&quot;
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Your Earnings</div>
                      <div className="text-sm font-black text-emerald-600">
                        ₹{req.providerEarnings.toLocaleString()}
                        <span className="text-[10px] text-slate-400 font-normal"> (Net after 10% fee)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Price</div>
                      <div className="text-xs font-bold text-slate-800">₹{req.totalAmount.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setRejectModalBookingId(req.id)}
                    className="rounded-xl border border-slate-300 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Decline (मना करें)
                  </button>
                  <button
                    onClick={() => acceptBooking(req.id)}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-200 transition"
                  >
                    Accept Job (स्वीकार करें)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TODAY'S SCHEDULED ROSTER */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-emerald-600" />
            <span>Today&apos;s Confirmed Jobs ({todayActiveOrAccepted.length})</span>
          </h2>
        </div>

        {todayActiveOrAccepted.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center bg-white">
            <Clock className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-600">No more jobs scheduled today</p>
            <p className="text-xs text-slate-400 mt-1">Keep your availability online to receive new requests.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayActiveOrAccepted.map((job) => {
              const isCurrentActive = activeJob?.bookingId === job.id;

              return (
                <div
                  key={job.id}
                  className={`rounded-3xl border p-4 bg-white shadow-sm transition ${
                    isCurrentActive
                      ? 'border-emerald-500 ring-2 ring-emerald-200'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{job.customerName}</span>
                        {job.bookingType === 'recurring' ? (
                          <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded font-bold">
                            Recurring
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">
                            One-time
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>{job.timeSlot}</span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span>{job.customerAddress}</span>
                      </div>
                    </div>

                    <a
                      href={`tel:${job.customerPhone}`}
                      className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      title="Call customer"
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {job.specificTasks.map((t, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Punch in trigger if not already active */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500">Rate: </span>
                      <span className="text-xs font-extrabold text-emerald-700">
                        ₹{job.providerEarnings.toLocaleString()}
                      </span>
                    </div>

                    {isCurrentActive ? (
                      <span className="text-xs font-black text-emerald-600 bg-emerald-100 px-3 py-1 rounded-xl">
                        In Progress
                      </span>
                    ) : (
                      <button
                        onClick={() => startWork(job.id, job.customerArea)}
                        disabled={!!activeJob}
                        className={`rounded-xl px-4 py-2 text-xs font-bold text-white transition flex items-center gap-1.5 ${
                          activeJob
                            ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                            : 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-100'
                        }`}
                      >
                        <Play className="h-3.5 w-3.5 fill-white" />
                        <span>Punch In (शुरू करें)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FINISH WORK MODAL */}
      {isFinishingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">Finish Work & Log Attendance</h3>
            <p className="text-xs text-slate-500 mb-4">
              Mark tasks completed at customer location before punching out.
            </p>

            <div className="space-y-2 mb-4">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Tasks Completed (कार्य पूरे किए):
              </label>
              {activeBooking?.specificTasks.map((task, idx) => {
                const checked = completedTasksChecklist.includes(task);
                return (
                  <label
                    key={idx}
                    className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer text-xs font-medium text-slate-800"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        if (checked) {
                          setCompletedTasksChecklist(completedTasksChecklist.filter((t) => t !== task));
                        } else {
                          setCompletedTasksChecklist([...completedTasksChecklist, task]);
                        }
                      }}
                      className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{task}</span>
                  </label>
                );
              })}
            </div>

            <div className="mb-4">
              <label className="text-xs font-bold text-slate-700 mb-1 block">Optional Helper Note:</label>
              <input
                type="text"
                placeholder="e.g. All rooms cleaned, keys handed over to security guard"
                value={workNotes}
                onChange={(e) => setWorkNotes(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsFinishingModalOpen(false)}
                className="w-1/3 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Back
              </button>
              <button
                onClick={handleConfirmFinish}
                className="w-2/3 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-200"
              >
                Punch Out & Receive Credit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectModalBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">Decline Booking</h3>
            <p className="text-xs text-slate-500 mb-3">Please specify a reason for decline:</p>

            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs bg-white mb-4 outline-none"
            >
              <option value="Schedule overlap / Not available during this time slot">
                Schedule overlap / Not available during this time slot
              </option>
              <option value="Location is too far from my current route">
                Location is too far from my current route
              </option>
              <option value="Rate or task requirements outside scope">
                Rate or task requirements outside scope
              </option>
              <option value="Personal emergency / taking leave">
                Personal emergency / taking leave
              </option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => setRejectModalBookingId(null)}
                className="w-1/2 rounded-xl border border-slate-300 py-2 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  rejectBooking(rejectModalBookingId, rejectReason);
                  setRejectModalBookingId(null);
                }}
                className="w-1/2 rounded-xl bg-red-600 hover:bg-red-700 py-2 text-xs font-bold text-white"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
