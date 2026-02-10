-- Create table for storing custom user-entered symptoms
CREATE TABLE IF NOT EXISTS custom_symptoms (
  custom_symptom_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID REFERENCES user_assessments(assessment_id) ON DELETE CASCADE,
  raw_symptom_text TEXT NOT NULL,
  normalized_symptom_text TEXT,
  matched_symptom_id UUID REFERENCES symptoms(symptom_id),
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_custom_symptoms_assessment ON custom_symptoms(assessment_id);
CREATE INDEX IF NOT EXISTS idx_custom_symptoms_matched ON custom_symptoms(matched_symptom_id);
CREATE INDEX IF NOT EXISTS idx_custom_symptoms_normalized ON custom_symptoms(normalized_symptom_text);

-- Add comment explaining the table purpose
COMMENT ON TABLE custom_symptoms IS 'Stores user-entered custom symptoms with their normalized forms and potential matches to predefined symptoms';
COMMENT ON COLUMN custom_symptoms.raw_symptom_text IS 'Original symptom text as entered by user';
COMMENT ON COLUMN custom_symptoms.normalized_symptom_text IS 'AI-normalized version of the symptom (handles typos, synonyms)';
COMMENT ON COLUMN custom_symptoms.matched_symptom_id IS 'Reference to predefined symptom if a match is found';
COMMENT ON COLUMN custom_symptoms.confidence_score IS 'Confidence score (0.00-1.00) for the match to predefined symptom';

-- RLS policy for custom symptoms
ALTER TABLE custom_symptoms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for custom symptoms" ON custom_symptoms;
CREATE POLICY "Public read access for custom symptoms" 
ON custom_symptoms FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert access for custom symptoms" ON custom_symptoms;
CREATE POLICY "Public insert access for custom symptoms" 
ON custom_symptoms FOR INSERT WITH CHECK (true);

-- Create a view that combines predefined and custom symptoms for an assessment
CREATE OR REPLACE VIEW assessment_all_symptoms AS
SELECT 
  ua.assessment_id,
  ua.user_id,
  ua.created_at as assessment_date,
  s.symptom_id as predefined_symptom_id,
  s.symptom_name as predefined_symptom_name,
  s.is_red_flag,
  cs.custom_symptom_id,
  cs.raw_symptom_text as custom_symptom,
  cs.normalized_symptom_text,
  cs.matched_symptom_id,
  cs.confidence_score
FROM user_assessments ua
LEFT JOIN LATERAL jsonb_array_elements_text((ua.symptoms_data->>'symptom_ids')::jsonb) AS symptom_id_text ON true
LEFT JOIN symptoms s ON s.symptom_id::text = symptom_id_text
LEFT JOIN custom_symptoms cs ON cs.assessment_id = ua.assessment_id;

COMMENT ON VIEW assessment_all_symptoms IS 'Unified view of both predefined and custom symptoms for each assessment';

SELECT 'Custom symptoms tracking tables created successfully' as status;