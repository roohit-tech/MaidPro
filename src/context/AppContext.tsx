import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  UserRole,
  Language,
  Provider,
  Customer,
  Booking,
  AttendanceRecord,
  LeaveRequest,
  PaymentRecord,
  Review,
  Complaint,
  ServiceArea,
  NotificationMessage,
  KYCData,
  EmergencyContact,
} from '../types';
import {
  INITIAL_PROVIDERS,
  INITIAL_CUSTOMERS,
  INITIAL_BOOKINGS,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVES,
  INITIAL_PAYMENTS,
  INITIAL_REVIEWS,
  INITIAL_COMPLAINTS,
  INITIAL_SERVICE_AREAS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';
import { translations } from '../data/translations';

interface ActiveJobSession {
  bookingId: string;
  startTime: number;
  formattedStartTime: string;
  location: string;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  selectedProviderId: string;
  setSelectedProviderId: (id: string) => void;
  currentProvider: Provider;
  selectedCustomerId: string;
  setSelectedCustomerId: (id: string) => void;
  currentCustomer: Customer;

  // Data
  providers: Provider[];
  customers: Customer[];
  bookings: Booking[];
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  paymentRecords: PaymentRecord[];
  reviews: Review[];
  complaints: Complaint[];
  serviceAreas: ServiceArea[];
  notifications: NotificationMessage[];
  commissionRate: number; // e.g. 0.10

  // Active Job Timer
  activeJob: ActiveJobSession | null;
  activeJobElapsed: number;

  // Audio accessibility
  isSpeaking: boolean;
  speakingText: string | null;
  speakText: (text: string) => void;
  stopSpeech: () => void;

  // Provider actions
  acceptBooking: (bookingId: string) => void;
  rejectBooking: (bookingId: string, reason?: string) => void;
  startWork: (bookingId: string, location?: string) => void;
  endWork: (bookingId: string, completedTasks: string[], notes?: string) => void;
  applyLeave: (leave: Omit<LeaveRequest, 'id' | 'providerId' | 'providerName' | 'status' | 'appliedAt' | 'affectedBookingsCount'>) => void;
  requestPayout: (amount: number, method: 'upi' | 'bank_transfer') => boolean;
  updateProviderProfile: (providerId: string, updates: Partial<Provider>) => void;
  submitKYC: (providerId: string, kyc: Partial<KYCData>) => void;
  toggleProviderAvailability: (providerId: string) => void;
  addEmergencyContact: (providerId: string, contact: Omit<EmergencyContact, 'id'>) => void;
  triggerSOS: (providerId: string) => void;

  // Customer actions
  createBooking: (bookingData: Partial<Booking>) => void;
  addReview: (reviewData: Omit<Review, 'id' | 'date'>) => void;

  // Admin actions
  verifyKYC: (providerId: string, status: 'verified' | 'rejected' | 'under_review', remarks: string) => void;
  updateCommissionRate: (rate: number) => void;
  resolveComplaint: (complaintId: string, notes: string) => void;
  toggleServiceArea: (areaId: string) => void;
  approveLeave: (leaveId: string, remarks?: string) => void;
  rejectLeave: (leaveId: string, remarks?: string) => void;
  disburseAllPendingPayouts: () => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  addNotification: (notif: Omit<NotificationMessage, 'id' | 'timestamp' | 'read'>) => void;
  isSOSModalOpen: boolean;
  setIsSOSModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'maidpro_app_state_v1';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load saved state or initial defaults
  const [role, setRole] = useState<UserRole>('provider');
  const [language, setLanguage] = useState<Language>('en');
  const [selectedProviderId, setSelectedProviderId] = useState<string>('prov-1');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('cust-1');

  const [providers, setProviders] = useState<Provider[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_providers`);
    return saved ? JSON.parse(saved) : INITIAL_PROVIDERS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_customers`);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_bookings`);
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_attendance`);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_leaves`);
    return saved ? JSON.parse(saved) : INITIAL_LEAVES;
  });

  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_payments`);
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_reviews`);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_complaints`);
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_areas`);
    return saved ? JSON.parse(saved) : INITIAL_SERVICE_AREAS;
  });

  const [notifications, setNotifications] = useState<NotificationMessage[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_notifs`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [commissionRate, setCommissionRate] = useState<number>(0.1);
  const [activeJob, setActiveJob] = useState<ActiveJobSession | null>(null);
  const [activeJobElapsed, setActiveJobElapsed] = useState<number>(0);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState<boolean>(false);

  // Audio Speech state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_providers`, JSON.stringify(providers));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_customers`, JSON.stringify(customers));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_bookings`, JSON.stringify(bookings));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_attendance`, JSON.stringify(attendanceRecords));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_leaves`, JSON.stringify(leaveRequests));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_payments`, JSON.stringify(paymentRecords));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_reviews`, JSON.stringify(reviews));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_complaints`, JSON.stringify(complaints));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_areas`, JSON.stringify(serviceAreas));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_notifs`, JSON.stringify(notifications));
    } catch {
      // storage quota or private browsing safeguard
    }
  }, [providers, customers, bookings, attendanceRecords, leaveRequests, paymentRecords, reviews, complaints, serviceAreas, notifications]);

  // Active Job Timer effect
  useEffect(() => {
    if (!activeJob) {
      setActiveJobElapsed(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const seconds = Math.floor((now - activeJob.startTime) / 1000);
      setActiveJobElapsed(seconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeJob]);

  // Speech helper
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => {
        setIsSpeaking(false);
        setSpeakingText(null);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setSpeakingText(null);
      };
      setIsSpeaking(true);
      setSpeakingText(text);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
      setSpeakingText(null);
    }
  };

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingText(null);
  };

  const currentProvider = providers.find((p) => p.id === selectedProviderId) || providers[0];
  const currentCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const addNotification = (notif: Omit<NotificationMessage, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationMessage = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Provider: Accept Booking
  const acceptBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'accepted' } : b))
    );
    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch {
      // safe fallback
    }

    addNotification({
      type: 'whatsapp',
      title: 'WhatsApp Alert 🟢',
      body: `Booking #${bookingId.replace('book-', '')} accepted! Customer informed on WhatsApp.`,
      sender: 'MaidPro Bot',
    });
  };

  // Provider: Reject Booking
  const rejectBooking = (bookingId: string, reason?: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'rejected', notes: reason ? `${b.notes || ''} [Rejected: ${reason}]` : b.notes } : b))
    );
    addNotification({
      type: 'push',
      title: 'Booking Declined',
      body: `Job request declined. Status updated in your roster.`,
    });
  };

  // Provider: Start Work (Punch in)
  const startWork = (bookingId: string, location?: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    const loc = location || booking?.customerArea || 'Customer Verified GPS Location';
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setActiveJob({
      bookingId,
      startTime: Date.now(),
      formattedStartTime: formattedTime,
      location: loc,
    });

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'in_progress' } : b))
    );

    // Add attendance record in-progress
    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      providerId: currentProvider.id,
      bookingId,
      customerName: booking?.customerName || 'Customer',
      serviceCategory: booking?.category || 'maid',
      date: now.toISOString().split('T')[0],
      checkInTime: formattedTime,
      checkInLocation: `${loc} (GPS Match)`,
      status: 'in_progress',
      completedTasks: [],
      verifiedByCustomer: false,
    };

    setAttendanceRecords((prev) => [newRecord, ...prev]);

    addNotification({
      type: 'whatsapp',
      title: 'WhatsApp: Punch-In Verified 📍',
      body: `${currentProvider.name} punched in at ${formattedTime} at ${loc}. Customer notified!`,
      sender: 'MaidPro Attendance Bot',
    });
  };

  // Provider: End Work (Punch out)
  const endWork = (bookingId: string, completedTasks: string[], notes?: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    const now = new Date();
    const formattedEndTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setActiveJob(null);

    // Update booking status if one-time, or keep active recurring
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: b.bookingType === 'one_time' ? 'completed' : 'accepted',
          };
        }
        return b;
      })
    );

    // Update attendance record
    setAttendanceRecords((prev) =>
      prev.map((att) => {
        if (att.bookingId === bookingId && att.status === 'in_progress') {
          return {
            ...att,
            checkOutTime: formattedEndTime,
            status: 'completed',
            completedTasks,
            notes,
            verifiedByCustomer: true,
          };
        }
        return att;
      })
    );

    // Credit earnings
    if (booking) {
      const earned = booking.bookingType === 'one_time' ? booking.providerEarnings : Math.round(booking.providerEarnings / 26);
      setProviders((prev) =>
        prev.map((p) =>
          p.id === currentProvider.id
            ? {
                ...p,
                walletBalance: p.walletBalance + earned,
                totalJobsDone: p.totalJobsDone + 1,
              }
            : p
        )
      );

      const payment: PaymentRecord = {
        id: `pay-${Date.now()}`,
        providerId: currentProvider.id,
        bookingId,
        amount: earned,
        type: 'job_earning',
        paymentMethod: 'upi',
        status: 'completed',
        date: now.toISOString().split('T')[0],
        referenceId: `JOB-${Math.floor(100000 + Math.random() * 900000)}`,
        description: `Duty completed for ${booking.customerName} (${completedTasks.length} tasks marked)`,
      };
      setPaymentRecords((prev) => [payment, ...prev]);
    }

    try {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
    } catch {
      // safe fallback
    }

    addNotification({
      type: 'whatsapp',
      title: 'WhatsApp: Job Complete! 🎉',
      body: `Work ended at ${formattedEndTime}. Duties completed logged and payment updated.`,
      sender: 'MaidPro Bot',
    });
  };

  // Provider: Apply Leave
  const applyLeave = (leave: Omit<LeaveRequest, 'id' | 'providerId' | 'providerName' | 'status' | 'appliedAt' | 'affectedBookingsCount'>) => {
    const activeRecurringCount = bookings.filter(
      (b) => b.providerId === currentProvider.id && b.bookingType === 'recurring' && b.status !== 'cancelled'
    ).length;

    const newLeave: LeaveRequest = {
      ...leave,
      id: `leave-${Date.now()}`,
      providerId: currentProvider.id,
      providerName: currentProvider.name,
      status: 'pending',
      appliedAt: new Date().toISOString().split('T')[0],
      affectedBookingsCount: activeRecurringCount,
    };

    setLeaveRequests((prev) => [newLeave, ...prev]);

    addNotification({
      type: 'push',
      title: 'Leave Application Submitted',
      body: `Leave request for ${leave.startDate} to ${leave.endDate} submitted for admin review.`,
    });
  };

  // Provider: Request Payout
  const requestPayout = (amount: number, method: 'upi' | 'bank_transfer') => {
    if (amount <= 0 || amount > currentProvider.walletBalance) {
      return false;
    }

    setProviders((prev) =>
      prev.map((p) =>
        p.id === currentProvider.id
          ? { ...p, walletBalance: p.walletBalance - amount }
          : p
      )
    );

    const ref = `WTH-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const payout: PaymentRecord = {
      id: `pay-${Date.now()}`,
      providerId: currentProvider.id,
      amount,
      type: 'payout_withdrawal',
      paymentMethod: method,
      status: 'completed',
      date: new Date().toISOString().split('T')[0],
      referenceId: ref,
      description: `Withdrawn ₹${amount.toLocaleString()} to ${method.toUpperCase()} (${
        method === 'upi' ? currentProvider.bankDetails.upiId : currentProvider.bankDetails.accountNumber
      })`,
    };

    setPaymentRecords((prev) => [payout, ...prev]);

    try {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    } catch {
      // safe fallback
    }

    addNotification({
      type: 'whatsapp',
      title: 'WhatsApp: Withdrawal Sent 💸',
      body: `₹${amount.toLocaleString()} transferred to your ${method === 'upi' ? 'UPI' : 'Bank Account'}. Ref: ${ref}`,
      sender: 'MaidPro Finance',
    });

    return true;
  };

  // Provider: Update Profile
  const updateProviderProfile = (providerId: string, updates: Partial<Provider>) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, ...updates } : p))
    );
    addNotification({
      type: 'push',
      title: 'Profile Updated',
      body: 'Your service profile preferences have been successfully saved.',
    });
  };

  // Provider: Submit KYC
  const submitKYC = (providerId: string, kycUpdates: Partial<KYCData>) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id === providerId) {
          return {
            ...p,
            kyc: {
              ...p.kyc,
              ...kycUpdates,
              status: 'under_review',
              submittedAt: new Date().toISOString().split('T')[0],
            },
          };
        }
        return p;
      })
    );

    addNotification({
      type: 'push',
      title: 'KYC Documents Uploaded',
      body: 'Your documents are now under review by the MaidPro verification team.',
    });
  };

  // Provider: Toggle Availability
  const toggleProviderAvailability = (providerId: string) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id === providerId) {
          const newStatus = !p.schedule.isAvailable;
          return {
            ...p,
            schedule: { ...p.schedule, isAvailable: newStatus },
          };
        }
        return p;
      })
    );
  };

  // Provider: Add Emergency Contact
  const addEmergencyContact = (providerId: string, contact: Omit<EmergencyContact, 'id'>) => {
    const newContact: EmergencyContact = {
      ...contact,
      id: `em-${Date.now()}`,
    };
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId
          ? { ...p, emergencyContacts: [...p.emergencyContacts, newContact] }
          : p
      )
    );
  };

  // Provider: SOS Trigger
  const triggerSOS = (providerId: string) => {
    const provider = providers.find((p) => p.id === providerId) || currentProvider;
    setIsSOSModalOpen(true);
    addNotification({
      type: 'whatsapp',
      title: '🚨 EMERGENCY SOS ACTIVATED 🚨',
      body: `Emergency alert triggered for ${provider.name} (${provider.phone}). Live location broadcasted to Emergency Helpline & Contacts!`,
      sender: 'MaidPro Safety Desk',
    });
  };

  // Customer: Create Booking
  const createBooking = (bookingData: Partial<Booking>) => {
    const prov = providers.find((p) => p.id === bookingData.providerId) || currentProvider;
    const total = bookingData.totalAmount || (bookingData.bookingType === 'recurring' ? prov.rates.monthlyRecurring : prov.rates.perVisit);
    const commAmt = Math.round(total * commissionRate);
    const provEarn = total - commAmt;

    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      customerPhone: currentCustomer.phone,
      customerAddress: currentCustomer.address,
      customerArea: currentCustomer.area,
      providerId: prov.id,
      providerName: prov.name,
      category: bookingData.category || 'maid',
      specificTasks: bookingData.specificTasks || ['General domestic assistance'],
      bookingType: bookingData.bookingType || 'recurring',
      recurringFrequency: bookingData.recurringFrequency || 'daily',
      recurringDays: bookingData.recurringDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      recurringDurationMonths: bookingData.recurringDurationMonths || 1,
      startDate: bookingData.startDate || new Date().toISOString().split('T')[0],
      timeSlot: bookingData.timeSlot || '08:00 AM - 10:00 AM',
      totalAmount: total,
      commissionRate,
      commissionAmount: commAmt,
      providerEarnings: provEarn,
      status: 'pending',
      notes: bookingData.notes || '',
      audioNoteText: `New booking request from ${currentCustomer.name} in ${currentCustomer.area} for ${bookingData.category || 'maid'}.`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Send WhatsApp notification to provider
    addNotification({
      type: 'whatsapp',
      title: 'WhatsApp Alert 🟢',
      body: `New booking request from ${currentCustomer.name} (${currentCustomer.area}) for ${bookingData.category || 'service'}. Rate: ₹${total.toLocaleString()}`,
      sender: 'MaidPro Automated WhatsApp Bot',
    });

    try {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
    } catch {
      // safe fallback
    }
  };

  // Customer: Add Review
  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setReviews((prev) => [newReview, ...prev]);

    // Recalculate provider rating
    const provReviews = [...reviews.filter((r) => r.providerId === reviewData.providerId), newReview];
    const avgRating = provReviews.reduce((sum, r) => sum + r.rating, 0) / provReviews.length;

    setProviders((prev) =>
      prev.map((p) =>
        p.id === reviewData.providerId
          ? {
              ...p,
              rating: Number(avgRating.toFixed(2)),
              reviewCount: provReviews.length,
            }
          : p
      )
    );

    addNotification({
      type: 'push',
      title: 'New Customer Review Received',
      body: `${reviewData.customerName} left a ${reviewData.rating}-star review!`,
    });
  };

  // Admin: Verify KYC
  const verifyKYC = (providerId: string, status: 'verified' | 'rejected' | 'under_review', remarks: string) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id === providerId) {
          return {
            ...p,
            kyc: {
              ...p.kyc,
              status,
              adminRemarks: remarks,
              verifiedAt: status === 'verified' ? new Date().toISOString().split('T')[0] : undefined,
            },
          };
        }
        return p;
      })
    );

    addNotification({
      type: 'whatsapp',
      title: status === 'verified' ? 'KYC Approved! 🛡️' : 'KYC Document Action Needed',
      body: `Admin marked your KYC as ${status.toUpperCase()}. ${remarks}`,
      sender: 'MaidPro Verification Team',
    });
  };

  // Admin: Update commission
  const updateCommissionRate = (rate: number) => {
    setCommissionRate(rate);
  };

  // Admin: Resolve complaint
  const resolveComplaint = (complaintId: string, notes: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? { ...c, status: 'resolved', resolutionNotes: notes }
          : c
      )
    );
  };

  // Admin: Toggle service area
  const toggleServiceArea = (areaId: string) => {
    setServiceAreas((prev) =>
      prev.map((a) =>
        a.id === areaId ? { ...a, isAvailable: !a.isAvailable } : a
      )
    );
  };

  // Admin: Approve Leave
  const approveLeave = (leaveId: string, remarks?: string) => {
    setLeaveRequests((prev) =>
      prev.map((l) =>
        l.id === leaveId
          ? { ...l, status: 'approved', adminRemarks: remarks || 'Approved by administrator' }
          : l
      )
    );
    addNotification({
      type: 'push',
      title: 'Leave Request Approved ✅',
      body: `Your leave has been approved by the admin. Assigned customers have been alerted.`,
    });
  };

  // Admin: Reject Leave
  const rejectLeave = (leaveId: string, remarks?: string) => {
    setLeaveRequests((prev) =>
      prev.map((l) =>
        l.id === leaveId
          ? { ...l, status: 'rejected', adminRemarks: remarks || 'Declined due to peak shift demand' }
          : l
      )
    );
  };

  // Admin: Disburse all pending payouts
  const disburseAllPendingPayouts = () => {
    const totalPending = providers.reduce((sum, p) => sum + p.walletBalance, 0);
    setProviders((prev) =>
      prev.map((p) => ({
        ...p,
        walletBalance: 0,
      }))
    );
    try {
      confetti({ particleCount: 100, spread: 100, origin: { y: 0.4 } });
    } catch {
      // safe fallback
    }
    addNotification({
      type: 'push',
      title: 'Batch Salaries & Payouts Disbursed 💰',
      body: `Total ₹${totalPending.toLocaleString()} transferred to all registered provider bank accounts!`,
    });
  };

  const t = translations[language] || translations.en;

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        t,
        selectedProviderId,
        setSelectedProviderId,
        currentProvider,
        selectedCustomerId,
        setSelectedCustomerId,
        currentCustomer,
        providers,
        customers,
        bookings,
        attendanceRecords,
        leaveRequests,
        paymentRecords,
        reviews,
        complaints,
        serviceAreas,
        notifications,
        commissionRate,
        activeJob,
        activeJobElapsed,
        isSpeaking,
        speakingText,
        speakText,
        stopSpeech,
        acceptBooking,
        rejectBooking,
        startWork,
        endWork,
        applyLeave,
        requestPayout,
        updateProviderProfile,
        submitKYC,
        toggleProviderAvailability,
        addEmergencyContact,
        triggerSOS,
        createBooking,
        addReview,
        verifyKYC,
        updateCommissionRate,
        resolveComplaint,
        toggleServiceArea,
        approveLeave,
        rejectLeave,
        disburseAllPendingPayouts,
        markNotificationRead,
        addNotification,
        isSOSModalOpen,
        setIsSOSModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
