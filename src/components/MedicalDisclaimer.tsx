import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function MedicalDisclaimer() {
  return (
    <Alert className="border-destructive bg-destructive/10">
      <AlertTriangle className="h-5 w-5 text-destructive" />
      <AlertTitle className="text-destructive font-semibold">
        Important Medical Disclaimer
      </AlertTitle>
      <AlertDescription className="text-sm text-foreground/90 mt-2 space-y-2">
        <p>
          <strong>This is NOT a diagnostic tool.</strong> MediGuide is a health information and care 
          navigation tool that uses a Common Conditions Knowledge Base for guidance purposes only.
        </p>
        <p>
          The information provided represents <strong>possible common conditions based on symptom patterns</strong> 
          and should not be considered as medical diagnosis, treatment recommendations, or prescriptions.
        </p>
        <p>
          <strong>Always consult qualified healthcare professionals</strong> for proper medical diagnosis, 
          evaluation, and treatment. The suggestions provided are for informational and navigation guidance only.
        </p>
        <p className="font-semibold">
          In case of emergency or severe symptoms, contact emergency services immediately (dial 108).
        </p>
      </AlertDescription>
    </Alert>
  );
}
