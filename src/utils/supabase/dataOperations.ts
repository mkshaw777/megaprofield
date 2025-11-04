// Supabase Data Operations for Megapro Innovation SFA
// Replaces localStorage with Supabase database

import { supabase, handleSupabaseError } from './client';
import type { User, Doctor, Visit, Expense, TourPlan, Product, AppSettings } from '../types';

// ==================== HELPER FUNCTIONS ====================

function convertTimestamp(timestamp: number): string {
  return new Date(timestamp).toISOString();
}

function parseTimestamp(isoString: string): number {
  return new Date(isoString).getTime();
}

// ==================== USER OPERATIONS ====================

export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', handleSupabaseError(error));
    return [];
  }

  return (data || []).map(u => ({
    userId: u.user_id,
    name: u.name,
    username: u.username,
    passwordHash: u.password_hash,
    role: u.role as 'mr' | 'manager' | 'admin',
    linkedManagerId: u.linked_manager_id || undefined,
    isActive: u.is_active,
    createdAt: parseTimestamp(u.created_at),
  }));
}

export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;

  return {
    userId: data.user_id,
    name: data.name,
    username: data.username,
    passwordHash: data.password_hash,
    role: data.role as 'mr' | 'manager' | 'admin',
    linkedManagerId: data.linked_manager_id || undefined,
    isActive: data.is_active,
    createdAt: parseTimestamp(data.created_at),
  };
}

export async function createUser(userData: Omit<User, 'userId' | 'createdAt'>): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .insert({
      name: userData.name,
      username: userData.username,
      password_hash: userData.passwordHash,
      role: userData.role,
      linked_manager_id: userData.linkedManagerId || null,
      is_active: userData.isActive,
    })
    .select()
    .single();

  if (error || !data) {
    console.error('Error creating user:', handleSupabaseError(error));
    return null;
  }

  return {
    userId: data.user_id,
    name: data.name,
    username: data.username,
    passwordHash: data.password_hash,
    role: data.role as 'mr' | 'manager' | 'admin',
    linkedManagerId: data.linked_manager_id || undefined,
    isActive: data.is_active,
    createdAt: parseTimestamp(data.created_at),
  };
}

export async function authenticateUser(username: string, password: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password_hash', password)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;

  return {
    userId: data.user_id,
    name: data.name,
    username: data.username,
    passwordHash: data.password_hash,
    role: data.role as 'mr' | 'manager' | 'admin',
    linkedManagerId: data.linked_manager_id || undefined,
    isActive: data.is_active,
    createdAt: parseTimestamp(data.created_at),
  };
}

// ==================== DOCTOR OPERATIONS ====================

export async function getDoctorsByMR(mrId: string): Promise<Doctor[]> {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('assigned_mr_id', mrId)
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error('Error fetching doctors:', handleSupabaseError(error));
    return [];
  }

  return (data || []).map(d => ({
    doctorId: d.doctor_id,
    name: d.name,
    specialty: d.specialty,
    location: d.location_lat && d.location_lng ? {
      lat: d.location_lat,
      lng: d.location_lng,
      address: d.location_address || undefined,
    } : undefined,
    assignedMrId: d.assigned_mr_id,
    phone: d.phone || undefined,
    address: d.address || undefined,
    isActive: d.is_active,
  }));
}

export async function createDoctor(doctorData: Omit<Doctor, 'doctorId'>): Promise<Doctor | null> {
  const { data, error } = await supabase
    .from('doctors')
    .insert({
      name: doctorData.name,
      specialty: doctorData.specialty,
      location_lat: doctorData.location?.lat || null,
      location_lng: doctorData.location?.lng || null,
      location_address: doctorData.location?.address || null,
      assigned_mr_id: doctorData.assignedMrId,
      phone: doctorData.phone || null,
      address: doctorData.address || null,
      is_active: doctorData.isActive,
    })
    .select()
    .single();

  if (error || !data) {
    console.error('Error creating doctor:', handleSupabaseError(error));
    return null;
  }

  return {
    doctorId: data.doctor_id,
    name: data.name,
    specialty: data.specialty,
    location: data.location_lat && data.location_lng ? {
      lat: data.location_lat,
      lng: data.location_lng,
      address: data.location_address || undefined,
    } : undefined,
    assignedMrId: data.assigned_mr_id,
    phone: data.phone || undefined,
    address: data.address || undefined,
    isActive: data.is_active,
  };
}

export async function updateDoctor(doctorId: string, updates: Partial<Doctor>): Promise<Doctor | null> {
  const updateData: any = {};
  
  if (updates.name) updateData.name = updates.name;
  if (updates.specialty) updateData.specialty = updates.specialty;
  if (updates.location) {
    updateData.location_lat = updates.location.lat;
    updateData.location_lng = updates.location.lng;
    updateData.location_address = updates.location.address || null;
  }
  if (updates.phone !== undefined) updateData.phone = updates.phone;
  if (updates.address !== undefined) updateData.address = updates.address;
  if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

  const { data, error } = await supabase
    .from('doctors')
    .update(updateData)
    .eq('doctor_id', doctorId)
    .select()
    .single();

  if (error || !data) {
    console.error('Error updating doctor:', handleSupabaseError(error));
    return null;
  }

  return {
    doctorId: data.doctor_id,
    name: data.name,
    specialty: data.specialty,
    location: data.location_lat && data.location_lng ? {
      lat: data.location_lat,
      lng: data.location_lng,
      address: data.location_address || undefined,
    } : undefined,
    assignedMrId: data.assigned_mr_id,
    phone: data.phone || undefined,
    address: data.address || undefined,
    isActive: data.is_active,
  };
}

// ==================== VISIT OPERATIONS ====================

export async function checkInVisit(visitData: Omit<Visit, 'visitId' | 'status'>): Promise<Visit | null> {
  // Check if user already has active visit
  const { data: activeVisits } = await supabase
    .from('visits')
    .select('visit_id')
    .eq('mr_id', visitData.mrId)
    .eq('status', 'active');

  if (activeVisits && activeVisits.length > 0) {
    throw new Error('You already have an active visit. Please check-out first.');
  }

  const { data, error } = await supabase
    .from('visits')
    .insert({
      mr_id: visitData.mrId,
      mr_name: visitData.mrName,
      doctor_id: visitData.doctorId,
      doctor_name: visitData.doctorName,
      check_in_timestamp: convertTimestamp(visitData.checkInTimestamp),
      check_in_lat: visitData.checkInLocation.lat,
      check_in_lng: visitData.checkInLocation.lng,
      check_in_address: visitData.checkInLocation.address || null,
      pob_amount: 0,
      collection_amount: 0,
      gift_distributed: false,
      products_discussed: [],
      status: 'active',
    })
    .select()
    .single();

  if (error || !data) {
    console.error('Error checking in visit:', handleSupabaseError(error));
    return null;
  }

  return {
    visitId: data.visit_id,
    mrId: data.mr_id,
    mrName: data.mr_name,
    doctorId: data.doctor_id,
    doctorName: data.doctor_name,
    checkInTimestamp: parseTimestamp(data.check_in_timestamp),
    checkInLocation: {
      lat: data.check_in_lat,
      lng: data.check_in_lng,
      address: data.check_in_address || undefined,
    },
    pobAmount: Number(data.pob_amount),
    collectionAmount: Number(data.collection_amount),
    giftDistributed: data.gift_distributed,
    productsDiscussed: data.products_discussed || [],
    status: data.status as 'active' | 'completed',
  };
}

export async function checkOutVisit(
  visitId: string,
  checkOutData: {
    checkOutLocation: { lat: number; lng: number; address?: string };
    pobAmount?: number;
    collectionAmount?: number;
    giftDistributed?: boolean;
    productsDiscussed?: string[];
    notes?: string;
  }
): Promise<Visit | null> {
  const checkOutTimestamp = new Date().toISOString();
  
  // Get visit to calculate duration
  const { data: visit } = await supabase
    .from('visits')
    .select('check_in_timestamp')
    .eq('visit_id', visitId)
    .single();

  const duration = visit ? 
    Math.floor((new Date().getTime() - parseTimestamp(visit.check_in_timestamp)) / 1000 / 60) : 
    null;

  const { data, error } = await supabase
    .from('visits')
    .update({
      check_out_timestamp: checkOutTimestamp,
      check_out_lat: checkOutData.checkOutLocation.lat,
      check_out_lng: checkOutData.checkOutLocation.lng,
      check_out_address: checkOutData.checkOutLocation.address || null,
      pob_amount: checkOutData.pobAmount || 0,
      collection_amount: checkOutData.collectionAmount || 0,
      gift_distributed: checkOutData.giftDistributed || false,
      products_discussed: checkOutData.productsDiscussed || [],
      notes: checkOutData.notes || null,
      status: 'completed',
      duration: duration,
    })
    .eq('visit_id', visitId)
    .select()
    .single();

  if (error || !data) {
    console.error('Error checking out visit:', handleSupabaseError(error));
    return null;
  }

  return {
    visitId: data.visit_id,
    mrId: data.mr_id,
    mrName: data.mr_name,
    doctorId: data.doctor_id,
    doctorName: data.doctor_name,
    checkInTimestamp: parseTimestamp(data.check_in_timestamp),
    checkInLocation: {
      lat: data.check_in_lat,
      lng: data.check_in_lng,
      address: data.check_in_address || undefined,
    },
    checkOutTimestamp: data.check_out_timestamp ? parseTimestamp(data.check_out_timestamp) : undefined,
    checkOutLocation: data.check_out_lat && data.check_out_lng ? {
      lat: data.check_out_lat,
      lng: data.check_out_lng,
      address: data.check_out_address || undefined,
    } : undefined,
    pobAmount: Number(data.pob_amount),
    collectionAmount: Number(data.collection_amount),
    giftDistributed: data.gift_distributed,
    productsDiscussed: data.products_discussed || [],
    notes: data.notes || undefined,
    status: data.status as 'active' | 'completed',
    duration: data.duration || undefined,
  };
}

export async function getTodayVisits(mrId?: string): Promise<Visit[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStart = today.toISOString();
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStart = tomorrow.toISOString();

  let query = supabase
    .from('visits')
    .select('*')
    .gte('check_in_timestamp', todayStart)
    .lt('check_in_timestamp', tomorrowStart);

  if (mrId) {
    query = query.eq('mr_id', mrId);
  }

  const { data, error } = await query.order('check_in_timestamp', { ascending: false });

  if (error) {
    console.error('Error fetching today visits:', handleSupabaseError(error));
    return [];
  }

  return (data || []).map(v => ({
    visitId: v.visit_id,
    mrId: v.mr_id,
    mrName: v.mr_name,
    doctorId: v.doctor_id,
    doctorName: v.doctor_name,
    checkInTimestamp: parseTimestamp(v.check_in_timestamp),
    checkInLocation: {
      lat: v.check_in_lat,
      lng: v.check_in_lng,
      address: v.check_in_address || undefined,
    },
    checkOutTimestamp: v.check_out_timestamp ? parseTimestamp(v.check_out_timestamp) : undefined,
    checkOutLocation: v.check_out_lat && v.check_out_lng ? {
      lat: v.check_out_lat,
      lng: v.check_out_lng,
      address: v.check_out_address || undefined,
    } : undefined,
    pobAmount: Number(v.pob_amount),
    collectionAmount: Number(v.collection_amount),
    giftDistributed: v.gift_distributed,
    productsDiscussed: v.products_discussed || [],
    notes: v.notes || undefined,
    status: v.status as 'active' | 'completed',
    duration: v.duration || undefined,
  }));
}

// ==================== EXPENSE OPERATIONS ====================

export async function createExpense(expenseData: Omit<Expense, 'expenseId' | 'submittedAt'>): Promise<Expense | null> {
  const { data, error } = await supabase
    .from('expenses')
    .insert({
      user_id: expenseData.userId,
      user_name: expenseData.userName,
      user_role: expenseData.userRole,
      date: convertTimestamp(expenseData.date),
      distance_km: expenseData.distanceKm,
      is_outstation: expenseData.isOutstation,
      is_night_stay: expenseData.isNightStay,
      hotel_bill_amount: expenseData.hotelBillAmount,
      bill_proof_url: expenseData.billProofUrl || null,
      bike_meter_start: expenseData.bikeMeterStart || null,
      bike_meter_end: expenseData.bikeMeterEnd || null,
      bike_meter_start_photo_url: expenseData.bikeMeterStartPhotoUrl || null,
      bike_meter_end_photo_url: expenseData.bikeMeterEndPhotoUrl || null,
      calculated_da: expenseData.calculatedDA,
      calculated_ta: expenseData.calculatedTA,
      total_expense: expenseData.totalExpense,
      status: expenseData.status,
      ai_risk_score: expenseData.aiRiskScore || null,
      ai_risk_flag: expenseData.aiRiskFlag || null,
      is_joint_work: expenseData.isJointWork || null,
      joint_work_mr_id: expenseData.jointWorkMRId || null,
      joint_work_mr_name: expenseData.jointWorkMRName || null,
    })
    .select()
    .single();

  if (error || !data) {
    console.error('Error creating expense:', handleSupabaseError(error));
    return null;
  }

  return {
    expenseId: data.expense_id,
    userId: data.user_id,
    userName: data.user_name,
    userRole: data.user_role as 'mr' | 'manager' | 'admin',
    date: parseTimestamp(data.date),
    distanceKm: Number(data.distance_km),
    isOutstation: data.is_outstation,
    isNightStay: data.is_night_stay,
    hotelBillAmount: Number(data.hotel_bill_amount),
    billProofUrl: data.bill_proof_url || undefined,
    bikeMeterStart: data.bike_meter_start ? Number(data.bike_meter_start) : undefined,
    bikeMeterEnd: data.bike_meter_end ? Number(data.bike_meter_end) : undefined,
    bikeMeterStartPhotoUrl: data.bike_meter_start_photo_url || undefined,
    bikeMeterEndPhotoUrl: data.bike_meter_end_photo_url || undefined,
    calculatedDA: Number(data.calculated_da),
    calculatedTA: Number(data.calculated_ta),
    totalExpense: Number(data.total_expense),
    status: data.status as 'pending' | 'approved' | 'rejected',
    submittedAt: parseTimestamp(data.submitted_at),
    aiRiskScore: data.ai_risk_score ? Number(data.ai_risk_score) : undefined,
    aiRiskFlag: data.ai_risk_flag || undefined,
    isJointWork: data.is_joint_work || undefined,
    jointWorkMRId: data.joint_work_mr_id || undefined,
    jointWorkMRName: data.joint_work_mr_name || undefined,
  };
}

export async function getPendingExpenses(managerId?: string): Promise<Expense[]> {
  let query = supabase
    .from('expenses')
    .select('*')
    .eq('status', 'pending');

  if (managerId) {
    // Get MRs under this manager
    const { data: mrs } = await supabase
      .from('users')
      .select('user_id')
      .eq('linked_manager_id', managerId);
    
    if (mrs && mrs.length > 0) {
      const mrIds = mrs.map(mr => mr.user_id);
      query = query.in('user_id', mrIds);
    }
  }

  const { data, error } = await query.order('submitted_at', { ascending: false });

  if (error) {
    console.error('Error fetching pending expenses:', handleSupabaseError(error));
    return [];
  }

  return (data || []).map(e => ({
    expenseId: e.expense_id,
    userId: e.user_id,
    userName: e.user_name,
    userRole: e.user_role as 'mr' | 'manager' | 'admin',
    date: parseTimestamp(e.date),
    distanceKm: Number(e.distance_km),
    isOutstation: e.is_outstation,
    isNightStay: e.is_night_stay,
    hotelBillAmount: Number(e.hotel_bill_amount),
    billProofUrl: e.bill_proof_url || undefined,
    bikeMeterStart: e.bike_meter_start ? Number(e.bike_meter_start) : undefined,
    bikeMeterEnd: e.bike_meter_end ? Number(e.bike_meter_end) : undefined,
    bikeMeterStartPhotoUrl: e.bike_meter_start_photo_url || undefined,
    bikeMeterEndPhotoUrl: e.bike_meter_end_photo_url || undefined,
    calculatedDA: Number(e.calculated_da),
    calculatedTA: Number(e.calculated_ta),
    totalExpense: Number(e.total_expense),
    status: e.status as 'pending' | 'approved' | 'rejected',
    approvedByManagerId: e.approved_by_manager_id || undefined,
    approvedByManagerName: e.approved_by_manager_name || undefined,
    rejectionReason: e.rejection_reason || undefined,
    submittedAt: parseTimestamp(e.submitted_at),
    processedAt: e.processed_at ? parseTimestamp(e.processed_at) : undefined,
    aiRiskScore: e.ai_risk_score ? Number(e.ai_risk_score) : undefined,
    aiRiskFlag: e.ai_risk_flag || undefined,
    isJointWork: e.is_joint_work || undefined,
    jointWorkMRId: e.joint_work_mr_id || undefined,
    jointWorkMRName: e.joint_work_mr_name || undefined,
  }));
}

// ==================== PRODUCTS ====================

export async function getActiveProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error('Error fetching products:', handleSupabaseError(error));
    return [];
  }

  return (data || []).map(p => ({
    productId: p.product_id,
    name: p.name,
    description: p.description || undefined,
    price: p.price ? Number(p.price) : undefined,
    isActive: p.is_active,
  }));
}

// ==================== APP SETTINGS ====================

export async function getAppSettings(): Promise<AppSettings | null> {
  const { data, error } = await supabase
    .from('app_settings')
    .select('*')
    .eq('id', 1)
    .single();

  if (error || !data) {
    console.error('Error fetching settings:', handleSupabaseError(error));
    return null;
  }

  return {
    mr_da_local: Number(data.mr_da_local),
    mr_da_outstation: Number(data.mr_da_outstation),
    manager_da_solo: Number(data.manager_da_solo),
    manager_da_joint: Number(data.manager_da_joint),
    ta_per_km: Number(data.ta_per_km),
    mr_hotel_limit: Number(data.mr_hotel_limit),
    manager_hotel_limit: Number(data.manager_hotel_limit),
    outstation_ta_cap: Number(data.outstation_ta_cap),
    outstation_distance_threshold: data.outstation_distance_threshold,
    expense_entry_start_hour: data.expense_entry_start_hour,
    companyLogo: data.company_logo || undefined,
  };
}
