import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { searchHospitals, getAllSpecialists } from '@/db/api';
import HospitalCard from '@/components/HospitalCard';
import type { HospitalWithDistance, Specialist, HospitalType, BudgetRange, InsuranceType } from '@/types';
import { Search, MapPin, Loader2 } from 'lucide-react';

interface HospitalSearchForm {
  city: string;
  state: string;
  pincode: string;
  hospital_type: HospitalType | 'all';
  specialist_id: string;
  budget_range: BudgetRange | 'all';
  insurance_type: InsuranceType | 'all';
  emergency_available: boolean;
  diagnostic_facilities: boolean;
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
      state: '',
      pincode: '',
      hospital_type: 'all',
      specialist_id: 'all',
      budget_range: 'all',
      insurance_type: 'all',
      emergency_available: false,
      diagnostic_facilities: false,
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
        state: data.state || undefined,
        pincode: data.pincode || undefined,
        hospital_type: data.hospital_type !== 'all' ? data.hospital_type : undefined,
        specialist_id: data.specialist_id && data.specialist_id !== 'all' ? data.specialist_id : undefined,
        budget_range: data.budget_range !== 'all' ? data.budget_range : undefined,
        insurance_type: data.insurance_type !== 'all' ? data.insurance_type : undefined,
        emergency_available: data.emergency_available || undefined,
        diagnostic_facilities: data.diagnostic_facilities || undefined,
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
          <h1 className="text-3xl font-bold">Find Healthcare Facilities in India</h1>
          <p className="text-muted-foreground">
            Search for hospitals and clinics across India based on location, budget, insurance, and facilities
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
                <div className="grid gap-4 @md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Mumbai, Delhi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Maharashtra" {...field} />
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
                        <FormLabel>Pincode</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 400001" {...field} />
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
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="government">Government</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                            <SelectItem value="trust">Trust / Charitable</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budget_range"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget Range</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select budget" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">All Budgets</SelectItem>
                            <SelectItem value="low">Low (₹0 - ₹5,000)</SelectItem>
                            <SelectItem value="medium">Medium (₹5,000 - ₹30,000)</SelectItem>
                            <SelectItem value="high">High (₹30,000+)</SelectItem>
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
                    name="insurance_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Insurance Accepted</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select insurance" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">All Insurance Types</SelectItem>
                            <SelectItem value="ayushman_bharat">Ayushman Bharat</SelectItem>
                            <SelectItem value="state_scheme">State Government Schemes</SelectItem>
                            <SelectItem value="private_insurance">Private Insurance</SelectItem>
                            <SelectItem value="cashless">Cashless Treatment</SelectItem>
                            <SelectItem value="self_pay">Self-Pay / No Insurance</SelectItem>
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
                    name="emergency_available"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="cursor-pointer">
                            Emergency Services Available
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="diagnostic_facilities"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="cursor-pointer">
                            Diagnostic Facilities Available
                          </FormLabel>
                        </div>
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
                Enter your search criteria above to find healthcare facilities across India
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
