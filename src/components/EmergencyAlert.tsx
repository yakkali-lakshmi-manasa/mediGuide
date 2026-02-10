import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmergencyAlertProps {
  redFlags: string[];
}

export default function EmergencyAlert({ redFlags }: EmergencyAlertProps) {
  if (redFlags.length === 0) return null;

  return (
    <Alert className="border-2 border-red-600 bg-red-50 dark:bg-red-950 dark:border-red-500">
      <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
      <AlertTitle className="text-lg font-bold text-red-900 dark:text-red-100">
        ⚠️ EMERGENCY ALERT
      </AlertTitle>
      <AlertDescription className="mt-2 space-y-3 text-red-900 dark:text-red-100">
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
            className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            onClick={() => window.open('tel:108')}
          >
            <Phone className="mr-2 h-4 w-4" />
            Call Emergency Services (108)
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
