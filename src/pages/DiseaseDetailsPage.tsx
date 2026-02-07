import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import SpecialistCard from '@/components/SpecialistCard';
import { getDiseaseById, getSpecialistsByDisease, getTestsByDisease } from '@/db/api';
import type { Disease, Specialist, DiagnosticTest } from '@/types';
import { ArrowLeft, AlertCircle, Activity, Shield, Biohazard, Clock } from 'lucide-react';

export default function DiseaseDetailsPage() {
  const { diseaseId } = useParams<{ diseaseId: string }>();
  const navigate = useNavigate();
  const [disease, setDisease] = useState<Disease | null>(null);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [tests, setTests] = useState<DiagnosticTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (diseaseId) {
      loadDiseaseDetails(diseaseId);
    }
  }, [diseaseId]);

  const loadDiseaseDetails = async (id: string) => {
    setLoading(true);
    try {
      const [diseaseData, specialistsData, testsData] = await Promise.all([
        getDiseaseById(id),
        getSpecialistsByDisease(id),
        getTestsByDisease(id),
      ]);

      setDisease(diseaseData);
      setSpecialists(specialistsData);
      setTests(testsData);
    } catch (error) {
      console.error('Error loading disease details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="@container max-w-4xl mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-12 w-3/4 bg-muted" />
          <Skeleton className="h-32 w-full bg-muted" />
          <Skeleton className="h-64 w-full bg-muted" />
        </div>
      </div>
    );
  }

  if (!disease) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Disease Not Found</CardTitle>
            <CardDescription>The requested disease information could not be found</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              Back to Home
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

  return (
    <div className="min-h-screen bg-background">
      <div className="@container max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{disease.disease_name}</h1>
            <p className="text-muted-foreground">Detailed information about this condition</p>
          </div>
          <Badge className={getUrgencyColor(disease.urgency_level)}>
            <AlertCircle className="mr-1 h-3 w-3" />
            {disease.urgency_level.toUpperCase()}
          </Badge>
        </div>

        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm font-medium">
              ⚠️ <strong>Important:</strong> This information is for educational purposes only and
              does NOT constitute medical advice or diagnosis. Always consult qualified healthcare
              professionals for proper evaluation and treatment.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {disease.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{disease.description}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {disease.is_chronic && (
                <Badge variant="secondary">
                  <Clock className="mr-1 h-3 w-3" />
                  Chronic Condition
                </Badge>
              )}
              {disease.is_infectious && (
                <Badge variant="secondary">
                  <Biohazard className="mr-1 h-3 w-3" />
                  Infectious
                </Badge>
              )}
              {disease.requires_image_analysis && (
                <Badge variant="secondary">
                  <Shield className="mr-1 h-3 w-3" />
                  Visual Assessment Helpful
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {disease.causes && (
          <Card>
            <CardHeader>
              <CardTitle>Common Causes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{disease.causes}</p>
            </CardContent>
          </Card>
        )}

        {disease.risk_factors && (
          <Card>
            <CardHeader>
              <CardTitle>Risk Factors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{disease.risk_factors}</p>
            </CardContent>
          </Card>
        )}

        <Separator />

        {specialists.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Recommended Specialists</h2>
            <p className="text-muted-foreground">
              These specialists are qualified to diagnose and treat this condition
            </p>
            <div className="grid gap-4 @md:grid-cols-2">
              {specialists.map((specialist) => (
                <SpecialistCard key={specialist.specialist_id} specialist={specialist} />
              ))}
            </div>
          </div>
        )}

        {tests.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Diagnostic Tests</h2>
              <p className="text-muted-foreground">
                Healthcare providers may use these tests to diagnose this condition
              </p>
              <div className="grid gap-3">
                {tests.map((test) => (
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

        <Card className="bg-accent">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">If you suspect you may have this condition:</p>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Consult with a recommended specialist</li>
              <li>Discuss your symptoms and concerns</li>
              <li>Follow professional medical advice for diagnosis and treatment</li>
              <li>Do not self-diagnose or self-medicate</li>
            </ol>
            <Button
              className="w-full mt-4"
              onClick={() => navigate('/hospitals')}
            >
              Find Healthcare Facilities
            </Button>
          </CardContent>
        </Card>

        <Button variant="outline" onClick={() => navigate(-1)} className="w-full">
          Go Back
        </Button>
      </div>
    </div>
  );
}
