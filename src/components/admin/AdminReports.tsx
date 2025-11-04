import { BarChart3, TrendingUp, Users } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const monthlyData = [
  { month: 'Jan', pob: 180000, collection: 142000, expense: 8500 },
  { month: 'Feb', pob: 195000, collection: 158000, expense: 9200 },
  { month: 'Mar', pob: 210000, collection: 165000, expense: 8800 },
  { month: 'Apr', pob: 225000, collection: 182000, expense: 9600 },
  { month: 'May', pob: 240000, collection: 195000, expense: 10200 },
];

const performanceData = [
  { name: 'John Doe', pob: 45000, collection: 32000, visits: 12 },
  { name: 'Jane Smith', pob: 52000, collection: 41000, visits: 15 },
  { name: 'Mike Johnson', pob: 38000, collection: 28000, visits: 10 },
  { name: 'Sarah Williams', pob: 61000, collection: 48000, visits: 18 },
];

export default function AdminReports() {
  return (
    <div className="p-4 lg:p-8 min-w-0 w-full">
      <h1 className="text-[#1F2937] mb-6">Reports & Analytics</h1>

      {/* Monthly Trend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-[#2563EB]" />
          <h3 className="text-[#1F2937]">Monthly Performance Trend</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pob" stroke="#2563EB" name="POB" />
            <Line type="monotone" dataKey="collection" stroke="#10B981" name="Collection" />
            <Line type="monotone" dataKey="expense" stroke="#F59E0B" name="Expense" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* MR Performance Comparison */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={20} className="text-[#10B981]" />
          <h3 className="text-[#1F2937]">MR Performance Comparison</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pob" fill="#2563EB" name="POB" />
            <Bar dataKey="collection" fill="#10B981" name="Collection" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Stats Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users size={20} className="text-[#8B5CF6]" />
          <h3 className="text-[#1F2937]">Detailed Performance Stats</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm text-gray-600">MR Name</th>
                <th className="text-right py-3 px-4 text-sm text-gray-600">Visits</th>
                <th className="text-right py-3 px-4 text-sm text-gray-600">POB</th>
                <th className="text-right py-3 px-4 text-sm text-gray-600">Collection</th>
                <th className="text-right py-3 px-4 text-sm text-gray-600">Collection %</th>
                <th className="text-right py-3 px-4 text-sm text-gray-600">Outstanding</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.map((mr, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-[#1F2937]">{mr.name}</td>
                  <td className="text-right py-3 px-4 text-[#1F2937]">{mr.visits}</td>
                  <td className="text-right py-3 px-4 text-[#1F2937]">₹{mr.pob.toLocaleString()}</td>
                  <td className="text-right py-3 px-4 text-[#1F2937]">₹{mr.collection.toLocaleString()}</td>
                  <td className="text-right py-3 px-4 text-[#1F2937]">
                    {((mr.collection / mr.pob) * 100).toFixed(1)}%
                  </td>
                  <td className="text-right py-3 px-4 text-[#1F2937]">
                    ₹{(mr.pob - mr.collection).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
