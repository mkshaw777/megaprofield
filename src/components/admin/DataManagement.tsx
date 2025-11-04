import { useState } from 'react';
import { Upload, Download, FileText, Users, Package, DollarSign, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner@2.0.3';
import { Alert, AlertDescription } from '../ui/alert';
import { bulkCreateDoctors, bulkCreateProducts, bulkCreateOutstandingPayments, getAllDoctors, getAllProducts, getAllOutstandingPayments, getAllUsers } from '../../utils/dataStorage';
import type { Doctor, Product, OutstandingPayment } from '../../utils/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export default function DataManagement() {
  const [uploading, setUploading] = useState(false);
  const [selectedMRId, setSelectedMRId] = useState<string>('');
  
  // Get current data counts
  const doctors = getAllDoctors();
  const products = getAllProducts();
  const outstandingPayments = getAllOutstandingPayments();
  
  // Get all MRs and Managers for assignment
  const allUsers = getAllUsers();
  const mrAndManagers = allUsers.filter(u => u.role === 'mr' || u.role === 'manager');

  const parseDoctorCSV = (csvText: string, assignedToMRId?: string): Omit<Doctor, 'doctorId'>[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV file is empty or has no data rows');
    }

    const headers = lines[0].split(',').map(h => h.trim());
    // Required headers - GPS is now optional
    const requiredHeaders = ['name', 'specialty', 'clinic', 'address', 'phone'];
    
    // Validate required headers
    const hasRequiredHeaders = requiredHeaders.every(h => headers.includes(h));
    if (!hasRequiredHeaders) {
      throw new Error(`Invalid CSV format. Required headers: ${requiredHeaders.join(', ')}`);
    }

    const doctors: Omit<Doctor, 'doctorId'>[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',').map(v => v.trim());
      
      if (values.length < 5) {
        throw new Error(`Row ${i + 1}: Missing required fields (name, specialty, clinic, address, phone)`);
      }

      // Parse latitude/longitude if provided (optional)
      let location: { latitude: number; longitude: number } | undefined;
      if (values[5] && values[6]) {
        const lat = parseFloat(values[5]);
        const lng = parseFloat(values[6]);
        if (!isNaN(lat) && !isNaN(lng)) {
          location = { latitude: lat, longitude: lng };
        }
      }

      doctors.push({
        name: values[0],
        specialty: values[1],
        clinic: values[2],
        address: values[3],
        phone: values[4],
        assignedMRId: assignedToMRId, // Use the selected MR from dropdown
        assignedMRName: undefined, // Will be set by backend
        location, // Optional GPS coordinates
        createdAt: Date.now(),
      });
    }

    return doctors;
  };

  const parseProductCSV = (csvText: string): Omit<Product, 'productId'>[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV file is empty or has no data rows');
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const expectedHeaders = ['name', 'sku', 'category', 'price', 'description'];
    
    const hasAllHeaders = expectedHeaders.every(h => headers.includes(h));
    if (!hasAllHeaders) {
      throw new Error(`Invalid CSV format. Expected headers: ${expectedHeaders.join(', ')}`);
    }

    const products: Omit<Product, 'productId'>[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',').map(v => v.trim());
      
      if (values.length < 5) {
        throw new Error(`Row ${i + 1}: Insufficient columns`);
      }

      products.push({
        name: values[0],
        sku: values[1],
        category: values[2],
        price: parseFloat(values[3]),
        description: values[4] || '',
      });
    }

    return products;
  };

  const parseOutstandingCSV = (csvText: string): Omit<OutstandingPayment, 'paymentId'>[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV file is empty or has no data rows');
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const expectedHeaders = ['doctorId', 'doctorName', 'assignedMRId', 'assignedMRName', 'amount', 'dueDate', 'invoiceNumber'];
    
    const hasAllHeaders = expectedHeaders.every(h => headers.includes(h));
    if (!hasAllHeaders) {
      throw new Error(`Invalid CSV format. Expected headers: ${expectedHeaders.join(', ')}`);
    }

    const payments: Omit<OutstandingPayment, 'paymentId'>[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',').map(v => v.trim());
      
      if (values.length < 7) {
        throw new Error(`Row ${i + 1}: Insufficient columns`);
      }

      payments.push({
        doctorId: values[0],
        doctorName: values[1],
        assignedMRId: values[2],
        assignedMRName: values[3],
        amount: parseFloat(values[4]),
        dueDate: new Date(values[5]).getTime(),
        invoiceNumber: values[6],
        isPaid: false,
        createdAt: Date.now(),
      });
    }

    return payments;
  };

  const handleDoctorUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }
    
    if (!selectedMRId) {
      toast.error('Please select MR/Manager first', {
        description: 'Doctors must be assigned to an MR or Manager',
      });
      e.target.value = '';
      return;
    }

    setUploading(true);

    try {
      const text = await file.text();
      const doctors = parseDoctorCSV(text, selectedMRId);
      
      const created = bulkCreateDoctors(doctors);
      
      const assignedUser = mrAndManagers.find(u => u.userId === selectedMRId);
      
      toast.success(`Successfully uploaded ${created.length} doctors!`, {
        description: `Assigned to ${assignedUser?.name || 'selected user'}`,
      });
      
      // Reset file input
      e.target.value = '';
    } catch (error: any) {
      toast.error('Upload failed', {
        description: error.message || 'Invalid CSV format',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleProductUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setUploading(true);

    try {
      const text = await file.text();
      const products = parseProductCSV(text);
      
      const created = bulkCreateProducts(products);
      
      toast.success(`Successfully uploaded ${created.length} products!`, {
        description: 'Product catalog has been updated',
      });
      
      e.target.value = '';
    } catch (error: any) {
      toast.error('Upload failed', {
        description: error.message || 'Invalid CSV format',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleOutstandingUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setUploading(true);

    try {
      const text = await file.text();
      const payments = parseOutstandingCSV(text);
      
      const created = bulkCreateOutstandingPayments(payments);
      
      toast.success(`Successfully uploaded ${created.length} outstanding payments!`, {
        description: 'Outstanding records have been updated',
      });
      
      e.target.value = '';
    } catch (error: any) {
      toast.error('Upload failed', {
        description: error.message || 'Invalid CSV format',
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadSampleCSV = (type: 'doctor' | 'product' | 'outstanding') => {
    let csvContent = '';
    let filename = '';

    if (type === 'doctor') {
      csvContent = `name,specialty,clinic,address,phone,latitude,longitude
Dr. Rajesh Kumar,Cardiologist,City Heart Clinic,123 MG Road Mumbai,9876543210,19.0760,72.8777
Dr. Priya Sharma,Pediatrician,Children's Care Center,456 Park Street Delhi,9876543211,28.7041,77.1025
Dr. Amit Patel,Orthopedic,Bone & Joint Hospital,789 FC Road Pune,9876543212,,
Dr. Sunita Verma,Dermatologist,Skin Care Clinic,321 Ring Road Bangalore,9876543213,,`;
      filename = 'sample_doctors.csv';
    } else if (type === 'product') {
      csvContent = `name,sku,category,price,description
Aspirin 100mg,MED-001,Analgesic,25.50,Pain relief medication
Amoxicillin 500mg,MED-002,Antibiotic,85.00,Broad spectrum antibiotic
Omeprazole 20mg,MED-003,Antacid,45.00,Proton pump inhibitor`;
      filename = 'sample_products.csv';
    } else {
      csvContent = `doctorId,doctorName,assignedMRId,assignedMRName,amount,dueDate,invoiceNumber
doc-1,Dr. Rajesh Kumar,mr-1,John Doe,15000,2025-11-30,INV-2025-001
doc-2,Dr. Priya Sharma,mr-1,John Doe,8500,2025-12-15,INV-2025-002
doc-3,Dr. Amit Patel,mr-2,Jane Smith,22000,2025-12-01,INV-2025-003`;
      filename = 'sample_outstanding.csv';
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(`Sample ${type} CSV downloaded`);
  };

  const handleDownload = (type: string) => {
    toast.success(`${type} download initiated`);
  };

  return (
    <div className="p-4 lg:p-8 min-w-0 w-full">
      <h1 className="text-[#1F2937] mb-6">Data Management</h1>

      {/* Info Alert */}
      <Alert className="mb-6 border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Upload CSV files to bulk import data. Select MR/Manager first for doctor uploads. GPS coordinates are optional - MR can set them during visits.
        </AlertDescription>
      </Alert>

      {/* MR/Manager Selection for Doctor Upload */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="text-[#1F2937] mb-4 flex items-center gap-2">
          <Users size={20} className="text-[#2563EB]" />
          Assign Doctors to MR/Manager
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Select which MR or Manager should handle these doctors. This is required for doctor uploads.
        </p>
        <Select value={selectedMRId} onValueChange={setSelectedMRId}>
          <SelectTrigger className="w-full md:w-96">
            <SelectValue placeholder="Select MR or Manager..." />
          </SelectTrigger>
          <SelectContent>
            {mrAndManagers.map(user => (
              <SelectItem key={user.userId} value={user.userId}>
                {user.name} ({user.role === 'mr' ? 'MR' : 'Manager'})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedMRId && (
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
            <CheckCircle2 size={14} />
            Selected: {mrAndManagers.find(u => u.userId === selectedMRId)?.name}
          </p>
        )}
      </div>

      {/* Upload Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <UploadCard
          title="Upload Doctor List"
          icon={Users}
          iconColor="#2563EB"
          description="Upload CSV file with doctor details"
          onUpload={handleDoctorUpload}
          onDownloadSample={() => downloadSampleCSV('doctor')}
          disabled={uploading || !selectedMRId}
          format="name, specialty, clinic, address, phone (latitude, longitude optional)"
          requiresSelection={!selectedMRId}
        />
        <UploadCard
          title="Upload Product List"
          icon={Package}
          iconColor="#10B981"
          description="Upload CSV file with product catalog"
          onUpload={handleProductUpload}
          onDownloadSample={() => downloadSampleCSV('product')}
          disabled={uploading}
          format="name, sku, category, price, description"
        />
        <UploadCard
          title="Upload Outstanding"
          icon={DollarSign}
          iconColor="#F59E0B"
          description="Upload CSV file with outstanding amounts"
          onUpload={handleOutstandingUpload}
          onDownloadSample={() => downloadSampleCSV('outstanding')}
          disabled={uploading}
          format="doctorId, doctorName, assignedMRId, assignedMRName, amount, dueDate, invoiceNumber"
        />
      </div>

      {/* Download Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-[#1F2937] mb-4">Export Data</h3>
        <p className="text-gray-600 mb-6">Download comprehensive reports in various formats</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-12 justify-start"
            onClick={() => handleDownload('All Data (CSV)')}
          >
            <Download size={20} className="mr-2" />
            Download All Data (CSV)
          </Button>
          <Button
            variant="outline"
            className="h-12 justify-start"
            onClick={() => handleDownload('All Data (PDF)')}
          >
            <FileText size={20} className="mr-2" />
            Download All Data (PDF)
          </Button>
          <Button
            variant="outline"
            className="h-12 justify-start"
            onClick={() => handleDownload('POB Report (CSV)')}
          >
            <Download size={20} className="mr-2" />
            Download POB Report (CSV)
          </Button>
          <Button
            variant="outline"
            className="h-12 justify-start"
            onClick={() => handleDownload('Expense Report (CSV)')}
          >
            <Download size={20} className="mr-2" />
            Download Expense Report (CSV)
          </Button>
        </div>
      </div>

      {/* Data Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Users size={20} className="text-[#2563EB]" />
            <p className="text-sm text-gray-600">Total Doctors</p>
          </div>
          <p className="text-[#1F2937]">{doctors.length.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">in database</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Package size={20} className="text-[#10B981]" />
            <p className="text-sm text-gray-600">Total Products</p>
          </div>
          <p className="text-[#1F2937]">{products.length.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">in catalog</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={20} className="text-[#F59E0B]" />
            <p className="text-sm text-gray-600">Outstanding Records</p>
          </div>
          <p className="text-[#1F2937]">{outstandingPayments.length.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">pending payments</p>
        </div>
      </div>
    </div>
  );
}

interface UploadCardProps {
  title: string;
  icon: any;
  iconColor: string;
  description: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadSample: () => void;
  disabled?: boolean;
  format: string;
  requiresSelection?: boolean;
}

function UploadCard({ title, icon: Icon, iconColor, description, onUpload, onDownloadSample, disabled, format, requiresSelection }: UploadCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-lg" style={{ backgroundColor: `${iconColor}15` }}>
          <Icon size={24} style={{ color: iconColor }} />
        </div>
        <h3 className="text-[#1F2937]">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      
      {/* CSV Format Info */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-xs text-gray-500 mb-1">Required columns:</p>
        <p className="text-xs text-[#1F2937] font-mono break-all">{format}</p>
      </div>

      {/* Sample Download */}
      <Button
        variant="outline"
        size="sm"
        className="w-full mb-3"
        onClick={onDownloadSample}
        disabled={disabled}
      >
        <Download size={14} className="mr-2" />
        Download Sample CSV
      </Button>

      {/* Warning if selection required */}
      {requiresSelection && (
        <Alert className="mb-3 border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800 text-xs">
            Please select MR/Manager above before uploading
          </AlertDescription>
        </Alert>
      )}

      {/* Upload Button */}
      <input
        type="file"
        accept=".csv"
        onChange={onUpload}
        className="hidden"
        id={`upload-${title}`}
        disabled={disabled}
      />
      <label htmlFor={`upload-${title}`}>
        <Button 
          asChild 
          className="w-full bg-[#2563EB] hover:bg-blue-700"
          disabled={disabled}
        >
          <span>
            <Upload size={16} className="mr-2" />
            {requiresSelection ? 'Select MR/Manager First' : (disabled ? 'Uploading...' : 'Upload CSV')}
          </span>
        </Button>
      </label>
    </div>
  );
}
