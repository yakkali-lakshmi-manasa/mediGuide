import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import EmergencyAlert from '@/components/EmergencyAlert';
import DiseaseCard from '@/components/DiseaseCard';
import SpecialistCard from '@/components/SpecialistCard';
import type { AnalysisResult } from '@/types';
import { AlertCircle, Stethoscope, FileText, Building2, ArrowLeft } from 'lucide-react';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { analysisResult } = location.state as { analysisResult: AnalysisResult } || {};

  if (!analysisResult) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Results Found</CardTitle>
            <CardDescription>Please complete an assessment first</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/assessment')} className="w-full">
              Start Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'emergency':
        return 'bg-destructive text-destructive-foreground';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getUrgencyMessage = (level: string) => {
    switch (level) {
      case 'emergency':
        return 'Seek immediate medical attention';
      case 'high':
        return 'Consult a doctor as soon as possible';
      case 'medium':
        return 'Schedule a consultation within a few days';
      default:
        return 'Routine consultation recommended';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="@container max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Analysis Results</h1>
            <p className="text-muted-foreground">
              Based on your symptoms, here are the possible conditions
            </p>
          </div>
        </div>

        {analysisResult.emergency_alert && (
          <EmergencyAlert redFlags={analysisResult.red_flags} />
        )}

        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Overall Assessment</CardTitle>
                <CardDescription>Urgency level and next steps</CardDescription>
              </div>
              <Badge className={getUrgencyColor(analysisResult.urgency_level)} variant="default">
                <AlertCircle className="mr-1 h-4 w-4" />
                {analysisResult.urgency_level.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">
              {getUrgencyMessage(analysisResult.urgency_level)}
            </p>
            {analysisResult.red_flags.length > 0 && !analysisResult.emergency_alert && (
              <div className="mt-4 p-3 bg-destructive/10 rounded-lg">
                <p className="text-sm font-medium text-destructive">
                  ⚠️ Critical symptoms detected: {analysisResult.red_flags.join(', ')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Possible Conditions</h2>
          </div>
          <p className="text-muted-foreground">
            These are potential conditions based on your symptoms. This is NOT a diagnosis.
            Always consult a healthcare professional for proper evaluation.
          </p>
          
          {analysisResult.possible_conditions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No specific conditions identified. Please consult a healthcare professional for evaluation.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 @lg:grid-cols-2">
              {analysisResult.possible_conditions.map((condition, index) => (
                <DiseaseCard key={index} condition={condition} />
              ))}
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-secondary" />
            <h2 className="text-2xl font-bold">Recommended Specialists</h2>
          </div>
          <p className="text-muted-foreground">
            Based on your symptoms, consider consulting these types of specialists
          </p>
          
          {analysisResult.recommended_specialists.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Start with a General Physician for initial evaluation
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 @md:grid-cols-2 @lg:grid-cols-3">
              {analysisResult.recommended_specialists.map((specialist) => (
                <SpecialistCard key={specialist.specialist_id} specialist={specialist} reason="Based on your symptoms" />
              ))}
            </div>
          )}
        </div>

        {analysisResult.recommended_tests.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Recommended Diagnostic Tests</h2>
              </div>
              <p className="text-muted-foreground">
                Your healthcare provider may recommend these tests for proper diagnosis
              </p>
              
              <div className="grid gap-3 @md:grid-cols-2">
                {analysisResult.recommended_tests.map((test) => (
                  <Card key={test.test_id}>
                    <CardHeader>
                      <CardTitle className="text-base">{test.test_name}</CardTitle>
                      {test.description && (
                        <CardDescription>{test.description}</CardDescription>
                      )}
                    </CardHeader>
                    {test.purpose && (
                      <CardContent>
                        <p className="text-sm">
                          <span className="font-medium">Purpose:</span> {test.purpose}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />

        <Card className="bg-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>Based on this analysis, we recommend:</p>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Consult with a recommended specialist for professional evaluation</li>
              <li>Bring this analysis summary to your appointment</li>
              <li>Discuss recommended diagnostic tests with your healthcare provider</li>
              <li>Find suitable hospitals and clinics in your area</li>
            </ol>
            <Button
              className="w-full mt-4"
              onClick={() => navigate('/hospitals')}
            >
              <Building2 className="mr-2 h-4 w-4" />
              Find Hospitals Near You
            </Button>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate('/assessment')} className="flex-1">
            New Assessment
          </Button>
          <Button variant="outline" onClick={() => navigate('/')} className="flex-1">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
