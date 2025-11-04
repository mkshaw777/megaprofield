/**
 * Image Export & Database Cleanup Utilities
 * 
 * Features:
 * - Export images as ZIP file
 * - Calculate storage usage
 * - Clean images from database
 * - Maintain data integrity
 */

import { getAllExpenses, updateExpense } from './dataStorage';
import type { Expense } from './types';

export interface StorageStats {
  totalExpenses: number;
  expensesWithImages: number;
  totalImages: number;
  estimatedStorageMB: number;
  breakdown: {
    hotelBills: number;
    odometerStart: number;
    odometerEnd: number;
  };
}

export interface ImageExportOptions {
  startDate?: number;
  endDate?: number;
  includeHotelBills?: boolean;
  includeOdometers?: boolean;
  userIds?: string[];
}

export interface ImageRecord {
  expenseId: string;
  userName: string;
  date: Date;
  type: 'hotel_bill' | 'odometer_start' | 'odometer_end';
  image: string;
  metadata?: {
    amount?: number;
    distance?: number;
    meterReading?: number;
  };
}

/**
 * Calculate storage usage from base64 images
 */
function calculateBase64Size(base64: string): number {
  if (!base64) return 0;
  
  // Remove data:image/xxx;base64, prefix
  const base64Data = base64.split(',')[1] || base64;
  
  // Base64 size = (original size * 4/3)
  // We calculate original size = base64 size * 3/4
  return (base64Data.length * 3) / 4;
}

/**
 * Get storage statistics
 */
export function getStorageStatistics(expenses?: Expense[]): StorageStats {
  const allExpenses = expenses || getAllExpenses();
  
  let totalImages = 0;
  let totalBytes = 0;
  const breakdown = {
    hotelBills: 0,
    odometerStart: 0,
    odometerEnd: 0,
  };
  
  const expensesWithImages = allExpenses.filter(expense => {
    let hasImage = false;
    
    if (expense.billProofUrl) {
      hasImage = true;
      totalImages++;
      breakdown.hotelBills++;
      totalBytes += calculateBase64Size(expense.billProofUrl);
    }
    
    if (expense.bikeMeterStartPhotoUrl) {
      hasImage = true;
      totalImages++;
      breakdown.odometerStart++;
      totalBytes += calculateBase64Size(expense.bikeMeterStartPhotoUrl);
    }
    
    if (expense.bikeMeterEndPhotoUrl) {
      hasImage = true;
      totalImages++;
      breakdown.odometerEnd++;
      totalBytes += calculateBase64Size(expense.bikeMeterEndPhotoUrl);
    }
    
    return hasImage;
  });
  
  return {
    totalExpenses: allExpenses.length,
    expensesWithImages: expensesWithImages.length,
    totalImages,
    estimatedStorageMB: totalBytes / (1024 * 1024),
    breakdown,
  };
}

/**
 * Extract images from expenses based on filters
 */
export function extractImages(options: ImageExportOptions = {}): ImageRecord[] {
  const {
    startDate,
    endDate,
    includeHotelBills = true,
    includeOdometers = true,
    userIds,
  } = options;
  
  const allExpenses = getAllExpenses();
  const imageRecords: ImageRecord[] = [];
  
  allExpenses.forEach(expense => {
    // Apply filters
    if (startDate && expense.date < startDate) return;
    if (endDate && expense.date > endDate) return;
    if (userIds && userIds.length > 0 && !userIds.includes(expense.userId)) return;
    
    const expenseDate = new Date(expense.date);
    
    // Extract hotel bill
    if (includeHotelBills && expense.billProofUrl) {
      imageRecords.push({
        expenseId: expense.expenseId,
        userName: expense.userName,
        date: expenseDate,
        type: 'hotel_bill',
        image: expense.billProofUrl,
        metadata: {
          amount: expense.hotelBillAmount,
        },
      });
    }
    
    // Extract odometer start
    if (includeOdometers && expense.bikeMeterStartPhotoUrl) {
      imageRecords.push({
        expenseId: expense.expenseId,
        userName: expense.userName,
        date: expenseDate,
        type: 'odometer_start',
        image: expense.bikeMeterStartPhotoUrl,
        metadata: {
          meterReading: expense.bikeMeterStart,
          distance: expense.distanceKm,
        },
      });
    }
    
    // Extract odometer end
    if (includeOdometers && expense.bikeMeterEndPhotoUrl) {
      imageRecords.push({
        expenseId: expense.expenseId,
        userName: expense.userName,
        date: expenseDate,
        type: 'odometer_end',
        image: expense.bikeMeterEndPhotoUrl,
        metadata: {
          meterReading: expense.bikeMeterEnd,
          distance: expense.distanceKm,
        },
      });
    }
  });
  
  return imageRecords;
}

/**
 * Helper function to download blob as file
 */
function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Helper function to convert base64 to Blob
 */
function base64ToBlob(base64: string, mimeType: string = 'image/jpeg'): Blob {
  const base64Data = base64.split(',')[1] || base64;
  const byteCharacters = atob(base64Data);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  return new Blob(byteArrays, { type: mimeType });
}

/**
 * Export images as ZIP file (using fflate library for ZIP creation)
 */
export async function exportImagesToZip(
  images: ImageRecord[],
  zipFileName: string = 'expense_images_export.zip'
): Promise<void> {
  if (images.length === 0) {
    throw new Error('No images to export');
  }
  
  // Import fflate dynamically
  const { zip, strToU8 } = await import('fflate');
  
  const files: Record<string, Uint8Array> = {};
  
  // Create folder structure: YYYY-MM/UserName/
  images.forEach((record) => {
    const yearMonth = `${record.date.getFullYear()}-${String(record.date.getMonth() + 1).padStart(2, '0')}`;
    const dateStr = record.date.toISOString().split('T')[0]; // YYYY-MM-DD
    const userName = record.userName.replace(/[^a-zA-Z0-9]/g, '_');
    
    // Determine file extension from base64
    let ext = 'jpg';
    if (record.image.includes('image/png')) ext = 'png';
    else if (record.image.includes('image/jpeg')) ext = 'jpg';
    
    // Create filename
    const fileName = `${dateStr}_${record.type}_${record.expenseId.substring(0, 8)}.${ext}`;
    const filePath = `${yearMonth}/${userName}/${fileName}`;
    
    // Convert base64 to Uint8Array
    const base64Data = record.image.split(',')[1] || record.image;
    const byteCharacters = atob(base64Data);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    
    files[filePath] = byteArray;
    
    // Also create a metadata file
    const metadataFileName = `${dateStr}_${record.type}_${record.expenseId.substring(0, 8)}.txt`;
    const metadataPath = `${yearMonth}/${userName}/${metadataFileName}`;
    
    const metadataContent = [
      `Expense ID: ${record.expenseId}`,
      `User: ${record.userName}`,
      `Date: ${record.date.toLocaleString()}`,
      `Type: ${record.type}`,
      record.metadata?.amount ? `Amount: ₹${record.metadata.amount}` : '',
      record.metadata?.meterReading ? `Meter Reading: ${record.metadata.meterReading} km` : '',
      record.metadata?.distance ? `Distance: ${record.metadata.distance} km` : '',
    ].filter(Boolean).join('\n');
    
    files[metadataPath] = strToU8(metadataContent);
  });
  
  // Create summary file
  const summary = [
    '=== EXPENSE IMAGES EXPORT SUMMARY ===',
    '',
    `Export Date: ${new Date().toLocaleString()}`,
    `Total Images: ${images.length}`,
    '',
    '--- Breakdown by Type ---',
    `Hotel Bills: ${images.filter(i => i.type === 'hotel_bill').length}`,
    `Odometer Start: ${images.filter(i => i.type === 'odometer_start').length}`,
    `Odometer End: ${images.filter(i => i.type === 'odometer_end').length}`,
    '',
    '--- Breakdown by User ---',
    ...Array.from(new Set(images.map(i => i.userName)))
      .map(user => `${user}: ${images.filter(i => i.userName === user).length} images`),
    '',
    '=== FOLDER STRUCTURE ===',
    'Images are organized as:',
    'YYYY-MM/UserName/YYYY-MM-DD_type_expenseId.jpg',
    '',
    'Metadata files (.txt) contain expense details.',
  ].join('\n');
  
  files['README.txt'] = strToU8(summary);
  
  // Generate ZIP file
  return new Promise((resolve, reject) => {
    zip(files, { level: 6 }, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      
      // Create blob and download
      const blob = new Blob([data], { type: 'application/zip' });
      downloadBlob(blob, zipFileName);
      resolve();
    });
  });
}

/**
 * Delete images from database (keep expense data)
 */
export function deleteImagesFromDatabase(
  expenseIds: string[],
  options: {
    deleteHotelBills?: boolean;
    deleteOdometers?: boolean;
  } = {}
): number {
  const {
    deleteHotelBills = true,
    deleteOdometers = true,
  } = options;
  
  let deletedCount = 0;
  
  expenseIds.forEach(expenseId => {
    const expenses = getAllExpenses();
    const expense = expenses.find(e => e.expenseId === expenseId);
    
    if (!expense) return;
    
    // Create updated expense (remove image URLs but keep data)
    const updatedExpense: Partial<Expense> = {};
    
    if (deleteHotelBills && expense.billProofUrl) {
      updatedExpense.billProofUrl = undefined;
      deletedCount++;
    }
    
    if (deleteOdometers && expense.bikeMeterStartPhotoUrl) {
      updatedExpense.bikeMeterStartPhotoUrl = undefined;
      deletedCount++;
    }
    
    if (deleteOdometers && expense.bikeMeterEndPhotoUrl) {
      updatedExpense.bikeMeterEndPhotoUrl = undefined;
      deletedCount++;
    }
    
    // Update expense (this preserves all other data)
    if (Object.keys(updatedExpense).length > 0) {
      updateExpense(expenseId, updatedExpense);
    }
  });
  
  return deletedCount;
}

/**
 * Get expenses grouped by month
 */
export function getExpensesByMonth(): { [month: string]: Expense[] } {
  const expenses = getAllExpenses();
  const grouped: { [month: string]: Expense[] } = {};
  
  expenses.forEach(expense => {
    const date = new Date(expense.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!grouped[monthKey]) {
      grouped[monthKey] = [];
    }
    
    grouped[monthKey].push(expense);
  });
  
  return grouped;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get storage limit warning
 */
export function getStorageWarning(storageMB: number): {
  level: 'safe' | 'warning' | 'critical';
  message: string;
  color: string;
} {
  // Supabase free tier: 500 MB
  // LocalStorage limit: ~5-10 MB per domain
  
  const localStorageLimit = 5; // MB
  const percentage = (storageMB / localStorageLimit) * 100;
  
  if (percentage < 60) {
    return {
      level: 'safe',
      message: `Storage usage: ${percentage.toFixed(1)}% of browser limit`,
      color: 'text-green-600',
    };
  } else if (percentage < 85) {
    return {
      level: 'warning',
      message: `Storage usage: ${percentage.toFixed(1)}% - Consider cleanup`,
      color: 'text-yellow-600',
    };
  } else {
    return {
      level: 'critical',
      message: `Storage usage: ${percentage.toFixed(1)}% - Cleanup required!`,
      color: 'text-red-600',
    };
  }
}
