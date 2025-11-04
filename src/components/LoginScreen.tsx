import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import logo from 'figma:asset/e251b5c18758a36c694bcd1e83413a4344519727.png';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Logo and Company Name */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <img src={logo} alt="Megapro Innovation" className="h-12" />
            </div>
            <h1 className="text-[#1F2937] mb-1">Megapro Innovation</h1>
            <p className="text-sm text-gray-600">Sales Force Automation</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>
            
            <Button type="submit" className="w-full h-12 bg-[#2563EB] hover:bg-[#1d4ed8]">
              Login
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Default credentials:</p>
            <p className="font-mono text-xs">MR: mr/mr | Manager: manager/manager | Admin: admin/admin</p>
            <p className="mt-2 text-xs">New staff members can use their assigned credentials</p>
          </div>
          
          {/* Footer Branding */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-400">© 2025 Megapro Innovation. All rights reserved.</p>
            <p className="text-xs text-gray-400 mt-1">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
