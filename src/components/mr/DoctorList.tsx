import { useState, useEffect } from 'react';
import { Search, MapPin, Stethoscope, MapPinned, Navigation } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';
import { getAllDoctors, updateDoctor } from '../../utils/dataStorage';
import { getCurrentUser } from '../../utils/authStorage';
import type { Doctor } from '../../utils/types';

interface DoctorListProps {
  onStartVisit: (doctorName: string, specialty: string) => void;
}

export default function DoctorList({ onStartVisit }: DoctorListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [settingLocation, setSettingLocation] = useState<string | null>(null);
  
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = () => {
    const allDoctors = getAllDoctors();
    // Filter doctors assigned to current MR (case-insensitive check)
    const myDoctors = currentUser 
      ? allDoctors.filter(d => d.assignedMrId === currentUser.userId || d.assignedMRId === currentUser.userId)
      : allDoctors;
    console.log('Current User:', currentUser);
    console.log('All Doctors:', allDoctors);
    console.log('My Doctors:', myDoctors);
    setDoctors(myDoctors);
  };

  const handleSetLocation = async (doctor: Doctor) => {
    if (!navigator.geolocation) {
      toast.error('GPS not supported', {
        description: 'Your device does not support location services',
      });
      return;
    }

    setSettingLocation(doctor.doctorId);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        const updated = updateDoctor(doctor.doctorId, {
          location: { latitude, longitude },
        });

        if (updated) {
          toast.success('Location updated!', {
            description: `${doctor.name}'s clinic location has been set`,
          });
          loadDoctors(); // Reload to show updated data
        } else {
          toast.error('Update failed');
        }
        
        setSettingLocation(null);
      },
      (error) => {
        toast.error('Location access denied', {
          description: 'Please allow location access to set doctor location',
        });
        setSettingLocation(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doctor.clinic?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (doctor.address?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-white mb-4">Doctors</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search doctors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white h-12"
          />
        </div>
      </div>

      {/* Doctor List */}
      <div className="p-4 space-y-3">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.doctorId} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-[#1F2937]">{doctor.name}</h3>
                  {doctor.location ? (
                    <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                      <MapPinned size={12} className="mr-1" />
                      GPS Set
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-orange-600 border-orange-600 text-xs">
                      No GPS
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Stethoscope size={16} />
                  <span>{doctor.specialty}</span>
                </div>
                {doctor.clinic && (
                  <p className="text-sm text-gray-600 mb-1">{doctor.clinic}</p>
                )}
                {doctor.address && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={16} />
                    <span>{doctor.address}</span>
                  </div>
                )}
                {doctor.phone && (
                  <p className="text-sm text-gray-500 mt-1">📞 {doctor.phone}</p>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => onStartVisit(doctor.name, doctor.specialty)}
                className="flex-1 bg-[#10B981] hover:bg-green-600"
              >
                Start Visit
              </Button>
              
              {!doctor.location && (
                <Button
                  onClick={() => handleSetLocation(doctor)}
                  variant="outline"
                  className="flex-shrink-0"
                  disabled={settingLocation === doctor.doctorId}
                >
                  <Navigation size={16} className="mr-1" />
                  {settingLocation === doctor.doctorId ? 'Setting...' : 'Set GPS'}
                </Button>
              )}
            </div>
          </div>
        ))}
        
        {filteredDoctors.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-6xl mb-4">👨‍⚕️</div>
              <h3 className="text-lg mb-2 text-gray-800">No Doctors Assigned</h3>
              <p className="text-sm text-gray-500 mb-4">
                {searchQuery 
                  ? 'No doctors match your search. Try a different keyword.'
                  : 'You don\'t have any doctors assigned yet. Please contact your admin to assign doctors to you.'
                }
              </p>
              {!searchQuery && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-700">
                    <strong>Note:</strong> Login as Admin to assign doctors to MRs in the Data Management section.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
