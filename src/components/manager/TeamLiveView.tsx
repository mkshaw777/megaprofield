import { MapPin, Navigation } from 'lucide-react';

interface MRLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
  status: string;
  lastActivity: string;
}

const mockLocations: MRLocation[] = [
  { id: 1, name: 'John Doe', lat: 19.0760, lng: 72.8777, status: 'At Dr. Rajesh Kumar', lastActivity: '10 mins ago' },
  { id: 2, name: 'Jane Smith', lat: 19.0596, lng: 72.8295, status: 'On-field', lastActivity: '5 mins ago' },
  { id: 3, name: 'Mike Johnson', lat: 19.2183, lng: 72.9781, status: 'Offline', lastActivity: '2 hours ago' },
  { id: 4, name: 'Sarah Williams', lat: 19.1136, lng: 72.8697, status: 'On-field', lastActivity: '15 mins ago' },
];

export default function TeamLiveView() {
  return (
    <div>
      {/* Map View */}
      <div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-blue-100 via-purple-50 to-green-100 h-96 relative">
            {/* Map placeholder with MR pins */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Navigation size={32} className="text-gray-400" />
            </div>
            
            {/* MR Location Pins */}
            {mockLocations.map((location, index) => (
              <div
                key={location.id}
                className="absolute bg-white rounded-lg shadow-lg p-2 animate-bounce"
                style={{
                  top: `${20 + index * 20}%`,
                  left: `${15 + index * 20}%`,
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <MapPin size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-[#1F2937]">{location.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MR List */}
      <div className="p-4">
        <h3 className="text-[#1F2937] mb-3">Team Members</h3>
        <div className="space-y-3">
          {mockLocations.map((location) => (
            <div key={location.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-[#1F2937] mb-1">{location.name}</h4>
                  <p className="text-sm text-gray-600 mb-1">{location.status}</p>
                  <p className="text-xs text-gray-500">Last update: {location.lastActivity}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Location: {location.lat.toFixed(4)}°N, {location.lng.toFixed(4)}°E
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
