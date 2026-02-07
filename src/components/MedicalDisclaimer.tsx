import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function MedicalDisclaimer() {
  return (
    <Alert className="border-destructive bg-destructive/10">
      <AlertTriangle className="h-5 w-5 text-destructive" />
      <AlertTitle className="text-destructive font-semibold">
        Important Medical Disclaimer
      </AlertTitle>
      <AlertDescription className="text-sm text-foreground/90 mt-2">
        This application is a health information and care navigation tool only. It does NOT provide
        medical diagnosis, treatment, or prescriptions. The information provided represents possible
        conditions based on symptoms and should not be considered as medical advice. Always consult
        qualified healthcare professionals for proper diagnosis and treatment. In case of emergency,
        contact emergency services immediately.
      </AlertDescription>
    </Alert>
  );
}
