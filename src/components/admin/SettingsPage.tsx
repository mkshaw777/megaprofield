import { useState } from 'react';
import { Settings, DollarSign, Car, Hotel } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner@2.0.3';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    daRate: '500',
    taPerKm: '8',
    hotelLimitMR: '1500',
    hotelLimitManager: '2500',
  });

  const handleSave = () => {
    toast.success('Settings updated successfully!');
  };

  return (
    <div className="p-4 lg:p-8 min-w-0 w-full">
      <div className="flex items-center gap-2 mb-6">
        <Settings size={24} className="text-[#2563EB]" />
        <h1 className="text-[#1F2937]">System Settings</h1>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="text-[#1F2937] mb-4">Expense Rates Configuration</h3>
          <p className="text-sm text-gray-600 mb-6">
            Configure the daily allowance and travel rates for MR expense calculations
          </p>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="da">Daily Allowance (DA) per day (₹)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="da"
                  type="number"
                  value={settings.daRate}
                  onChange={(e) => setSettings({ ...settings, daRate: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ta">Travel Allowance (TA) per kilometer (₹)</Label>
              <div className="relative">
                <Car className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="ta"
                  type="number"
                  value={settings.taPerKm}
                  onChange={(e) => setSettings({ ...settings, taPerKm: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hotel-mr">Hotel Bill Limit - MR (₹)</Label>
              <div className="relative">
                <Hotel className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="hotel-mr"
                  type="number"
                  value={settings.hotelLimitMR}
                  onChange={(e) => setSettings({ ...settings, hotelLimitMR: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hotel-manager">Hotel Bill Limit - Manager (₹)</Label>
              <div className="relative">
                <Hotel className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="hotel-manager"
                  type="number"
                  value={settings.hotelLimitManager}
                  onChange={(e) => setSettings({ ...settings, hotelLimitManager: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Current Rate Summary */}
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 mb-6">
          <h3 className="text-[#1F2937] mb-4">Current Rate Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Daily Allowance</p>
              <p className="text-[#1F2937]">₹{settings.daRate}/day</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Travel Allowance</p>
              <p className="text-[#1F2937]">₹{settings.taPerKm}/km</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Hotel Limit (MR)</p>
              <p className="text-[#1F2937]">₹{settings.hotelLimitMR}</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Hotel Limit (Manager)</p>
              <p className="text-[#1F2937]">₹{settings.hotelLimitManager}</p>
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full h-12 bg-[#10B981] hover:bg-green-600">
          Save Settings
        </Button>
      </div>
    </div>
  );
}
