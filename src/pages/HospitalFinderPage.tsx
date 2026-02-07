import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { searchHospitals, getAllSpecialists } from '@/db/api';
import HospitalCard from '@/components/HospitalCard';
import type { HospitalWithDistance, Specialist, HospitalType } from '@/types';
import { Search, MapPin, Loader2 } from 'lucide-react';

interface HospitalSearchForm {
  city: string;
  pincode: string;
  hospital_type: HospitalType | 'both';
  specialist_id: string;
  min_budget: string;
  max_budget: string;
}

export default function HospitalFinderPage() {
  const { toast } = useToast();
  const [hospitals, setHospitals] = useState<HospitalWithDistance[]>([]);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const form = useForm<HospitalSearchForm>({
    defaultValues: {
      city: '',
      pincode: '',
      hospital_type: 'both',
      specialist_id: '',
      min_budget: '',
      max_budget: '',
    },
  });

  useEffect(() => {
    loadSpecialists();
  }, []);

  const loadSpecialists = async () => {
    try {
      const data = await getAllSpecialists();
      setSpecialists(data);
    } catch (error) {
      console.error('Error loading specialists:', error);
    }
  };

  const onSubmit = async (data: HospitalSearchForm) => {
    setLoading(true);
    setSearched(true);

    try {
      const searchParams = {
        city: data.city || undefined,
        pincode: data.pincode || undefined,
        hospital_type: data.hospital_type !== 'both' ? data.hospital_type : undefined,
        specialist_id: data.specialist_id && data.specialist_id !== 'all' ? data.specialist_id : undefined,
        min_budget: data.min_budget ? Number(data.min_budget) : undefined,
        max_budget: data.max_budget ? Number(data.max_budget) : undefined,
      };

      const results = await searchHospitals(searchParams);
      setHospitals(results);

      if (results.length === 0) {
        toast({
          title: 'No hospitals found',
          description: 'Try adjusting your search criteria',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Search failed',
        description: error.message || 'Failed to search hospitals',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    form.reset();
    setHospitals([]);
    setSearched(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="@container max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Find Healthcare Facilities</h1>
          <p className="text-muted-foreground">
            Search for hospitals and clinics based on your location, budget, and specialist needs
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Criteria
            </CardTitle>
            <CardDescription>
              Enter your preferences to find suitable healthcare facilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 @md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., New York" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pincode/ZIP Code</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 10001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 @md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="hospital_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hospital Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="both">Both Government & Private</SelectItem>
                            <SelectItem value="government">Government Only</SelectItem>
                            <SelectItem value="private">Private Only</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specialist_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialist (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Any specialist" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">Any Specialist</SelectItem>
                            {specialists.map((specialist) => (
                              <SelectItem
                                key={specialist.specialist_id}
                                value={specialist.specialist_id}
                              >
                                {specialist.specialist_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 @md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="min_budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Budget ($)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="max_budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Budget ($)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="50000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Search className="mr-2 h-4 w-4" />
                    Search Hospitals
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClearFilters}
                    disabled={loading}
                  >
                    Clear Filters
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {searched && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {hospitals.length > 0 ? `Found ${hospitals.length} Hospitals` : 'No Results'}
              </h2>
              {hospitals.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Sorted by distance
                </p>
              )}
            </div>

            {hospitals.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    No hospitals found matching your criteria
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search filters or expanding your search area
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 @lg:grid-cols-2">
                {hospitals.map((hospital) => (
                  <HospitalCard key={hospital.hospital_id} hospital={hospital} />
                ))}
              </div>
            )}
          </div>
        )}

        {!searched && (
          <Card className="bg-muted/50">
            <CardContent className="py-12 text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Enter your search criteria above to find healthcare facilities
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
