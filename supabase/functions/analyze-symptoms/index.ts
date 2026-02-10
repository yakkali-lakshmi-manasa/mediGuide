import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SymptomInput {
  symptom_ids: string[];
  symptom_description: string;
  duration: string;
  severity: 'mild' | 'moderate' | 'severe';
}

interface UserProfile {
  age?: number;
  gender?: string;
  medical_history?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { symptoms, userProfile, imageUrl } = await req.json();

    const symptomInput = symptoms as SymptomInput;
    const profile = userProfile as UserProfile;

    // Process custom symptoms from free-text description
    let customSymptomIds: string[] = [];
    let normalizedCustomSymptoms: Array<{ raw: string; normalized: string; matchedId?: string }> = [];
    
    if (symptomInput.symptom_description && symptomInput.symptom_description.trim().length > 0) {
      // Split custom symptoms by common delimiters
      const customSymptomTexts = symptomInput.symptom_description
        .split(/[,;.\n]/)
        .map(s => s.trim())
        .filter(s => s.length > 0);

      // Normalize and try to match custom symptoms to predefined ones
      const { data: allSymptoms } = await supabaseClient
        .from('symptoms')
        .select('symptom_id, symptom_name');

      for (const customText of customSymptomTexts) {
        const normalized = customText.toLowerCase().trim();
        
        // Try to find a match in predefined symptoms (fuzzy matching)
        const matchedSymptom = allSymptoms?.find(s => {
          const symptomName = s.symptom_name.toLowerCase();
          return symptomName.includes(normalized) || 
                 normalized.includes(symptomName) ||
                 // Check for common synonyms/variations
                 (normalized.includes('pain') && symptomName.includes('pain')) ||
                 (normalized.includes('ache') && symptomName.includes('pain')) ||
                 (normalized.includes('hurt') && symptomName.includes('pain'));
        });

        normalizedCustomSymptoms.push({
          raw: customText,
          normalized: normalized,
          matchedId: matchedSymptom?.symptom_id,
        });

        // If matched, add to symptom_ids for analysis
        if (matchedSymptom && !symptomInput.symptom_ids.includes(matchedSymptom.symptom_id)) {
          customSymptomIds.push(matchedSymptom.symptom_id);
        }
      }
    }

    // Combine predefined and matched custom symptoms
    const allSymptomIds = [...symptomInput.symptom_ids, ...customSymptomIds];

    // Fetch symptom details for all symptoms (predefined + matched custom)
    const { data: symptomData, error: symptomError } = await supabaseClient
      .from('symptoms')
      .select('*')
      .in('symptom_id', allSymptomIds);

    if (symptomError) throw symptomError;

    // Check for red flag symptoms
    const redFlags = symptomData?.filter(s => s.is_red_flag) || [];
    const hasEmergency = redFlags.length > 0 || symptomInput.severity === 'severe';

    // Fetch possible diseases based on all symptoms (predefined + matched custom)
    const { data: mappingData, error: mappingError } = await supabaseClient
      .from('disease_symptom_mapping')
      .select('disease_id, weight, diseases(*)')
      .in('symptom_id', allSymptomIds);

    if (mappingError) throw mappingError;

    // Calculate disease scores
    const diseaseScores = new Map<string, { disease: any; score: number; matchCount: number }>();
    
    mappingData?.forEach((mapping: any) => {
      const diseaseId = mapping.disease_id;
      const existing = diseaseScores.get(diseaseId);
      
      if (existing) {
        existing.score += mapping.weight;
        existing.matchCount += 1;
      } else {
        diseaseScores.set(diseaseId, {
          disease: mapping.diseases,
          score: mapping.weight,
          matchCount: 1,
        });
      }
    });

    // Sort by score and get top 5
    const sortedDiseases = Array.from(diseaseScores.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Fetch specialists and tests for each disease
    const possibleConditions = await Promise.all(
      sortedDiseases.map(async ({ disease, score, matchCount }) => {
        const { data: specialists } = await supabaseClient
          .from('disease_specialist_mapping')
          .select('specialists(*)')
          .eq('disease_id', disease.disease_id);

        const { data: tests } = await supabaseClient
          .from('disease_test_mapping')
          .select('diagnostic_tests(*)')
          .eq('disease_id', disease.disease_id);

        const maxScore = allSymptomIds.length;
        const confidenceScore = Math.min((score / maxScore) * 100, 95);

        let reasoning = `Based on ${matchCount} matching symptom(s)`;
        
        // Add info about custom symptoms if any were matched
        const customMatchCount = customSymptomIds.filter(id => 
          mappingData?.some(m => m.disease_id === disease.disease_id && allSymptomIds.includes(id))
        ).length;
        
        if (customMatchCount > 0) {
          reasoning += ` (including ${customMatchCount} from your description)`;
        }
        reasoning += '. ';
        
        if (disease.is_chronic) {
          reasoning += 'This is a chronic condition. ';
        }
        if (disease.is_infectious) {
          reasoning += 'This condition is infectious. ';
        }
        
        reasoning += `Typical urgency level: ${disease.urgency_level}.`;

        return {
          disease,
          confidence_score: Math.round(confidenceScore),
          reasoning,
          specialists: specialists?.map((s: any) => s.specialists).filter(Boolean) || [],
          tests: tests?.map((t: any) => t.diagnostic_tests).filter(Boolean) || [],
        };
      })
    );

    // Determine overall urgency
    let urgencyLevel: 'low' | 'medium' | 'high' | 'emergency' = 'low';
    
    if (hasEmergency || redFlags.length > 0) {
      urgencyLevel = 'emergency';
    } else if (sortedDiseases.some(d => d.disease.urgency_level === 'high')) {
      urgencyLevel = 'high';
    } else if (sortedDiseases.some(d => d.disease.urgency_level === 'medium')) {
      urgencyLevel = 'medium';
    }

    // Collect all recommended specialists
    const allSpecialists = new Map();
    possibleConditions.forEach(condition => {
      condition.specialists.forEach(specialist => {
        allSpecialists.set(specialist.specialist_id, specialist);
      });
    });

    // Collect all recommended tests
    const allTests = new Map();
    possibleConditions.forEach(condition => {
      condition.tests.forEach(test => {
        allTests.set(test.test_id, test);
      });
    });

    const analysisResult = {
      possible_conditions: possibleConditions,
      urgency_level: urgencyLevel,
      red_flags: redFlags.map(s => s.symptom_name),
      recommended_specialists: Array.from(allSpecialists.values()),
      recommended_tests: Array.from(allTests.values()),
      emergency_alert: urgencyLevel === 'emergency',
      custom_symptoms_processed: normalizedCustomSymptoms.length,
      custom_symptoms_matched: customSymptomIds.length,
    };

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
