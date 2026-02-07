export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'emergency';
export type HospitalType = 'government' | 'private';
export type SeverityLevel = 'mild' | 'moderate' | 'severe';
export type GenderType = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export interface Symptom {
  symptom_id: string;
  symptom_name: string;
  category: string | null;
  description: string | null;
  is_red_flag: boolean;
  created_at: string;
}

export interface Disease {
  disease_id: string;
  disease_name: string;
  description: string | null;
  causes: string | null;
  risk_factors: string | null;
  is_chronic: boolean;
  is_infectious: boolean;
  urgency_level: UrgencyLevel;
  requires_image_analysis: boolean;
  created_at: string;
}

export interface Specialist {
  specialist_id: string;
  specialist_name: string;
  description: string | null;
  created_at: string;
}

export interface Hospital {
  hospital_id: string;
  hospital_name: string;
  type: HospitalType;
  address: string;
  city: string;
  pincode: string | null;
  contact_number: string | null;
  latitude: number | null;
  longitude: number | null;
  cost_range_min: number | null;
  cost_range_max: number | null;
  created_at: string;
}

export interface DiagnosticTest {
  test_id: string;
  test_name: string;
  description: string | null;
  purpose: string | null;
  created_at: string;
}

export interface User {
  user_id: string;
  age: number | null;
  gender: GenderType | null;
  medical_history: string | null;
  location: string | null;
  city: string | null;
  pincode: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserAssessment {
  assessment_id: string;
  user_id: string | null;
  symptoms_data: Json;
  image_url: string | null;
  analysis_results: Json;
  urgency_detected: UrgencyLevel | null;
  created_at: string;
}

export interface SymptomInput {
  symptom_ids: string[];
  symptom_description: string;
  duration: string;
  severity: SeverityLevel;
}

export interface UserProfile {
  age?: number;
  gender?: GenderType;
  medical_history?: string;
  location?: string;
  city?: string;
  pincode?: string;
}

export interface AnalysisResult {
  possible_conditions: PossibleCondition[];
  urgency_level: UrgencyLevel;
  red_flags: string[];
  recommended_specialists: Specialist[];
  recommended_tests: DiagnosticTest[];
  emergency_alert: boolean;
}

export interface PossibleCondition {
  disease: Disease;
  confidence_score: number;
  reasoning: string;
  specialists: Specialist[];
  tests: DiagnosticTest[];
}

export interface HospitalSearchParams {
  city?: string;
  pincode?: string;
  hospital_type?: HospitalType | 'both';
  specialist_id?: string;
  min_budget?: number;
  max_budget?: number;
  latitude?: number;
  longitude?: number;
}

export interface HospitalWithDistance extends Hospital {
  distance_km?: number;
  available_specialists?: Specialist[];
  insurance_providers?: string[];
}

export type Database = {
  public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
