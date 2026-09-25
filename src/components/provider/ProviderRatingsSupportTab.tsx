import React, { useState } from 'react';
import {
  Star,
  MessageSquare,
  PhoneCall,
  Volume2,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProviderRatingsSupportTab: React.FC = () => {
  const { currentProvider, reviews, speakText, t } = useApp();

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [isWhatsAppChatOpen, setIsWhatsAppChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatThread, setChatThread] = useState([
    {
      sender: 'bot',
      text: `Hello ${currentProvider.name}! Welcome to MaidPro 24/7 Domestic Partner Support. How can we help you today?`,
      time: 'Just now',
    },
  ]);

  const myReviews = reviews.filter((r) => r.providerId === currentProvider.id);

  const faqs = [
    {
      q: 'How do I withdraw my earnings to my bank account or UPI?',
      q_hi: 'मैं अपनी कमाई बैंक या UPI में कैसे निकालूं?',
      a: 'Go to the Earnings tab, tap "Withdraw to UPI/Bank", enter the amount, and tap Confirm. The money is transferred to your account instantly with 0 withdrawal fee.',
    },
    {
      q: 'What should I do if a customer asks for tasks not in the contract?',
      q_hi: 'अगर ग्राहक समझौते से बाहर का काम करने को कहे तो क्या करें?',
      a: 'You can politely explain that standard packages cover listed duties. If they need extra heavy tasks (like painting or balcony sofa lifting), ask them to book an extra add-on in the MaidPro app so you get paid extra.',
    },
    {
      q: 'How do I take leave for family functions or festivals?',
      q_hi: 'त्योहार या शादी में छुट्टी कैसे लें?',
      a: 'Go to Schedule tab -> Leave -> Apply Leave. Select your dates and reason at least 2-3 days in advance. MaidPro will automatically alert your regular households.',
    },
    {
      q: 'What if I feel unsafe at a customer location?',
      q_hi: 'अगर किसी घर में असुरक्षित महसूस हो तो क्या करें?',
      a: 'Immediately tap the red SOS button at the top of your screen. This calls 112 emergency police, sounds an emergency alert to our safety team, and broadcasts your live GPS coordinates.',
    },
  ];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = {
      sender: 'user',
      text: chatMessage,
      time: 'Just now',
    };

    setChatThread((prev) => [...prev, userMsg]);
    const input = chatMessage;
    setChatMessage('');

    setTimeout(() => {
      let reply = 'Thank you for reaching out. Our support executive has received your query and will assist you immediately.';
      if (input.toLowerCase().includes('salary') || input.toLowerCase().includes('payout')) {
        reply = 'Your payouts are processed automatically via UPI and bank NEFT. You can also withdraw manually anytime from the Earnings tab.';
      } else if (input.toLowerCase().includes('leave')) {
        reply = 'To take leave, please use the Schedule tab -> Apply Leave so your households are notified.';
      }

      setChatThread((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: reply,
          time: 'Just now',
        },
      ]);
    }, 800);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* RATINGS OVERVIEW */}
      <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">
              Customer Ratings & Trust
            </h2>
            <p className="text-xs text-slate-500">Based on verified household reviews</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-2xl font-black text-amber-500 justify-end">
              <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
              <span>{currentProvider.rating}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-semibold">
              {myReviews.length} Verified Reviews
            </div>
          </div>
        </div>

        {/* Compliments badges */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Top Compliments from Customers:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {['Very Punctual (98%)', 'Hygienic Cleaning', 'Pet Friendly', 'Tasty & Wholesome Food', 'Gentle with Children'].map(
              (tag, idx) => (
                <span
                  key={idx}
                  className="rounded-xl bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-bold text-amber-900"
                >
                  ✨ {tag}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* CUSTOMER REVIEWS FEED */}
      <div className="space-y-3">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
          Recent Reviews ({myReviews.length})
        </h3>

        <div className="space-y-2.5">
          {myReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-xs">{rev.customerName}</span>
                  <span className="text-[10px] text-slate-400 block">{rev.date}</span>
                </div>
                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                &quot;{rev.comment}&quot;
              </p>

              <div className="flex flex-wrap gap-1">
                {rev.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUPPORT & HELPDESK */}
      <div className="rounded-3xl bg-emerald-900 text-white p-5 shadow-lg space-y-4">
        <div>
          <h3 className="text-base font-black">24/7 Domestic Partner Support</h3>
          <p className="text-xs text-emerald-200 mt-0.5">
            Need help with a booking, payment dispute, or customer assistance? We are here.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setIsWhatsAppChatOpen(true)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3 px-3 text-xs font-extrabold transition shadow-md"
          >
            <MessageSquare className="h-4 w-4" />
            <span>WhatsApp Help</span>
          </button>
          <a
            href="tel:1800123456"
            className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white py-3 px-3 text-xs font-bold transition border border-emerald-700"
          >
            <PhoneCall className="h-4 w-4" />
            <span>Call Toll-Free</span>
          </a>
        </div>
      </div>

      {/* VOICE-GUIDED FAQ ACCORDION */}
      <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4 text-emerald-600" />
            <span>Helper Audio Guide & FAQs</span>
          </h3>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 overflow-hidden transition"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-3.5 text-left bg-slate-50 hover:bg-slate-100 transition gap-2"
                >
                  <div>
                    <span className="font-bold text-slate-800 text-xs block">{faq.q}</span>
                    <span className="text-[11px] text-emerald-700 font-medium">{faq.q_hi}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-3.5 bg-white text-xs text-slate-600 border-t border-slate-100 space-y-2">
                    <p className="leading-relaxed">{faq.a}</p>
                    <button
                      onClick={() => speakText(`${faq.q}. ${faq.a}`)}
                      className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>Hear Answer in Voice</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* WHATSAPP SUPPORT CHAT MODAL */}
      {isWhatsAppChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-slate-100 shadow-2xl overflow-hidden flex flex-col h-[520px]">
            {/* Header */}
            <div className="bg-emerald-700 text-white p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                  MP
                </div>
                <div>
                  <h4 className="font-bold text-sm">MaidPro WhatsApp Desk</h4>
                  <p className="text-[10px] text-emerald-200">Online 24/7 • Typically replies in seconds</p>
                </div>
              </div>
              <button
                onClick={() => setIsWhatsAppChatOpen(false)}
                className="text-white/80 hover:text-white text-lg font-bold px-2"
              >
                ✕
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-[#e5ddd5]/30">
              {chatThread.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-2.5 text-xs shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`text-[9px] block text-right mt-1 ${
                        msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input bar */}
            <form onSubmit={handleSendChat} className="p-2.5 bg-white border-t border-slate-200 flex gap-2">
              <input
                type="text"
                placeholder="Type your message to MaidPro..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
