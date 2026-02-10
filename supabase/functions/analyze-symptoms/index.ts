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

    // Categorize symptoms by type for better matching logic
    const symptomCategories = new Map<string, string>();
    symptomData?.forEach(s => {
      if (s.category) {
        symptomCategories.set(s.symptom_id, s.category);
      }
    });

    // Check if fever is present (important for infection likelihood)
    const hasFever = symptomData?.some(s => s.symptom_name.toLowerCase().includes('fever')) || false;

    // Calculate disease scores with category-aware matching
    const diseaseScores = new Map<string, { 
      disease: any; 
      score: number; 
      matchCount: number;
      categoryMatches: Set<string>;
      hasRelevantSymptoms: boolean;
    }>();
    
    mappingData?.forEach((mapping: any) => {
      const diseaseId = mapping.disease_id;
      const symptomId = mapping.symptom_id;
      const symptomCategory = symptomCategories.get(symptomId);
      
      const existing = diseaseScores.get(diseaseId);
      
      if (existing) {
        existing.score += mapping.weight;
        existing.matchCount += 1;
        if (symptomCategory) {
          existing.categoryMatches.add(symptomCategory);
        }
      } else {
        const categorySet = new Set<string>();
        if (symptomCategory) {
          categorySet.add(symptomCategory);
        }
        diseaseScores.set(diseaseId, {
          disease: mapping.diseases,
          score: mapping.weight,
          matchCount: 1,
          categoryMatches: categorySet,
          hasRelevantSymptoms: false,
        });
      }
    });

    // Apply medical precision filtering based on severity and symptom relevance
    const filteredDiseases = Array.from(diseaseScores.values()).filter(({ disease, matchCount, categoryMatches }) => {
      // RULE 1: Minimum symptom match requirement
      // Require at least 1 symptom match for any condition
      if (matchCount < 1) return false;

      // RULE 2: Severity-aware filtering for MILD cases
      if (symptomInput.severity === 'mild') {
        // Suppress serious/chronic conditions unless strongly justified
        const isSeriousCondition = disease.urgency_level === 'high' || 
                                   disease.urgency_level === 'emergency' ||
                                   disease.is_chronic;
        
        // For serious conditions, require at least 2 matching symptoms
        if (isSeriousCondition && matchCount < 2) {
          return false;
        }

        // Suppress organ-specific chronic diseases (Hypertension, Cardiac, etc.) for mild severity
        const isOrganSpecificChronic = disease.is_chronic && 
          (disease.disease_name.toLowerCase().includes('hypertension') ||
           disease.disease_name.toLowerCase().includes('cardiac') ||
           disease.disease_name.toLowerCase().includes('myocardial'));
        
        if (isOrganSpecificChronic && matchCount < 3) {
          return false;
        }
      }

      // RULE 3: Category-specific relevance checks
      const diseaseName = disease.disease_name.toLowerCase();
      
      // Gastroenteritis requires GI symptoms
      if (diseaseName.includes('gastro') || diseaseName.includes('enteritis')) {
        const hasGISymptom = categoryMatches.has('Gastrointestinal');
        if (!hasGISymptom) return false;
      }

      // Pneumonia requires respiratory symptoms
      if (diseaseName.includes('pneumonia')) {
        const hasRespiratorySymptom = categoryMatches.has('Respiratory');
        if (!hasRespiratorySymptom) return false;
      }

      // Hypertension should not appear without cardiovascular symptoms or medical history
      if (diseaseName.includes('hypertension')) {
        const hasCardiovascularSymptom = categoryMatches.has('Cardiovascular');
        const hasHistoryMention = profile.medical_history?.toLowerCase().includes('hypertension') ||
                                  profile.medical_history?.toLowerCase().includes('blood pressure');
        if (!hasCardiovascularSymptom && !hasHistoryMention) {
          return false;
        }
      }

      // Cardiac conditions require cardiovascular symptoms
      if (diseaseName.includes('cardiac') || diseaseName.includes('myocardial')) {
        const hasCardiovascularSymptom = categoryMatches.has('Cardiovascular');
        if (!hasCardiovascularSymptom) return false;
      }

      // Dermatological conditions require skin symptoms
      if (diseaseName.includes('dermatitis') || diseaseName.includes('eczema') || 
          diseaseName.includes('psoriasis')) {
        const hasSkinSymptom = categoryMatches.has('Dermatological');
        if (!hasSkinSymptom) return false;
      }

      return true;
    });

    // RULE 4: Fever-specific logic - boost infectious conditions
    filteredDiseases.forEach(item => {
      if (hasFever && item.disease.is_infectious) {
        // Boost score for infectious conditions when fever is present
        item.score *= 1.3;
      }
      
      if (hasFever && item.disease.is_chronic && !item.disease.is_infectious) {
        // Reduce score for purely chronic conditions when fever is present
        item.score *= 0.7;
      }
    });

    // Sort by adjusted score and limit results based on severity
    let maxResults = 5;
    if (symptomInput.severity === 'mild') {
      maxResults = 3; // Narrow down to 2-3 conditions for mild cases
    }

    const sortedDiseases = filteredDiseases
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);

    // Fetch specialists and tests for each disease
    const possibleConditions = await Promise.all(
      sortedDiseases.map(async ({ disease, score, matchCount, categoryMatches }) => {
        const { data: specialists } = await supabaseClient
          .from('disease_specialist_mapping')
          .select('specialists(*)')
          .eq('disease_id', disease.disease_id);

        const { data: tests } = await supabaseClient
          .from('disease_test_mapping')
          .select('diagnostic_tests(*)')
          .eq('disease_id', disease.disease_id);

        const maxScore = allSymptomIds.length;
        let confidenceScore = Math.min((score / maxScore) * 100, 95);

        // RULE 5: Confidence score adjustment based on severity
        if (symptomInput.severity === 'mild') {
          // Cap confidence for mild severity
          const isSeriousCondition = disease.urgency_level === 'high' || 
                                     disease.urgency_level === 'emergency';
          
          if (isSeriousCondition) {
            // Serious conditions get very low confidence for mild severity
            confidenceScore = Math.min(confidenceScore * 0.4, 35);
          } else {
            // Even common conditions capped at 60% for mild severity
            confidenceScore = Math.min(confidenceScore, 60);
          }
        } else if (symptomInput.severity === 'moderate') {
          // Moderate severity allows higher confidence
          confidenceScore = Math.min(confidenceScore, 80);
        }
        // Severe severity keeps original high confidence

        let reasoning = `Pattern match based on ${matchCount} symptom(s)`;
        
        // Add info about custom symptoms if any were matched
        const customMatchCount = customSymptomIds.filter(id => 
          mappingData?.some(m => m.disease_id === disease.disease_id && allSymptomIds.includes(id))
        ).length;
        
        if (customMatchCount > 0) {
          reasoning += ` (including ${customMatchCount} from your description)`;
        }
        
        // Add category information
        if (categoryMatches.size > 0) {
          const categories = Array.from(categoryMatches).join(', ');
          reasoning += ` affecting ${categories.toLowerCase()} system`;
        }
        
        reasoning += '. ';
        
        if (disease.is_chronic) {
          reasoning += 'Typically a chronic condition. ';
        }
        if (disease.is_infectious) {
          reasoning += 'Typically infectious. ';
          if (hasFever) {
            reasoning += 'Fever pattern supports this match. ';
          }
        }
        
        reasoning += `Guidance urgency level: ${disease.urgency_level}.`;

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

    // RULE 6: Specialist recommendation control
    // Collect all recommended specialists
    const allSpecialists = new Map();
    possibleConditions.forEach(condition => {
      condition.specialists.forEach(specialist => {
        allSpecialists.set(specialist.specialist_id, specialist);
      });
    });

    // For mild severity with only low-risk conditions, recommend only General Physician
    let recommendedSpecialists = Array.from(allSpecialists.values());
    
    if (symptomInput.severity === 'mild') {
      const allLowRisk = possibleConditions.every(c => 
        c.disease.urgency_level === 'low' && !c.disease.is_chronic
      );
      
      if (allLowRisk) {
        // Filter to only General Physician or General Medicine
        recommendedSpecialists = recommendedSpecialists.filter(s => 
          s.specialist_name.toLowerCase().includes('general') ||
          s.specialist_name.toLowerCase().includes('physician') ||
          s.specialist_name.toLowerCase().includes('family')
        );
        
        // If no general physician found, keep only the first specialist
        if (recommendedSpecialists.length === 0 && allSpecialists.size > 0) {
          recommendedSpecialists = [Array.from(allSpecialists.values())[0]];
        }
      } else {
        // For mild with some risk, limit to 2 most relevant specialists
        recommendedSpecialists = recommendedSpecialists.slice(0, 2);
      }
    }

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
      recommended_specialists: recommendedSpecialists,
      recommended_tests: Array.from(allTests.values()),
      emergency_alert: urgencyLevel === 'emergency',
      custom_symptoms_processed: normalizedCustomSymptoms.length,
      custom_symptoms_matched: customSymptomIds.length,
      severity_applied: symptomInput.severity,
      filtering_applied: true,
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
