-- Clarify Medical Data Model: Common Conditions Knowledge Base
-- This migration adds comments and clarifications to emphasize that the database
-- contains a "Common Conditions Knowledge Base" for guidance purposes only,
-- NOT a diagnostic database.

-- Add table comment to clarify purpose
COMMENT ON TABLE diseases IS 
'Common Conditions Knowledge Base: Contains high-level, non-diagnostic health conditions for symptom pattern matching and guidance-level suggestions only. This is NOT a diagnosis database. All outputs should be labeled as "possible common conditions (not a diagnosis)".';

-- Add column comments for clarity
COMMENT ON COLUMN diseases.disease_id IS 'Unique identifier for each common condition entry';
COMMENT ON COLUMN diseases.disease_name IS 'Name of the common condition (e.g., Common Cold, Viral Fever) - for guidance purposes only';
COMMENT ON COLUMN diseases.description IS 'High-level description of the common condition - informational only, not diagnostic';
COMMENT ON COLUMN diseases.causes IS 'General information about common causes - educational purposes only';
COMMENT ON COLUMN diseases.risk_factors IS 'General risk factor information - guidance only';
COMMENT ON COLUMN diseases.is_chronic IS 'Indicates if condition is typically chronic in nature - informational flag';
COMMENT ON COLUMN diseases.is_infectious IS 'Indicates if condition is typically infectious - informational flag';
COMMENT ON COLUMN diseases.urgency_level IS 'Guidance-level urgency indicator for seeking medical care - not a medical assessment';
COMMENT ON COLUMN diseases.requires_image_analysis IS 'Technical flag for system processing - indicates if visual symptoms are relevant';

-- Add comments to mapping tables
COMMENT ON TABLE disease_symptom_mapping IS 
'Symptom pattern matching data: Maps symptoms to common conditions for guidance purposes. Used for pattern recognition only, not diagnosis.';

COMMENT ON TABLE disease_specialist_mapping IS 
'Specialist guidance mapping: Suggests types of healthcare providers for common conditions. For navigation guidance only.';

COMMENT ON TABLE disease_test_mapping IS 
'Diagnostic test information: General information about tests that healthcare providers may consider. Educational purposes only.';

-- Add comment to user_assessments table
COMMENT ON TABLE user_assessments IS 
'User symptom assessments: Stores user-reported symptoms for pattern matching against the Common Conditions Knowledge Base. Results are guidance only, not medical assessments.';

-- Add comment to custom_symptoms table
COMMENT ON TABLE custom_symptoms IS 
'Custom symptom entries: User-provided symptom descriptions that are normalized and matched to known symptom patterns for guidance purposes.';

-- Ensure hospitals table has proper comment (separate from conditions)
COMMENT ON TABLE hospitals IS 
'Hospital information database: Contains factual hospital data including location, contact, specialties, and insurance information. This is separate from the Common Conditions Knowledge Base and contains verified facility information.';

-- Add view comment
COMMENT ON VIEW assessment_all_symptoms IS 
'Combined view of predefined and custom symptoms for each assessment. Used for pattern matching in the Common Conditions Knowledge Base.';
