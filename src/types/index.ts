export type UserRole = 'provider' | 'customer' | 'admin';

export type Language = 'en' | 'hi' | 'hinglish';

export type ServiceCategory = 'maid' | 'cook' | 'babysitter' | 'elderly_care' | 'helper';

export type BookingType = 'one_time' | 'recurring';

export type RecurringFrequency = 'daily' | 'weekly' | 'monthly';

export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';

export type KYCStatus = 'verified' | 'under_review' | 'pending' | 'rejected';

export type AttendanceStatus = 'present' | 'in_progress' | 'completed' | 'late' | 'leave';

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export type LeaveType = 'sick' | 'personal' | 'festival' | 'emergency';

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

export interface BankDetails {
  accountHolder: string;
  accountNumber: string;
  ifscOrRouting: string;
  upiId: string;
  bankName: string;
}

export interface KYCData {
  status: KYCStatus;
  idType: 'Aadhaar Card' | 'Voter ID' | 'Driving License' | 'Passport';
  idNumber: string;
  idFrontUrl?: string;
  idBackUrl?: string;
  policeVerificationDone: boolean;
  addressProofVerified: boolean;
  submittedAt?: string;
  verifiedAt?: string;
  adminRemarks?: string;
}

export interface ProviderRates {
  hourly: number; // e.g. ₹150
  perVisit: number; // e.g. ₹350
  monthlyRecurring: number; // e.g. ₹6,500
}

export interface ProviderSchedule {
  days: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[];
  dailySlots: { id: string; start: string; end: string; label: string }[];
  isAvailable: boolean;
}

export interface Provider {
  id: string;
  name: string;
  gender: 'Female' | 'Male' | 'Other';
  age: number;
  phone: string;
  photo: string;
  rating: number;
  reviewCount: number;
  categories: ServiceCategory[];
  experienceYears: number;
  skills: string[];
  languagesSpoken: string[];
  preferredHours: ('morning' | 'afternoon' | 'evening' | 'full_day' | 'live_in')[];
  preferredLocations: string[];
  schedule: ProviderSchedule;
  rates: ProviderRates;
  kyc: KYCData;
  emergencyContacts: EmergencyContact[];
  walletBalance: number;
  cashCollected: number;
  bankDetails: BankDetails;
  totalJobsDone: number;
  bio?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  area: string;
  city: string;
  familyMembers: string;
  pets: boolean;
  photo?: string;
  totalSpent: number;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerArea: string;
  providerId: string;
  providerName: string;
  category: ServiceCategory;
  specificTasks: string[];
  bookingType: BookingType;
  recurringFrequency?: RecurringFrequency;
  recurringDays?: string[];
  recurringDurationMonths?: number;
  startDate: string;
  endDate?: string;
  timeSlot: string; // e.g. "07:30 AM - 09:30 AM"
  totalAmount: number;
  commissionRate: number; // e.g. 0.10 (10%)
  commissionAmount: number;
  providerEarnings: number;
  status: BookingStatus;
  notes?: string;
  audioNoteText?: string;
  customerRating?: number;
  customerReview?: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  providerId: string;
  bookingId: string;
  customerName: string;
  serviceCategory: ServiceCategory;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  checkInLocation?: string;
  status: AttendanceStatus;
  completedTasks: string[];
  photoProofUrl?: string;
  notes?: string;
  verifiedByCustomer?: boolean;
}

export interface LeaveRequest {
  id: string;
  providerId: string;
  providerName: string;
  startDate: string;
  endDate: string;
  leaveType: LeaveType;
  reason: string;
  status: LeaveStatus;
  appliedAt: string;
  affectedBookingsCount: number;
  adminRemarks?: string;
}

export interface PaymentRecord {
  id: string;
  providerId: string;
  bookingId?: string;
  amount: number;
  type: 'job_earning' | 'payout_withdrawal' | 'cash_settlement' | 'bonus';
  paymentMethod: 'upi' | 'bank_transfer' | 'cash';
  status: 'completed' | 'processing' | 'pending';
  date: string;
  referenceId: string;
  description: string;
}

export interface Review {
  id: string;
  providerId: string;
  customerId: string;
  customerName: string;
  rating: number;
  date: string;
  comment: string;
  tags: string[];
  category: ServiceCategory;
}

export interface Complaint {
  id: string;
  bookingId?: string;
  raisedBy: 'customer' | 'provider';
  raisedByName: string;
  targetName: string;
  category: 'punctuality' | 'quality' | 'behavior' | 'payment' | 'other';
  description: string;
  status: 'open' | 'investigating' | 'resolved';
  resolutionNotes?: string;
  createdAt: string;
}

export interface ServiceArea {
  id: string;
  name: string;
  city: string;
  activeProvidersCount: number;
  baseRateMultiplier: number;
  isAvailable: boolean;
}

export interface NotificationMessage {
  id: string;
  type: 'whatsapp' | 'push' | 'system';
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  sender?: string;
}
