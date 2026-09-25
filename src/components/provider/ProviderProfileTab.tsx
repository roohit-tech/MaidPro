import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Camera,
  UploadCloud,
  Check,
  Plus,
  Trash2,
  Clock,
  MapPin,
  Sparkles,
  Phone,
  User,
  Heart,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ServiceCategory } from '../../types';

export const ProviderProfileTab: React.FC = () => {
  const { currentProvider, updateProviderProfile, submitKYC, addEmergencyContact, t } = useApp();

  const [isEditingRates, setIsEditingRates] = useState(false);
  const [hourlyRate, setHourlyRate] = useState(currentProvider.rates.hourly);
  const [perVisitRate, setPerVisitRate] = useState(currentProvider.rates.perVisit);
  const [monthlyRate, setMonthlyRate] = useState(currentProvider.rates.monthlyRecurring);

  const [newSkillInput, setNewSkillInput] = useState('');
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactRelation, setContactRelation] = useState('Family');

  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [kycIdType, setKycIdType] = useState(currentProvider.kyc.idType);
  const [kycIdNumber, setKycIdNumber] = useState(currentProvider.kyc.idNumber);

  const handleSaveRates = () => {
    updateProviderProfile(currentProvider.id, {
      rates: {
        hourly: hourlyRate,
        perVisit: perVisitRate,
        monthlyRecurring: monthlyRate,
      },
    });
    setIsEditingRates(false);
  };

  const handleAddSkill = (skill: string) => {
    if (!skill || currentProvider.skills.includes(skill)) return;
    updateProviderProfile(currentProvider.id, {
      skills: [...currentProvider.skills, skill],
    });
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    updateProviderProfile(currentProvider.id, {
      skills: currentProvider.skills.filter((s) => s !== skill),
    });
  };

  const handleToggleCategory = (cat: ServiceCategory) => {
    const exists = currentProvider.categories.includes(cat);
    let newCats: ServiceCategory[];
    if (exists) {
      if (currentProvider.categories.length === 1) return; // Keep at least one
      newCats = currentProvider.categories.filter((c) => c !== cat);
    } else {
      newCats = [...currentProvider.categories, cat];
    }
    updateProviderProfile(currentProvider.id, { categories: newCats });
  };

  const handleSaveEmergencyContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone) return;
    addEmergencyContact(currentProvider.id, {
      name: contactName,
      phone: contactPhone,
      relationship: contactRelation,
    });
    setContactName('');
    setContactPhone('');
    setIsAddingContact(false);
  };

  const handleKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitKYC(currentProvider.id, {
      idType: kycIdType,
      idNumber: kycIdNumber,
      idFrontUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400',
      addressProofVerified: true,
      policeVerificationDone: true,
    });
    setIsKycModalOpen(false);
  };

  const categoryPresets: { id: ServiceCategory; label: string }[] = [
    { id: 'maid', label: 'House Maid & Cleaning' },
    { id: 'cook', label: 'Home Cook & Chef' },
    { id: 'babysitter', label: 'Babysitter & Nanny' },
    { id: 'elderly_care', label: 'Elderly Care Worker' },
    { id: 'helper', label: 'Household Helper' },
  ];

  return (
    <div className="space-y-4 pb-20">
      {/* Profile Header Card */}
      <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentProvider.photo}
              alt={currentProvider.name}
              className="h-20 w-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
            />
            <button
              onClick={() => alert('Photo updated')}
              className="absolute -bottom-1 -right-1 bg-slate-900 text-white p-1.5 rounded-full hover:bg-slate-800 shadow"
              title="Change Photo"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-black text-slate-900 truncate">{currentProvider.name}</h2>
              {currentProvider.kyc.status === 'verified' && (
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              )}
            </div>
            <p className="text-xs text-slate-500">{currentProvider.phone}</p>
            <p className="text-xs text-slate-500 capitalize">
              {currentProvider.gender}, {currentProvider.age} yrs • {currentProvider.languagesSpoken.join(', ')}
            </p>
            <div className="mt-1 flex items-center gap-2 text-xs">
              <span className="font-extrabold text-amber-500">★ {currentProvider.rating}</span>
              <span className="text-slate-400">({currentProvider.reviewCount} customer reviews)</span>
            </div>
          </div>
        </div>

        {currentProvider.bio && (
          <p className="mt-3 text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            &quot;{currentProvider.bio}&quot;
          </p>
        )}
      </div>

      {/* KYC VERIFICATION CARD */}
      <div
        className={`rounded-3xl p-4 border transition ${
          currentProvider.kyc.status === 'verified'
            ? 'bg-emerald-50/80 border-emerald-300'
            : currentProvider.kyc.status === 'under_review'
            ? 'bg-amber-50/80 border-amber-300'
            : 'bg-red-50/80 border-red-300'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2.5 rounded-2xl ${
                currentProvider.kyc.status === 'verified'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 text-white'
              }`}
            >
              {currentProvider.kyc.status === 'verified' ? (
                <ShieldCheck className="h-6 w-6" />
              ) : (
                <ShieldAlert className="h-6 w-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 text-sm">Govt KYC Verification</h3>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    currentProvider.kyc.status === 'verified'
                      ? 'bg-emerald-200 text-emerald-900'
                      : 'bg-amber-200 text-amber-900'
                  }`}
                >
                  {currentProvider.kyc.status}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {currentProvider.kyc.status === 'verified'
                  ? `Verified badge active • ${currentProvider.kyc.idType} (${currentProvider.kyc.idNumber})`
                  : 'Submit ID card for background verification to unlock premium client requests.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsKycModalOpen(true)}
            className="text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 shrink-0 transition"
          >
            {currentProvider.kyc.status === 'verified' ? 'View ID' : 'Upload ID'}
          </button>
        </div>

        {currentProvider.kyc.adminRemarks && (
          <div className="mt-2 text-[11px] text-slate-700 bg-white/70 p-2 rounded-xl">
            <strong>Verification Note:</strong> {currentProvider.kyc.adminRemarks}
          </div>
        )}
      </div>

      {/* SERVICE CATEGORIES */}
      <div className="rounded-3xl bg-white p-4 border border-slate-200 shadow-xs space-y-2.5">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
          Service Categories (मेरी सेवाएं)
        </h3>
        <p className="text-xs text-slate-500">Select roles you are qualified to perform</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {categoryPresets.map((cat) => {
            const isSelected = currentProvider.categories.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleToggleCategory(cat.id)}
                className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{cat.label}</span>
                {isSelected && <Check className="h-4 w-4 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* RATES & SALARY EXPECTATION */}
      <div className="rounded-3xl bg-white p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Salary & Service Rates
            </h3>
            <p className="text-xs text-slate-500">Your pricing shown to customers</p>
          </div>
          <button
            onClick={() => {
              if (isEditingRates) handleSaveRates();
              else setIsEditingRates(true);
            }}
            className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition"
          >
            {isEditingRates ? 'Save Rates' : 'Edit Rates'}
          </button>
        </div>

        {isEditingRates ? (
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hourly Rate (₹/hr)</label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Per Visit Rate (₹)</label>
              <input
                type="number"
                value={perVisitRate}
                onChange={(e) => setPerVisitRate(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Monthly Recurring Contract (₹/month for daily 2 hrs)
              </label>
              <input
                type="number"
                value={monthlyRate}
                onChange={(e) => setMonthlyRate(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block">Hourly</span>
              <span className="text-base font-black text-slate-800">₹{currentProvider.rates.hourly}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block">Per Visit</span>
              <span className="text-base font-black text-slate-800">₹{currentProvider.rates.perVisit}</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <span className="text-[10px] text-emerald-700 font-bold block">Monthly Daily</span>
              <span className="text-base font-black text-emerald-800">
                ₹{currentProvider.rates.monthlyRecurring.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* SKILLS */}
      <div className="rounded-3xl bg-white p-4 border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
          Skills & Specializations (हुनर)
        </h3>

        <div className="flex flex-wrap gap-1.5">
          {currentProvider.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 px-3 py-1 rounded-xl text-xs font-semibold"
            >
              <span>{skill}</span>
              <button
                onClick={() => handleRemoveSkill(skill)}
                className="text-slate-400 hover:text-red-500 ml-1"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2 pt-1">
          <input
            type="text"
            placeholder="Add new skill (e.g. Diaper changing, North Indian, Ironing)"
            value={newSkillInput}
            onChange={(e) => setNewSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill(newSkillInput);
              }
            }}
            className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => handleAddSkill(newSkillInput)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-bold"
          >
            Add
          </button>
        </div>
      </div>

      {/* PREFERRED LOCATIONS */}
      <div className="rounded-3xl bg-white p-4 border border-slate-200 shadow-xs space-y-2">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-emerald-600" />
          <span>Preferred Service Locations</span>
        </h3>
        <p className="text-xs text-slate-500">Areas where you accept jobs within daily commute:</p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {currentProvider.preferredLocations.map((loc) => (
            <span
              key={loc}
              className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl text-xs font-bold"
            >
              📍 {loc}
            </span>
          ))}
        </div>
      </div>

      {/* EMERGENCY CONTACTS */}
      <div className="rounded-3xl bg-white p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5 text-red-500" />
            <span>Emergency Contacts (SOS Alert Recipients)</span>
          </h3>
          <button
            onClick={() => setIsAddingContact(true)}
            className="text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition"
          >
            + Add Contact
          </button>
        </div>

        {currentProvider.emergencyContacts.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
          >
            <div>
              <span className="font-bold text-slate-800">{c.name}</span>
              <span className="text-slate-500 block text-[11px]">{c.relationship} • {c.phone}</span>
            </div>
            <a
              href={`tel:${c.phone}`}
              className="p-2 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            >
              <Phone className="h-3.5 w-3.5" />
            </a>
          </div>
        ))}

        {isAddingContact && (
          <form onSubmit={handleSaveEmergencyContact} className="p-3 bg-red-50/50 rounded-2xl border border-red-200 space-y-2 text-xs">
            <input
              type="text"
              required
              placeholder="Contact Name (e.g. Ramesh - Brother)"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2 bg-white"
            />
            <input
              type="tel"
              required
              placeholder="Mobile Phone Number"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2 bg-white"
            />
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingContact(false)}
                className="w-1/2 py-2 rounded-xl border border-slate-300 font-bold text-slate-600 bg-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-2 rounded-xl bg-red-600 text-white font-bold"
              >
                Save Contact
              </button>
            </div>
          </form>
        )}
      </div>

      {/* KYC UPLOAD MODAL */}
      {isKycModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">Government ID & Police KYC</h3>
            <p className="text-xs text-slate-500 mb-4">
              Upload your Aadhaar, Voter ID or Passport to receive the Verified Partner badge.
            </p>

            <form onSubmit={handleKycSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ID Document Type</label>
                <select
                  value={kycIdType}
                  onChange={(e) => setKycIdType(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs bg-white"
                >
                  <option value="Aadhaar Card">Aadhaar Card (UIDAI)</option>
                  <option value="Voter ID">Voter ID Card (Election Commission)</option>
                  <option value="Driving License">Driving License</option>
                  <option value="Passport">Passport</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Document Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5421-9876-1234"
                  value={kycIdNumber}
                  onChange={(e) => setKycIdNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs"
                />
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center bg-slate-50">
                <UploadCloud className="h-8 w-8 text-emerald-600 mx-auto mb-1" />
                <span className="text-xs font-bold text-slate-800 block">ID Front & Back Photo</span>
                <span className="text-[10px] text-slate-500">Tap to upload clear photo or scan</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsKycModalOpen(false)}
                  className="w-1/3 rounded-xl border border-slate-300 py-2.5 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-md"
                >
                  Submit for Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
