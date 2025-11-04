// Type Definitions for Megapro Innovation SFA

export interface GeoLocation {
  lat: number;
  lng: number;
  address?: string;
  timestamp?: number;
  accuracy?: number;
}

export type UserRole = 'mr' | 'manager' | 'admin';

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  taskId: string;
  title: string;
  description: string;
  assignedTo: string; // userId
  assignedToName: string;
  assignedToRole: UserRole;
  assignedBy: string; // userId (admin)
  assignedByName: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: number; // timestamp
  createdAt: number;
  completedAt?: number;
  notes?: string;
  relatedDoctorId?: string; // Optional: Link to doctor
  targetAmount?: number; // Optional: Target POB/Collection
}

export interface User {
  userId: string;
  name: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  linkedManagerId?: string; // For MRs only
  isActive: boolean;
  createdAt: number;
}

export interface Doctor {
  doctorId: string;
  name: string;
  specialty: string;
  clinic?: string;
  location?: GeoLocation;
  assignedMrId: string;
  assignedMRId?: string; // Backward compatibility (capital R)
  assignedMRName?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
}

export interface Visit {
  visitId: string;
  mrId: string;
  mrName: string;
  doctorId: string;
  doctorName: string;
  checkInTimestamp: number;
  checkInLocation: GeoLocation;
  checkOutTimestamp?: number;
  checkOutLocation?: GeoLocation;
  pobAmount: number;
  collectionAmount: number;
  giftDistributed: boolean;
  productsDiscussed: string[];
  notes?: string;
  status: 'active' | 'completed';
  duration?: number; // in minutes
}

export type ExpenseStatus = 'pending' | 'approved' | 'rejected';

export interface AIValidationData {
  confidence: number; // 0-100
  level: 'HIGH' | 'MEDIUM' | 'LOW';
  action: 'AUTO_APPROVE' | 'MANUAL_REVIEW' | 'FLAG_REJECT';
  flags: string[];
  timestamp: number;
  details?: {
    imageQuality?: number;
    isEdited?: boolean;
    isScreenshot?: boolean;
    isDuplicate?: boolean;
  };
}

export interface Expense {
  expenseId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  date: number;
  distanceKm: number;
  isOutstation: boolean;
  isNightStay: boolean;
  hotelBillAmount: number;
  billProofUrl?: string;
  bikeMeterStart?: number; // Start meter reading (for outstation)
  bikeMeterEnd?: number; // End meter reading (for outstation)
  bikeMeterStartPhotoUrl?: string; // Photo of start meter
  bikeMeterEndPhotoUrl?: string; // Photo of end meter
  calculatedDA: number;
  calculatedTA: number;
  totalExpense: number;
  status: ExpenseStatus;
  approvedByManagerId?: string;
  approvedByManagerName?: string;
  rejectionReason?: string;
  submittedAt: number;
  processedAt?: number;
  // AI Fraud Detection
  aiRiskScore?: number;
  odometerValidation?: AIValidationData; // AI validation for odometer photo
  billValidation?: AIValidationData; // AI validation for hotel bill
  aiRiskFlag?: boolean;
  // Manager-specific fields
  isJointWork?: boolean; // For managers working with MR
  jointWorkMRId?: string; // Which MR was working with (optional)
  jointWorkMRName?: string; // MR name for display
}

export interface AppSettings {
  mr_da_local: number;
  mr_da_outstation: number;
  manager_da_solo: number;
  manager_da_joint: number;
  ta_per_km: number;
  mr_hotel_limit: number;
  manager_hotel_limit: number;
  outstation_ta_cap: number;
  outstation_distance_threshold: number; // e.g., 30 km
  expense_entry_start_hour: number; // e.g., 20 (8 PM)
  companyLogo?: string;
}

export type TourPlanStatus = 'pending' | 'approved' | 'rejected';

export interface TourPlan {
  tourPlanId: string;
  mrId: string;
  mrName: string;
  date: number;
  locations: string[];
  doctorsToVisit: string[];
  expectedDistance: number;
  status: TourPlanStatus;
  approvedByManagerId?: string;
  approvedByManagerName?: string;
  createdAt: number;
  processedAt?: number;
}

export interface Product {
  productId: string;
  name: string;
  description?: string;
  price?: number;
  isActive: boolean;
}

export interface OutstandingPayment {
  paymentId: string;
  doctorId: string;
  doctorName: string;
  amount: number;
  dueDate: number;
  isPaid: boolean;
  paidDate?: number;
  notes?: string;
}

export interface DashboardStats {
  totalVisits: number;
  totalPOB: number;
  totalCollection: number;
  activeVisits: number;
  pendingExpenses: number;
  approvedExpenses: number;
  totalExpenses: number;
}

export interface MRLocation {
  mrId: string;
  mrName: string;
  location: GeoLocation;
  status: 'idle' | 'in_visit' | 'offline';
  currentDoctorName?: string;
  lastUpdate: number;
}
