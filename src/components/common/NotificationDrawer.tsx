import React from 'react';
import { Bell, CheckCheck, MessageSquare, ShieldCheck, X, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Notifications & WhatsApp</h3>
              <p className="text-xs text-slate-500">Live alerts & job updates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Bell className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No new notifications</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer relative ${
                  n.read
                    ? 'bg-white border-slate-200 text-slate-700'
                    : n.type === 'whatsapp'
                    ? 'bg-emerald-50/70 border-emerald-300 text-slate-800 shadow-sm'
                    : 'bg-indigo-50/70 border-indigo-200 text-slate-800 shadow-sm'
                }`}
              >
                {!n.read && (
                  <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
                <div className="flex items-start gap-2.5">
                  <div
                    className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                      n.type === 'whatsapp'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {n.type === 'whatsapp' ? (
                      <MessageSquare className="h-4 w-4" />
                    ) : (
                      <Bell className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{n.body}</p>
                    {n.sender && (
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-emerald-700">
                        <Sparkles className="h-3 w-3" />
                        <span>Via {n.sender}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Encrypted SMS & WhatsApp Gateway Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
