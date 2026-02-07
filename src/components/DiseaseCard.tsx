import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import type { PossibleCondition } from '@/types';
import { AlertCircle, TrendingUp, Activity } from 'lucide-react';

interface DiseaseCardProps {
  condition: PossibleCondition;
}

export default function DiseaseCard({ condition }: DiseaseCardProps) {
  const navigate = useNavigate();
  const { disease, confidence_score, reasoning } = condition;

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
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{disease.disease_name}</CardTitle>
            <CardDescription className="mt-1">{disease.description}</CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2 ml-4">
            <Badge variant="outline" className="text-sm">
              <TrendingUp className="mr-1 h-3 w-3" />
              {confidence_score}% Match
            </Badge>
            <Badge className={getUrgencyColor(disease.urgency_level)}>
              <AlertCircle className="mr-1 h-3 w-3" />
              {disease.urgency_level.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            <Activity className="inline mr-1 h-4 w-4" />
            Analysis Reasoning:
          </p>
          <p className="text-sm">{reasoning}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {disease.is_chronic && (
            <Badge variant="secondary">Chronic Condition</Badge>
          )}
          {disease.is_infectious && (
            <Badge variant="secondary">Infectious</Badge>
          )}
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate(`/disease/${disease.disease_id}`)}
        >
          View Detailed Information
        </Button>
      </CardContent>
    </Card>
  );
}
