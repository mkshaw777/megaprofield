import { useState, useEffect } from 'react';
import { Receipt, Upload, Calculator, Clock, AlertCircle, CheckCircle2, Users, Sparkles, Shield } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner@2.0.3';
import { getCurrentUser } from '../../utils/authStorage';
import { getAppSettings, createExpense, getUserById, getAllUsers } from '../../utils/dataStorage';
import {
  calculateExpense,
  isExpenseEntryAllowed,
  validateExpenseInput,
  detectFakeBill,
  type ExpenseInput,
} from '../../utils/expenseCalculator';
import {
  validateOdometerImage,
  validateHotelBill,
  generateImageHash,
  getValidationBadgeColor,
  getValidationIcon,
  type AIValidationResult,
} from '../../utils/aiValidation';

export default function ExpenseForm() {
  const [distance, setDistance] = useState('');
  const [isOutstation, setIsOutstation] = useState(false);
  const [isNightStay, setIsNightStay] = useState(false);
  const [hotelBill, setHotelBill] = useState('');
  const [billPhoto, setBillPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Bike meter readings (for outstation)
  const [bikeMeterStart, setBikeMeterStart] = useState('');
  const [bikeMeterEnd, setBikeMeterEnd] = useState('');
  const [startMeterPhoto, setStartMeterPhoto] = useState<string | null>(null);
  const [endMeterPhoto, setEndMeterPhoto] = useState<string | null>(null);
  
  // AI Validation states
  const [isValidatingOdometer, setIsValidatingOdometer] = useState(false);
  const [isValidatingBill, setIsValidatingBill] = useState(false);
  const [odometerValidation, setOdometerValidation] = useState<AIValidationResult | null>(null);
  const [billValidation, setBillValidation] = useState<AIValidationResult | null>(null);
  
  // Manager-specific fields
  const [isJointWork, setIsJointWork] = useState(false);
  const [selectedMRId, setSelectedMRId] = useState('');
  
  // Calculated values
  const [calculatedDA, setCalculatedDA] = useState(0);
  const [calculatedTA, setCalculatedTA] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [breakdown, setBreakdown] = useState<any>(null);

  // Get current user and settings
  const currentUser = getCurrentUser();
  const settings = getAppSettings();
  const timeCheck = isExpenseEntryAllowed(settings);
  
  // Get user details
  const user = currentUser ? getUserById(currentUser.userId) : null;
  
  // Get all MRs (for Manager joint work selection)
  const allUsers = getAllUsers();
  const mrList = allUsers.filter(u => u.role === 'mr');

  // Auto-calculate when inputs change
  useEffect(() => {
    if (!user || !distance) {
      setCalculatedDA(0);
      setCalculatedTA(0);
      setTotalExpense(0);
      setBreakdown(null);
      return;
    }

    const input: ExpenseInput = {
      userId: user.userId,
      userRole: user.role,
      distanceKm: Number(distance) || 0,
      isOutstation,
      isNightStay,
      hotelBillAmount: Number(hotelBill) || 0,
      isJointWork: user.role === 'manager' ? isJointWork : false,
    };

    const result = calculateExpense(input, settings);
    setCalculatedDA(result.calculatedDA);
    setCalculatedTA(result.calculatedTA);
    setTotalExpense(result.totalExpense);
    setBreakdown(result.breakdown);
  }, [distance, isOutstation, isNightStay, hotelBill, isJointWork, user]);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    photoType: 'hotel' | 'meterStart' | 'meterEnd'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const photoData = reader.result as string;
      
      if (photoType === 'hotel') {
        setBillPhoto(photoData);
        toast.success('Hotel bill photo uploaded - Validating...');
        
        // Run AI validation on hotel bill
        setIsValidatingBill(true);
        try {
          const validation = await validateHotelBill(
            photoData,
            currentUser?.userId || '',
            Number(hotelBill) || 0
          );
          setBillValidation(validation);
          
          if (validation.level === 'HIGH') {
            toast.success('✓ Bill validated successfully', {
              description: `Confidence: ${validation.confidence}%`,
            });
          } else if (validation.level === 'MEDIUM') {
            toast.warning('⚠ Bill requires manual review', {
              description: validation.flags[0] || 'Please verify bill details',
            });
          } else {
            toast.error('✕ Bill validation failed', {
              description: validation.flags[0] || 'Please upload clear original bill',
            });
          }
        } catch (error) {
          toast.error('Validation failed - please try again');
        } finally {
          setIsValidatingBill(false);
        }
      } else if (photoType === 'meterStart') {
        setStartMeterPhoto(photoData);
        toast.success('Start meter photo uploaded');
      } else if (photoType === 'meterEnd') {
        setEndMeterPhoto(photoData);
        toast.success('End meter photo uploaded - Validating...');
        
        // Run AI validation on odometer
        setIsValidatingOdometer(true);
        try {
          const validation = await validateOdometerImage(
            photoData,
            currentUser?.userId || '',
            Number(bikeMeterStart) || undefined,
            Number(distance) || undefined
          );
          setOdometerValidation(validation);
          
          if (validation.level === 'HIGH') {
            toast.success('✓ Odometer validated successfully', {
              description: `Confidence: ${validation.confidence}%`,
            });
          } else if (validation.level === 'MEDIUM') {
            toast.warning('⚠ Odometer requires manual review', {
              description: validation.flags[0] || 'Please verify odometer reading',
            });
          } else {
            toast.error('✕ Odometer validation failed', {
              description: validation.flags[0] || 'Please upload clear odometer photo',
            });
          }
        } catch (error) {
          toast.error('Validation failed - please try again');
        } finally {
          setIsValidatingOdometer(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser || !user) {
      toast.error('User not logged in');
      return;
    }

    // Check time restriction
    if (!timeCheck.allowed) {
      toast.error(timeCheck.message);
      return;
    }

    // Validate inputs
    const input: ExpenseInput = {
      userId: user.userId,
      userRole: user.role,
      distanceKm: Number(distance) || 0,
      isOutstation,
      isNightStay,
      hotelBillAmount: Number(hotelBill) || 0,
      isJointWork: user.role === 'manager' ? isJointWork : false,
    };

    const validation = validateExpenseInput(input);
    if (!validation.valid) {
      validation.errors.forEach(error => toast.error(error));
      return;
    }

    // Validate night stay requires hotel bill
    if (isNightStay && !hotelBill) {
      toast.error('Hotel bill amount is required for night stay');
      return;
    }

    // Validate hotel bill requires photo
    if (Number(hotelBill) > 0 && !billPhoto) {
      toast.error('Please upload hotel bill photo');
      return;
    }
    
    // Check AI validation results
    if (billPhoto && billValidation) {
      if (!billValidation.isValid) {
        toast.error('Hotel bill validation failed', {
          description: billValidation.flags.join(', '),
        });
        return;
      }
      if (billValidation.action === 'FLAG_REJECT') {
        toast.error('Bill appears suspicious', {
          description: 'Please upload a clear photo of the original bill',
        });
        return;
      }
    }
    
    if (isOutstation && endMeterPhoto && odometerValidation) {
      if (!odometerValidation.isValid) {
        toast.error('Odometer validation failed', {
          description: odometerValidation.flags.join(', '),
        });
        return;
      }
      if (odometerValidation.action === 'FLAG_REJECT') {
        toast.error('Odometer image appears suspicious', {
          description: 'Please upload a clear photo of the actual odometer',
        });
        return;
      }
    }

    // Validate outstation requires bike meter readings
    if (isOutstation) {
      if (!bikeMeterStart || !bikeMeterEnd) {
        toast.error('Start and End meter readings are required for outstation travel');
        return;
      }
      
      if (!startMeterPhoto || !endMeterPhoto) {
        toast.error('Start and End meter photos are required for outstation travel');
        return;
      }

      // Strict validation: meter difference should match distance
      const meterDiff = Number(bikeMeterEnd) - Number(bikeMeterStart);
      const distanceEntered = Number(distance);
      
      if (Math.abs(meterDiff - distanceEntered) > 0.1) {
        toast.error(
          `Meter reading mismatch! Difference: ${meterDiff.toFixed(1)} km, Distance entered: ${distanceEntered} km`
        );
        return;
      }

      // End reading should be greater than start
      if (Number(bikeMeterEnd) <= Number(bikeMeterStart)) {
        toast.error('End meter reading must be greater than start meter reading');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // AI Bill Detection (if bill photo uploaded)
      let aiRiskScore = 0;
      let aiRiskFlag = false;

      if (billPhoto && Number(hotelBill) > 0) {
        toast.info('Analyzing bill with AI...');
        const aiResult = await detectFakeBill(billPhoto);
        aiRiskScore = aiResult.riskScore;
        aiRiskFlag = aiResult.isFlagged;

        if (aiRiskFlag) {
          toast.warning(`Bill flagged for review (Risk: ${aiRiskScore}%)`);
        }
      }

      // Get joint work MR details if applicable
      let jointWorkMRName: string | undefined;
      if (user.role === 'manager' && isJointWork && selectedMRId) {
        const selectedMR = getUserById(selectedMRId);
        jointWorkMRName = selectedMR?.name;
      }

      // Create expense record
      const expense = createExpense({
        userId: user.userId,
        userName: user.name,
        userRole: user.role,
        date: Date.now(),
        distanceKm: Number(distance),
        isOutstation,
        isNightStay,
        hotelBillAmount: Number(hotelBill) || 0,
        billProofUrl: billPhoto || undefined,
        bikeMeterStart: isOutstation ? Number(bikeMeterStart) : undefined,
        bikeMeterEnd: isOutstation ? Number(bikeMeterEnd) : undefined,
        bikeMeterStartPhotoUrl: isOutstation ? startMeterPhoto || undefined : undefined,
        bikeMeterEndPhotoUrl: isOutstation ? endMeterPhoto || undefined : undefined,
        calculatedDA,
        calculatedTA,
        totalExpense,
        status: 'pending',
        aiRiskScore,
        aiRiskFlag,
        // AI Validation Results
        odometerValidation: odometerValidation ? {
          confidence: odometerValidation.confidence,
          level: odometerValidation.level,
          action: odometerValidation.action,
          flags: odometerValidation.flags,
          timestamp: odometerValidation.timestamp,
          details: odometerValidation.details,
        } : undefined,
        billValidation: billValidation ? {
          confidence: billValidation.confidence,
          level: billValidation.level,
          action: billValidation.action,
          flags: billValidation.flags,
          timestamp: billValidation.timestamp,
          details: billValidation.details,
        } : undefined,
        isJointWork: user.role === 'manager' ? isJointWork : undefined,
        jointWorkMRId: user.role === 'manager' && isJointWork ? selectedMRId || undefined : undefined,
        jointWorkMRName: user.role === 'manager' && isJointWork ? jointWorkMRName : undefined,
      });

      // Success message
      toast.success(
        `Expense submitted successfully! Total: ₹${totalExpense.toFixed(2)}`,
        {
          description: aiRiskFlag 
            ? 'Note: Bill flagged for manual review' 
            : 'Pending manager approval',
        }
      );

      // Reset form
      setDistance('');
      setIsOutstation(false);
      setIsNightStay(false);
      setHotelBill('');
      setBillPhoto(null);
      setBikeMeterStart('');
      setBikeMeterEnd('');
      setStartMeterPhoto(null);
      setEndMeterPhoto(null);
      setIsJointWork(false);
      setSelectedMRId('');
      // Reset AI validation states
      setOdometerValidation(null);
      setBillValidation(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Receipt size={32} />
          </div>
        </div>
        <h1 className="text-white text-center mb-2">Daily Expense</h1>
        <p className="text-center text-sm opacity-90">Submit your daily expenses</p>
      </div>

      {/* Time Restriction Alert */}
      {!timeCheck.allowed && (
        <div className="p-4">
          <Alert className="border-amber-200 bg-amber-50">
            <Clock className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              {timeCheck.message}
              {timeCheck.timeRemaining && (
                <span className="block text-sm mt-1">
                  Time remaining: {timeCheck.timeRemaining}
                </span>
              )}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Distance Entry */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-[#1F2937] flex items-center gap-2">
            <Calculator size={20} className="text-[#2563EB]" />
            Travel Details
          </h3>

          <div className="space-y-2">
            <Label htmlFor="distance">Distance Travelled (km) *</Label>
            <Input
              id="distance"
              type="number"
              step="0.1"
              placeholder="Enter distance in km"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="h-12"
              required
              disabled={!timeCheck.allowed}
            />
            <p className="text-xs text-gray-500">
              Threshold: {settings.outstation_distance_threshold}km for outstation
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="outstation" className="cursor-pointer">
                Outstation Travel
              </Label>
              <p className="text-xs text-gray-500">
                Distance ≥ {settings.outstation_distance_threshold}km
              </p>
            </div>
            <Switch
              id="outstation"
              checked={isOutstation}
              onCheckedChange={setIsOutstation}
              disabled={!timeCheck.allowed}
            />
          </div>

          {/* Bike Meter Readings - Show only for Outstation */}
          {isOutstation && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm text-[#1F2937]">Bike Meter Readings (Required for Outstation)</h4>
              
              {/* Start Meter Reading */}
              <div className="space-y-2">
                <Label htmlFor="bikeMeterStart">Start Meter Reading (km) *</Label>
                <Input
                  id="bikeMeterStart"
                  type="number"
                  step="0.1"
                  placeholder="Enter start meter reading"
                  value={bikeMeterStart}
                  onChange={(e) => setBikeMeterStart(e.target.value)}
                  className="h-12 bg-white"
                  required={isOutstation}
                  disabled={!timeCheck.allowed}
                />
              </div>

              {/* Start Meter Photo */}
              <div className="space-y-2">
                <Label htmlFor="startMeterPhoto">Upload Start Meter Photo *</Label>
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center bg-white hover:border-[#2563EB] transition-colors">
                  {startMeterPhoto ? (
                    <div className="space-y-2">
                      <img
                        src={startMeterPhoto}
                        alt="Start meter preview"
                        className="max-h-32 mx-auto rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setStartMeterPhoto(null)}
                        className="text-red-600"
                      >
                        Remove Photo
                      </Button>
                    </div>
                  ) : (
                    <label htmlFor="startMeterPhoto" className="cursor-pointer block">
                      <Upload size={24} className="mx-auto mb-2 text-blue-400" />
                      <p className="text-sm text-gray-600">Click to upload start meter photo</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                      <input
                        id="startMeterPhoto"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'meterStart')}
                        className="hidden"
                        disabled={!timeCheck.allowed}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* End Meter Reading */}
              <div className="space-y-2">
                <Label htmlFor="bikeMeterEnd">End Meter Reading (km) *</Label>
                <Input
                  id="bikeMeterEnd"
                  type="number"
                  step="0.1"
                  placeholder="Enter end meter reading"
                  value={bikeMeterEnd}
                  onChange={(e) => setBikeMeterEnd(e.target.value)}
                  className="h-12 bg-white"
                  required={isOutstation}
                  disabled={!timeCheck.allowed}
                />
                {bikeMeterStart && bikeMeterEnd && (
                  <p className="text-xs text-blue-600">
                    Meter Difference: {(Number(bikeMeterEnd) - Number(bikeMeterStart)).toFixed(1)} km
                    {distance && Math.abs((Number(bikeMeterEnd) - Number(bikeMeterStart)) - Number(distance)) > 0.1 && (
                      <span className="text-red-600 ml-2">
                        ⚠️ Should match distance: {distance} km
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* End Meter Photo */}
              <div className="space-y-2">
                <Label htmlFor="endMeterPhoto" className="flex items-center gap-2">
                  Upload End Meter Photo *
                  <Shield size={16} className="text-blue-600" title="AI Fraud Detection Enabled" />
                </Label>
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center bg-white hover:border-[#2563EB] transition-colors">
                  {endMeterPhoto ? (
                    <div className="space-y-2">
                      <img
                        src={endMeterPhoto}
                        alt="End meter preview"
                        className="max-h-32 mx-auto rounded-lg"
                      />
                      
                      {/* AI Validation Status */}
                      {isValidatingOdometer ? (
                        <div className="flex items-center justify-center gap-2 text-blue-600 animate-pulse">
                          <Sparkles size={16} />
                          <span className="text-sm">AI Validating...</span>
                        </div>
                      ) : odometerValidation && (
                        <Badge className={`${getValidationBadgeColor(odometerValidation.level)} border`}>
                          {getValidationIcon(odometerValidation.level)} AI Score: {odometerValidation.confidence}%
                        </Badge>
                      )}
                      
                      {/* Validation Flags */}
                      {odometerValidation && odometerValidation.flags.length > 0 && (
                        <div className="text-xs text-left bg-gray-50 p-2 rounded space-y-1">
                          {odometerValidation.flags.map((flag, i) => (
                            <div key={i} className="text-gray-700">• {flag}</div>
                          ))}
                        </div>
                      )}
                      
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEndMeterPhoto(null);
                          setOdometerValidation(null);
                        }}
                        className="text-red-600"
                      >
                        Remove Photo
                      </Button>
                    </div>
                  ) : (
                    <label htmlFor="endMeterPhoto" className="cursor-pointer block">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Upload size={24} className="text-blue-400" />
                        <Shield size={20} className="text-green-600" />
                      </div>
                      <p className="text-sm text-gray-600">Click to upload end meter photo</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB • AI Protected</p>
                      <input
                        id="endMeterPhoto"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'meterEnd')}
                        className="hidden"
                        disabled={!timeCheck.allowed}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="nightstay" className="cursor-pointer">
                Night Stay
              </Label>
              <p className="text-xs text-gray-500">
                Includes hotel accommodation
              </p>
            </div>
            <Switch
              id="nightstay"
              checked={isNightStay}
              onCheckedChange={setIsNightStay}
              disabled={!timeCheck.allowed}
            />
          </div>
        </div>

        {/* Manager Joint Work Section */}
        {user?.role === 'manager' && (
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-[#1F2937] flex items-center gap-2">
              <Users size={20} className="text-[#10B981]" />
              Work Type
            </h3>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div>
                <Label htmlFor="jointwork" className="cursor-pointer">
                  Joint Work with MR
                </Label>
                <p className="text-xs text-gray-600">
                  DA: ₹{isJointWork ? settings.manager_da_joint : settings.manager_da_solo}
                  {isJointWork ? ' (Joint)' : ' (Solo)'}
                </p>
              </div>
              <Switch
                id="jointwork"
                checked={isJointWork}
                onCheckedChange={setIsJointWork}
                disabled={!timeCheck.allowed}
              />
            </div>

            {/* MR Selection (if joint work) */}
            {isJointWork && (
              <div className="space-y-2 p-4 bg-green-50 rounded-lg border border-green-200">
                <Label htmlFor="mrSelection">Select MR (Optional)</Label>
                <Select
                  value={selectedMRId}
                  onValueChange={setSelectedMRId}
                  disabled={!timeCheck.allowed}
                >
                  <SelectTrigger id="mrSelection" className="h-12 bg-white">
                    <SelectValue placeholder="Select MR you worked with" />
                  </SelectTrigger>
                  <SelectContent>
                    {mrList.map(mr => (
                      <SelectItem key={mr.userId} value={mr.userId}>
                        {mr.name} ({mr.username})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Optional: Select which MR you worked with for record keeping
                </p>
              </div>
            )}

            {/* Info Alert */}
            <Alert className="border-green-200 bg-green-50">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 text-sm">
                {isJointWork 
                  ? `Joint Work DA: ₹${settings.manager_da_joint} (for supervision & training)`
                  : `Solo Work DA: ₹${settings.manager_da_solo}`}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Hotel Bill (if night stay) */}
        {isNightStay && (
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-[#1F2937]">Hotel Accommodation</h3>

            <div className="space-y-2">
              <Label htmlFor="hotelBill">Hotel Bill Amount (₹) *</Label>
              <Input
                id="hotelBill"
                type="number"
                step="0.01"
                placeholder="Enter hotel bill amount"
                value={hotelBill}
                onChange={(e) => setHotelBill(e.target.value)}
                className="h-12"
                required={isNightStay}
                disabled={!timeCheck.allowed}
              />
              <p className="text-xs text-gray-500">
                {currentUser?.role === 'mr' 
                  ? `Limit: ₹${settings.mr_hotel_limit}`
                  : `Limit: ₹${settings.manager_hotel_limit}`}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="billPhoto" className="flex items-center gap-2">
                Upload Hotel Bill Photo *
                <Shield size={16} className="text-blue-600" title="AI Fraud Detection Enabled" />
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#2563EB] transition-colors">
                {billPhoto ? (
                  <div className="space-y-2">
                    <img
                      src={billPhoto}
                      alt="Bill preview"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                    
                    {/* AI Validation Status */}
                    {isValidatingBill ? (
                      <div className="flex items-center justify-center gap-2 text-blue-600 animate-pulse">
                        <Sparkles size={16} />
                        <span className="text-sm">AI Validating Bill...</span>
                      </div>
                    ) : billValidation && (
                      <Badge className={`${getValidationBadgeColor(billValidation.level)} border`}>
                        {getValidationIcon(billValidation.level)} AI Score: {billValidation.confidence}%
                      </Badge>
                    )}
                    
                    {/* Validation Details */}
                    {billValidation && billValidation.flags.length > 0 && (
                      <div className="text-xs text-left bg-gray-50 p-3 rounded space-y-1">
                        <div className="font-semibold text-gray-700 mb-1">AI Analysis:</div>
                        {billValidation.flags.map((flag, i) => (
                          <div key={i} className="text-gray-600">• {flag}</div>
                        ))}
                      </div>
                    )}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setBillPhoto(null);
                        setBillValidation(null);
                      }}
                      className="text-red-600"
                    >
                      Remove Photo
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="billPhoto" className="cursor-pointer block">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Upload size={32} className="text-gray-400" />
                      <Shield size={24} className="text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600">Click to upload bill photo</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB • AI Protected</p>
                    <input
                      id="billPhoto"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'hotel')}
                      className="hidden"
                      disabled={!timeCheck.allowed}
                    />
                  </label>
                )}
              </div>
              <Alert className="border-blue-200 bg-blue-50">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-xs">
                  🤖 AI will automatically check: Screenshot detection • Image editing • Bill authenticity • Duplicate submission
                </AlertDescription>
              </Alert>
            </div>
          </div>
        )}

        {/* Calculation Summary */}
        {breakdown && (
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-[#1F2937] flex items-center gap-2">
              <Calculator size={20} className="text-[#10B981]" />
              Expense Breakdown
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Daily Allowance (DA)</p>
                  <p className="text-xs text-gray-500">{breakdown.daType}</p>
                </div>
                <p className="text-[#1F2937]">₹{breakdown.daAmount.toFixed(2)}</p>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Travel Allowance (TA)</p>
                  <p className="text-xs text-gray-500">{breakdown.taCalculation}</p>
                </div>
                <p className="text-[#1F2937]">₹{breakdown.taAmount.toFixed(2)}</p>
              </div>

              {isNightStay && breakdown.hotelAmount > 0 && (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Hotel Bill</p>
                    <p className="text-xs text-gray-500">
                      Claimed: ₹{hotelBill} (Limit: ₹{breakdown.hotelLimit})
                    </p>
                  </div>
                  <p className="text-[#1F2937]">₹{breakdown.hotelAmount.toFixed(2)}</p>
                </div>
              )}

              <div className="border-t pt-3 flex justify-between items-center">
                <p className="text-[#1F2937]">Total Expense</p>
                <p className="text-2xl text-[#10B981]">₹{totalExpense.toFixed(2)}</p>
              </div>
            </div>

            {Number(hotelBill) > breakdown?.hotelLimit && (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 text-sm">
                  Hotel bill exceeds limit. Only ₹{breakdown.hotelLimit} will be claimed.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!timeCheck.allowed || isSubmitting || !distance}
          className="w-full h-14 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
        >
          {isSubmitting ? (
            <>
              <Clock size={20} className="mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle2 size={20} className="mr-2" />
              Submit Expense for Approval
            </>
          )}
        </Button>

        {!timeCheck.allowed && (
          <p className="text-center text-sm text-gray-500">
            Expense submission is only allowed after {settings.expense_entry_start_hour}:00 
            ({settings.expense_entry_start_hour >= 12 ? 
              `${settings.expense_entry_start_hour - 12} PM` : 
              `${settings.expense_entry_start_hour} AM`})
          </p>
        )}
      </form>
    </div>
  );
}
