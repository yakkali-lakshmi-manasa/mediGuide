import { supabase } from './supabase';
import type {
  Symptom,
  Disease,
  Specialist,
  Hospital,
  DiagnosticTest,
  UserAssessment,
  HospitalSearchParams,
  HospitalWithDistance,
  SymptomInput,
  UserProfile,
  AnalysisResult,
} from '@/types';

// Symptoms API
export const getAllSymptoms = async (): Promise<Symptom[]> => {
  const { data, error } = await supabase
    .from('symptoms')
    .select('*')
    .order('symptom_name');

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getRedFlagSymptoms = async (): Promise<Symptom[]> => {
  const { data, error } = await supabase
    .from('symptoms')
    .select('*')
    .eq('is_red_flag', true);

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// Diseases API
export const getDiseaseById = async (diseaseId: string): Promise<Disease | null> => {
  const { data, error } = await supabase
    .from('diseases')
    .select('*')
    .eq('disease_id', diseaseId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getDiseasesBySymptoms = async (symptomIds: string[]): Promise<Disease[]> => {
  const { data, error } = await supabase
    .from('disease_symptom_mapping')
    .select('disease_id, diseases(*)')
    .in('symptom_id', symptomIds);

  if (error) throw error;
  
  const diseases = data?.map((item: any) => item.diseases).filter(Boolean) || [];
  return Array.isArray(diseases) ? diseases : [];
};

// Specialists API
export const getAllSpecialists = async (): Promise<Specialist[]> => {
  const { data, error } = await supabase
    .from('specialists')
    .select('*')
    .order('specialist_name');

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getSpecialistsByDisease = async (diseaseId: string): Promise<Specialist[]> => {
  const { data, error } = await supabase
    .from('disease_specialist_mapping')
    .select('specialists(*)')
    .eq('disease_id', diseaseId);

  if (error) throw error;
  
  const specialists = data?.map((item: any) => item.specialists).filter(Boolean) || [];
  return Array.isArray(specialists) ? specialists : [];
};

// Diagnostic Tests API
export const getTestsByDisease = async (diseaseId: string): Promise<DiagnosticTest[]> => {
  const { data, error } = await supabase
    .from('disease_test_mapping')
    .select('diagnostic_tests(*)')
    .eq('disease_id', diseaseId);

  if (error) throw error;
  
  const tests = data?.map((item: any) => item.diagnostic_tests).filter(Boolean) || [];
  return Array.isArray(tests) ? tests : [];
};

// Hospitals API
export const searchHospitals = async (params: HospitalSearchParams): Promise<HospitalWithDistance[]> => {
  let query = supabase.from('hospitals').select(`
    *,
    hospital_specialist_mapping(specialists(*))
  `);

  if (params.city) {
    query = query.ilike('city', `%${params.city}%`);
  }

  if (params.state) {
    query = query.ilike('state', `%${params.state}%`);
  }

  if (params.pincode) {
    query = query.eq('pincode', params.pincode);
  }

  if (params.hospital_type && params.hospital_type !== 'all') {
    query = query.eq('type', params.hospital_type);
  }

  if (params.budget_range) {
    query = query.eq('budget_range', params.budget_range);
  }

  if (params.emergency_available) {
    query = query.eq('emergency_available', true);
  }

  if (params.diagnostic_facilities) {
    query = query.eq('diagnostic_facilities', true);
  }

  query = query.order('hospital_name').limit(50);

  const { data, error } = await query;

  if (error) throw error;

  let hospitals: HospitalWithDistance[] = (data || []).map((hospital: any) => {
    const specialists = hospital.hospital_specialist_mapping
      ?.map((mapping: any) => mapping.specialists)
      .filter(Boolean) || [];

    let distance_km: number | undefined;
    if (params.latitude && params.longitude && hospital.latitude && hospital.longitude) {
      const R = 6371;
      const dLat = ((hospital.latitude - params.latitude) * Math.PI) / 180;
      const dLon = ((hospital.longitude - params.longitude) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((params.latitude * Math.PI) / 180) *
          Math.cos((hospital.latitude * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      distance_km = R * c;
    }

    return {
      ...hospital,
      available_specialists: specialists,
      insurance_types: [],
      distance_km,
    };
  });

  // Filter by specialist if specified
  if (params.specialist_id) {
    hospitals = hospitals.filter(h => 
      h.available_specialists?.some(s => s.specialist_id === params.specialist_id)
    );
  }

  // Fetch insurance types for each hospital
  if (hospitals.length > 0) {
    const hospitalIds = hospitals.map(h => h.hospital_id);
    const { data: insuranceData } = await supabase
      .from('hospital_insurance_types')
      .select('hospital_id, insurance_type')
      .in('hospital_id', hospitalIds);

    if (insuranceData) {
      hospitals = hospitals.map(hospital => ({
        ...hospital,
        insurance_types: insuranceData
          .filter((ins: any) => ins.hospital_id === hospital.hospital_id)
          .map((ins: any) => ins.insurance_type),
      }));
    }

    // Filter by insurance type if specified
    if (params.insurance_type) {
      hospitals = hospitals.filter(h =>
        h.insurance_types?.includes(params.insurance_type as any)
      );
    }
  }

  return hospitals.sort((a, b) => {
    if (a.distance_km !== undefined && b.distance_km !== undefined) {
      return a.distance_km - b.distance_km;
    }
    return 0;
  });
};

// User Assessment API
export const createAssessment = async (
  userId: string | null,
  symptomsData: SymptomInput,
  imageUrl: string | null,
  analysisResults: AnalysisResult
): Promise<UserAssessment> => {
  const { data, error } = await supabase
    .from('user_assessments')
    .insert({
      user_id: userId,
      symptoms_data: symptomsData as any,
      image_url: imageUrl,
      analysis_results: analysisResults as any,
      urgency_detected: analysisResults.urgency_level,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserAssessments = async (userId: string): Promise<UserAssessment[]> => {
  const { data, error } = await supabase
    .from('user_assessments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// Image Upload API
export const uploadMedicalImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('app-9gmytsqjzo5d_medical_images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('app-9gmytsqjzo5d_medical_images')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

// AI Analysis API (calls Edge Function)
export const analyzeSymptoms = async (
  symptoms: SymptomInput,
  userProfile: UserProfile,
  imageUrl?: string
): Promise<AnalysisResult> => {
  const { data, error } = await supabase.functions.invoke('analyze-symptoms', {
    body: {
      symptoms,
      userProfile,
      imageUrl,
    },
  });

  if (error) {
    console.error('Analysis error:', error);
    throw new Error(error.message || 'Failed to analyze symptoms');
  }

  return data as AnalysisResult;
};
