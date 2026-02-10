import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { getAllSymptoms } from '@/db/api';
import { uploadMedicalImage, analyzeSymptoms } from '@/db/api';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';
import type { Symptom, SeverityLevel, GenderType } from '@/types';
import { Loader2, Upload, X, AlertCircle } from 'lucide-react';

interface AssessmentFormData {
  selectedSymptoms: string[];
  symptomDescription: string;
  duration: string;
  severity: SeverityLevel;
  age?: number;
  gender?: GenderType;
  medicalHistory?: string;
  city?: string;
  pincode?: string;
}

export default function AssessmentPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const form = useForm<AssessmentFormData>({
    defaultValues: {
      selectedSymptoms: [],
      symptomDescription: '',
      duration: '',
      severity: 'mild',
      age: undefined,
      gender: undefined,
      medicalHistory: '',
      city: '',
      pincode: '',
    },
  });

  useEffect(() => {
    loadSymptoms();
  }, []);

  const loadSymptoms = async () => {
    try {
      const data = await getAllSymptoms();
      setSymptoms(data);
    } catch (error) {
      toast({
        title: 'Error loading symptoms',
        description: 'Failed to load symptom list',
        variant: 'destructive',
      });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 1MB',
        variant: 'destructive',
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const url = await uploadMedicalImage(file);
      setUploadedImageUrl(url);
      toast({
        title: 'Image uploaded successfully',
        description: 'Your medical image has been uploaded.',
      });
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setUploadedImageUrl(null);
  };

  const onSubmit = async (data: AssessmentFormData) => {
    // Validation: At least one symptom must be provided (predefined OR custom OR both)
    const hasSelectedSymptoms = data.selectedSymptoms.length > 0;
    const hasCustomSymptoms = data.symptomDescription.trim().length > 0;
    
    if (!hasSelectedSymptoms && !hasCustomSymptoms) {
      toast({
        title: 'No symptoms provided',
        description: 'Please provide at least one symptom to continue. You can select from the checklist, type your own symptoms, or use both.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const symptomsInput = {
        symptom_ids: data.selectedSymptoms,
        symptom_description: data.symptomDescription,
        duration: data.duration,
        severity: data.severity,
      };

      const userProfile = {
        age: data.age,
        gender: data.gender,
        medical_history: data.medicalHistory,
        city: data.city,
        pincode: data.pincode,
      };

      const analysisResult = await analyzeSymptoms(
        symptomsInput,
        userProfile,
        uploadedImageUrl || undefined
      );

      navigate('/results', { state: { analysisResult, symptomsInput, userProfile } });
    } catch (error: any) {
      toast({
        title: 'Analysis failed',
        description: error.message || 'Failed to analyze symptoms',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedSymptoms = form.watch('selectedSymptoms');

  return (
    <div className="min-h-screen bg-background">
      <div className="@container max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Symptom Assessment</h1>
          <p className="text-muted-foreground">
            Provide information about your symptoms using the checklist, free-text description, or both methods
          </p>
        </div>

        <MedicalDisclaimer />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Your Symptoms (Optional)</CardTitle>
                <CardDescription>
                  Choose symptoms from the list below, or skip to describe your own symptoms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="selectedSymptoms"
                  render={() => (
                    <FormItem>
                      <div className="mb-4 p-3 bg-muted/50 rounded-lg border">
                        <p className="text-sm text-muted-foreground">
                          💡 <strong>Flexible Input:</strong> You can select symptoms from the checklist, type your own symptoms below, or use both methods together.
                        </p>
                      </div>
                      <div className="grid gap-3 @md:grid-cols-2">
                        {symptoms.map((symptom) => (
                          <FormField
                            key={symptom.symptom_id}
                            control={form.control}
                            name="selectedSymptoms"
                            render={({ field }) => (
                              <FormItem className="flex items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(symptom.symptom_id)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      const updated = checked
                                        ? [...current, symptom.symptom_id]
                                        : current.filter((id) => id !== symptom.symptom_id);
                                      field.onChange(updated);
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-normal cursor-pointer">
                                    {symptom.symptom_name}
                                    {symptom.is_red_flag && (
                                      <AlertCircle className="inline ml-1 h-3 w-3 text-destructive" />
                                    )}
                                  </FormLabel>
                                  {symptom.description && (
                                    <p className="text-xs text-muted-foreground">
                                      {symptom.description}
                                    </p>
                                  )}
                                </div>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add Other Symptoms (Optional)</CardTitle>
                <CardDescription>
                  Describe any symptoms not listed above, or provide additional details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="symptomDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Describe Your Symptoms</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type any symptoms you're experiencing (e.g., 'sharp pain in lower back', 'feeling dizzy when standing up', 'red rash on arms')..."
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        You can describe symptoms in your own words. The AI will understand and normalize them.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 @md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 3 days, 2 weeks" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="severity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Severity</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select severity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="mild">Mild</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="severe">Severe</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Medical Image Upload (Optional)</CardTitle>
                <CardDescription>
                  Upload images for skin conditions or visible symptoms only
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!uploadedImageUrl ? (
                  <div>
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {uploading ? 'Uploading...' : 'Click to upload image'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG, WEBP (max 1MB)
                        </p>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                    </label>
                    {uploading && <Progress value={50} className="mt-2" />}
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={uploadedImageUrl}
                      alt="Uploaded medical image"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personal Information (Optional)</CardTitle>
                <CardDescription>
                  This information helps provide more accurate recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 @md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Your age"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="medicalHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical History</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any relevant medical history, chronic conditions, or current medications..."
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 @md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Your city" {...field} />
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
                        <FormLabel>Pincode/ZIP</FormLabel>
                        <FormControl>
                          <Input placeholder="Your pincode" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analyze Symptoms
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
