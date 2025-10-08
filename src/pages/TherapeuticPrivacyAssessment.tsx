import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import assessmentData from '@/data/therapeuticPrivacyAssessment.json';

export default function TherapeuticPrivacyAssessment() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});

  const section = assessmentData.sections[currentSection];
  const isLastSection = currentSection === assessmentData.sections.length - 1;

  const handleNext = () => {
    if (isLastSection) {
      navigate('/assessment-results', { state: { responses } });
    } else {
      setCurrentSection(prev => prev + 1);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {assessmentData.title}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-6">
            {assessmentData.description}
          </p>
          
          <div className="flex gap-2 mb-6">
            {assessmentData.sections.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 flex-1 rounded-full ${
                  idx === currentSection ? 'bg-primary' :
                  idx < currentSection ? 'bg-primary/50' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
            <CardDescription>{section.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {section.therapeuticLens && (
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Therapeutic Lens:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {section.therapeuticLens.map((lens, idx) => (
                      <li key={idx}>{lens}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="text-center py-8">
                <CheckCircle2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Assessment interface will be implemented with interactive questions
                </p>
              </div>

              <Button onClick={handleNext} className="w-full">
                {isLastSection ? 'Complete Assessment' : 'Next Section'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
