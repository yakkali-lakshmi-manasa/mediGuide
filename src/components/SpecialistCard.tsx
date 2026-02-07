import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Specialist } from '@/types';
import { Stethoscope } from 'lucide-react';

interface SpecialistCardProps {
  specialist: Specialist;
  reason?: string;
}

export default function SpecialistCard({ specialist, reason }: SpecialistCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Stethoscope className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{specialist.specialist_name}</CardTitle>
            <CardDescription className="mt-1">
              {specialist.description || 'Medical specialist'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      {reason && (
        <CardContent>
          <Badge variant="secondary" className="text-xs">
            Recommended for your symptoms
          </Badge>
        </CardContent>
      )}
    </Card>
  );
}
