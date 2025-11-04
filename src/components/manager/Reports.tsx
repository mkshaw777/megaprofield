import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const performanceData = [
  { name: 'John', pob: 45000, collection: 32000 },
  { name: 'Jane', pob: 52000, collection: 41000 },
  { name: 'Mike', pob: 38000, collection: 28000 },
  { name: 'Sarah', pob: 61000, collection: 48000 },
];

const weeklyData = [
  { day: 'Mon', visits: 12 },
  { day: 'Tue', visits: 15 },
  { day: 'Wed', visits: 10 },
  { day: 'Thu', visits: 18 },
  { day: 'Fri', visits: 14 },
];

export default function Reports() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-white mb-2">Reports & Analytics</h1>
        <p className="text-sm opacity-90">Team performance insights</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={20} className="text-[#10B981]" />
              <p className="text-sm text-gray-600">Total POB</p>
            </div>
            <p className="text-[#1F2937]">₹2,40,000</p>
            <p className="text-xs text-green-600 mt-1">↑ 12% vs last week</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={20} className="text-[#2563EB]" />
              <p className="text-sm text-gray-600">Collection</p>
            </div>
            <p className="text-[#1F2937]">₹1,80,000</p>
            <p className="text-xs text-green-600 mt-1">↑ 8% vs last week</p>
          </div>
        </div>

        {/* MR Performance Chart */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={20} className="text-[#2563EB]" />
            <h3 className="text-[#1F2937]">MR Performance</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="pob" fill="#2563EB" />
              <Bar dataKey="collection" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#2563EB] rounded"></div>
              <span className="text-xs text-gray-600">POB</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#10B981] rounded"></div>
              <span className="text-xs text-gray-600">Collection</span>
            </div>
          </div>
        </div>

        {/* Weekly Visits Chart */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Users size={20} className="text-[#8B5CF6]" />
            <h3 className="text-[#1F2937]">Weekly Visits</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="visits" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Individual MR Stats */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-[#1F2937] mb-3">Individual Performance</h3>
          <div className="space-y-3">
            {performanceData.map((mr) => (
              <div key={mr.name} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#1F2937]">{mr.name}</span>
                  <span className="text-sm text-gray-600">
                    {((mr.collection / mr.pob) * 100).toFixed(0)}% collection rate
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">POB</p>
                    <p className="text-[#1F2937]">₹{mr.pob.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Collection</p>
                    <p className="text-[#1F2937]">₹{mr.collection.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
