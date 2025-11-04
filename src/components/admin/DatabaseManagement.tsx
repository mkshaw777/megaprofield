import { useState, useEffect } from 'react';
import { 
  Database, Download, Trash2, HardDrive, Image, Calendar, 
  Users, AlertTriangle, CheckCircle, Info, FileArchive 
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { toast } from 'sonner@2.0.3';
import { getAllUsers } from '../../utils/dataStorage';
import {
  getStorageStatistics,
  extractImages,
  exportImagesToZip,
  deleteImagesFromDatabase,
  getExpensesByMonth,
  formatFileSize,
  getStorageWarning,
  type ImageExportOptions,
} from '../../utils/imageExportUtils';

export default function DatabaseManagement() {
  const [stats, setStats] = useState(getStorageStatistics());
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [includeHotelBills, setIncludeHotelBills] = useState(true);
  const [includeOdometers, setIncludeOdometers] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteAfterExport, setDeleteAfterExport] = useState(false);
  const [lastExportedIds, setLastExportedIds] = useState<string[]>([]);
  
  const users = getAllUsers();
  const expensesByMonth = getExpensesByMonth();
  const months = Object.keys(expensesByMonth).sort().reverse();
  
  // Refresh stats
  const refreshStats = () => {
    setStats(getStorageStatistics());
  };
  
  useEffect(() => {
    refreshStats();
  }, []);
  
  // Get storage warning
  const storageWarning = getStorageWarning(stats.estimatedStorageMB);
  
  // Calculate preview count
  const getPreviewCount = () => {
    const options: ImageExportOptions = {
      includeHotelBills,
      includeOdometers,
      userIds: selectedUsers.length > 0 ? selectedUsers : undefined,
    };
    
    if (selectedMonth !== 'all') {
      const [year, month] = selectedMonth.split('-').map(Number);
      const startDate = new Date(year, month - 1, 1).getTime();
      const endDate = new Date(year, month, 0, 23, 59, 59).getTime();
      options.startDate = startDate;
      options.endDate = endDate;
    }
    
    const images = extractImages(options);
    return images.length;
  };
  
  // Handle export
  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const options: ImageExportOptions = {
        includeHotelBills,
        includeOdometers,
        userIds: selectedUsers.length > 0 ? selectedUsers : undefined,
      };
      
      let monthLabel = 'All_Time';
      
      if (selectedMonth !== 'all') {
        const [year, month] = selectedMonth.split('-').map(Number);
        const startDate = new Date(year, month - 1, 1).getTime();
        const endDate = new Date(year, month, 0, 23, 59, 59).getTime();
        options.startDate = startDate;
        options.endDate = endDate;
        monthLabel = selectedMonth;
      }
      
      const images = extractImages(options);
      
      if (images.length === 0) {
        toast.error('No images found matching the criteria');
        setIsExporting(false);
        return;
      }
      
      // Store expense IDs for potential deletion
      const expenseIds = Array.from(new Set(images.map(img => img.expenseId)));
      setLastExportedIds(expenseIds);
      
      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `Megapro_Expense_Images_${monthLabel}_${timestamp}.zip`;
      
      // Export
      await exportImagesToZip(images, fileName);
      
      toast.success(`✓ Export complete!`, {
        description: `${images.length} images downloaded as ${fileName}`,
      });
      
      // Show delete dialog if option selected
      if (deleteAfterExport) {
        setShowDeleteDialog(true);
      }
    } catch (error: any) {
      toast.error('Export failed', {
        description: error.message,
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  // Handle delete
  const handleDelete = () => {
    if (lastExportedIds.length === 0) {
      toast.error('No images to delete');
      return;
    }
    
    const deletedCount = deleteImagesFromDatabase(lastExportedIds, {
      deleteHotelBills: includeHotelBills,
      deleteOdometers: includeOdometers,
    });
    
    toast.success(`✓ Database cleaned!`, {
      description: `${deletedCount} images removed from server`,
    });
    
    // Refresh stats
    refreshStats();
    setShowDeleteDialog(false);
    setLastExportedIds([]);
  };
  
  const previewCount = getPreviewCount();
  
  return (
    <div className="min-h-screen bg-[#F9FAFB] min-w-0 w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-4 lg:p-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <Database size={32} />
            </div>
            <div>
              <h1 className="text-white text-3xl mb-2">Database Management</h1>
              <p className="text-purple-100">Export & Clean Expense Images</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Storage Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <HardDrive className="text-blue-600" size={24} />
              <Badge variant="outline">Total</Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatFileSize(stats.estimatedStorageMB * 1024 * 1024)}
            </div>
            <p className="text-sm text-gray-500">Used Storage</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Image className="text-green-600" size={24} />
              <Badge variant="outline">{stats.totalImages}</Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats.expensesWithImages}
            </div>
            <p className="text-sm text-gray-500">Expenses with Images</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <FileArchive className="text-purple-600" size={24} />
              <Badge variant="outline">Bills</Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats.breakdown.hotelBills}
            </div>
            <p className="text-sm text-gray-500">Hotel Bill Images</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <FileArchive className="text-orange-600" size={24} />
              <Badge variant="outline">Meters</Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats.breakdown.odometerStart + stats.breakdown.odometerEnd}
            </div>
            <p className="text-sm text-gray-500">Odometer Images</p>
          </Card>
        </div>

        {/* Storage Warning */}
        {storageWarning.level !== 'safe' && (
          <Alert className={
            storageWarning.level === 'critical' 
              ? 'border-red-300 bg-red-50' 
              : 'border-yellow-300 bg-yellow-50'
          }>
            <AlertTriangle className={
              storageWarning.level === 'critical' ? 'text-red-600' : 'text-yellow-600'
            } size={20} />
            <AlertDescription className={
              storageWarning.level === 'critical' ? 'text-red-800' : 'text-yellow-800'
            }>
              <strong>{storageWarning.level === 'critical' ? '⚠️ Critical:' : '⚠ Warning:'}</strong> {storageWarning.message}
              <br />
              <span className="text-sm mt-1 block">
                Regular cleanup recommended to maintain optimal performance.
              </span>
            </AlertDescription>
          </Alert>
        )}

        {/* Export Configuration */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Download size={24} className="text-blue-600" />
            Export & Cleanup Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Month Selection */}
            <div className="space-y-2">
              <Label htmlFor="month" className="flex items-center gap-2">
                <Calendar size={16} />
                Select Month
              </Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger id="month">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {months.map(month => {
                    const monthStats = getStorageStatistics(expensesByMonth[month]);
                    return (
                      <SelectItem key={month} value={month}>
                        {month} ({monthStats.totalImages} images)
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* User Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users size={16} />
                Filter by Users (Optional)
              </Label>
              <div className="border rounded-lg p-3 max-h-32 overflow-y-auto bg-white">
                <div className="space-y-2">
                  {users
                    .filter(u => u.role !== 'admin')
                    .map(user => (
                      <label key={user.userId} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={selectedUsers.includes(user.userId)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedUsers([...selectedUsers, user.userId]);
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== user.userId));
                            }
                          }}
                        />
                        <span className="text-sm">{user.name} ({user.role})</span>
                      </label>
                    ))}
                </div>
              </div>
              {selectedUsers.length > 0 && (
                <p className="text-xs text-gray-500">
                  {selectedUsers.length} user(s) selected
                </p>
              )}
            </div>
          </div>

          {/* Image Type Selection */}
          <div className="mt-6 space-y-3">
            <Label>Include Image Types:</Label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={includeHotelBills}
                  onCheckedChange={(checked) => setIncludeHotelBills(!!checked)}
                />
                <span className="text-sm">Hotel Bills</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={includeOdometers}
                  onCheckedChange={(checked) => setIncludeOdometers(!!checked)}
                />
                <span className="text-sm">Odometer Photos</span>
              </label>
            </div>
          </div>

          {/* Delete After Export Option */}
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={deleteAfterExport}
                onCheckedChange={(checked) => setDeleteAfterExport(!!checked)}
                className="mt-1"
              />
              <div>
                <div className="font-semibold text-red-900">
                  Delete images after export
                </div>
                <p className="text-xs text-red-700 mt-1">
                  ⚠️ Images will be removed from server after successful download. 
                  All expense data (amounts, dates, approvals) will be preserved.
                  Make sure to save the ZIP file safely!
                </p>
              </div>
            </label>
          </div>
        </Card>

        {/* Preview & Action */}
        <Card className="p-6">
          <h3 className="font-bold text-gray-900 mb-4">Export Preview</h3>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
              <Info className="text-blue-600" size={20} />
              <div>
                <p className="text-blue-900 font-semibold">
                  {previewCount} images will be exported
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Files will be organized in folders: YYYY-MM/UserName/
                </p>
              </div>
            </div>
          </div>

          {previewCount === 0 ? (
            <Alert>
              <AlertDescription>
                No images found matching the selected criteria. 
                Try adjusting your filters.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              <Button
                onClick={handleExport}
                disabled={isExporting || previewCount === 0}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Exporting {previewCount} images...
                  </>
                ) : (
                  <>
                    <Download size={20} className="mr-2" />
                    Download {previewCount} Images as ZIP
                  </>
                )}
              </Button>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-gray-600">Estimated ZIP size:</div>
                  <div className="font-semibold">
                    {formatFileSize((stats.estimatedStorageMB * 1024 * 1024) * (previewCount / stats.totalImages))}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-gray-600">After cleanup:</div>
                  <div className="font-semibold text-green-600">
                    {formatFileSize(stats.estimatedStorageMB * 1024 * 1024 * (1 - previewCount / stats.totalImages))} saved
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Instructions */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="text-green-600" />
            How It Works
          </h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-3">
              <span className="font-bold text-purple-600">1.</span>
              <span>Select month and users to filter images (or export all)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-purple-600">2.</span>
              <span>Choose image types: Hotel bills and/or odometer photos</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-purple-600">3.</span>
              <span>Click "Download ZIP" - images will be organized by month/user</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-purple-600">4.</span>
              <span>Save the ZIP file to your computer (backup recommended)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-purple-600">5.</span>
              <span>If "Delete after export" is checked, images will be removed from server</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-purple-600">6.</span>
              <span><strong>Important:</strong> Expense data (amounts, approvals, reports) remains intact!</span>
            </li>
          </ol>
        </Card>

        {/* Safety Note */}
        <Alert className="border-green-300 bg-green-50">
          <CheckCircle className="text-green-600" size={20} />
          <AlertDescription className="text-green-800">
            <strong>Safe & Reversible:</strong> Only image files are removed. All expense records, 
            amounts, dates, approvals, and reports remain in the database. You can always re-upload 
            images if needed.
          </AlertDescription>
        </Alert>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 size={24} />
              Confirm Image Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                You are about to delete <strong>{lastExportedIds.length}</strong> images 
                from the server database.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
                <p className="font-semibold text-yellow-900 mb-1">Before proceeding:</p>
                <ul className="list-disc list-inside space-y-1 text-yellow-800">
                  <li>Confirm ZIP file is downloaded and saved</li>
                  <li>Verify you can open the ZIP file</li>
                  <li>Keep backup in safe location</li>
                </ul>
              </div>
              <p className="text-green-700 font-semibold">
                ✓ Expense data will remain safe (amounts, approvals, reports)
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel - Keep Images</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 size={16} className="mr-2" />
              Yes, Delete Images
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
