/**
 * Authentication Logic
 * Handles user login/logout with Supabase backend
 */

import { supabaseClient } from './client';
import type { AuthData } from '../utils/auth-storage';

/**
 * Authenticate user with username and password
 */
export async function authenticateUser(
  username: string,
  password: string
): Promise<AuthData | null> {
  try {
    // Call backend authentication endpoint
    const response = await fetch(
      `${supabaseClient.functions}/make-server-685d939a/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseClient.publicKey}`,
        },
        body: JSON.stringify({ username, password }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Authentication failed');
    }

    const data = await response.json();
    return data.user;
  } catch (error: any) {
    console.error('Authentication error:', error);
    throw error;
  }
}

/**
 * Demo/Offline Authentication (fallback)
 * Only use when backend is not available
 */
export function authenticateUserOffline(
  username: string,
  password: string
): AuthData | null {
  // Demo users database
  const demoUsers: Record<string, { password: string; data: AuthData }> = {
    'mr001': {
      password: 'mr123',
      data: {
        id: 'mr-001',
        username: 'mr001',
        name: 'Rajesh Kumar',
        role: 'mr',
        email: 'rajesh@company.com',
        phone: '9876543210',
        territory: 'Mumbai Central',
        manager: 'mgr001',
      },
    },
    'mr002': {
      password: 'mr123',
      data: {
        id: 'mr-002',
        username: 'mr002',
        name: 'Priya Sharma',
        role: 'mr',
        email: 'priya@company.com',
        phone: '9876543211',
        territory: 'Mumbai West',
        manager: 'mgr001',
      },
    },
    'mgr001': {
      password: 'mgr123',
      data: {
        id: 'mgr-001',
        username: 'mgr001',
        name: 'Amit Patel',
        role: 'manager',
        email: 'amit@company.com',
        phone: '9876543220',
        territory: 'Mumbai Region',
      },
    },
    'admin': {
      password: 'admin123',
      data: {
        id: 'admin-001',
        username: 'admin',
        name: 'System Administrator',
        role: 'admin',
        email: 'admin@company.com',
        phone: '9876543200',
      },
    },
  };

  // Check credentials
  const user = demoUsers[username.toLowerCase()];
  if (user && user.password === password) {
    return user.data;
  }

  return null;
}

/**
 * Validate session token
 */
export async function validateSession(token: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${supabaseClient.functions}/make-server-685d939a/auth/validate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
}

/**
 * Refresh authentication token
 */
export async function refreshToken(oldToken: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${supabaseClient.functions}/make-server-685d939a/auth/refresh`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${oldToken}`,
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}
