import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import MRApp from './components/MRApp';
import ManagerApp from './components/ManagerApp';
import AdminApp from './components/AdminApp';
import { Toaster } from './components/ui/sonner';
import { authenticateUser } from './utils/authStorage';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<{ name: string; role: 'mr' | 'manager' | 'admin' } | null>(null);

  useEffect(() => {
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

  return (
    <>
      {user.role === 'mr' && <MRApp userName={user.name} onLogout={handleLogout} />}
      {user.role === 'manager' && <ManagerApp userName={user.name} onLogout={handleLogout} />}
      {user.role === 'admin' && <AdminApp userName={user.name} onLogout={handleLogout} />}
      <Toaster />
    </>
  );
}
