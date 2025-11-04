/**
 * AI Fraud Detection Utility (Mock Implementation)
 * 
 * NOTE: This is a SIMULATION for demonstration purposes.
 * In production, replace with real AI APIs:
 * - Google Cloud Vision API
 * - AWS Rekognition
 * - Custom TensorFlow.js model
 * 
 * See /AI_FRAUD_DETECTION_GUIDE.md for implementation details
 */

export interface AIValidationResult {
  isValid: boolean;
  confidence: number; // 0-100
  level: 'HIGH' | 'MEDIUM' | 'LOW';
  action: 'AUTO_APPROVE' | 'MANUAL_REVIEW' | 'FLAG_REJECT';
  flags: string[];
  details: {
    imageQuality: number;
    hasMetadata: boolean;
    isEdited: boolean;
    isScreenshot: boolean;
    isDuplicate: boolean;
    ocrConfidence?: number;
    extractedText?: string;
    gpsMatch?: boolean;
  };
  timestamp: number;
}

/**
 * Generate image hash for duplicate detection
 */
export function generateImageHash(base64Image: string): string {
  // Simple hash simulation
  // In production, use: crypto.createHash('sha256').update(base64Image).digest('hex')
  let hash = 0;
  for (let i = 0; i < base64Image.length; i++) {
    const char = base64Image.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

/**
 * Check if image is a screenshot (mock implementation)
 */
function detectScreenshot(base64Image: string): boolean {
  // Mock: Randomly flag 10% as screenshots for demo
  // Real implementation would check EXIF data, image properties
  return Math.random() < 0.1;
}

/**
 * Check if image has been edited (mock implementation)
 */
function detectImageEditing(base64Image: string): boolean {
  // Mock: Randomly flag 15% as edited for demo
  // Real implementation would analyze EXIF metadata, compression artifacts
  return Math.random() < 0.15;
}

/**
 * Analyze image quality
 */
function analyzeImageQuality(base64Image: string): number {
  // Mock: Random quality score between 60-100
  // Real implementation would check resolution, blur, lighting
  return Math.floor(Math.random() * 40) + 60;
}

/**
 * Extract text from image (OCR simulation)
 */
function performOCR(base64Image: string, type: 'odometer' | 'bill'): {
  text: string;
  confidence: number;
} {
  // Mock OCR results
  if (type === 'odometer') {
    const reading = Math.floor(Math.random() * 50000) + 10000;
    return {
      text: reading.toString(),
      confidence: Math.floor(Math.random() * 20) + 80
    };
  } else {
    // Hotel bill
    const amount = Math.floor(Math.random() * 600) + 300;
    return {
      text: `Hotel Bill\nAmount: Rs. ${amount}\nDate: ${new Date().toLocaleDateString()}`,
      confidence: Math.floor(Math.random() * 20) + 75
    };
  }
}

/**
 * Check for duplicate submissions
 */
export function checkDuplicateImage(
  imageHash: string,
  userId: string,
  existingHashes: string[]
): boolean {
  return existingHashes.includes(imageHash);
}

/**
 * Main AI validation function for odometer images
 */
export async function validateOdometerImage(
  base64Image: string,
  userId: string,
  previousReading?: number,
  claimedDistance?: number
): Promise<AIValidationResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const flags: string[] = [];
  let confidence = 100;
  
  // Check 1: Image quality
  const quality = analyzeImageQuality(base64Image);
  const details: AIValidationResult['details'] = {
    imageQuality: quality,
    hasMetadata: true,
    isEdited: false,
    isScreenshot: false,
    isDuplicate: false,
  };
  
  if (quality < 70) {
    flags.push('Poor image quality');
    confidence -= 15;
  }
  
  // Check 2: Screenshot detection
  const isScreenshot = detectScreenshot(base64Image);
  details.isScreenshot = isScreenshot;
  if (isScreenshot) {
    flags.push('Image appears to be a screenshot');
    confidence -= 40;
  }
  
  // Check 3: Editing detection
  const isEdited = detectImageEditing(base64Image);
  details.isEdited = isEdited;
  if (isEdited) {
    flags.push('Image may have been edited');
    confidence -= 30;
  }
  
  // Check 4: OCR and reading validation
  const ocr = performOCR(base64Image, 'odometer');
  details.ocrConfidence = ocr.confidence;
  details.extractedText = ocr.text;
  
  if (ocr.confidence < 80) {
    flags.push('Low OCR confidence - text unclear');
    confidence -= 10;
  }
  
  // Check 5: Reading consistency
  if (previousReading && claimedDistance) {
    const extractedReading = parseInt(ocr.text);
    const expectedReading = previousReading + claimedDistance;
    const difference = Math.abs(extractedReading - expectedReading);
    
    if (difference > 10) {
      flags.push(`Odometer reading mismatch: Expected ~${expectedReading}, found ${extractedReading}`);
      confidence -= 25;
    }
  }
  
  // Determine validation level
  let level: AIValidationResult['level'];
  let action: AIValidationResult['action'];
  
  if (confidence >= 90) {
    level = 'HIGH';
    action = 'AUTO_APPROVE';
  } else if (confidence >= 70) {
    level = 'MEDIUM';
    action = 'MANUAL_REVIEW';
  } else {
    level = 'LOW';
    action = 'FLAG_REJECT';
  }
  
  return {
    isValid: confidence >= 70,
    confidence,
    level,
    action,
    flags,
    details,
    timestamp: Date.now(),
  };
}

/**
 * Main AI validation function for hotel bills
 */
export async function validateHotelBill(
  base64Image: string,
  userId: string,
  claimedAmount: number,
  maxAmount: number = 700
): Promise<AIValidationResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const flags: string[] = [];
  let confidence = 100;
  
  const details: AIValidationResult['details'] = {
    imageQuality: 0,
    hasMetadata: true,
    isEdited: false,
    isScreenshot: false,
    isDuplicate: false,
  };
  
  // Check 1: Image quality
  const quality = analyzeImageQuality(base64Image);
  details.imageQuality = quality;
  
  if (quality < 70) {
    flags.push('Poor image quality');
    confidence -= 15;
  }
  
  // Check 2: Screenshot detection (common for fake bills)
  const isScreenshot = detectScreenshot(base64Image);
  details.isScreenshot = isScreenshot;
  if (isScreenshot) {
    flags.push('Bill appears to be a screenshot (not original photo)');
    confidence -= 50; // Heavy penalty for screenshots
  }
  
  // Check 3: Editing detection
  const isEdited = detectImageEditing(base64Image);
  details.isEdited = isEdited;
  if (isEdited) {
    flags.push('Bill may have been digitally edited');
    confidence -= 35;
  }
  
  // Check 4: OCR and amount extraction
  const ocr = performOCR(base64Image, 'bill');
  details.ocrConfidence = ocr.confidence;
  details.extractedText = ocr.text;
  
  if (ocr.confidence < 75) {
    flags.push('Low OCR confidence - bill text unclear');
    confidence -= 15;
  }
  
  // Check 5: Amount validation
  const extractedAmount = parseInt(ocr.text.match(/Rs\.?\s*(\d+)/)?.[1] || '0');
  
  if (Math.abs(extractedAmount - claimedAmount) > 50) {
    flags.push(`Amount mismatch: Claimed ₹${claimedAmount}, extracted ₹${extractedAmount}`);
    confidence -= 20;
  }
  
  if (claimedAmount > maxAmount) {
    flags.push(`Amount exceeds limit: ₹${claimedAmount} > ₹${maxAmount}`);
    confidence -= 15;
  }
  
  // Check 6: Bill format validation
  const hasBillFormat = ocr.text.includes('Bill') || 
                        ocr.text.includes('Invoice') ||
                        ocr.text.includes('Receipt');
  
  if (!hasBillFormat) {
    flags.push('Document does not appear to be a valid bill');
    confidence -= 25;
  }
  
  // Determine validation level
  let level: AIValidationResult['level'];
  let action: AIValidationResult['action'];
  
  if (confidence >= 90) {
    level = 'HIGH';
    action = 'AUTO_APPROVE';
  } else if (confidence >= 70) {
    level = 'MEDIUM';
    action = 'MANUAL_REVIEW';
  } else {
    level = 'LOW';
    action = 'FLAG_REJECT';
  }
  
  return {
    isValid: confidence >= 70,
    confidence,
    level,
    action,
    flags,
    details,
    timestamp: Date.now(),
  };
}

/**
 * Comprehensive expense validation (combines all checks)
 */
export async function validateExpenseSubmission(
  expense: {
    type: 'odometer' | 'hotel_bill';
    image: string;
    userId: string;
    amount?: number;
    distance?: number;
    previousReading?: number;
  },
  previousSubmissions: string[] = []
): Promise<AIValidationResult> {
  const imageHash = generateImageHash(expense.image);
  
  // Check for duplicates first
  const isDuplicate = checkDuplicateImage(imageHash, expense.userId, previousSubmissions);
  
  if (isDuplicate) {
    return {
      isValid: false,
      confidence: 0,
      level: 'LOW',
      action: 'FLAG_REJECT',
      flags: ['DUPLICATE: This image has been submitted before'],
      details: {
        imageQuality: 0,
        hasMetadata: false,
        isEdited: false,
        isScreenshot: false,
        isDuplicate: true,
      },
      timestamp: Date.now(),
    };
  }
  
  // Run appropriate validation
  if (expense.type === 'odometer') {
    return await validateOdometerImage(
      expense.image,
      expense.userId,
      expense.previousReading,
      expense.distance
    );
  } else {
    return await validateHotelBill(
      expense.image,
      expense.userId,
      expense.amount || 0
    );
  }
}

/**
 * Get validation badge color
 */
export function getValidationBadgeColor(level: AIValidationResult['level']): string {
  switch (level) {
    case 'HIGH':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'LOW':
      return 'bg-red-100 text-red-800 border-red-300';
  }
}

/**
 * Get validation icon
 */
export function getValidationIcon(level: AIValidationResult['level']): string {
  switch (level) {
    case 'HIGH':
      return '✓';
    case 'MEDIUM':
      return '⚠';
    case 'LOW':
      return '✕';
  }
}
