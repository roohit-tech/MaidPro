import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Building,
  CreditCard,
  QrCode,
  DollarSign,
  Download,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProviderEarningsTab: React.FC = () => {
  const { currentProvider, paymentRecords, requestPayout, bookings, commissionRate, t } = useApp();

  const [withdrawAmount, setWithdrawAmount] = useState<number>(currentProvider.walletBalance > 0 ? Math.min(5000, currentProvider.walletBalance) : 0);
  const [withdrawMethod, setWithdrawMethod] = useState<'upi' | 'bank_transfer'>('upi');
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState<string | null>(null);

  const myPayments = paymentRecords.filter((p) => p.providerId === currentProvider.id);

  // Calculate stats
  const totalEarnedMonth = myPayments
    .filter((p) => p.type === 'job_earning')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalWithdrawn = myPayments
    .filter((p) => p.type === 'payout_withdrawal')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0 || withdrawAmount > currentProvider.walletBalance) return;

    const success = requestPayout(withdrawAmount, withdrawMethod);
    if (success) {
      setPayoutSuccessMsg(`Successfully transferred ₹${withdrawAmount.toLocaleString()} to ${withdrawMethod.toUpperCase()}!`);
      setTimeout(() => setPayoutSuccessMsg(null), 4000);
      setIsWithdrawModalOpen(false);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Wallet Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 text-white shadow-xl">
        <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-2">
          <span>AVAILABLE WALLET BALANCE</span>
          <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Instant Payout Ready</span>
          </span>
        </div>

        <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-4">
          ₹{currentProvider.walletBalance.toLocaleString()}
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700/60 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">This Month Gross</span>
            <span className="font-extrabold text-sm text-emerald-400">
              ₹{(totalEarnedMonth + currentProvider.cashCollected).toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Direct Cash Collected</span>
            <span className="font-extrabold text-sm text-amber-300">
              ₹{currentProvider.cashCollected.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <button
            onClick={() => {
              setWithdrawAmount(currentProvider.walletBalance);
              setIsWithdrawModalOpen(true);
            }}
            disabled={currentProvider.walletBalance <= 0}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm transition shadow-lg ${
              currentProvider.walletBalance > 0
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ArrowUpRight className="h-5 w-5" />
            <span>Withdraw to UPI / Bank (पैसे निकालें)</span>
          </button>
        </div>
      </div>

      {payoutSuccessMsg && (
        <div className="rounded-2xl bg-emerald-100 border border-emerald-300 p-4 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{payoutSuccessMsg}</span>
        </div>
      )}

      {/* Salary & Commission Breakdown Box */}
      <div className="rounded-3xl bg-white p-4 border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
          Transparent Commission & Rates
        </h3>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] text-slate-400 font-bold">Platform Fee</div>
            <div className="text-sm font-black text-slate-800">{commissionRate * 100}%</div>
            <div className="text-[9px] text-slate-400">Insurance & App</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] text-slate-400 font-bold">You Keep</div>
            <div className="text-sm font-black text-emerald-600">{(1 - commissionRate) * 100}%</div>
            <div className="text-[9px] text-slate-400">Net take-home</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] text-slate-400 font-bold">Base Rate</div>
            <div className="text-sm font-black text-slate-800">₹{currentProvider.rates.hourly}/hr</div>
            <div className="text-[9px] text-slate-400">Configurable</div>
          </div>
        </div>
      </div>

      {/* Bank Account Details */}
      <div className="rounded-3xl bg-white p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
            Registered Bank & UPI
          </h3>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
            Active
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2">
              <QrCode className="h-4 w-4 text-emerald-600" />
              <div>
                <span className="text-[10px] text-slate-400 block">UPI ID</span>
                <span className="font-bold text-slate-800">{currentProvider.bankDetails.upiId}</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-500">Fast (Instant)</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-slate-600" />
              <div>
                <span className="text-[10px] text-slate-400 block">{currentProvider.bankDetails.bankName}</span>
                <span className="font-bold text-slate-800">
                  {currentProvider.bankDetails.accountNumber} ({currentProvider.bankDetails.ifscOrRouting})
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-500">NEFT/IMPS</span>
          </div>
        </div>
      </div>

      {/* Payment History List */}
      <div className="space-y-3">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
          Payment History ({myPayments.length})
        </h3>

        <div className="space-y-2.5">
          {myPayments.map((p) => {
            const isWithdraw = p.type === 'payout_withdrawal';
            return (
              <div
                key={p.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl ${
                      isWithdraw
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isWithdraw ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownLeft className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {isWithdraw ? 'Payout Withdrawal' : 'Job Earnings Credited'}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {p.description}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {p.date} • Ref: {p.referenceId}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`text-sm font-black ${
                      isWithdraw ? 'text-amber-700' : 'text-emerald-600'
                    }`}
                  >
                    {isWithdraw ? '-' : '+'}₹{p.amount.toLocaleString()}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    Completed
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WITHDRAW MODAL */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">Withdraw Funds</h3>
            <p className="text-xs text-slate-500 mb-4">
              Available balance: <strong>₹{currentProvider.walletBalance.toLocaleString()}</strong>
            </p>

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Amount to Withdraw (₹)
                </label>
                <input
                  type="number"
                  min={100}
                  max={currentProvider.walletBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-300 py-3 px-4 text-xl font-black text-slate-900 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Withdraw To</label>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('upi')}
                    className={`p-3 rounded-xl border text-center transition ${
                      withdrawMethod === 'upi'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    UPI ({currentProvider.bankDetails.upiId.split('@')[0]})
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('bank_transfer')}
                    className={`p-3 rounded-xl border text-center transition ${
                      withdrawMethod === 'bank_transfer'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    Bank Account ({currentProvider.bankDetails.accountNumber.slice(-4)})
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="w-1/3 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-200"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
