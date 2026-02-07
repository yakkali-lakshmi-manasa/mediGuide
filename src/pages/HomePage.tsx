import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';
import { useNavigate } from 'react-router-dom';
import { Activity, Search, Building2, Shield, Heart, Stethoscope } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="@container max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">
              MediGuide AI
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI-powered healthcare assessment and care navigation system for all medical conditions
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <MedicalDisclaimer />
        </div>

        <div className="grid gap-6 @md:grid-cols-2 @lg:grid-cols-3 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-2">
                <Activity className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Symptom Assessment</CardTitle>
              <CardDescription>
                Describe your symptoms and get AI-powered analysis of possible conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate('/assessment')}>
                Start Assessment
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="p-3 bg-secondary/10 rounded-lg w-fit mb-2">
                <Stethoscope className="h-8 w-8 text-secondary" />
              </div>
              <CardTitle>Specialist Recommendations</CardTitle>
              <CardDescription>
                Get recommendations for appropriate medical specialists based on your symptoms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" onClick={() => navigate('/assessment')}>
                Find Specialists
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="p-3 bg-accent rounded-lg w-fit mb-2">
                <Building2 className="h-8 w-8 text-accent-foreground" />
              </div>
              <CardTitle>Hospital Finder</CardTitle>
              <CardDescription>
                Search for suitable hospitals based on location, budget, and specialist availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={() => navigate('/hospitals')}>
                Find Hospitals
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto space-y-6 pt-8">
          <h2 className="text-2xl font-bold text-center">How It Works</h2>
          
          <div className="grid gap-4 @md:grid-cols-3">
            <div className="flex flex-col items-center text-center space-y-2 p-4">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold">Input Symptoms</h3>
              <p className="text-sm text-muted-foreground">
                Select symptoms from our comprehensive list or describe them in your own words
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-2 p-4">
              <div className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold">AI Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Our AI analyzes your symptoms and provides possible conditions with confidence scores
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-2 p-4">
              <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold">Get Guidance</h3>
              <p className="text-sm text-muted-foreground">
                Receive specialist recommendations, diagnostic test suggestions, and hospital options
              </p>
            </div>
          </div>
        </div>

        <Card className="max-w-4xl mx-auto bg-muted/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <CardTitle>Safety & Privacy</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>✓ Your health information is securely stored</p>
            <p>✓ Emergency symptom detection with immediate alerts</p>
            <p>✓ Evidence-based medical information</p>
            <p>✓ No diagnosis or prescriptions - guidance only</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
