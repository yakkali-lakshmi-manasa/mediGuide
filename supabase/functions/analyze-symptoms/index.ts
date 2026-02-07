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

    // Fetch symptom details
    const { data: symptomData, error: symptomError } = await supabaseClient
      .from('symptoms')
      .select('*')
      .in('symptom_id', symptomInput.symptom_ids);

    if (symptomError) throw symptomError;

    // Check for red flag symptoms
    const redFlags = symptomData?.filter(s => s.is_red_flag) || [];
    const hasEmergency = redFlags.length > 0 || symptomInput.severity === 'severe';

    // Fetch possible diseases based on symptoms
    const { data: mappingData, error: mappingError } = await supabaseClient
      .from('disease_symptom_mapping')
      .select('disease_id, weight, diseases(*)')
      .in('symptom_id', symptomInput.symptom_ids);

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

        const maxScore = symptomInput.symptom_ids.length;
        const confidenceScore = Math.min((score / maxScore) * 100, 95);

        let reasoning = `Based on ${matchCount} matching symptom(s). `;
        
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
