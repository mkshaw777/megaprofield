import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import MRApp from './components/MRApp';
import ManagerApp from './components/ManagerApp';
import AdminApp from './components/AdminApp';
import { Toaster } from './components/ui/sonner';
import { authenticateUser, getAllUsers } from './utils/authStorage';
import { getAllDoctors } from './utils/dataStorage';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<{ name: string; role: 'mr' | 'manager' | 'admin' } | null>(null);

  useEffect(() => {
    // Initialize system on app load - this triggers sample data creation
    getAllUsers();
    getAllDoctors();
    
    // Splash screen timer - updated for better UX
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (username: string, password: string) => {
    // Dynamic authentication using localStorage
    const authenticatedUser = authenticateUser(username, password);
    
    if (authenticatedUser) {
      // Map role to lowercase for component routing
      const roleMap = {
        'MR': 'mr',
        'Manager': 'manager',
        'Admin': 'admin',
      } as const;
      
      setUser({ 
        name: authenticatedUser.name, 
        role: roleMap[authenticatedUser.role] as 'mr' | 'manager' | 'admin'
      });
    } else {
      alert('Invalid credentials. Please check your username and password.');
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!user) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  if (user.role === 'mr') {
    return (
      <>
        <MRApp userName={user.name} onLogout={handleLogout} />
        <Toaster />
      </>
    );
  }

  if (user.role === 'manager') {
    return (
      <>
        <ManagerApp userName={user.name} onLogout={handleLogout} />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <AdminApp userName={user.name} onLogout={handleLogout} />
      <Toaster />
    </>
  );
}
