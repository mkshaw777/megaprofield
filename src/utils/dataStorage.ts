// Centralized Data Storage - Complete SFA Backend Logic
// Structured for easy migration to Supabase

import {
  User,
  Doctor,
  Visit,
  Expense,
  TourPlan,
  Product,
  OutstandingPayment,
  AppSettings,
  MRLocation,
  DashboardStats,
  GeoLocation,
  UserRole,
  ExpenseStatus,
  TourPlanStatus,
  Task,
  TaskStatus,
  TaskPriority,
} from './types';

// ==================== STORAGE KEYS ====================

const USERS_KEY = 'megapro_users';
const DOCTORS_KEY = 'megapro_doctors';
const VISITS_KEY = 'megapro_visits';
const EXPENSES_KEY = 'megapro_expenses';
const TOUR_PLANS_KEY = 'megapro_tour_plans';
const PRODUCTS_KEY = 'megapro_products';
const OUTSTANDING_KEY = 'megapro_outstanding';
const SETTINGS_KEY = 'megapro_settings';
const ACTIVE_VISITS_KEY = 'megapro_active_visits';
const TASKS_KEY = 'megapro_tasks';

// ==================== DEFAULT APP SETTINGS ====================

const DEFAULT_SETTINGS: AppSettings = {
  mr_da_local: 100,
  mr_da_outstation: 100,
  manager_da_solo: 200,
  manager_da_joint: 500,
  ta_per_km: 2.5,
  mr_hotel_limit: 500,
  manager_hotel_limit: 700,
  outstation_ta_cap: 500,
  outstation_distance_threshold: 30,
  expense_entry_start_hour: 20, // 8 PM
  companyLogo: undefined,
};

// ==================== HELPER FUNCTIONS ====================

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  const stored = localStorage.getItem(key);
  if (!stored) return defaultValue;
  try {
    return JSON.parse(stored);
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ==================== USER MANAGEMENT ====================

export const getAllUsers = (): User[] => {
  return getItem<User[]>(USERS_KEY, []);
};

export const getUserById = (userId: string): User | undefined => {
  const users = getAllUsers();
  return users.find(u => u.userId === userId);
};

export const getUserByUsername = (username: string): User | undefined => {
  const users = getAllUsers();
  return users.find(u => u.username === username);
};

export const createUser = (user: Omit<User, 'userId' | 'createdAt'>): User => {
  const users = getAllUsers();
  const newUser: User = {
    ...user,
    userId: generateId(),
    createdAt: Date.now(),
  };
  users.push(newUser);
  setItem(USERS_KEY, users);
  return newUser;
};

export const updateUser = (userId: string, updates: Partial<User>): User | null => {
  const users = getAllUsers();
  const index = users.findIndex(u => u.userId === userId);
  if (index === -1) return null;
  
  users[index] = { ...users[index], ...updates };
  setItem(USERS_KEY, users);
  return users[index];
};

export const deleteUser = (userId: string): boolean => {
  const users = getAllUsers();
  const filtered = users.filter(u => u.userId !== userId);
  if (filtered.length === users.length) return false;
  setItem(USERS_KEY, filtered);
  return true;
};

export const getUsersByRole = (role: UserRole): User[] => {
  const users = getAllUsers();
  return users.filter(u => u.role === role && u.isActive);
};

export const getMRsByManager = (managerId: string): User[] => {
  const users = getAllUsers();
  return users.filter(u => u.role === 'mr' && u.linkedManagerId === managerId && u.isActive);
};

// ==================== DOCTOR MANAGEMENT ====================

export const getAllDoctors = (): Doctor[] => {
  return getItem<Doctor[]>(DOCTORS_KEY, []);
};

export const getDoctorById = (doctorId: string): Doctor | undefined => {
  const doctors = getAllDoctors();
  return doctors.find(d => d.doctorId === doctorId);
};

export const getDoctorsByMR = (mrId: string): Doctor[] => {
  const doctors = getAllDoctors();
  return doctors.filter(d => d.assignedMrId === mrId && d.isActive);
};

export const getDoctorsByManager = (managerId: string): Doctor[] => {
  // Get all MRs under this manager
  const mrs = getMRsByManager(managerId);
  const mrIds = mrs.map(mr => mr.userId);
  
  // Get all doctors assigned to these MRs
  const doctors = getAllDoctors();
  return doctors.filter(d => mrIds.includes(d.assignedMrId) && d.isActive);
};

export const createDoctor = (doctor: Omit<Doctor, 'doctorId'>): Doctor => {
  const doctors = getAllDoctors();
  const newDoctor: Doctor = {
    ...doctor,
    doctorId: generateId(),
  };
  doctors.push(newDoctor);
  setItem(DOCTORS_KEY, doctors);
  return newDoctor;
};

export const updateDoctor = (doctorId: string, updates: Partial<Doctor>): Doctor | null => {
  const doctors = getAllDoctors();
  const index = doctors.findIndex(d => d.doctorId === doctorId);
  if (index === -1) return null;
  
  doctors[index] = { ...doctors[index], ...updates };
  setItem(DOCTORS_KEY, doctors);
  return doctors[index];
};

export const deleteDoctor = (doctorId: string): boolean => {
  const doctors = getAllDoctors();
  const filtered = doctors.filter(d => d.doctorId !== doctorId);
  if (filtered.length === doctors.length) return false;
  setItem(DOCTORS_KEY, filtered);
  return true;
};

export const bulkCreateDoctors = (doctors: Omit<Doctor, 'doctorId'>[]): Doctor[] => {
  const existingDoctors = getAllDoctors();
  const newDoctors: Doctor[] = doctors.map(d => ({
    ...d,
    doctorId: generateId(),
  }));
  const allDoctors = [...existingDoctors, ...newDoctors];
  setItem(DOCTORS_KEY, allDoctors);
  return newDoctors;
};

// ==================== VISIT MANAGEMENT ====================

export const getAllVisits = (): Visit[] => {
  return getItem<Visit[]>(VISITS_KEY, []);
};

export const getVisitById = (visitId: string): Visit | undefined => {
  const visits = getAllVisits();
  return visits.find(v => v.visitId === visitId);
};

export const getVisitsByMR = (mrId: string): Visit[] => {
  const visits = getAllVisits();
  return visits.filter(v => v.mrId === mrId);
};

export const getVisitsByDoctor = (doctorId: string): Visit[] => {
  const visits = getAllVisits();
  return visits.filter(v => v.doctorId === doctorId);
};

export const getActiveVisitByMR = (mrId: string): Visit | undefined => {
  const visits = getAllVisits();
  return visits.find(v => v.mrId === mrId && v.status === 'active');
};

export const checkInVisit = (visit: Omit<Visit, 'visitId' | 'status'>): Visit => {
  const visits = getAllVisits();
  
  // Check if MR already has an active visit
  const activeVisit = visits.find(v => v.mrId === visit.mrId && v.status === 'active');
  if (activeVisit) {
    throw new Error('You already have an active visit. Please check-out first.');
  }
  
  const newVisit: Visit = {
    ...visit,
    visitId: generateId(),
    status: 'active',
    pobAmount: 0,
    collectionAmount: 0,
    giftDistributed: false,
    productsDiscussed: [],
  };
  
  visits.push(newVisit);
  setItem(VISITS_KEY, visits);
  return newVisit;
};

export const checkOutVisit = (
  visitId: string,
  checkOutData: {
    checkOutLocation: GeoLocation;
    pobAmount?: number;
    collectionAmount?: number;
    giftDistributed?: boolean;
    productsDiscussed?: string[];
    notes?: string;
  }
): Visit | null => {
  const visits = getAllVisits();
  const index = visits.findIndex(v => v.visitId === visitId);
  if (index === -1) return null;
  
  const visit = visits[index];
  const checkOutTimestamp = Date.now();
  const duration = Math.floor((checkOutTimestamp - visit.checkInTimestamp) / 1000 / 60); // minutes
  
  visits[index] = {
    ...visit,
    ...checkOutData,
    checkOutTimestamp,
    duration,
    status: 'completed',
  };
  
  setItem(VISITS_KEY, visits);
  return visits[index];
};

export const updateVisit = (visitId: string, updates: Partial<Visit>): Visit | null => {
  const visits = getAllVisits();
  const index = visits.findIndex(v => v.visitId === visitId);
  if (index === -1) return null;
  
  visits[index] = { ...visits[index], ...updates };
  setItem(VISITS_KEY, visits);
  return visits[index];
};

export const getTodayVisits = (mrId?: string): Visit[] => {
  const visits = getAllVisits();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();
  
  return visits.filter(v => {
    const visitDate = new Date(v.checkInTimestamp);
    visitDate.setHours(0, 0, 0, 0);
    const matchesDate = visitDate.getTime() === todayTimestamp;
    const matchesMR = mrId ? v.mrId === mrId : true;
    return matchesDate && matchesMR;
  });
};

export const getVisitsByDateRange = (startDate: number, endDate: number, mrId?: string): Visit[] => {
  const visits = getAllVisits();
  return visits.filter(v => {
    const matchesDate = v.checkInTimestamp >= startDate && v.checkInTimestamp <= endDate;
    const matchesMR = mrId ? v.mrId === mrId : true;
    return matchesDate && matchesMR;
  });
};

// ==================== EXPENSE MANAGEMENT ====================

export const getAllExpenses = (): Expense[] => {
  return getItem<Expense[]>(EXPENSES_KEY, []);
};

export const getExpenseById = (expenseId: string): Expense | undefined => {
  const expenses = getAllExpenses();
  return expenses.find(e => e.expenseId === expenseId);
};

export const getExpensesByUser = (userId: string): Expense[] => {
  const expenses = getAllExpenses();
  return expenses.filter(e => e.userId === userId);
};

export const getPendingExpenses = (managerId?: string): Expense[] => {
  const expenses = getAllExpenses();
  let pending = expenses.filter(e => e.status === 'pending');
  
  if (managerId) {
    // Filter expenses for MRs under this manager
    const mrs = getMRsByManager(managerId);
    const mrIds = mrs.map(mr => mr.userId);
    pending = pending.filter(e => mrIds.includes(e.userId));
  }
  
  return pending;
};

export const createExpense = (expense: Omit<Expense, 'expenseId' | 'submittedAt'>): Expense => {
  const expenses = getAllExpenses();
  const newExpense: Expense = {
    ...expense,
    expenseId: generateId(),
    submittedAt: Date.now(),
  };
  expenses.push(newExpense);
  setItem(EXPENSES_KEY, expenses);
  return newExpense;
};

export const updateExpenseStatus = (
  expenseId: string,
  status: ExpenseStatus,
  managerId?: string,
  managerName?: string,
  rejectionReason?: string
): Expense | null => {
  const expenses = getAllExpenses();
  const index = expenses.findIndex(e => e.expenseId === expenseId);
  if (index === -1) return null;
  
  expenses[index] = {
    ...expenses[index],
    status,
    approvedByManagerId: managerId,
    approvedByManagerName: managerName,
    rejectionReason,
    processedAt: Date.now(),
  };
  
  setItem(EXPENSES_KEY, expenses);
  return expenses[index];
};

export const updateExpense = (
  expenseId: string,
  updates: Partial<Expense>
): Expense | null => {
  const expenses = getAllExpenses();
  const index = expenses.findIndex(e => e.expenseId === expenseId);
  if (index === -1) return null;
  
  expenses[index] = {
    ...expenses[index],
    ...updates,
  };
  
  setItem(EXPENSES_KEY, expenses);
  return expenses[index];
};

export const updateExpenseAIFlags = (
  expenseId: string,
  aiRiskScore: number,
  aiRiskFlag: boolean
): Expense | null => {
  const expenses = getAllExpenses();
  const index = expenses.findIndex(e => e.expenseId === expenseId);
  if (index === -1) return null;
  
  expenses[index] = {
    ...expenses[index],
    aiRiskScore,
    aiRiskFlag,
  };
  
  setItem(EXPENSES_KEY, expenses);
  return expenses[index];
};

export const getExpensesByDateRange = (startDate: number, endDate: number, userId?: string): Expense[] => {
  const expenses = getAllExpenses();
  return expenses.filter(e => {
    const matchesDate = e.date >= startDate && e.date <= endDate;
    const matchesUser = userId ? e.userId === userId : true;
    return matchesDate && matchesUser;
  });
};

export const getFlaggedExpenses = (): Expense[] => {
  const expenses = getAllExpenses();
  return expenses.filter(e => e.aiRiskFlag === true);
};

// ==================== TOUR PLAN MANAGEMENT ====================

export const getAllTourPlans = (): TourPlan[] => {
  return getItem<TourPlan[]>(TOUR_PLANS_KEY, []);
};

export const getTourPlanById = (tourPlanId: string): TourPlan | undefined => {
  const plans = getAllTourPlans();
  return plans.find(p => p.tourPlanId === tourPlanId);
};

export const getTourPlansByMR = (mrId: string): TourPlan[] => {
  const plans = getAllTourPlans();
  return plans.filter(p => p.mrId === mrId);
};

export const getPendingTourPlans = (managerId?: string): TourPlan[] => {
  const plans = getAllTourPlans();
  let pending = plans.filter(p => p.status === 'pending');
  
  if (managerId) {
    const mrs = getMRsByManager(managerId);
    const mrIds = mrs.map(mr => mr.userId);
    pending = pending.filter(p => mrIds.includes(p.mrId));
  }
  
  return pending;
};

export const createTourPlan = (plan: Omit<TourPlan, 'tourPlanId' | 'createdAt'>): TourPlan => {
  const plans = getAllTourPlans();
  const newPlan: TourPlan = {
    ...plan,
    tourPlanId: generateId(),
    createdAt: Date.now(),
  };
  plans.push(newPlan);
  setItem(TOUR_PLANS_KEY, plans);
  return newPlan;
};

export const updateTourPlanStatus = (
  tourPlanId: string,
  status: TourPlanStatus,
  managerId?: string,
  managerName?: string
): TourPlan | null => {
  const plans = getAllTourPlans();
  const index = plans.findIndex(p => p.tourPlanId === tourPlanId);
  if (index === -1) return null;
  
  plans[index] = {
    ...plans[index],
    status,
    approvedByManagerId: managerId,
    approvedByManagerName: managerName,
    processedAt: Date.now(),
  };
  
  setItem(TOUR_PLANS_KEY, plans);
  return plans[index];
};

// ==================== PRODUCT MANAGEMENT ====================

export const getAllProducts = (): Product[] => {
  return getItem<Product[]>(PRODUCTS_KEY, []);
};

export const getActiveProducts = (): Product[] => {
  const products = getAllProducts();
  return products.filter(p => p.isActive);
};

export const createProduct = (product: Omit<Product, 'productId'>): Product => {
  const products = getAllProducts();
  const newProduct: Product = {
    ...product,
    productId: generateId(),
  };
  products.push(newProduct);
  setItem(PRODUCTS_KEY, products);
  return newProduct;
};

export const updateProduct = (productId: string, updates: Partial<Product>): Product | null => {
  const products = getAllProducts();
  const index = products.findIndex(p => p.productId === productId);
  if (index === -1) return null;
  
  products[index] = { ...products[index], ...updates };
  setItem(PRODUCTS_KEY, products);
  return products[index];
};

export const bulkCreateProducts = (products: Omit<Product, 'productId'>[]): Product[] => {
  const existingProducts = getAllProducts();
  const newProducts: Product[] = products.map(p => ({
    ...p,
    productId: generateId(),
  }));
  const allProducts = [...existingProducts, ...newProducts];
  setItem(PRODUCTS_KEY, allProducts);
  return newProducts;
};

// ==================== OUTSTANDING PAYMENTS ====================

export const getAllOutstandingPayments = (): OutstandingPayment[] => {
  return getItem<OutstandingPayment[]>(OUTSTANDING_KEY, []);
};

export const createOutstandingPayment = (payment: Omit<OutstandingPayment, 'paymentId'>): OutstandingPayment => {
  const payments = getAllOutstandingPayments();
  const newPayment: OutstandingPayment = {
    ...payment,
    paymentId: generateId(),
  };
  payments.push(newPayment);
  setItem(OUTSTANDING_KEY, payments);
  return newPayment;
};

export const markPaymentPaid = (paymentId: string): OutstandingPayment | null => {
  const payments = getAllOutstandingPayments();
  const index = payments.findIndex(p => p.paymentId === paymentId);
  if (index === -1) return null;
  
  payments[index] = {
    ...payments[index],
    isPaid: true,
    paidDate: Date.now(),
  };
  
  setItem(OUTSTANDING_KEY, payments);
  return payments[index];
};

export const bulkCreateOutstandingPayments = (payments: Omit<OutstandingPayment, 'paymentId'>[]): OutstandingPayment[] => {
  const existingPayments = getAllOutstandingPayments();
  const newPayments: OutstandingPayment[] = payments.map(p => ({
    ...p,
    paymentId: generateId(),
  }));
  const allPayments = [...existingPayments, ...newPayments];
  setItem(OUTSTANDING_KEY, allPayments);
  return newPayments;
};

// ==================== APP SETTINGS ====================

export const getAppSettings = (): AppSettings => {
  return getItem<AppSettings>(SETTINGS_KEY, DEFAULT_SETTINGS);
};

export const updateAppSettings = (updates: Partial<AppSettings>): AppSettings => {
  const settings = getAppSettings();
  const newSettings = { ...settings, ...updates };
  setItem(SETTINGS_KEY, newSettings);
  return newSettings;
};

export const resetAppSettings = (): AppSettings => {
  setItem(SETTINGS_KEY, DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
};

// ==================== MR LIVE TRACKING ====================

export const getMRLocations = (managerId?: string): MRLocation[] => {
  const visits = getAllVisits();
  let mrs = getUsersByRole('mr');
  
  if (managerId) {
    mrs = getMRsByManager(managerId);
  }
  
  const locations: MRLocation[] = mrs.map(mr => {
    const activeVisit = visits.find(v => v.mrId === mr.userId && v.status === 'active');
    const todayVisits = getTodayVisits(mr.userId);
    
    if (activeVisit) {
      return {
        mrId: mr.userId,
        mrName: mr.name,
        location: activeVisit.checkInLocation,
        status: 'in_visit',
        currentDoctorName: activeVisit.doctorName,
        lastUpdate: activeVisit.checkInTimestamp,
      };
    } else if (todayVisits.length > 0) {
      const lastVisit = todayVisits[todayVisits.length - 1];
      return {
        mrId: mr.userId,
        mrName: mr.name,
        location: lastVisit.checkOutLocation || lastVisit.checkInLocation,
        status: 'idle',
        lastUpdate: lastVisit.checkOutTimestamp || lastVisit.checkInTimestamp,
      };
    } else {
      return {
        mrId: mr.userId,
        mrName: mr.name,
        location: { lat: 0, lng: 0, address: 'No location data' },
        status: 'offline',
        lastUpdate: Date.now(),
      };
    }
  });
  
  return locations;
};

// ==================== DASHBOARD STATS ====================

export const getDashboardStats = (userId?: string, userRole?: UserRole): DashboardStats => {
  let visits = getAllVisits();
  let expenses = getAllExpenses();
  
  if (userId && userRole === 'mr') {
    visits = visits.filter(v => v.mrId === userId);
    expenses = expenses.filter(e => e.userId === userId);
  } else if (userId && userRole === 'manager') {
    const mrs = getMRsByManager(userId);
    const mrIds = mrs.map(mr => mr.userId);
    visits = visits.filter(v => mrIds.includes(v.mrId));
    expenses = expenses.filter(e => mrIds.includes(e.userId));
  }
  
  const totalVisits = visits.length;
  const totalPOB = visits.reduce((sum, v) => sum + v.pobAmount, 0);
  const totalCollection = visits.reduce((sum, v) => sum + v.collectionAmount, 0);
  const activeVisits = visits.filter(v => v.status === 'active').length;
  const pendingExpenses = expenses.filter(e => e.status === 'pending').length;
  const approvedExpenses = expenses.filter(e => e.status === 'approved').length;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.totalExpense, 0);
  
  return {
    totalVisits,
    totalPOB,
    totalCollection,
    activeVisits,
    pendingExpenses,
    approvedExpenses,
    totalExpenses,
  };
};

// ==================== UTILITY FUNCTIONS ====================

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

export const formatDate = (timestamp: number): string => {
  const d = new Date(timestamp);
  return d.toLocaleDateString('en-IN', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
};

export const formatTime = (timestamp: number): string => {
  const d = new Date(timestamp);
  return d.toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

export const formatDateTime = (timestamp: number): string => {
  return `${formatDate(timestamp)} ${formatTime(timestamp)}`;
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

// ==================== INITIALIZATION ====================

export const initializeSampleData = (): void => {
  // Check if already initialized
  const users = getAllUsers();
  if (users.length > 0) return;
  
  console.log('Initializing sample data...');
  
  // Create sample products
  const sampleProducts: Omit<Product, 'productId'>[] = [
    { name: 'Medicine A', description: 'Pain Relief', price: 250, isActive: true },
    { name: 'Medicine B', description: 'Antibiotic', price: 450, isActive: true },
    { name: 'Medicine C', description: 'Vitamin Supplement', price: 180, isActive: true },
    { name: 'Medicine D', description: 'Blood Pressure', price: 320, isActive: true },
  ];
  
  bulkCreateProducts(sampleProducts);
  
  console.log('Sample data initialized');
};

// ==================== LEGACY COMPATIBILITY ====================
// Functions for backward compatibility with existing components

export interface POBProduct {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  rate: number;
  total: number;
}

export interface DoctorVisit {
  id: string;
  mrId: number;
  mrName: string;
  mrUsername: string;
  doctorName: string;
  specialty: string;
  startTime: string;
  endTime: string;
  duration: number;
  stockist?: string;
  pobProducts: POBProduct[];
  totalPOB: number;
  collectionAmount: number;
  giftName?: string;
  giftQuantity?: string;
  date: string;
  location?: string;
}

export interface MRPerformance {
  mrId: string; // Changed from number to string for unique userId
  mrName: string;
  mrUsername: string;
  visits: number;
  totalPOB: number;
  totalCollection: number;
  totalOutstanding: number;
  totalExpenses: number;
  pendingExpenses: number;
  status: 'active' | 'offline';
}

// Legacy saveVisit function
export function saveVisit(visit: DoctorVisit): void {
  // Convert legacy format to new format
  const users = getAllUsers();
  const mrUser = users.find(u => u.username === visit.mrUsername && u.role === 'mr');
  
  if (!mrUser) {
    console.error('MR user not found');
    return;
  }

  // Find or create doctor
  const doctors = getAllDoctors();
  let doctor = doctors.find(d => d.name === visit.doctorName);
  
  if (!doctor) {
    doctor = createDoctor({
      name: visit.doctorName,
      specialty: visit.specialty,
      assignedMrId: mrUser.userId,
      isActive: true,
    });
  }

  // Create visit in new format
  const newVisit: Omit<Visit, 'visitId' | 'status'> = {
    mrId: mrUser.userId,
    mrName: mrUser.name,
    doctorId: doctor.doctorId,
    doctorName: visit.doctorName,
    checkInTimestamp: new Date(visit.startTime).getTime(),
    checkInLocation: {
      lat: 0,
      lng: 0,
      address: visit.location || 'Unknown',
    },
    checkOutTimestamp: new Date(visit.endTime).getTime(),
    checkOutLocation: {
      lat: 0,
      lng: 0,
      address: visit.location || 'Unknown',
    },
    pobAmount: visit.totalPOB,
    collectionAmount: visit.collectionAmount,
    giftDistributed: !!visit.giftName,
    productsDiscussed: visit.pobProducts.map(p => p.productName),
    notes: visit.giftName ? `Gift: ${visit.giftName} (${visit.giftQuantity})` : undefined,
    duration: Math.floor(visit.duration / 60), // convert seconds to minutes
  };

  // Check out the visit directly (since it's already completed in legacy format)
  const visits = getAllVisits();
  const completedVisit: Visit = {
    ...newVisit as any,
    visitId: generateId(),
    status: 'completed',
  };
  
  visits.push(completedVisit);
  setItem(VISITS_KEY, visits);
}

// Legacy getAllMRPerformance function
export function getAllMRPerformance(): MRPerformance[] {
  const users = getAllUsers();
  const mrUsers = users.filter(u => u.role === 'mr');
  const visits = getAllVisits();
  const expenses = getAllExpenses();

  return mrUsers.map(mr => {
    const mrVisits = visits.filter(v => v.mrId === mr.userId);
    const mrExpenses = expenses.filter(e => e.userId === mr.userId);

    const totalPOB = mrVisits.reduce((sum, v) => sum + v.pobAmount, 0);
    const totalCollection = mrVisits.reduce((sum, v) => sum + v.collectionAmount, 0);
    const totalExpenseAmount = mrExpenses.reduce((sum, e) => sum + e.totalExpense, 0);
    const pendingExpenseAmount = mrExpenses
      .filter(e => e.status === 'pending')
      .reduce((sum, e) => sum + e.totalExpense, 0);

    // Check if active today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();
    
    const todayVisits = mrVisits.filter(v => {
      const visitDate = new Date(v.checkInTimestamp);
      visitDate.setHours(0, 0, 0, 0);
      return visitDate.getTime() === todayTimestamp;
    });

    const isActive = todayVisits.length > 0;

    return {
      mrId: mr.userId, // Use unique userId as key
      mrName: mr.name,
      mrUsername: mr.username,
      visits: mrVisits.length,
      totalPOB,
      totalCollection,
      totalOutstanding: totalPOB - totalCollection,
      totalExpenses: totalExpenseAmount,
      pendingExpenses: pendingExpenseAmount,
      status: isActive ? 'active' : 'offline',
    };
  });
}

// ==================== TASK MANAGEMENT ====================

export function getAllTasks(): Task[] {
  const data = localStorage.getItem(TASKS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getTasksByUser(userId: string): Task[] {
  const tasks = getAllTasks();
  return tasks.filter(t => t.assignedTo === userId);
}

export function getTasksByStatus(status: TaskStatus): Task[] {
  const tasks = getAllTasks();
  return tasks.filter(t => t.status === status);
}

export function getPendingTasksByUser(userId: string): Task[] {
  const tasks = getTasksByUser(userId);
  return tasks.filter(t => t.status === 'pending' || t.status === 'in-progress');
}

export function createTask(task: Omit<Task, 'taskId' | 'createdAt'>): Task {
  const tasks = getAllTasks();
  const newTask: Task = {
    ...task,
    taskId: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
  };
  tasks.push(newTask);
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  return newTask;
}

export function updateTaskStatus(taskId: string, status: TaskStatus, notes?: string): boolean {
  const tasks = getAllTasks();
  const taskIndex = tasks.findIndex(t => t.taskId === taskId);
  if (taskIndex === -1) return false;

  tasks[taskIndex].status = status;
  if (notes) {
    tasks[taskIndex].notes = notes;
  }
  if (status === 'completed') {
    tasks[taskIndex].completedAt = Date.now();
  }

  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  return true;
}

export function updateTask(taskId: string, updates: Partial<Task>): boolean {
  const tasks = getAllTasks();
  const taskIndex = tasks.findIndex(t => t.taskId === taskId);
  if (taskIndex === -1) return false;

  tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  return true;
}

export function deleteTask(taskId: string): boolean {
  const tasks = getAllTasks();
  const filtered = tasks.filter(t => t.taskId !== taskId);
  if (filtered.length === tasks.length) return false;

  localStorage.setItem(TASKS_KEY, JSON.stringify(filtered));
  return true;
}

export function getTaskStats(userId: string): {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
} {
  const tasks = getTasksByUser(userId);
  const now = Date.now();

  return {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.status !== 'completed' && t.dueDate < now).length,
  };
}
