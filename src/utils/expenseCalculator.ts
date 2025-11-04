// Expense Calculation Logic

import { AppSettings, UserRole } from './types';

export interface ExpenseInput {
  userId: string;
  userRole: UserRole;
  distanceKm: number;
  isOutstation: boolean;
  isNightStay: boolean;
  hotelBillAmount: number;
  isJointWork?: boolean; // For managers working with MR
}

export interface ExpenseCalculation {
  calculatedDA: number;
  calculatedTA: number;
  totalExpense: number;
  breakdown: {
    daType: string;
    daAmount: number;
    taCalculation: string;
    taAmount: number;
    hotelAmount: number;
    hotelLimit: number;
  };
}

/**
 * Calculate expense based on business rules
 * 
 * MR Logic:
 * - If distance < outstation_distance_threshold: DA = mr_da_local
 * - If distance >= outstation_distance_threshold: DA = mr_da_outstation
 * - TA = distance * ta_per_km (capped at outstation_ta_cap if outstation)
 * - If night stay: add hotel bill (up to mr_hotel_limit)
 * 
 * Manager Logic:
 * - Similar to MR but uses manager-specific rates
 */
export function calculateExpense(
  input: ExpenseInput,
  settings: AppSettings
): ExpenseCalculation {
  const {
    userRole,
    distanceKm,
    isOutstation,
    isNightStay,
    hotelBillAmount,
    isJointWork = false,
  } = input;

  let calculatedDA = 0;
  let calculatedTA = 0;
  let daType = '';
  let hotelLimit = 0;

  // Determine if outstation based on distance
  const isOutstationByDistance = distanceKm >= settings.outstation_distance_threshold;
  const actuallyOutstation = isOutstation || isOutstationByDistance;

  if (userRole === 'mr') {
    // MR DA Calculation
    if (actuallyOutstation) {
      calculatedDA = settings.mr_da_outstation;
      daType = 'MR DA (Outstation)';
    } else {
      calculatedDA = settings.mr_da_local;
      daType = 'MR DA (Local)';
    }
    hotelLimit = settings.mr_hotel_limit;
  } else if (userRole === 'manager') {
    // Manager DA Calculation
    if (isJointWork) {
      calculatedDA = settings.manager_da_joint;
      daType = 'Manager DA (Joint with MR)';
    } else {
      calculatedDA = settings.manager_da_solo;
      daType = 'Manager DA (Solo)';
    }
    hotelLimit = settings.manager_hotel_limit;
  } else {
    // Admin shouldn't submit expenses typically, but handle gracefully
    calculatedDA = 0;
    daType = 'N/A';
    hotelLimit = 0;
  }

  // TA Calculation - Only if distance >= threshold (30km)
  let taAmount = 0;
  
  if (distanceKm >= settings.outstation_distance_threshold) {
    taAmount = distanceKm * settings.ta_per_km;
    
    // Cap TA if outstation
    if (actuallyOutstation && taAmount > settings.outstation_ta_cap) {
      taAmount = settings.outstation_ta_cap;
    }
  }
  
  calculatedTA = Math.round(taAmount * 100) / 100; // Round to 2 decimal places

  // Hotel Bill
  let hotelAmount = 0;
  if (isNightStay && hotelBillAmount > 0) {
    hotelAmount = Math.min(hotelBillAmount, hotelLimit);
  }

  // Total Calculation
  const totalExpense = calculatedDA + calculatedTA + hotelAmount;

  return {
    calculatedDA,
    calculatedTA,
    totalExpense: Math.round(totalExpense * 100) / 100,
    breakdown: {
      daType,
      daAmount: calculatedDA,
      taCalculation: distanceKm >= settings.outstation_distance_threshold
        ? actuallyOutstation 
          ? `${distanceKm} km × ₹${settings.ta_per_km} = ₹${taAmount.toFixed(2)} (capped at ₹${settings.outstation_ta_cap})`
          : `${distanceKm} km × ₹${settings.ta_per_km}`
        : 'Not applicable (< 30 km)',
      taAmount: calculatedTA,
      hotelAmount,
      hotelLimit,
    },
  };
}

/**
 * Check if expense entry is allowed (only after 8 PM)
 */
export function isExpenseEntryAllowed(settings: AppSettings): {
  allowed: boolean;
  message: string;
  timeRemaining?: string;
} {
  const now = new Date();
  const currentHour = now.getHours();
  const startHour = settings.expense_entry_start_hour;

  if (currentHour >= startHour) {
    return {
      allowed: true,
      message: 'Expense entry is allowed',
    };
  }

  const hoursRemaining = startHour - currentHour;
  const minutesRemaining = 60 - now.getMinutes();
  
  return {
    allowed: false,
    message: `Expense entry is only allowed after ${startHour}:00 (${formatTime(startHour)}:00)`,
    timeRemaining: `${hoursRemaining - 1}h ${minutesRemaining}m remaining`,
  };
}

/**
 * Format hour to 12-hour format
 */
function formatTime(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}

/**
 * Validate expense input
 */
export function validateExpenseInput(input: ExpenseInput): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (input.distanceKm < 0) {
    errors.push('Distance cannot be negative');
  }

  if (input.distanceKm > 1000) {
    errors.push('Distance seems unusually high (>1000 km). Please verify.');
  }

  if (input.isNightStay && input.hotelBillAmount <= 0) {
    errors.push('Hotel bill amount is required for night stay');
  }

  if (input.hotelBillAmount < 0) {
    errors.push('Hotel bill amount cannot be negative');
  }

  if (input.hotelBillAmount > 10000) {
    errors.push('Hotel bill amount seems unusually high. Please verify.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Simulate AI fake bill detection
 * Returns a risk score between 0-100
 * This is a placeholder for future AI integration
 */
export async function detectFakeBill(billProofUrl: string): Promise<{
  riskScore: number;
  isFlagged: boolean;
  reason?: string;
}> {
  // Placeholder implementation
  // In production, this would call an AI service API
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // For demo purposes, randomly generate a risk score
  // In real implementation, this would come from AI model
  const riskScore = Math.floor(Math.random() * 100);
  const isFlagged = riskScore > 70; // Flag if risk > 70%

  return {
    riskScore,
    isFlagged,
    reason: isFlagged ? 'High probability of manipulated/fake bill detected' : undefined,
  };
}

/**
 * Get expense summary for a period
 */
export interface ExpenseSummary {
  totalExpenses: number;
  totalDA: number;
  totalTA: number;
  totalHotel: number;
  count: number;
  averageExpense: number;
}

export function calculateExpenseSummary(expenses: {
  calculatedDA: number;
  calculatedTA: number;
  totalExpense: number;
}[]): ExpenseSummary {
  if (expenses.length === 0) {
    return {
      totalExpenses: 0,
      totalDA: 0,
      totalTA: 0,
      totalHotel: 0,
      count: 0,
      averageExpense: 0,
    };
  }

  const totalDA = expenses.reduce((sum, e) => sum + e.calculatedDA, 0);
  const totalTA = expenses.reduce((sum, e) => sum + e.calculatedTA, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.totalExpense, 0);
  const totalHotel = totalExpenses - totalDA - totalTA;

  return {
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    totalDA: Math.round(totalDA * 100) / 100,
    totalTA: Math.round(totalTA * 100) / 100,
    totalHotel: Math.round(totalHotel * 100) / 100,
    count: expenses.length,
    averageExpense: Math.round((totalExpenses / expenses.length) * 100) / 100,
  };
}
