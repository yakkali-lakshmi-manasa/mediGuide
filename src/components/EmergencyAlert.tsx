import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmergencyAlertProps {
  redFlags: string[];
}

export default function EmergencyAlert({ redFlags }: EmergencyAlertProps) {
  if (redFlags.length === 0) return null;

  return (
    <Alert className="border-destructive bg-destructive text-destructive-foreground">
      <AlertTriangle className="h-6 w-6" />
      <AlertTitle className="text-lg font-bold">⚠️ EMERGENCY ALERT</AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p className="font-semibold">
          You have reported critical symptoms that require IMMEDIATE medical attention:
        </p>
        <ul className="list-disc list-inside space-y-1">
          {redFlags.map((flag, index) => (
            <li key={index}>{flag}</li>
          ))}
        </ul>
        <div className="flex flex-col gap-2 mt-4">
          <p className="font-bold">DO NOT DELAY - SEEK EMERGENCY CARE NOW</p>
          <Button
            variant="outline"
            className="w-full bg-destructive-foreground text-destructive hover:bg-destructive-foreground/90"
            onClick={() => window.open('tel:911')}
          >
            <Phone className="mr-2 h-4 w-4" />
            Call Emergency Services (911)
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
