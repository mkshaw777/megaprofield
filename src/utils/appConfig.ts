/**
 * App Configuration
 * 
 * यहाँ से पूरे app की branding, settings, और configuration control होती है
 * Future में कोई भी change यहाँ से easily कर सकते हैं
 */

// ============================================
// COMPANY BRANDING
// ============================================

export const COMPANY_CONFIG = {
  // Company Details
  name: 'Megapro Innovation',
  tagline: 'Sales Force Automation',
  website: 'www.megaproinnovation.com',
  email: 'support@megaproinnovation.com',
  phone: '+91-XXXXXXXXXX', // आपका number डालें
  
  // App Details
  appName: 'Megapro Innovation',
  appVersion: '1.0.0',
  appDescription: 'Complete Sales Force Automation Platform for Medical Representatives',
  
  // Copyright
  copyrightYear: '2025',
  copyrightText: '© 2025 Megapro Innovation. All rights reserved.',
  
  // Logo path (Figma import)
  logoPath: 'figma:asset/e251b5c18758a36c694bcd1e83413a4344519727.png',
} as const;

// ============================================
// COLOR SCHEME
// ============================================

export const COLORS = {
  // Primary Colors
  primary: '#2563EB',      // Primary Blue
  primaryDark: '#1d4ed8',  // Darker Blue (hover)
  primaryLight: '#3b82f6', // Lighter Blue
  
  // Status Colors
  success: '#10B981',      // Green (approvals, success)
  warning: '#F59E0B',      // Orange (pending, warnings)
  danger: '#EF4444',       // Red (rejections, errors)
  info: '#3B82F6',         // Blue (info)
  
  // Background Colors
  background: '#F9FAFB',   // Light Gray background
  backgroundDark: '#F3F4F6',
  white: '#FFFFFF',
  
  // Text Colors
  textPrimary: '#1F2937',  // Dark Gray (main text)
  textSecondary: '#6B7280', // Medium Gray (secondary text)
  textLight: '#9CA3AF',    // Light Gray (subtle text)
  
  // Border Colors
  border: '#E5E7EB',
  borderDark: '#D1D5DB',
} as const;

// ============================================
// USER ROLES
// ============================================

export const USER_ROLES = {
  MR: 'mr',
  MANAGER: 'manager',
  ADMIN: 'admin',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// ============================================
// EXPENSE CONFIGURATION
// ============================================

export const EXPENSE_CONFIG = {
  // MR Expense Rules
  MR: {
    // Distance threshold (KM)
    distanceThreshold: 30,
    
    // DA (Daily Allowance)
    daRate: 100,
    
    // TA (Travel Allowance) - per KM
    taRatePerKm: 2.5,
    
    // Hotel limit
    hotelLimit: 0, // MR usually don't get hotel allowance
  },
  
  // Manager Expense Rules
  MANAGER: {
    // DA rates
    daSolo: 200,      // When touring alone
    daWithMR: 500,    // When touring with MR (joint tour)
    
    // TA
    taRatePerKm: 2.5,
    
    // Hotel
    hotelLimit: 700,  // Per night
  },
  
  // Admin Expense Rules (if any)
  ADMIN: {
    daRate: 0,
    taRatePerKm: 0,
    hotelLimit: 0,
  },
} as const;

// ============================================
// GPS CONFIGURATION
// ============================================

export const GPS_CONFIG = {
  // Check-in/Check-out accuracy
  accuracyThreshold: 50, // meters
  
  // Timeout for GPS
  timeout: 10000, // 10 seconds
  
  // Max age of cached location
  maximumAge: 5000, // 5 seconds
  
  // High accuracy mode
  enableHighAccuracy: true,
} as const;

// ============================================
// AI VALIDATION CONFIG
// ============================================

export const AI_CONFIG = {
  // Fraud detection thresholds
  suspiciousDistance: 5000, // meters (5km)
  suspiciousTimeGap: 300,   // seconds (5 minutes)
  
  // Image validation
  minImageSize: 10 * 1024,   // 10KB
  maxImageSize: 5 * 1024 * 1024, // 5MB
  allowedFormats: ['image/jpeg', 'image/jpg', 'image/png'],
  
  // Location validation
  maxLocationAge: 60000, // 1 minute
} as const;

// ============================================
// TOUR PLAN CONFIGURATION
// ============================================

export const TOUR_CONFIG = {
  // Maximum doctors per day
  maxDoctorsPerDay: 12,
  
  // Minimum visit duration (minutes)
  minVisitDuration: 5,
  
  // Maximum visit duration (minutes)
  maxVisitDuration: 120,
  
  // Working hours
  workingHours: {
    start: '09:00',
    end: '18:00',
  },
} as const;

// ============================================
// POB (Purchase Order Booking) CONFIG
// ============================================

export const POB_CONFIG = {
  // Minimum quantity
  minQuantity: 1,
  
  // Maximum quantity
  maxQuantity: 10000,
  
  // Required fields
  requireStockist: true,
  requireProduct: true,
  requireQuantity: true,
  requireValue: true,
} as const;

// ============================================
// APPROVAL WORKFLOW CONFIG
// ============================================

export const APPROVAL_CONFIG = {
  // Auto-approve threshold (for expenses)
  autoApproveThreshold: 0, // 0 means all require manual approval
  
  // Approval levels
  levels: {
    expense: ['manager'],
    pob: ['manager'],
    leave: ['manager', 'admin'],
  },
  
  // Notification settings
  notifications: {
    emailEnabled: false,
    smsEnabled: false,
    appNotificationEnabled: true,
  },
} as const;

// ============================================
// DATABASE CLEANUP CONFIG
// ============================================

export const CLEANUP_CONFIG = {
  // Data retention (days)
  retentionDays: {
    visits: 365,       // 1 year
    expenses: 730,     // 2 years
    pob: 730,          // 2 years
    tourPlans: 180,    // 6 months
    activityLogs: 90,  // 3 months
  },
  
  // Auto cleanup
  autoCleanup: true,
  cleanupSchedule: 'weekly', // daily, weekly, monthly
} as const;

// ============================================
// IMAGE STORAGE CONFIG
// ============================================

export const STORAGE_CONFIG = {
  // Bucket names
  buckets: {
    visits: 'visit-photos-685d939a',
    expenses: 'expense-receipts-685d939a',
    profiles: 'user-profiles-685d939a',
    documents: 'documents-685d939a',
  },
  
  // Image compression
  compression: {
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
  },
  
  // File naming
  useTimestamp: true,
  useUserId: true,
} as const;

// ============================================
// ANALYTICS CONFIG
// ============================================

export const ANALYTICS_CONFIG = {
  // Default date ranges
  defaultRange: 30, // days
  
  // Dashboard refresh
  autoRefresh: true,
  refreshInterval: 300000, // 5 minutes
  
  // Chart colors
  chartColors: [
    COLORS.primary,
    COLORS.success,
    COLORS.warning,
    COLORS.danger,
    COLORS.info,
  ],
} as const;

// ============================================
// MOBILE APP CONFIG
// ============================================

export const MOBILE_CONFIG = {
  // Bottom navigation (MR & Manager)
  showBottomNav: true,
  bottomNavHeight: 64, // pixels
  
  // Offline support
  offlineEnabled: false,
  
  // Push notifications
  pushEnabled: false,
} as const;

// ============================================
// ADMIN PANEL CONFIG
// ============================================

export const ADMIN_CONFIG = {
  // Features
  features: {
    staffManagement: true,
    dataManagement: true,
    reports: true,
    analytics: true,
    databaseCleanup: true,
    systemSettings: true,
    csvUpload: true,
  },
  
  // Bulk operations
  bulkOperations: {
    maxRecords: 1000,
    allowDelete: true,
    allowUpdate: true,
  },
} as const;

// ============================================
// VALIDATION RULES
// ============================================

export const VALIDATION_RULES = {
  // Username
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
  },
  
  // Password
  password: {
    minLength: 6,
    maxLength: 50,
    requireUppercase: false,
    requireLowercase: false,
    requireNumber: false,
    requireSpecialChar: false,
  },
  
  // Phone
  phone: {
    minLength: 10,
    maxLength: 15,
    pattern: /^[0-9+\-() ]+$/,
  },
  
  // Email
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
} as const;

// ============================================
// DEFAULT CREDENTIALS (DEMO)
// ============================================

export const DEMO_CREDENTIALS = {
  MR: {
    username: 'mr',
    password: 'mr',
    displayName: 'Medical Representative',
  },
  MANAGER: {
    username: 'manager',
    password: 'manager',
    displayName: 'Sales Manager',
  },
  ADMIN: {
    username: 'admin',
    password: 'admin',
    displayName: 'Administrator',
  },
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get company name
 */
export function getCompanyName(): string {
  return COMPANY_CONFIG.name;
}

/**
 * Get app version
 */
export function getAppVersion(): string {
  return COMPANY_CONFIG.appVersion;
}

/**
 * Get copyright text
 */
export function getCopyrightText(): string {
  return COMPANY_CONFIG.copyrightText;
}

/**
 * Get color by name
 */
export function getColor(colorName: keyof typeof COLORS): string {
  return COLORS[colorName];
}

/**
 * Get expense config for role
 */
export function getExpenseConfig(role: UserRole) {
  switch (role) {
    case USER_ROLES.MR:
      return EXPENSE_CONFIG.MR;
    case USER_ROLES.MANAGER:
      return EXPENSE_CONFIG.MANAGER;
    case USER_ROLES.ADMIN:
      return EXPENSE_CONFIG.ADMIN;
    default:
      return EXPENSE_CONFIG.MR;
  }
}

/**
 * Format company info for display
 */
export function getCompanyInfo() {
  return {
    name: COMPANY_CONFIG.name,
    tagline: COMPANY_CONFIG.tagline,
    version: COMPANY_CONFIG.appVersion,
    copyright: COMPANY_CONFIG.copyrightText,
    contact: {
      email: COMPANY_CONFIG.email,
      phone: COMPANY_CONFIG.phone,
      website: COMPANY_CONFIG.website,
    },
  };
}

// ============================================
// EXPORT ALL
// ============================================

export default {
  COMPANY_CONFIG,
  COLORS,
  USER_ROLES,
  EXPENSE_CONFIG,
  GPS_CONFIG,
  AI_CONFIG,
  TOUR_CONFIG,
  POB_CONFIG,
  APPROVAL_CONFIG,
  CLEANUP_CONFIG,
  STORAGE_CONFIG,
  ANALYTICS_CONFIG,
  MOBILE_CONFIG,
  ADMIN_CONFIG,
  VALIDATION_RULES,
  DEMO_CREDENTIALS,
};
