import { useState, useEffect } from 'react';
import SplashScreen from './components/auth/SplashScreen';
import LoginScreen from './components/auth/LoginScreen';
import MRApp from './components/mr/MRApp';
import ManagerApp from './components/manager/ManagerApp';
import AdminApp from './components/admin/AdminApp';
import { Toaster } from './components/ui/sonner';
import { getAuthData, clearAuthData } from './lib/utils/auth-storage';

type UserRole = 'mr' | 'manager' | 'admin';

interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const authData = getAuthData();
        if (authData) {
          setUser(authData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearAuthData();
      } finally {
        // Show splash for minimum 2 seconds for branding
        setTimeout(() => setLoading(false), 2000);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    clearAuthData();
    setUser(null);
  };

  if (loading) {
    return <SplashScreen />;
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Route to appropriate app based on role
  switch (user.role) {
    case 'mr':
      return <MRApp user={user} onLogout={handleLogout} />;
    case 'manager':
      return <ManagerApp user={user} onLogout={handleLogout} />;
    case 'admin':
      return <AdminApp user={user} onLogout={handleLogout} />;
    default:
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid Role</h2>
            <p className="text-gray-600 mb-6">
              Your account role is not recognized. Please contact support.
            </p>
            <button
              onClick={handleLogout}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Logout
            </button>
          </div>
          <Toaster position="top-center" />
        </div>
      );
  }
}
