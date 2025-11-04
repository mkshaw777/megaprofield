// Supabase Client Configuration for Megapro Innovation SFA
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Database Types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          user_id: string;
          name: string;
          username: string;
          password_hash: string;
          role: 'mr' | 'manager' | 'admin';
          linked_manager_id: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'user_id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      doctors: {
        Row: {
          doctor_id: string;
          name: string;
          specialty: string;
          location_lat: number | null;
          location_lng: number | null;
          location_address: string | null;
          assigned_mr_id: string;
          phone: string | null;
          address: string | null;
          is_active: boolean;
        };
        Insert: Omit<Database['public']['Tables']['doctors']['Row'], 'doctor_id'>;
        Update: Partial<Database['public']['Tables']['doctors']['Insert']>;
      };
      visits: {
        Row: {
          visit_id: string;
          mr_id: string;
          mr_name: string;
          doctor_id: string;
          doctor_name: string;
          check_in_timestamp: string;
          check_in_lat: number;
          check_in_lng: number;
          check_in_address: string | null;
          check_out_timestamp: string | null;
          check_out_lat: number | null;
          check_out_lng: number | null;
          check_out_address: string | null;
          pob_amount: number;
          collection_amount: number;
          gift_distributed: boolean;
          products_discussed: string[];
          notes: string | null;
          status: 'active' | 'completed';
          duration: number | null;
        };
        Insert: Omit<Database['public']['Tables']['visits']['Row'], 'visit_id'>;
        Update: Partial<Database['public']['Tables']['visits']['Insert']>;
      };
      expenses: {
        Row: {
          expense_id: string;
          user_id: string;
          user_name: string;
          user_role: 'mr' | 'manager' | 'admin';
          date: string;
          distance_km: number;
          is_outstation: boolean;
          is_night_stay: boolean;
          hotel_bill_amount: number;
          bill_proof_url: string | null;
          bike_meter_start: number | null;
          bike_meter_end: number | null;
          bike_meter_start_photo_url: string | null;
          bike_meter_end_photo_url: string | null;
          calculated_da: number;
          calculated_ta: number;
          total_expense: number;
          status: 'pending' | 'approved' | 'rejected';
          approved_by_manager_id: string | null;
          approved_by_manager_name: string | null;
          rejection_reason: string | null;
          submitted_at: string;
          processed_at: string | null;
          ai_risk_score: number | null;
          ai_risk_flag: boolean | null;
          is_joint_work: boolean | null;
          joint_work_mr_id: string | null;
          joint_work_mr_name: string | null;
        };
        Insert: Omit<Database['public']['Tables']['expenses']['Row'], 'expense_id' | 'submitted_at'>;
        Update: Partial<Database['public']['Tables']['expenses']['Insert']>;
      };
      tour_plans: {
        Row: {
          tour_plan_id: string;
          mr_id: string;
          mr_name: string;
          date: string;
          locations: string[];
          doctors_to_visit: string[];
          expected_distance: number;
          status: 'pending' | 'approved' | 'rejected';
          approved_by_manager_id: string | null;
          approved_by_manager_name: string | null;
          created_at: string;
          processed_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['tour_plans']['Row'], 'tour_plan_id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['tour_plans']['Insert']>;
      };
      products: {
        Row: {
          product_id: string;
          name: string;
          description: string | null;
          price: number | null;
          is_active: boolean;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'product_id'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      app_settings: {
        Row: {
          id: number;
          mr_da_local: number;
          mr_da_outstation: number;
          manager_da_solo: number;
          manager_da_joint: number;
          ta_per_km: number;
          mr_hotel_limit: number;
          manager_hotel_limit: number;
          outstation_ta_cap: number;
          outstation_distance_threshold: number;
          expense_entry_start_hour: number;
          company_logo: string | null;
        };
        Insert: Omit<Database['public']['Tables']['app_settings']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['app_settings']['Insert']>;
      };
    };
  };
}

// Create Supabase client
const supabaseUrl = `https://${projectId}.supabase.co`;
export const supabase = createClient<Database>(supabaseUrl, publicAnonKey);

// Helper function to handle Supabase errors
export function handleSupabaseError(error: any): string {
  if (!error) return 'Unknown error occurred';
  return error.message || error.error_description || 'An error occurred';
}

// Check if Supabase is connected
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('users').select('count').limit(1);
    return !error;
  } catch (e) {
    return false;
  }
}
