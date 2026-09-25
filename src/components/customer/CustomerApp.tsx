import React, { useState } from 'react';
import {
  Search,
  Star,
  ShieldCheck,
  Clock,
  MapPin,
  Calendar,
  CheckCircle,
  Repeat,
  Plus,
  Sparkles,
  Phone,
  User,
  Heart,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ServiceCategory, BookingType, RecurringFrequency, Provider } from '../../types';

export const CustomerApp: React.FC = () => {
  const {
    providers,
    currentCustomer,
    customers,
    setSelectedCustomerId,
    bookings,
    attendanceRecords,
    createBooking,
    addReview,
    t,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProviderForBooking, setSelectedProviderForBooking] = useState<Provider | null>(null);

  // Booking Modal State
  const [bookingType, setBookingType] = useState<BookingType>('recurring');
  const [recurringFreq, setRecurringFreq] = useState<RecurringFrequency>('daily');
  const [timeSlot, setTimeSlot] = useState('07:00 AM - 09:00 AM');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>(['Floor sweeping & mopping', 'Utensil cleaning']);
  const [notes, setNotes] = useState('We have 1 pet dog. Please ring front bell.');
  const [bookingSuccessModal, setBookingSuccessModal] = useState(false);

  // Review Modal State
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewTags, setReviewTags] = useState<string[]>(['Punctual', 'Hygienic', 'Trustworthy']);

  // Filter providers
  const filteredProviders = providers.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.categories.includes(selectedCategory);
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.preferredLocations.some((loc) => loc.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Customer's bookings
  const myBookings = bookings.filter((b) => b.customerId === currentCustomer.id);
  const activeBookings = myBookings.filter((b) => b.status === 'accepted' || b.status === 'in_progress');

  const handleOpenBookingModal = (provider: Provider) => {
    setSelectedProviderForBooking(provider);
    if (provider.categories.includes('cook')) {
      setSelectedTasks(['Breakfast & Lunch prep', 'Phulka & sabzi making', 'Kitchen cleaning']);
      setTimeSlot('07:30 AM - 09:30 AM');
    } else if (provider.categories.includes('babysitter')) {
      setSelectedTasks(['Baby playtime & storytelling', 'Feed assistance', 'Sterilize bottles']);
      setTimeSlot('09:00 AM - 01:00 PM');
    } else if (provider.categories.includes('elderly_care')) {
      setSelectedTasks(['Walking assistance', 'BP & vitals check', 'Medication reminders']);
      setTimeSlot('08:00 AM - 02:00 PM');
    } else {
      setSelectedTasks(['Floor sweeping & mopping', 'Utensil cleaning', 'Garbage disposal']);
      setTimeSlot('06:30 AM - 08:30 AM');
    }
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProviderForBooking) return;

    const totalAmt =
      bookingType === 'recurring'
        ? selectedProviderForBooking.rates.monthlyRecurring
        : selectedProviderForBooking.rates.perVisit;

    createBooking({
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      customerPhone: currentCustomer.phone,
      customerAddress: currentCustomer.address,
      customerArea: currentCustomer.area,
      providerId: selectedProviderForBooking.id,
      providerName: selectedProviderForBooking.name,
      category: selectedProviderForBooking.categories[0],
      specificTasks: selectedTasks,
      bookingType,
      recurringFrequency: bookingType === 'recurring' ? recurringFreq : undefined,
      recurringDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      startDate,
      timeSlot,
      totalAmount: totalAmt,
      notes,
    });

    setSelectedProviderForBooking(null);
    setBookingSuccessModal(true);
  };

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    const booking = bookings.find((b) => b.id === reviewBookingId);
    if (!booking) return;

    addReview({
      providerId: booking.providerId,
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      rating: reviewRating,
      comment: reviewComment,
      tags: reviewTags,
      category: booking.category,
    });

    setReviewBookingId(null);
    setReviewComment('');
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      <div className="max-w-4xl mx-auto px-4 pt-4 space-y-5">
        {/* Customer Top Bar */}
        <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={currentCustomer.photo || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200'}
              alt={currentCustomer.name}
              className="h-12 w-12 rounded-2xl object-cover border border-slate-200 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base text-slate-900">{currentCustomer.name}</h1>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-extrabold px-2 py-0.5 rounded-full">
                  Customer
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3 text-emerald-600" />
                <span>{currentCustomer.address}</span>
              </p>
            </div>
          </div>

          {/* Switch Customer Profile */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Switch Customer:</span>
            <select
              value={currentCustomer.id}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="rounded-xl border border-slate-300 p-2 font-bold text-slate-800 bg-slate-50 outline-none"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.area})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ACTIVE HELPERS & ATTENDANCE AT YOUR HOME */}
        {activeBookings.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Your Active Domestic Helpers ({activeBookings.length})</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeBookings.map((b) => {
                const helper = providers.find((p) => p.id === b.providerId);
                const todaysAtt = attendanceRecords.find(
                  (a) => a.bookingId === b.id && a.date === new Date().toISOString().split('T')[0]
                );

                return (
                  <div
                    key={b.id}
                    className="rounded-3xl bg-white p-4 border border-emerald-200 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={helper?.photo}
                          alt={b.providerName}
                          className="h-12 w-12 rounded-2xl object-cover border border-emerald-400"
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <h3 className="font-bold text-slate-900 text-sm">{b.providerName}</h3>
                            <ShieldCheck className="h-4 w-4 text-emerald-600" />
                          </div>
                          <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                            {b.category}
                          </span>
                        </div>
                      </div>

                      <a
                        href={`tel:${b.customerPhone}`}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-2.5 text-xs space-y-1">
                      <div className="flex justify-between text-slate-600">
                        <span>Daily Slot:</span>
                        <strong className="text-slate-800">{b.timeSlot}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Today&apos;s Status:</span>
                        {todaysAtt?.status === 'in_progress' ? (
                          <span className="text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded">
                            On Duty (Punched In at {todaysAtt.checkInTime})
                          </span>
                        ) : todaysAtt?.status === 'completed' ? (
                          <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                            Completed today ({todaysAtt.checkOutTime})
                          </span>
                        ) : (
                          <span className="text-slate-500 font-medium">Scheduled for today</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setReviewBookingId(b.id)}
                        className="w-full py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        ★ Rate & Review Helper
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SEARCH & CATEGORY FILTERS */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search helper name, cuisine, cleaning skill, or neighborhood..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 py-2.5 pl-10 pr-4 text-xs font-medium bg-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Categories Pill Bar */}
          <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-bold">
            {[
              { id: 'all', label: 'All Services' },
              { id: 'maid', label: '🧹 Maids & Housekeeping' },
              { id: 'cook', label: '🍳 Cooks & Chefs' },
              { id: 'babysitter', label: '👶 Babysitters & Nannies' },
              { id: 'elderly_care', label: '👵 Elderly Care Attendants' },
              { id: 'helper', label: '🏠 All-Rounder Helpers' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`py-2 px-3.5 rounded-2xl whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* PROVIDER CARDS GRID */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">
              Verified Domestic Professionals ({filteredProviders.length})
            </h2>
            <span className="text-xs text-slate-500">Government KYC Verified</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProviders.map((provider) => (
              <div
                key={provider.id}
                className="rounded-3xl bg-white p-5 border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={provider.photo}
                          alt={provider.name}
                          className="h-14 w-14 rounded-2xl object-cover border border-slate-200"
                        />
                        {provider.kyc.status === 'verified' && (
                          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5">
                            <ShieldCheck className="h-3.5 w-3.5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-extrabold text-slate-900 text-base">{provider.name}</h3>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span>{provider.rating}</span>
                          <span className="text-slate-400 font-normal">({provider.reviewCount} reviews)</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {provider.experienceYears} yrs exp • {provider.languagesSpoken.join(', ')}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-emerald-600 block">
                        ₹{provider.rates.monthlyRecurring.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">/month (Daily)</span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {provider.skills.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-slate-100 text-slate-700 px-2 py-0.5 text-[10px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {provider.skills.length > 4 && (
                      <span className="text-[10px] text-slate-400">+{provider.skills.length - 4} more</span>
                    )}
                  </div>

                  {/* Location coverage */}
                  <div className="mt-3 flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>Areas: {provider.preferredLocations.join(', ')}</span>
                  </div>
                </div>

                {/* Book Action Button */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    One-time: <strong>₹{provider.rates.perVisit}</strong>
                  </div>
                  <button
                    onClick={() => handleOpenBookingModal(provider)}
                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-emerald-100 transition"
                  >
                    <span>Book Service</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOOKING MODAL */}
        {selectedProviderForBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Book {selectedProviderForBooking.name}
                  </h3>
                  <p className="text-xs text-slate-500 capitalize">
                    {selectedProviderForBooking.categories.join(' & ')} • Verified Helper
                  </p>
                </div>
                <button
                  onClick={() => setSelectedProviderForBooking(null)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleConfirmBooking} className="space-y-4 mt-4">
                {/* Booking Type: Recurring vs One-time */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Service Frequency (सेवा का प्रकार)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBookingType('recurring')}
                      className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                        bookingType === 'recurring'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Repeat className="h-4 w-4 text-emerald-600" />
                      <span>Daily / Monthly Contract</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingType('one_time')}
                      className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                        bookingType === 'one_time'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <span>One-Time Task</span>
                    </button>
                  </div>
                </div>

                {bookingType === 'recurring' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Recurring Frequency
                    </label>
                    <select
                      value={recurringFreq}
                      onChange={(e) => setRecurringFreq(e.target.value as RecurringFrequency)}
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs bg-white"
                    >
                      <option value="daily">Daily (6 days a week, Mon-Sat)</option>
                      <option value="weekly">Weekly (3 days a week: Mon, Wed, Fri)</option>
                      <option value="monthly">Monthly Full-Time Package</option>
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Time Slot</label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs bg-white"
                    >
                      <option value="06:30 AM - 08:30 AM">Morning Early (06:30 AM - 08:30 AM)</option>
                      <option value="07:30 AM - 09:30 AM">Breakfast Slot (07:30 AM - 09:30 AM)</option>
                      <option value="09:00 AM - 11:00 AM">Morning Slot (09:00 AM - 11:00 AM)</option>
                      <option value="11:30 AM - 01:30 PM">Lunch Slot (11:30 AM - 01:30 PM)</option>
                      <option value="04:30 PM - 06:30 PM">Evening Slot (04:30 PM - 06:30 PM)</option>
                      <option value="07:00 PM - 09:00 PM">Dinner Slot (07:00 PM - 09:00 PM)</option>
                    </select>
                  </div>
                </div>

                {/* Specific tasks */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Tasks Required:
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {selectedProviderForBooking.skills.slice(0, 6).map((task, idx) => {
                      const checked = selectedTasks.includes(task);
                      return (
                        <label
                          key={idx}
                          className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              if (checked) setSelectedTasks(selectedTasks.filter((t) => t !== task));
                              else setSelectedTasks([...selectedTasks, task]);
                            }}
                            className="rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="truncate">{task}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Special Household Instructions
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Ring back door bell, low spice food, Golden Retriever pet at home"
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                  />
                </div>

                {/* Pricing calculation summary */}
                <div className="rounded-2xl bg-emerald-50 p-3.5 border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 uppercase block">Total Payable</span>
                    <span className="text-lg font-black text-emerald-950">
                      ₹
                      {(bookingType === 'recurring'
                        ? selectedProviderForBooking.rates.monthlyRecurring
                        : selectedProviderForBooking.rates.perVisit
                      ).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-700 block">
                      {bookingType === 'recurring' ? 'Billed monthly with daily attendance tracking' : 'Pay after work'}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-200 px-3 py-1 rounded-xl">
                    100% Satisfaction Guarantee
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProviderForBooking(null)}
                    className="w-1/3 rounded-xl border border-slate-300 py-3 text-xs font-bold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-200"
                  >
                    Confirm & Send WhatsApp Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* BOOKING SUCCESS MODAL */}
        {bookingSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Booking Request Sent!</h3>
              <p className="text-xs text-slate-600">
                We have notified your chosen helper on WhatsApp and push notification. You can track their daily attendance and punch-in status from your dashboard.
              </p>
              <button
                onClick={() => setBookingSuccessModal(false)}
                className="w-full rounded-2xl bg-emerald-600 py-3 text-white font-bold text-xs"
              >
                View Active Helpers
              </button>
            </div>
          </div>
        )}

        {/* REVIEW MODAL */}
        {reviewBookingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl">
              <h3 className="text-base font-bold text-slate-900 mb-1">Rate Your Domestic Helper</h3>
              <p className="text-xs text-slate-500 mb-3">Your feedback helps helpers get more bookings.</p>

              <form onSubmit={handlePostReview} className="space-y-3">
                <div className="flex justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setReviewRating(s)}
                      className="p-1 text-2xl transition hover:scale-125"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          s <= reviewRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Review</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe their punctuality, cleanliness, cooking taste, or handling of kids/pets..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewBookingId(null)}
                    className="w-1/3 rounded-xl border border-slate-300 py-2.5 text-xs font-bold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
