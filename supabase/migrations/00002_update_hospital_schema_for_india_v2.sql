-- Add new columns to hospitals table
ALTER TABLE hospitals 
  ADD COLUMN IF NOT EXISTS state VARCHAR(100),
  ADD COLUMN IF NOT EXISTS budget_range VARCHAR(20),
  ADD COLUMN IF NOT EXISTS emergency_available BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS diagnostic_facilities BOOLEAN DEFAULT false;

-- Create budget range check constraint
ALTER TABLE hospitals 
  DROP CONSTRAINT IF EXISTS budget_range_check;
  
ALTER TABLE hospitals 
  ADD CONSTRAINT budget_range_check 
  CHECK (budget_range IN ('low', 'medium', 'high'));

-- Create insurance types table
CREATE TABLE IF NOT EXISTS hospital_insurance_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id UUID REFERENCES hospitals(hospital_id) ON DELETE CASCADE,
  insurance_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(hospital_id, insurance_type)
);

-- Create index for insurance types
CREATE INDEX IF NOT EXISTS idx_hospital_insurance_hospital ON hospital_insurance_types(hospital_id);
CREATE INDEX IF NOT EXISTS idx_hospital_insurance_type ON hospital_insurance_types(insurance_type);

-- Add indexes for new hospital fields
CREATE INDEX IF NOT EXISTS idx_hospitals_state ON hospitals(state);
CREATE INDEX IF NOT EXISTS idx_hospitals_budget_range ON hospitals(budget_range);
CREATE INDEX IF NOT EXISTS idx_hospitals_emergency ON hospitals(emergency_available);
CREATE INDEX IF NOT EXISTS idx_hospitals_diagnostic ON hospitals(diagnostic_facilities);

-- RLS policy for insurance types
ALTER TABLE hospital_insurance_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for insurance types" ON hospital_insurance_types;
CREATE POLICY "Public read access for insurance types" 
ON hospital_insurance_types FOR SELECT USING (true);

SELECT 'Schema updated successfully' as status;