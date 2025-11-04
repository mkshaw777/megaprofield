// Authentication and User Management with LocalStorage
// Compatible with new dataStorage types

import { User, Doctor, generateId, createUser, getAllUsers as getUsers, createDoctor, getAllDoctors } from './dataStorage';

export interface StaffUser {
  id: number;
  name: string;
  email: string;
  username: string;
  password: string;
  role: 'MR' | 'Manager' | 'Admin';
  manager?: string;
  phone: string;
  territory: string;
  createdAt: string;
}

const STORAGE_KEY = 'megapro_auth_legacy';
const CURRENT_USER_KEY = 'megapro_current_user';
const INITIALIZED_KEY = 'megapro_initialized';

// Initialize system with default users and sample data
const initializeSystem = (): void => {
  if (typeof window === 'undefined') return;
  
  const initialized = localStorage.getItem(INITIALIZED_KEY);
  if (initialized) return;
  
  console.log('Initializing Megapro SFA system...');
  
  // Create Manager
  const manager = createUser({
    name: 'Sarah Smith',
    username: 'manager',
    passwordHash: 'manager', // In production, use proper hashing
    role: 'manager',
    isActive: true,
  });
  
  // Create Admin
  createUser({
    name: 'Admin User',
    username: 'admin',
    passwordHash: 'admin',
    role: 'admin',
    isActive: true,
  });
  
  // Create MRs
  const mr1 = createUser({
    name: 'John Doe',
    username: 'mr',
    passwordHash: 'mr',
    role: 'mr',
    linkedManagerId: manager.userId,
    isActive: true,
  });
  
  const mr2 = createUser({
    name: 'Jane Smith',
    username: 'jane',
    passwordHash: 'jane123',
    role: 'mr',
    linkedManagerId: manager.userId,
    isActive: true,
  });
  
  // Create sample doctors - assigned to mr1 (username: mr)
  const sampleDoctors: Omit<Doctor, 'doctorId'>[] = [
    {
      name: 'Dr. Rajesh Kumar',
      specialty: 'Cardiologist',
      clinic: 'Apollo Hospital',
      address: 'Apollo Hospital, Mumbai',
      phone: '+91 98765 11111',
      assignedMrId: mr1.userId,
      assignedMRId: mr1.userId, // Also set this for backward compatibility
      isActive: true,
    },
    {
      name: 'Dr. Priya Sharma',
      specialty: 'Pediatrician',
      clinic: 'Lilavati Hospital',
      address: 'Lilavati Hospital, Mumbai',
      phone: '+91 98765 22222',
      assignedMrId: mr1.userId,
      assignedMRId: mr1.userId,
      isActive: true,
    },
    {
      name: 'Dr. Amit Patel',
      specialty: 'Orthopedic',
      clinic: 'Fortis Hospital',
      address: 'Fortis Hospital, Mumbai',
      phone: '+91 98765 33333',
      assignedMrId: mr1.userId,
      assignedMRId: mr1.userId,
      isActive: true,
    },
    {
      name: 'Dr. Sunita Verma',
      specialty: 'Dermatologist',
      clinic: 'Kokilaben Hospital',
      address: 'Kokilaben Hospital, Mumbai',
      phone: '+91 98765 44444',
      assignedMrId: mr1.userId,
      assignedMRId: mr1.userId,
      isActive: true,
    },
    {
      name: 'Dr. Vikram Singh',
      specialty: 'Neurologist',
      clinic: 'Breach Candy Hospital',
      address: 'Breach Candy Hospital, Mumbai',
      phone: '+91 98765 55555',
      assignedMrId: mr1.userId,
      assignedMRId: mr1.userId,
      isActive: true,
    },
    {
      name: 'Dr. Kavita Joshi',
      specialty: 'Ophthalmologist',
      clinic: 'Hinduja Hospital',
      address: 'Hinduja Hospital, Mumbai',
      phone: '+91 98765 66666',
      assignedMrId: mr1.userId,
      assignedMRId: mr1.userId,
      isActive: true,
    },
    {
      name: 'Dr. Suresh Reddy',
      specialty: 'General Physician',
      clinic: 'Jaslok Hospital',
      address: 'Jaslok Hospital, Mumbai',
      phone: '+91 98765 77777',
      assignedMrId: mr1.userId,
      assignedMRId: mr1.userId,
      isActive: true,
    },
    {
      name: 'Dr. Meera Iyer',
      specialty: 'Psychiatrist',
      clinic: 'Bombay Hospital',
      address: 'Bombay Hospital, Mumbai',
      phone: '+91 98765 88888',
      assignedMrId: mr1.userId,
      assignedMRId: mr1.userId,
      isActive: true,
    },
  ];
  
  sampleDoctors.forEach(doctor => createDoctor(doctor));
  
  console.log(`Created ${sampleDoctors.length} sample doctors assigned to ${mr1.name} (${mr1.username})`);
  
  localStorage.setItem(INITIALIZED_KEY, 'true');
  console.log('System initialized successfully!');
};

// Get all users (wrapper for compatibility)
export const getAllUsers = (): StaffUser[] => {
  initializeSystem();
  
  const users = getUsers();
  
  // Convert new User type to legacy StaffUser type for compatibility
  return users.map((u, index) => ({
    id: index + 1,
    name: u.name,
    email: `${u.username}@megapro.com`,
    username: u.username,
    password: u.passwordHash,
    role: u.role === 'mr' ? 'MR' : u.role === 'manager' ? 'Manager' : 'Admin',
    manager: u.linkedManagerId ? getUserName(u.linkedManagerId) : undefined,
    phone: '+91 98765 43210',
    territory: u.role === 'admin' ? 'All Regions' : 'Mumbai',
    createdAt: new Date(u.createdAt).toISOString(),
  }));
};

const getUserName = (userId: string): string => {
  const users = getUsers();
  const user = users.find(u => u.userId === userId);
  return user ? user.name : '';
};

// Save all users (for compatibility)
export const saveAllUsers = (users: StaffUser[]): void => {
  // This is for legacy compatibility
  // Actual saving happens through dataStorage
};

// Add new user
export const addUser = (user: Omit<StaffUser, 'id' | 'createdAt'>): StaffUser => {
  const managerId = user.manager ? getUsers().find(u => u.name === user.manager)?.userId : undefined;
  
  const newUser = createUser({
    name: user.name,
    username: user.username,
    passwordHash: user.password,
    role: user.role === 'MR' ? 'mr' : user.role === 'Manager' ? 'manager' : 'admin',
    linkedManagerId: managerId,
    isActive: true,
  });
  
  const users = getAllUsers();
  return users.find(u => u.username === user.username)!;
};

// Update user - using new ID system
export const updateUserById = (userId: string, updates: Partial<User>): void => {
  // Use the new dataStorage update function
  import('./dataStorage').then(({ updateUser: updateUserDS }) => {
    updateUserDS(userId, updates);
  });
};

// Legacy update by number ID
export const updateUser = (id: number, updates: Partial<StaffUser>): void => {
  const users = getAllUsers();
  const user = users[id - 1];
  if (!user) return;
  
  const realUser = getUsers().find(u => u.username === user.username);
  if (!realUser) return;
  
  updateUserById(realUser.userId, {
    name: updates.name || realUser.name,
    isActive: realUser.isActive,
  });
};

// Delete user
export const deleteUser = (id: number): void => {
  const users = getAllUsers();
  const user = users[id - 1];
  if (!user) return;
  
  const realUser = getUsers().find(u => u.username === user.username);
  if (!realUser) return;
  
  import('./dataStorage').then(({ deleteUser: deleteUserDS }) => {
    deleteUserDS(realUser.userId);
  });
};

// Authenticate user
export const authenticateUser = (username: string, password: string): StaffUser | null => {
  initializeSystem();
  
  const users = getUsers();
  const user = users.find(u => u.username === username && u.passwordHash === password && u.isActive);
  
  if (!user) return null;
  
  // Store current user session
  if (typeof window !== 'undefined') {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
      userId: user.userId,
      username: user.username,
      name: user.name,
      role: user.role,
    }));
  }
  
  // Convert to legacy format
  const allUsers = getAllUsers();
  return allUsers.find(u => u.username === username) || null;
};

// Get current logged-in user
export const getCurrentUser = (): { userId: string; username: string; name: string; role: string } | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

// Logout
export const logoutUser = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Check if username exists
export const usernameExists = (username: string): boolean => {
  const users = getAllUsers();
  return users.some(u => u.username.toLowerCase() === username.toLowerCase());
};

// Check if email exists
export const emailExists = (email: string): boolean => {
  const users = getAllUsers();
  return users.some(u => u.email.toLowerCase() === email.toLowerCase());
};

// Generate username from email
export const generateUsername = (email: string): string => {
  const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Check if username exists, add number suffix if needed
  let username = baseUsername;
  let counter = 1;
  
  while (usernameExists(username)) {
    username = `${baseUsername}${counter}`;
    counter++;
  }
  
  return username;
};

// Generate random password
export const generatePassword = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Get users by role
export const getUsersByRole = (role: 'MR' | 'Manager' | 'Admin'): StaffUser[] => {
  const users = getAllUsers();
  return users.filter(u => u.role === role);
};

// Get managers (for dropdown)
export const getManagers = (): StaffUser[] => {
  return getUsersByRole('Manager');
};
