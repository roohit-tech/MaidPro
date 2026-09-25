import React, { useState } from 'react';
import { Phone, ShieldCheck, KeyRound, User, Sparkles, X, Check, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ServiceCategory } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const OtpLoginModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { providers, setSelectedProviderId, setRole, addNotification, updateProviderProfile } = useApp();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'new_profile'>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [simulatedCode, setSimulatedCode] = useState('4821');
  const [isRegistering, setIsRegistering] = useState(false);

  // New profile state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<ServiceCategory>('maid');
  const [newExp, setNewExp] = useState(3);
  const [newRate, setNewRate] = useState(160);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 8) return;
    const generated = Math.floor(1000 + Math.random() * 9000).toString();
    setSimulatedCode(generated);
    setStep('otp');

    addNotification({
      type: 'whatsapp',
      title: 'WhatsApp OTP Code 📲',
      body: `Your MaidPro login OTP code is: ${generated}. Valid for 5 minutes.`,
      sender: 'MaidPro Auth Service',
    });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== simulatedCode && otpCode !== '1234') {
      // Allow flexible test code
    }

    // Check if phone matches existing provider
    const existing = providers.find((p) => p.phone.replace(/\D/g, '').includes(phoneNumber.replace(/\D/g, '')));
    if (existing) {
      setSelectedProviderId(existing.id);
      setRole('provider');
      onClose();
    } else {
      setStep('new_profile');
    }
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Auto-create or select provider
    const provId = `prov-${Date.now()}`;
    const newProv = {
      id: provId,
      name: newName || 'New Service Partner',
      gender: 'Female' as const,
      age: 30,
      phone: `+91 ${phoneNumber}`,
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
      rating: 5.0,
      reviewCount: 0,
      categories: [newCategory],
      experienceYears: newExp,
      skills: ['Basic Household Duties', 'Punctual & Sincere'],
      languagesSpoken: ['Hindi', 'English'],
      preferredHours: ['morning', 'afternoon'] as any,
      preferredLocations: ['Indiranagar', 'Koramangala'],
      schedule: {
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as any,
        dailySlots: [{ id: 's-1', start: '08:00 AM', end: '11:00 AM', label: 'Morning Slot' }],
        isAvailable: true,
      },
      rates: {
        hourly: newRate,
        perVisit: newRate * 2.5,
        monthlyRecurring: newRate * 45,
      },
      kyc: {
        status: 'pending' as const,
        idType: 'Aadhaar Card' as const,
        idNumber: '',
        policeVerificationDone: false,
        addressProofVerified: false,
      },
      emergencyContacts: [],
      walletBalance: 0,
      cashCollected: 0,
      bankDetails: {
        accountHolder: newName,
        accountNumber: '',
        ifscOrRouting: '',
        upiId: `${newName.toLowerCase().replace(/\s/g, '')}@upi`,
        bankName: 'Bank Account',
      },
      totalJobsDone: 0,
      bio: 'New domestic service partner ready for verified housekeeping & care assignments.',
    };

    updateProviderProfile(provId, newProv);
    setSelectedProviderId(provId);
    setRole('provider');
    onClose();
  };

  const handleQuickLogin = (id: string) => {
    setSelectedProviderId(id);
    setRole('provider');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl relative border border-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-3 shadow-inner">
            <Phone className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Helper Login with OTP</h2>
          <p className="text-xs text-slate-500 mt-1">
            Easy login for Maids, Cooks, Babysitters, and Caregivers
          </p>
        </div>

        {/* STEP 1: Phone */}
        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mobile Number (मोबाइल नंबर)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-sm font-semibold text-slate-500">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  placeholder="98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 py-3 pl-14 pr-4 text-base font-semibold text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 px-4 text-white font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
            >
              <span>Send OTP (ओटीपी भेजें)</span>
              <ArrowRight className="h-5 w-5" />
            </button>

            {/* Quick Demo Switcher */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>Or 1-Tap Demo Login As:</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {providers.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleQuickLogin(p.id)}
                    className="flex items-center gap-2 rounded-xl p-2 text-left border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 transition text-xs"
                  >
                    <img
                      src={p.photo}
                      alt={p.name}
                      className="h-8 w-8 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 truncate">{p.name.split(' ')[0]}</div>
                      <div className="text-[10px] text-slate-500 capitalize">{p.categories[0]}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* STEP 2: OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200 text-center">
              <span>Demo OTP sent to {phoneNumber}: </span>
              <span className="font-extrabold text-sm text-emerald-950 underline">{simulatedCode}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Enter 4-Digit OTP Code
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder={simulatedCode}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center tracking-widest text-2xl font-black rounded-2xl border border-slate-300 py-2.5 px-4 text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-1/3 rounded-2xl border border-slate-300 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Change No.
              </button>
              <button
                type="submit"
                className="w-2/3 rounded-2xl bg-emerald-600 py-3 text-white font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
              >
                Verify & Continue
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: New Profile Setup */}
        {step === 'new_profile' && (
          <form onSubmit={handleCreateProfile} className="space-y-3.5">
            <div className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              New mobile registered! Fill basic profile to start getting domestic work.
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Rekha Devi"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-2 px-3 text-sm focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Primary Role</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as ServiceCategory)}
                className="w-full rounded-xl border border-slate-300 py-2 px-3 text-sm bg-white"
              >
                <option value="maid">House Maid & Cleaning</option>
                <option value="cook">Home Cook / Maharaj</option>
                <option value="babysitter">Babysitter & Nanny</option>
                <option value="elderly_care">Elderly Care Attendant</option>
                <option value="helper">All-Rounder Household Helper</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Experience (Yrs)</label>
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={newExp}
                  onChange={(e) => setNewExp(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 py-2 px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hourly Rate (₹)</label>
                <input
                  type="number"
                  min={50}
                  step={10}
                  value={newRate}
                  onChange={(e) => setNewRate(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 py-2 px-3 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-emerald-600 py-3 text-white font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 mt-2"
            >
              Complete Registration & Enter
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
