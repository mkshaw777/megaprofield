import { useState, useEffect } from 'react';
import { DollarSign, AlertTriangle, Receipt, Search, ArrowUpDown, Eye, RefreshCw } from 'lucide-react';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import MRActivityReport from './MRActivityReport';
import { getAllMRPerformance, type MRPerformance } from '../../utils/dataStorage';

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<MRPerformance[]>([]);
  const [showActivityReport, setShowActivityReport] = useState(false);
  const [selectedMR, setSelectedMR] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Load data on mount and refresh
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const performanceData = getAllMRPerformance();
    setData(performanceData);
    setLastUpdate(new Date());
  };

  if (showActivityReport && selectedMR) {
    return <MRActivityReport mrUsername={selectedMR} onBack={() => {
      setShowActivityReport(false);
      setSelectedMR(null);
      loadData(); // Refresh data when coming back
    }} />;
  }

  const filteredData = data.filter(
    (item) =>
      item.mrName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mrUsername.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSale = data.reduce((sum, item) => sum + item.totalPOB, 0);
  const totalCollection = data.reduce((sum, item) => sum + item.totalCollection, 0);
  const totalOutstanding = totalSale - totalCollection;
  const totalExpenses = data.reduce((sum, item) => sum + item.totalExpenses, 0);
  const totalVisits = data.reduce((sum, item) => sum + item.visits, 0);

  return (
    <div className="p-4 lg:p-8 min-w-0 w-full">
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="min-w-0">
          <h1 className="text-[#1F2937]">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <Button 
          onClick={loadData} 
          variant="outline"
          className="gap-2"
        >
          <RefreshCw size={16} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 lg:mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Visits</p>
            <Eye size={20} className="text-[#2563EB]" />
          </div>
          <p className="text-[#1F2937]">{totalVisits}</p>
          <p className="text-xs text-gray-500 mt-1">{data.length} Active MRs</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Sale (POB)</p>
            <DollarSign size={20} className="text-[#10B981]" />
          </div>
          <p className="text-[#1F2937]">₹{totalSale.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">
            Collection: ₹{totalCollection.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Outstanding</p>
            <AlertTriangle size={20} className="text-[#F59E0B]" />
          </div>
          <p className="text-[#1F2937]">₹{totalOutstanding.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">
            {totalSale > 0 ? Math.round((totalOutstanding / totalSale) * 100) : 0}% of sales
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Expenses</p>
            <Receipt size={20} className="text-[#EF4444]" />
          </div>
          <p className="text-[#1F2937]">₹{totalExpenses.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">All MRs combined</p>
        </div>
      </div>

      {/* Data Status Alert */}
      {data.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={20} className="text-[#2563EB]" />
            <h3 className="text-[#1F2937]">No Activity Yet</h3>
          </div>
          <p className="text-sm text-gray-600">
            No MR activity recorded yet. MRs need to complete doctor visits to see data here.
          </p>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={20} className="text-[#10B981]" />
            <h3 className="text-[#1F2937]">Live Data</h3>
          </div>
          <p className="text-sm text-gray-600">
            Real-time data from all MRs. Click "View Details" to see individual MR activity reports.
          </p>
        </div>
      )}

      {/* Search and Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    MR Name <ArrowUpDown size={14} />
                  </div>
                </TableHead>
              <TableHead className="whitespace-nowrap">Username</TableHead>
              <TableHead className="text-center whitespace-nowrap">Visits</TableHead>
              <TableHead className="text-right whitespace-nowrap">POB</TableHead>
              <TableHead className="text-right whitespace-nowrap">Collection</TableHead>
              <TableHead className="text-right whitespace-nowrap">Outstanding</TableHead>
              <TableHead className="text-right whitespace-nowrap">Expenses</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  {searchQuery ? 'No MRs found matching your search' : 'No MR data available'}
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.mrId}>
                  <TableCell>{item.mrName}</TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-[#2563EB]">
                      {item.mrUsername}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{item.visits}</Badge>
                  </TableCell>
                  <TableCell className="text-right">₹{item.totalPOB.toLocaleString()}</TableCell>
                  <TableCell className="text-right">₹{item.totalCollection.toLocaleString()}</TableCell>
                  <TableCell className="text-right">₹{item.totalOutstanding.toLocaleString()}</TableCell>
                  <TableCell className="text-right">₹{item.totalExpenses.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedMR(item.mrUsername);
                        setShowActivityReport(true);
                      }}
                    >
                      <Eye size={16} className="mr-2" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        </div>
      </div>
    </div>
  );
}
