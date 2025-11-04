/**
 * Auth Storage Utility
 * Manages authentication data in localStorage
 */

const AUTH_KEY = 'fieldforce_auth';

export interface AuthData {
  id: string;
  username: string;
  name: string;
  role: 'mr' | 'manager' | 'admin';
  email?: string;
  phone?: string;
  territory?: string;
  manager?: string;
}

/**
 * Save authentication data to localStorage
 */
export function setAuthData(data: AuthData): void {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save auth data:', error);
  }
}

/**
 * Get authentication data from localStorage
 */
export function getAuthData(): AuthData | null {
  try {
    const data = localStorage.getItem(AUTH_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to get auth data:', error);
    return null;
  }
}

/**
 * Clear authentication data from localStorage
 */
export function clearAuthData(): void {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch (error) {
    console.error('Failed to clear auth data:', error);
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getAuthData() !== null;
}

/**
 * Get current user role
 */
export function getUserRole(): string | null {
  const authData = getAuthData();
  return authData?.role || null;
}
