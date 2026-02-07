import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { HospitalWithDistance } from '@/types';
import { Building2, MapPin, Phone, IndianRupee, Navigation, AlertCircle, Activity } from 'lucide-react';

interface HospitalCardProps {
  hospital: HospitalWithDistance;
}

const insuranceLabels: Record<string, string> = {
  ayushman_bharat: 'Ayushman Bharat',
  state_scheme: 'State Scheme',
  private_insurance: 'Private Insurance',
  cashless: 'Cashless',
  self_pay: 'Self-Pay',
};

export default function HospitalCard({ hospital }: HospitalCardProps) {
  const formatCostRange = () => {
    if (hospital.cost_range_min === 0 || hospital.cost_range_min === null) {
      return 'Free/Subsidized';
    }
    return `₹${hospital.cost_range_min?.toLocaleString('en-IN')} - ₹${hospital.cost_range_max?.toLocaleString('en-IN')}`;
  };

  const getBudgetLabel = (range: string | null) => {
    switch (range) {
      case 'low':
        return 'Low Budget';
      case 'medium':
        return 'Medium Budget';
      case 'high':
        return 'High Budget';
      default:
        return 'Budget Info N/A';
    }
  };

  const getHospitalTypeLabel = (type: string) => {
    switch (type) {
      case 'government':
        return 'Government';
      case 'private':
        return 'Private';
      case 'trust':
        return 'Trust/Charitable';
      default:
        return type;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{hospital.hospital_name}</CardTitle>
            </div>
            <CardDescription className="space-y-1">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{hospital.address}, {hospital.city}</span>
              </div>
              {hospital.state && (
                <div className="text-xs">
                  <span>{hospital.state} - {hospital.pincode}</span>
                </div>
              )}
              {hospital.contact_number && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>{hospital.contact_number}</span>
                </div>
              )}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant={hospital.type === 'government' ? 'secondary' : hospital.type === 'trust' ? 'outline' : 'default'}>
              {getHospitalTypeLabel(hospital.type)}
            </Badge>
            {hospital.budget_range && (
              <Badge variant="outline" className="text-xs">
                {getBudgetLabel(hospital.budget_range)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <IndianRupee className="h-4 w-4" />
            <span>Cost Range:</span>
          </div>
          <span className="font-medium">{formatCostRange()}</span>
        </div>

        {hospital.distance_km !== undefined && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Navigation className="h-4 w-4" />
              <span>Distance:</span>
            </div>
            <span className="font-medium">{hospital.distance_km.toFixed(1)} km</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          {hospital.emergency_available && (
            <Badge variant="destructive" className="text-xs">
              <AlertCircle className="mr-1 h-3 w-3" />
              Emergency 24/7
            </Badge>
          )}
          {hospital.diagnostic_facilities && (
            <Badge variant="secondary" className="text-xs">
              <Activity className="mr-1 h-3 w-3" />
              Diagnostics
            </Badge>
          )}
        </div>

        {hospital.available_specialists && hospital.available_specialists.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">Available Specialists:</p>
            <div className="flex flex-wrap gap-1">
              {hospital.available_specialists.slice(0, 3).map((specialist) => (
                <Badge key={specialist.specialist_id} variant="outline" className="text-xs">
                  {specialist.specialist_name}
                </Badge>
              ))}
              {hospital.available_specialists.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{hospital.available_specialists.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {hospital.insurance_types && hospital.insurance_types.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-1">Insurance Accepted:</p>
            <div className="flex flex-wrap gap-1">
              {hospital.insurance_types.slice(0, 3).map((type, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {insuranceLabels[type] || type}
                </Badge>
              ))}
              {hospital.insurance_types.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{hospital.insurance_types.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={() => {
            if (hospital.latitude && hospital.longitude) {
              window.open(
                `https://www.google.com/maps/search/?api=1&query=${hospital.latitude},${hospital.longitude}`,
                '_blank'
              );
            }
          }}
        >
          <MapPin className="mr-2 h-4 w-4" />
          View on Map
        </Button>
      </CardContent>
    </Card>
  );
}
