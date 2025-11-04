// Supabase Storage Operations for Megapro Innovation SFA
// Handles image uploads for hotel bills and odometer photos

import { supabase, handleSupabaseError } from './client';

const EXPENSE_IMAGES_BUCKET = 'megapro-expense-images';

// ==================== HELPER FUNCTIONS ====================

/**
 * Convert base64 to File object
 */
function base64ToFile(base64: string, fileName: string): File {
  // Remove data URL prefix if present
  const base64Data = base64.includes('base64,') 
    ? base64.split('base64,')[1] 
    : base64;
  
  // Convert base64 to binary
  const byteString = atob(base64Data);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  // Detect MIME type from base64 prefix
  const mimeMatch = base64.match(/data:([^;]+);/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  
  return new File([ab], fileName, { type: mimeType });
}

/**
 * Generate unique file name
 */
function generateFileName(userId: string, type: 'hotel' | 'odometer_start' | 'odometer_end'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${userId}/${type}_${timestamp}_${random}.jpg`;
}

// ==================== STORAGE OPERATIONS ====================

/**
 * Upload hotel bill image
 */
export async function uploadHotelBill(
  userId: string,
  base64Image: string
): Promise<string | null> {
  try {
    const fileName = generateFileName(userId, 'hotel');
    const file = base64ToFile(base64Image, fileName);

    const { data, error } = await supabase.storage
      .from(EXPENSE_IMAGES_BUCKET)
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Error uploading hotel bill:', handleSupabaseError(error));
      return null;
    }

    // Return the storage path
    return data.path;
  } catch (error) {
    console.error('Error in uploadHotelBill:', error);
    return null;
  }
}

/**
 * Upload odometer start photo
 */
export async function uploadOdometerStart(
  userId: string,
  base64Image: string
): Promise<string | null> {
  try {
    const fileName = generateFileName(userId, 'odometer_start');
    const file = base64ToFile(base64Image, fileName);

    const { data, error } = await supabase.storage
      .from(EXPENSE_IMAGES_BUCKET)
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Error uploading odometer start:', handleSupabaseError(error));
      return null;
    }

    return data.path;
  } catch (error) {
    console.error('Error in uploadOdometerStart:', error);
    return null;
  }
}

/**
 * Upload odometer end photo
 */
export async function uploadOdometerEnd(
  userId: string,
  base64Image: string
): Promise<string | null> {
  try {
    const fileName = generateFileName(userId, 'odometer_end');
    const file = base64ToFile(base64Image, fileName);

    const { data, error } = await supabase.storage
      .from(EXPENSE_IMAGES_BUCKET)
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Error uploading odometer end:', handleSupabaseError(error));
      return null;
    }

    return data.path;
  } catch (error) {
    console.error('Error in uploadOdometerEnd:', error);
    return null;
  }
}

/**
 * Get signed URL for viewing image
 * @param path Storage path returned from upload
 * @param expiresIn Expiry time in seconds (default: 1 hour)
 */
export async function getImageUrl(
  path: string,
  expiresIn: number = 3600
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(EXPENSE_IMAGES_BUCKET)
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error('Error getting signed URL:', handleSupabaseError(error));
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Error in getImageUrl:', error);
    return null;
  }
}

/**
 * Delete image from storage
 */
export async function deleteImage(path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(EXPENSE_IMAGES_BUCKET)
      .remove([path]);

    if (error) {
      console.error('Error deleting image:', handleSupabaseError(error));
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteImage:', error);
    return false;
  }
}

/**
 * Get storage statistics
 */
export async function getStorageStats(userId?: string): Promise<{
  totalFiles: number;
  totalSize: number;
  sizeMB: number;
}> {
  try {
    const prefix = userId ? `${userId}/` : '';
    
    const { data, error } = await supabase.storage
      .from(EXPENSE_IMAGES_BUCKET)
      .list(prefix, {
        limit: 1000,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error || !data) {
      return { totalFiles: 0, totalSize: 0, sizeMB: 0 };
    }

    const totalSize = data.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
    const sizeMB = totalSize / (1024 * 1024);

    return {
      totalFiles: data.length,
      totalSize,
      sizeMB: Math.round(sizeMB * 100) / 100,
    };
  } catch (error) {
    console.error('Error in getStorageStats:', error);
    return { totalFiles: 0, totalSize: 0, sizeMB: 0 };
  }
}

/**
 * Bulk delete images (for cleanup)
 */
export async function bulkDeleteImages(paths: string[]): Promise<{
  success: number;
  failed: number;
}> {
  try {
    const { data, error } = await supabase.storage
      .from(EXPENSE_IMAGES_BUCKET)
      .remove(paths);

    if (error) {
      console.error('Error bulk deleting images:', handleSupabaseError(error));
      return { success: 0, failed: paths.length };
    }

    return {
      success: data?.length || 0,
      failed: paths.length - (data?.length || 0),
    };
  } catch (error) {
    console.error('Error in bulkDeleteImages:', error);
    return { success: 0, failed: paths.length };
  }
}

/**
 * Download image as base64 (for export/backup)
 */
export async function downloadImageAsBase64(path: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(EXPENSE_IMAGES_BUCKET)
      .download(path);

    if (error || !data) {
      console.error('Error downloading image:', handleSupabaseError(error));
      return null;
    }

    // Convert blob to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(data);
    });
  } catch (error) {
    console.error('Error in downloadImageAsBase64:', error);
    return null;
  }
}

/**
 * Check if storage bucket exists and is accessible
 */
export async function checkStorageBucket(): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage
      .from(EXPENSE_IMAGES_BUCKET)
      .list('', { limit: 1 });

    return !error;
  } catch (error) {
    return false;
  }
}

/**
 * Create storage bucket (call this once during setup)
 * Note: This requires admin/service role key, use Supabase UI instead
 */
export async function createStorageBucket(): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage.createBucket(
      EXPENSE_IMAGES_BUCKET,
      {
        public: false,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
      }
    );

    if (error) {
      console.error('Error creating bucket:', handleSupabaseError(error));
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in createStorageBucket:', error);
    return false;
  }
}
