import { User, Mail, Phone, MapPin, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import logo from 'figma:asset/e251b5c18758a36c694bcd1e83413a4344519727.png';

interface ProfileProps {
  userName: string;
  role: string;
  onLogout: () => void;
}

export default function Profile({ userName, role, onLogout }: ProfileProps) {
  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mb-4">
              <User size={48} className="text-white" />
            </div>
            <h2 className="text-[#1F2937] text-center">{userName}</h2>
            <p className="text-gray-600 text-center">{role}</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail size={20} className="text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm text-[#1F2937]">{userName.toLowerCase().replace(' ', '.')}@megapro.com</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone size={20} className="text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm text-[#1F2937]">+91 98765 43210</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin size={20} className="text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Territory</p>
                <p className="text-sm text-[#1F2937]">Mumbai - Central</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <img src={logo} alt="Megapro Innovation" className="h-10" />
            </div>
            <p className="text-[#1F2937] mb-1">Megapro Innovation</p>
            <p className="text-xs text-gray-500 mb-3">Sales Force Automation</p>
            <p className="text-xs text-gray-600">Version 1.0.0</p>
          </div>
        </div>
        
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full h-12 text-red-600 border-red-600 hover:bg-red-50"
        >
          <LogOut size={20} className="mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
