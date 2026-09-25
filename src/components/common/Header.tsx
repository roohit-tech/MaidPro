import React, { useState } from 'react';
import {
  ShieldAlert,
  Bell,
  Volume2,
  VolumeX,
  Languages,
  UserCheck,
  Users,
  Settings,
  LogIn,
  ChevronDown,
  Sparkles,
  PhoneCall,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Language, UserRole } from '../../types';
import { NotificationDrawer } from './NotificationDrawer';
import { SOSModal } from './SOSModal';
import { OtpLoginModal } from '../auth/OtpLoginModal';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    language,
    setLanguage,
    t,
    currentProvider,
    providers,
    selectedProviderId,
    setSelectedProviderId,
    notifications,
    isSpeaking,
    speakingText,
    stopSpeech,
    speakText,
    triggerSOS,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const handleAudioToggle = () => {
    if (isSpeaking) {
      stopSpeech();
    } else {
      speakText(
        `Welcome to MaidPro. You are logged in as ${currentProvider.name}. You have work schedules and job requests waiting.`
      );
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        {/* Top Announcement / Role Bar */}
        <div className="bg-slate-900 text-white px-3 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
          {/* Role selector */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-[11px] font-medium hidden sm:inline mr-1">
              Role:
            </span>
            <button
              onClick={() => setRole('provider')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-bold transition text-[11px] ${
                role === 'provider'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <UserCheck className="h-3 w-3" />
              <span>Helper (Provider)</span>
            </button>

            <button
              onClick={() => setRole('customer')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-bold transition text-[11px] ${
                role === 'customer'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Users className="h-3 w-3" />
              <span>Customer</span>
            </button>

            <button
              onClick={() => setRole('admin')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-bold transition text-[11px] ${
                role === 'admin'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Settings className="h-3 w-3" />
              <span>Admin</span>
            </button>
          </div>

          {/* Language selector & OTP login button */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[11px] bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
              <Languages className="h-3 w-3 text-emerald-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                aria-label="App Language"
                className="bg-transparent text-white font-medium outline-none cursor-pointer text-[11px]"
              >
                <option value="en" className="bg-slate-800 text-white">English</option>
                <option value="hi" className="bg-slate-800 text-white">हिन्दी (Hindi)</option>
                <option value="hinglish" className="bg-slate-800 text-white">Hinglish</option>
              </select>
            </div>

            {role === 'provider' && (
              <button
                onClick={() => setIsOtpOpen(true)}
                className="flex items-center gap-1 text-[11px] bg-emerald-600/90 hover:bg-emerald-500 text-white px-2 py-0.5 rounded-lg font-semibold transition"
              >
                <LogIn className="h-3 w-3" />
                <span className="hidden sm:inline">OTP Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Header Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Brand & Active Persona */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-lg shadow-md shadow-emerald-200 shrink-0">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                  Maid<span className="text-emerald-600">Pro</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                  Verified
                </span>
              </div>

              {/* Provider Persona selector if in provider role */}
              {role === 'provider' ? (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[11px] text-slate-500">Active:</span>
                  <select
                    value={selectedProviderId}
                    onChange={(e) => setSelectedProviderId(e.target.value)}
                    aria-label="Active Domestic Worker"
                    className="text-xs font-bold text-slate-800 bg-slate-100 rounded-md px-1.5 py-0.5 border border-slate-300 outline-none cursor-pointer"
                  >
                    {providers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.categories[0].toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
              ) : role === 'customer' ? (
                <p className="text-[11px] text-slate-500 font-medium">Customer Booking Portal</p>
              ) : (
                <p className="text-[11px] text-amber-600 font-bold">Admin Management Hub</p>
              )}
            </div>
          </div>

          {/* Quick Action controls */}
          <div className="flex items-center gap-2">
            {/* Audio Voice Assistant */}
            <button
              onClick={handleAudioToggle}
              title={isSpeaking ? 'Stop Voice' : 'Listen with Audio Voice Readout'}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                isSpeaking
                  ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="h-4 w-4 text-amber-700" />
                  <span className="hidden sm:inline">Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4 text-emerald-600" />
                  <span className="hidden sm:inline">Voice</span>
                </>
              )}
            </button>

            {/* Emergency SOS Button (Always visible for safety & domestic workers) */}
            <button
              onClick={() => triggerSOS(currentProvider.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-200 transition animate-pulse-subtle"
            >
              <ShieldAlert className="h-4 w-4" />
              <span className="tracking-wide">SOS</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotifOpen(true)}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition border border-slate-200"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white">
                  {unreadNotifs}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Real-time speaking banner */}
        {isSpeaking && speakingText && (
          <div className="bg-amber-500 text-slate-950 px-4 py-1 text-xs font-medium flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
              <span className="truncate">Speaking: &quot;{speakingText}&quot;</span>
            </div>
            <button onClick={stopSpeech} className="underline font-bold text-[11px] shrink-0 ml-2">
              Stop
            </button>
          </div>
        )}
      </header>

      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      <SOSModal />
      <OtpLoginModal isOpen={isOtpOpen} onClose={() => setIsOtpOpen(false)} />
    </>
  );
};
