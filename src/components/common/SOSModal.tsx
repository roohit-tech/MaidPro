import React from 'react';
import { AlertTriangle, Phone, ShieldAlert, X, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SOSModal: React.FC = () => {
  const { isSOSModalOpen, setIsSOSModalOpen, currentProvider } = useApp();

  if (!isSOSModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border-4 border-red-500">
        <div className="flex items-center justify-between pb-3 border-b border-red-100">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 animate-bounce">
              <ShieldAlert className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-red-600 tracking-tight">EMERGENCY SOS</h2>
              <p className="text-xs text-slate-500">Safety desk alert triggered</p>
            </div>
          </div>
          <button
            onClick={() => setIsSOSModalOpen(false)}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="my-4 rounded-2xl bg-red-50 p-4 border border-red-200">
          <div className="flex items-center gap-2 text-red-800 font-semibold text-sm">
            <MapPin className="h-4 w-4 text-red-600 animate-pulse" />
            <span>Live Location Broadcasting</span>
          </div>
          <p className="mt-1 text-xs text-red-700">
            Current coordinates & worker profile ({currentProvider.name}, {currentProvider.phone}) have been dispatched to MaidPro Safety Team & local emergency response.
          </p>
        </div>

        {/* Emergency Call buttons */}
        <div className="space-y-3">
          <a
            href="tel:112"
            className="flex items-center justify-between w-full rounded-2xl bg-red-600 px-5 py-4 text-white font-bold hover:bg-red-700 transition shadow-lg shadow-red-200"
          >
            <div className="flex items-center gap-3">
              <Phone className="h-6 w-6" />
              <div className="text-left">
                <div className="text-base font-extrabold">Call National Emergency (112)</div>
                <div className="text-xs text-red-100">Police, Ambulance & Fire</div>
              </div>
            </div>
            <span className="text-xs bg-red-700 px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">Toll Free</span>
          </a>

          <a
            href="tel:1091"
            className="flex items-center justify-between w-full rounded-2xl bg-rose-600 px-5 py-3.5 text-white font-bold hover:bg-rose-700 transition shadow-md shadow-rose-200"
          >
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5" />
              <div className="text-left">
                <div className="text-sm font-bold">Women Safety Helpline (1091)</div>
                <div className="text-xs text-rose-100">24/7 Rapid Response Desk</div>
              </div>
            </div>
            <span className="text-xs bg-rose-700 px-2 py-0.5 rounded-full">Call Now</span>
          </a>

          <div className="pt-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Primary Family Contacts
            </div>
            {currentProvider.emergencyContacts.length > 0 ? (
              <div className="space-y-2">
                {currentProvider.emergencyContacts.map((contact) => (
                  <a
                    key={contact.id}
                    href={`tel:${contact.phone}`}
                    className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 p-3 hover:bg-slate-100 transition"
                  >
                    <div className="text-left">
                      <div className="text-sm font-semibold text-slate-800">{contact.name}</div>
                      <div className="text-xs text-slate-500">{contact.relationship} • {contact.phone}</div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                      <Phone className="h-3.5 w-3.5" />
                      <span>Call</span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No family contacts registered yet. Add in Profile tab.</p>
            )}
          </div>
        </div>

        <div className="mt-5 text-center">
          <button
            onClick={() => setIsSOSModalOpen(false)}
            className="w-full rounded-xl py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition"
          >
            I Am Safe Now (Cancel Alarm)
          </button>
        </div>
      </div>
    </div>
  );
};
