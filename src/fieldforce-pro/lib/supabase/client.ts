/**
 * Supabase Client Configuration
 */

// These will be replaced with actual values during deployment
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';
const PROJECT_ID = SUPABASE_URL.split('//')[1]?.split('.')[0] || 'placeholder';

/**
 * Supabase Client Configuration
 */
export const supabaseClient = {
  url: SUPABASE_URL,
  publicKey: SUPABASE_ANON_KEY,
  projectId: PROJECT_ID,
  functions: `${SUPABASE_URL}/functions/v1`,
  storage: `${SUPABASE_URL}/storage/v1`,
  
  /**
   * Get authenticated headers
   */
  getHeaders(token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'apikey': this.publicKey,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      headers['Authorization'] = `Bearer ${this.publicKey}`;
    }
    
    return headers;
  },
};

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return (
    SUPABASE_URL !== 'https://placeholder.supabase.co' &&
    SUPABASE_ANON_KEY !== 'placeholder-key'
  );
}

/**
 * API Request Helper
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${supabaseClient.functions}/make-server-685d939a${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...supabaseClient.getHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    `${supabaseClient.storage}/object/${bucket}/${path}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseClient.publicKey}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('File upload failed');
  }

  const data = await response.json();
  return data.Key || data.path;
}

/**
 * Get public URL for uploaded file
 */
export function getPublicUrl(bucket: string, path: string): string {
  return `${supabaseClient.storage}/object/public/${bucket}/${path}`;
}

/**
 * Get signed URL for private file
 */
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600
): Promise<string> {
  const response = await apiRequest('/storage/signed-url', {
    method: 'POST',
    body: JSON.stringify({ bucket, path, expiresIn }),
  });

  return response.signedUrl;
}
