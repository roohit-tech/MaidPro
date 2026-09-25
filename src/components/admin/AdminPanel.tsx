import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  ShieldCheck,
  CalendarCheck,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  MapPin,
  Settings,
  Star,
  FileCheck,
  Eye,
  Percent,
  Search,
  Check,
  Repeat,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KYCStatus, LeaveRequest, Complaint, ServiceArea, Provider } from '../../types';

export const AdminPanel: React.FC = () => {
  const {
    providers,
    customers,
    bookings,
    attendanceRecords,
    leaveRequests,
    complaints,
    reviews,
    serviceAreas,
    commissionRate,
    updateCommissionRate,
    verifyKYC,
    resolveComplaint,
    approveLeave,
    rejectLeave,
    disburseAllPendingPayouts,
    toggleServiceArea,
    toggleProviderAvailability,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'analytics' | 'kyc' | 'providers' | 'bookings' | 'salaries' | 'complaints' | 'areas' | 'leaves'
  >('analytics');

  // Search & filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKycProvider, setSelectedKycProvider] = useState<Provider | null>(null);
  const [kycRemarks, setKycRemarks] = useState('All government documents verified.');

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Analytics metrics calculations
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalCommissionEarned = bookings.reduce((sum, b) => sum + b.commissionAmount, 0);
  const activeRequestsCount = bookings.filter((b) => b.status === 'in_progress' || b.status === 'pending').length;
  const verifiedProvidersCount = providers.filter((p) => p.kyc.status === 'verified').length;
  const pendingKycCount = providers.filter((p) => p.kyc.status === 'under_review' || p.kyc.status === 'pending').length;
  const pendingLeavesCount = leaveRequests.filter((l) => l.status === 'pending').length;
  const openComplaintsCount = complaints.filter((c) => c.status === 'open' || c.status === 'investigating').length;
  const totalSalariesPending = providers.reduce((sum, p) => sum + p.walletBalance, 0);

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-5 space-y-6">
        {/* Admin Navigation Pills */}
        <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-3 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
              ⚙️
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900 tracking-tight">MaidPro Operations Console</h1>
              <p className="text-[11px] text-slate-500">Live platform management & domestic workforce desk</p>
            </div>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full text-xs font-bold">
            {[
              { id: 'analytics', label: '📊 Dashboard & Revenue' },
              { id: 'kyc', label: `🛡️ KYC Verification (${pendingKycCount})` },
              { id: 'providers', label: `👷 Providers (${providers.length})` },
              { id: 'bookings', label: `📅 Bookings (${bookings.length})` },
              { id: 'salaries', label: '💰 Salaries & Payouts' },
              { id: 'complaints', label: `⚠️ Complaints (${openComplaintsCount})` },
              { id: 'leaves', label: `🏖️ Leaves (${pendingLeavesCount})` },
              { id: 'areas', label: `📍 Service Areas (${serviceAreas.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3 rounded-2xl whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. ANALYTICS & REVENUE DASHBOARD */}
        {activeTab === 'analytics' && (
          <div className="space-y-5">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-5 text-white shadow-lg">
                <div className="flex items-center justify-between text-xs text-emerald-100 font-semibold mb-1">
                  <span>TOTAL PLATFORM REVENUE</span>
                  <DollarSign className="h-5 w-5 text-emerald-200" />
                </div>
                <div className="text-2xl sm:text-3xl font-black">₹{totalRevenue.toLocaleString()}</div>
                <div className="mt-2 text-xs text-emerald-200 flex items-center justify-between">
                  <span>Net Commission (10%):</span>
                  <span className="font-extrabold text-white">₹{totalCommissionEarned.toLocaleString()}</span>
                </div>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white shadow-lg">
                <div className="flex items-center justify-between text-xs text-blue-100 font-semibold mb-1">
                  <span>ACTIVE SERVICE REQUESTS</span>
                  <TrendingUp className="h-5 w-5 text-blue-200" />
                </div>
                <div className="text-2xl sm:text-3xl font-black">{activeRequestsCount}</div>
                <div className="mt-2 text-xs text-blue-200">
                  {bookings.filter((b) => b.bookingType === 'recurring').length} active recurring households
                </div>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 p-5 text-white shadow-lg">
                <div className="flex items-center justify-between text-xs text-amber-100 font-semibold mb-1">
                  <span>DOMESTIC PARTNERS</span>
                  <Users className="h-5 w-5 text-amber-200" />
                </div>
                <div className="text-2xl sm:text-3xl font-black">{providers.length}</div>
                <div className="mt-2 text-xs text-amber-100">
                  {verifiedProvidersCount} KYC Verified • {pendingKycCount} in verification queue
                </div>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-purple-600 to-pink-700 p-5 text-white shadow-lg">
                <div className="flex items-center justify-between text-xs text-purple-100 font-semibold mb-1">
                  <span>DISBURSEMENT QUEUE</span>
                  <DollarSign className="h-5 w-5 text-purple-200" />
                </div>
                <div className="text-2xl sm:text-3xl font-black">₹{totalSalariesPending.toLocaleString()}</div>
                <div className="mt-2 text-xs text-purple-200">
                  Ready to disburse to provider UPI & Bank accounts
                </div>
              </div>
            </div>

            {/* Quick Operational Actions & Health */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Commission Rate Settings */}
              <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-sm">Platform Commission Tier</h3>
                  <Percent className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="text-xs text-slate-500">
                  Deducted automatically from household booking fees for platform insurance & operations.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-2xl font-black text-slate-900">{commissionRate * 100}%</span>
                  <div className="flex gap-1.5">
                    {[0.08, 0.1, 0.12, 0.15].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => updateCommissionRate(rate)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          commissionRate === rate
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {rate * 100}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Service Category Demand breakdown */}
              <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-xs space-y-3">
                <h3 className="font-extrabold text-slate-900 text-sm">Category Roster Volume</h3>
                <div className="space-y-2 text-xs">
                  {[
                    { label: 'Maids & Housekeeping', count: providers.filter((p) => p.categories.includes('maid')).length, color: 'bg-emerald-500' },
                    { label: 'Cooks & Chefs', count: providers.filter((p) => p.categories.includes('cook')).length, color: 'bg-amber-500' },
                    { label: 'Babysitters & Nannies', count: providers.filter((p) => p.categories.includes('babysitter')).length, color: 'bg-blue-500' },
                    { label: 'Elderly Care Attendants', count: providers.filter((p) => p.categories.includes('elderly_care')).length, color: 'bg-purple-500' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                        <span className="text-slate-700 font-semibold">{item.label}</span>
                      </div>
                      <span className="font-bold text-slate-900">{item.count} helpers</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instant Batch Salary Payout Trigger */}
              <div className="rounded-3xl bg-slate-900 text-white p-5 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-white text-sm">Disburse Provider Salaries</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Auto-transfer pending wallet balances to all domestic partners via UPI & NEFT.
                  </p>
                </div>
                <div className="pt-2">
                  <div className="text-xs text-amber-400 font-bold mb-2">
                    Pending Total: ₹{totalSalariesPending.toLocaleString()}
                  </div>
                  <button
                    onClick={disburseAllPendingPayouts}
                    disabled={totalSalariesPending <= 0}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition ${
                      totalSalariesPending > 0
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    1-Click Disburse Batch Payouts
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Bookings Feed in Admin */}
            <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-extrabold text-slate-900 text-sm">Latest Activity Stream</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Assigned Helper</th>
                      <th className="p-3">Service</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.slice(0, 5).map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{b.customerName}</td>
                        <td className="p-3 text-slate-700">{b.providerName}</td>
                        <td className="p-3 capitalize">{b.category}</td>
                        <td className="p-3">
                          {b.bookingType === 'recurring' ? (
                            <span className="text-blue-700 font-bold">Recurring ({b.recurringFrequency})</span>
                          ) : (
                            <span className="text-slate-500">One-Time</span>
                          )}
                        </td>
                        <td className="p-3 font-bold text-emerald-600">₹{b.totalAmount.toLocaleString()}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              b.status === 'in_progress'
                                ? 'bg-amber-100 text-amber-800'
                                : b.status === 'accepted'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. KYC VERIFICATION DESK */}
        {activeTab === 'kyc' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-slate-900">KYC & Document Verification Desk</h2>
                <p className="text-xs text-slate-500">
                  Review government IDs, Aadhaar numbers, and police clearances before granting the Green Shield.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providers.map((p) => {
                const isUnderReview = p.kyc.status === 'under_review' || p.kyc.status === 'pending';
                return (
                  <div
                    key={p.id}
                    className={`rounded-3xl p-5 border shadow-xs transition ${
                      isUnderReview
                        ? 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-100'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.photo}
                          alt={p.name}
                          className="h-12 w-12 rounded-2xl object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-extrabold text-slate-900 text-sm">{p.name}</h3>
                            {p.kyc.status === 'verified' && (
                              <ShieldCheck className="h-4 w-4 text-emerald-600" />
                            )}
                          </div>
                          <p className="text-xs text-slate-500">{p.phone}</p>
                          <span className="text-[10px] uppercase font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {p.categories.join(' • ')}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                          p.kyc.status === 'verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.kyc.status === 'under_review'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {p.kyc.status}
                      </span>
                    </div>

                    <div className="mt-3 rounded-2xl bg-white p-3 border border-slate-100 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">ID Document:</span>
                        <strong className="text-slate-800">{p.kyc.idType}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Document No:</span>
                        <strong className="text-slate-800">{p.kyc.idNumber || 'Pending Upload'}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Police Clearance:</span>
                        <span className={p.kyc.policeVerificationDone ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                          {p.kyc.policeVerificationDone ? '✓ Completed' : 'Pending Verification'}
                        </span>
                      </div>
                      {p.kyc.adminRemarks && (
                        <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl mt-1">
                          Remarks: {p.kyc.adminRemarks}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => setSelectedKycProvider(p)}
                        className="flex-1 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        Inspect Document
                      </button>

                      {p.kyc.status !== 'verified' ? (
                        <button
                          onClick={() => verifyKYC(p.id, 'verified', 'ID & police check verified by admin.')}
                          className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-200"
                        >
                          Approve KYC
                        </button>
                      ) : (
                        <button
                          onClick={() => verifyKYC(p.id, 'under_review', 'Document re-audit requested.')}
                          className="py-2 px-3 rounded-xl border border-slate-200 text-slate-500 hover:text-red-600 text-xs font-semibold"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. MANAGE PROVIDERS */}
        {activeTab === 'providers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-slate-900">Registered Domestic Helpers</h2>
                <p className="text-xs text-slate-500">Monitor active schedules, jobs completed, ratings, and rates</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-3xl bg-white border border-slate-200 shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                  <tr>
                    <th className="p-3">Partner</th>
                    <th className="p-3">Categories</th>
                    <th className="p-3">Experience</th>
                    <th className="p-3">Rates (Hr / Mo)</th>
                    <th className="p-3">Rating</th>
                    <th className="p-3">Wallet</th>
                    <th className="p-3">Duty Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {providers.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={p.photo}
                            alt={p.name}
                            className="h-9 w-9 rounded-xl object-cover"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{p.name}</div>
                            <div className="text-[10px] text-slate-400">{p.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 capitalize">{p.categories.join(', ')}</td>
                      <td className="p-3 font-semibold text-slate-700">{p.experienceYears} yrs</td>
                      <td className="p-3">
                        <span className="font-bold text-slate-900">₹{p.rates.hourly}/hr</span>
                        <span className="text-[10px] text-slate-400 block">₹{p.rates.monthlyRecurring.toLocaleString()}/mo</span>
                      </td>
                      <td className="p-3 font-bold text-amber-500">★ {p.rating} ({p.reviewCount})</td>
                      <td className="p-3 font-black text-emerald-600">₹{p.walletBalance.toLocaleString()}</td>
                      <td className="p-3">
                        <button
                          onClick={() => toggleProviderAvailability(p.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                            p.schedule.isAvailable
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {p.schedule.isAvailable ? 'Online' : 'Offline'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. MANAGE BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <h2 className="text-base font-black text-slate-900">All Household Bookings & Schedules</h2>

            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="rounded-3xl bg-white p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{b.customerName}</span>
                      <span className="text-slate-400">→</span>
                      <span className="font-bold text-emerald-700">{b.providerName}</span>
                      <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {b.category}
                      </span>
                    </div>
                    <div className="text-slate-500 mt-1">
                      {b.timeSlot} • {b.customerAddress}
                    </div>
                    <div className="text-slate-500 mt-0.5">
                      Tasks: {b.specificTasks.join(', ')}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-slate-900">
                      ₹{b.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-emerald-600">
                      Helper: ₹{b.providerEarnings.toLocaleString()} (10% Fee: ₹{b.commissionAmount})
                    </div>
                    <span
                      className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        b.status === 'in_progress'
                          ? 'bg-amber-100 text-amber-800'
                          : b.status === 'accepted'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. SALARIES & PAYOUTS */}
        {activeTab === 'salaries' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-slate-900">Salaries & Provider Payout Dispatches</h2>
                <p className="text-xs text-slate-500">Track earnings, commission deductions, and pending payouts</p>
              </div>
              <button
                onClick={disburseAllPendingPayouts}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-emerald-200"
              >
                Disburse All Pending (₹{totalSalariesPending.toLocaleString()})
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providers.map((p) => (
                <div key={p.id} className="rounded-3xl bg-white p-5 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{p.name}</h3>
                      <p className="text-xs text-slate-500">{p.bankDetails.bankName} • {p.bankDetails.upiId}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Pending Wallet</span>
                      <span className="text-lg font-black text-emerald-600">₹{p.walletBalance.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3 text-xs space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span>Account Number:</span>
                      <strong className="text-slate-800">{p.bankDetails.accountNumber}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>IFSC / Routing:</span>
                      <strong className="text-slate-800">{p.bankDetails.ifscOrRouting}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. COMPLAINTS & DISPUTES */}
        {activeTab === 'complaints' && (
          <div className="space-y-4">
            <h2 className="text-base font-black text-slate-900">Complaints & Dispute Resolution</h2>

            <div className="space-y-3">
              {complaints.map((comp) => (
                <div
                  key={comp.id}
                  className="rounded-3xl bg-white p-4 border border-slate-200 shadow-xs space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          {comp.raisedByName} ({comp.raisedBy === 'customer' ? 'Customer' : 'Helper'})
                        </span>
                        <span className="text-slate-400">regarding</span>
                        <span className="font-bold text-slate-800">{comp.targetName}</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded mt-1 inline-block">
                        Issue: {comp.category}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        comp.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {comp.status}
                    </span>
                  </div>

                  <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    &quot;{comp.description}&quot;
                  </p>

                  {comp.resolutionNotes && (
                    <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                      <strong>Admin Resolution:</strong> {comp.resolutionNotes}
                    </div>
                  )}

                  {comp.status !== 'resolved' && (
                    <button
                      onClick={() => resolveComplaint(comp.id, 'Dispute resolved after mediator call with customer and helper.')}
                      className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                    >
                      Mark as Resolved
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. LEAVE MANAGEMENT */}
        {activeTab === 'leaves' && (
          <div className="space-y-4">
            <h2 className="text-base font-black text-slate-900">Provider Leave Requests & Schedule Re-routing</h2>

            <div className="space-y-3">
              {leaveRequests.map((l) => (
                <div key={l.id} className="rounded-3xl bg-white p-5 border border-slate-200 shadow-xs space-y-3 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{l.providerName}</span>
                        <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          {l.leaveType}
                        </span>
                      </div>
                      <div className="text-slate-500 mt-1">
                        Dates: <strong>{l.startDate}</strong> to <strong>{l.endDate}</strong>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                        l.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : l.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {l.status}
                    </span>
                  </div>

                  <p className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-700 italic">
                    &quot;{l.reason}&quot;
                  </p>

                  <div className="flex justify-between items-center text-[11px] text-slate-500">
                    <span>{l.affectedBookingsCount} recurring household(s) will need re-scheduling</span>
                    {l.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => rejectLeave(l.id, 'Declined due to heavy festive booking volume.')}
                          className="px-3 py-1.5 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 font-bold"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => approveLeave(l.id, 'Approved. Backup domestic partner alerted.')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        >
                          Approve Leave
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. SERVICE AREAS */}
        {activeTab === 'areas' && (
          <div className="space-y-4">
            <h2 className="text-base font-black text-slate-900">Operational Zones & Service Coverage</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {serviceAreas.map((area) => (
                <div
                  key={area.id}
                  className="rounded-2xl bg-white p-4 border border-slate-200 shadow-xs space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-sm">{area.name}</span>
                    <button
                      onClick={() => toggleServiceArea(area.id)}
                      className={`h-2.5 w-2.5 rounded-full ${area.isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`}
                      title="Toggle active"
                    />
                  </div>
                  <div className="text-slate-500">{area.city}</div>
                  <div className="flex justify-between text-[11px] pt-2 border-t border-slate-100">
                    <span>Active Helpers:</span>
                    <strong className="text-emerald-700">{area.activeProvidersCount}</strong>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>Rate Multiplier:</span>
                    <strong className="text-slate-700">{area.baseRateMultiplier}x</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INSPECT KYC MODAL */}
        {selectedKycProvider && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base">KYC Document Verification</h3>
                <button
                  onClick={() => setSelectedKycProvider(null)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div>
                <img
                  src={selectedKycProvider.kyc.idFrontUrl || selectedKycProvider.photo}
                  alt="Government ID"
                  className="w-full h-44 rounded-2xl object-cover border border-slate-200"
                />
                <div className="mt-2 text-center text-xs text-slate-500">
                  Document Type: <strong>{selectedKycProvider.kyc.idType}</strong> • ID:{' '}
                  <strong>{selectedKycProvider.kyc.idNumber}</strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Admin Verification Remarks:</label>
                <input
                  type="text"
                  value={kycRemarks}
                  onChange={(e) => setKycRemarks(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    verifyKYC(selectedKycProvider.id, 'rejected', kycRemarks);
                    setSelectedKycProvider(null);
                  }}
                  className="w-1/2 py-2.5 rounded-xl border border-red-300 text-red-700 font-bold text-xs hover:bg-red-50"
                >
                  Reject Document
                </button>
                <button
                  onClick={() => {
                    verifyKYC(selectedKycProvider.id, 'verified', kycRemarks);
                    setSelectedKycProvider(null);
                  }}
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-200"
                >
                  Approve & Issue Badge
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
