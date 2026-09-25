import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  Wallet,
  User,
  Star,
  Sparkles,
} from 'lucide-react';
import { ProviderJobsTab } from './ProviderJobsTab';
import { ProviderScheduleTab } from './ProviderScheduleTab';
import { ProviderEarningsTab } from './ProviderEarningsTab';
import { ProviderProfileTab } from './ProviderProfileTab';
import { ProviderRatingsSupportTab } from './ProviderRatingsSupportTab';
import { useApp } from '../../context/AppContext';

export const ProviderApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'schedule' | 'earnings' | 'profile' | 'support'>('jobs');
  const { currentProvider, bookings, t } = useApp();

  const pendingCount = bookings.filter(
    (b) => b.providerId === currentProvider.id && b.status === 'pending'
  ).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      {/* Main Container */}
      <main className="flex-1 max-w-lg mx-auto w-full px-3 sm:px-4 pt-4">
        {activeTab === 'jobs' && <ProviderJobsTab />}
        {activeTab === 'schedule' && <ProviderScheduleTab />}
        {activeTab === 'earnings' && <ProviderEarningsTab />}
        {activeTab === 'profile' && <ProviderProfileTab />}
        {activeTab === 'support' && <ProviderRatingsSupportTab />}
      </main>

      {/* Mobile Bottom Navigation Bar with large touch targets */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg">
        <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
          {/* 1. Jobs / Today */}
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition relative ${
              activeTab === 'jobs'
                ? 'text-emerald-600 font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Clock className="h-5 w-5" />
              {pendingCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-white">
                  {pendingCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">Today / Jobs</span>
          </button>

          {/* 2. Schedule & Attendance */}
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition ${
              activeTab === 'schedule'
                ? 'text-emerald-600 font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CalendarDays className="h-5 w-5" />
            <span className="text-[10px] mt-1 tracking-tight">Roster / Leave</span>
          </button>

          {/* 3. Earnings & Wallet */}
          <button
            onClick={() => setActiveTab('earnings')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition ${
              activeTab === 'earnings'
                ? 'text-emerald-600 font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wallet className="h-5 w-5" />
            <span className="text-[10px] mt-1 tracking-tight">Earnings</span>
          </button>

          {/* 4. Profile & KYC */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition ${
              activeTab === 'profile'
                ? 'text-emerald-600 font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-[10px] mt-1 tracking-tight">Profile & KYC</span>
          </button>

          {/* 5. Support & Ratings */}
          <button
            onClick={() => setActiveTab('support')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition ${
              activeTab === 'support'
                ? 'text-emerald-600 font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Star className="h-5 w-5" />
            <span className="text-[10px] mt-1 tracking-tight">Help & Reviews</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
