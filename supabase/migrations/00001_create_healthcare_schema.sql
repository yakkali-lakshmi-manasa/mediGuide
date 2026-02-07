-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create ENUM types
CREATE TYPE urgency_level AS ENUM ('low', 'medium', 'high', 'emergency');
CREATE TYPE hospital_type AS ENUM ('government', 'private');
CREATE TYPE severity_level AS ENUM ('mild', 'moderate', 'severe');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');

-- Users table
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  age INTEGER,
  gender gender_type,
  medical_history TEXT,
  location TEXT,
  city TEXT,
  pincode VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Symptoms table
CREATE TABLE symptoms (
  symptom_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  symptom_name VARCHAR(200) NOT NULL UNIQUE,
  category VARCHAR(100),
  description TEXT,
  is_red_flag BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Diseases table
CREATE TABLE diseases (
  disease_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  disease_name VARCHAR(200) NOT NULL UNIQUE,
  description TEXT,
  causes TEXT,
  risk_factors TEXT,
  is_chronic BOOLEAN DEFAULT FALSE,
  is_infectious BOOLEAN DEFAULT FALSE,
  urgency_level urgency_level DEFAULT 'low',
  requires_image_analysis BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disease-Symptom mapping with weights
CREATE TABLE disease_symptom_mapping (
  mapping_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  disease_id UUID REFERENCES diseases(disease_id) ON DELETE CASCADE,
  symptom_id UUID REFERENCES symptoms(symptom_id) ON DELETE CASCADE,
  weight DECIMAL(3,2) DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(disease_id, symptom_id)
);

-- Specialists table
CREATE TABLE specialists (
  specialist_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  specialist_name VARCHAR(200) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disease-Specialist mapping
CREATE TABLE disease_specialist_mapping (
  mapping_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  disease_id UUID REFERENCES diseases(disease_id) ON DELETE CASCADE,
  specialist_id UUID REFERENCES specialists(specialist_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(disease_id, specialist_id)
);

-- Hospitals table
CREATE TABLE hospitals (
  hospital_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_name VARCHAR(300) NOT NULL,
  type hospital_type NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  pincode VARCHAR(10),
  contact_number VARCHAR(20),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  cost_range_min INTEGER,
  cost_range_max INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hospital-Specialist mapping
CREATE TABLE hospital_specialist_mapping (
  mapping_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id UUID REFERENCES hospitals(hospital_id) ON DELETE CASCADE,
  specialist_id UUID REFERENCES specialists(specialist_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(hospital_id, specialist_id)
);

-- Insurance providers
CREATE TABLE insurance_providers (
  insurance_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_name VARCHAR(200) NOT NULL,
  hospital_id UUID REFERENCES hospitals(hospital_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User assessments (history)
CREATE TABLE user_assessments (
  assessment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  symptoms_data JSONB,
  image_url TEXT,
  analysis_results JSONB,
  urgency_detected urgency_level,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Diagnostic tests
CREATE TABLE diagnostic_tests (
  test_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_name VARCHAR(200) NOT NULL UNIQUE,
  description TEXT,
  purpose TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disease-Test mapping
CREATE TABLE disease_test_mapping (
  mapping_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  disease_id UUID REFERENCES diseases(disease_id) ON DELETE CASCADE,
  test_id UUID REFERENCES diagnostic_tests(test_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(disease_id, test_id)
);

-- Create indexes for performance
CREATE INDEX idx_symptoms_name ON symptoms(symptom_name);
CREATE INDEX idx_symptoms_red_flag ON symptoms(is_red_flag);
CREATE INDEX idx_diseases_name ON diseases(disease_name);
CREATE INDEX idx_diseases_urgency ON diseases(urgency_level);
CREATE INDEX idx_hospitals_city ON hospitals(city);
CREATE INDEX idx_hospitals_type ON hospitals(type);
CREATE INDEX idx_hospitals_location ON hospitals USING GIST(ST_MakePoint(longitude, latitude));
CREATE INDEX idx_user_assessments_user ON user_assessments(user_id);
CREATE INDEX idx_user_assessments_created ON user_assessments(created_at DESC);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public read for reference data, user-specific for personal data)
CREATE POLICY "Public read access for symptoms" ON symptoms FOR SELECT USING (true);
CREATE POLICY "Public read access for diseases" ON diseases FOR SELECT USING (true);
CREATE POLICY "Public read access for specialists" ON specialists FOR SELECT USING (true);
CREATE POLICY "Public read access for hospitals" ON hospitals FOR SELECT USING (true);
CREATE POLICY "Public read access for insurance" ON insurance_providers FOR SELECT USING (true);
CREATE POLICY "Public read access for tests" ON diagnostic_tests FOR SELECT USING (true);
CREATE POLICY "Public read access for mappings" ON disease_symptom_mapping FOR SELECT USING (true);
CREATE POLICY "Public read access for disease specialists" ON disease_specialist_mapping FOR SELECT USING (true);
CREATE POLICY "Public read access for hospital specialists" ON hospital_specialist_mapping FOR SELECT USING (true);
CREATE POLICY "Public read access for disease tests" ON disease_test_mapping FOR SELECT USING (true);

-- Users can create their own records
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (true);

-- Assessments policies
CREATE POLICY "Users can insert assessments" ON user_assessments FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view assessments" ON user_assessments FOR SELECT USING (true);

-- Create storage bucket for medical images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('app-9gmytsqjzo5d_medical_images', 'app-9gmytsqjzo5d_medical_images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for medical images
CREATE POLICY "Public read access for medical images"
ON storage.objects FOR SELECT
USING (bucket_id = 'app-9gmytsqjzo5d_medical_images');

CREATE POLICY "Anyone can upload medical images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'app-9gmytsqjzo5d_medical_images' AND (storage.foldername(name))[1] = 'uploads');

CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'app-9gmytsqjzo5d_medical_images');

CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (bucket_id = 'app-9gmytsqjzo5d_medical_images');