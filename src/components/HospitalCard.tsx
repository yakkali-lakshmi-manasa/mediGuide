import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { HospitalWithDistance } from '@/types';
import { Building2, MapPin, Phone, DollarSign, Navigation } from 'lucide-react';

interface HospitalCardProps {
  hospital: HospitalWithDistance;
}

export default function HospitalCard({ hospital }: HospitalCardProps) {
  const formatCostRange = () => {
    if (hospital.cost_range_min === 0 || hospital.cost_range_min === null) {
      return 'Free/Subsidized';
    }
    return `$${hospital.cost_range_min?.toLocaleString()} - $${hospital.cost_range_max?.toLocaleString()}`;
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
              {hospital.contact_number && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>{hospital.contact_number}</span>
                </div>
              )}
            </CardDescription>
          </div>
          <Badge variant={hospital.type === 'government' ? 'secondary' : 'default'}>
            {hospital.type === 'government' ? 'Government' : 'Private'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
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

        {hospital.insurance_providers && hospital.insurance_providers.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-1">Accepts Insurance:</p>
            <div className="flex flex-wrap gap-1">
              {hospital.insurance_providers.slice(0, 2).map((provider, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {provider}
                </Badge>
              ))}
              {hospital.insurance_providers.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{hospital.insurance_providers.length - 2} more
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
