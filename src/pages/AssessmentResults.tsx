import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Download, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import assessmentData from '@/data/therapeuticPrivacyAssessment.json';

export default function AssessmentResults() {
  const navigate = useNavigate();
  const [responses, setResponses] = useState<Record<string, any>>({});

  useEffect(() => {
    const stored = localStorage.getItem('assessment-responses');
    if (stored) {
      setResponses(JSON.parse(stored));
    } else {
      navigate('/therapeutic-privacy-assessment');
    }
  }, [navigate]);

  const getSectionInsights = (sectionId: string) => {
    const section = assessmentData.sections.find(s => s.id === sectionId);
    if (!section) return null;

    const sectionResponses = section.questions
      .map(q => ({ question: q, answer: responses[q.id] }))
      .filter(r => r.answer !== undefined);

    return {
      section,
      responses: sectionResponses,
      completeness: (sectionResponses.length / section.questions.length) * 100
    };
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <Button variant="ghost" onClick={() => navigate('/assess')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Assessments
        </Button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
            <h1 className="text-3xl md:text-4xl font-bold">
              Assessment Complete
            </h1>
          </div>
          <p className="text-base md:text-lg text-muted-foreground">
            Review your therapeutic privacy assessment results and insights
          </p>
        </div>

        {/* Summary Card */}
        <Card className="mb-6 bg-gradient-to-br from-primary/5 to-teal/5">
          <CardHeader>
            <CardTitle>Assessment Summary</CardTitle>
            <CardDescription>
              This comprehensive assessment evaluated your privacy practices across 8 therapeutic dimensions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {assessmentData.sections.length}
                </div>
                <div className="text-sm text-muted-foreground">Dimensions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {Object.keys(responses).length}
                </div>
                <div className="text-sm text-muted-foreground">Responses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {Math.round((Object.keys(responses).length / assessmentData.sections.reduce((sum, s) => sum + s.questions.length, 0)) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {new Date().toLocaleDateString()}
                </div>
                <div className="text-sm text-muted-foreground">Date</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section Results */}
        <div className="space-y-6">
          {assessmentData.sections.map(section => {
            const insights = getSectionInsights(section.id);
            if (!insights) return null;

            return (
              <Card key={section.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {Math.round(insights.completeness)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Complete</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {insights.responses.map(({ question, answer }) => (
                      <div key={question.id} className="pb-4 border-b last:border-0">
                        <div className="font-medium mb-2">{question.text}</div>
                        <div className="text-sm text-muted-foreground">
                          {typeof answer === 'number' ? (
                            <div className="flex items-center gap-4">
                              <div className="flex-1 bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full"
                                  style={{ 
                                    width: `${((answer - (question.scale?.min || 1)) / ((question.scale?.max || 5) - (question.scale?.min || 1))) * 100}%` 
                                  }}
                                />
                              </div>
                              <span className="font-semibold">{answer}/{question.scale?.max || 5}</span>
                            </div>
                          ) : (
                            <div className="bg-muted p-3 rounded-lg">
                              {answer}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Next Steps */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>
              Recommendations for improving therapeutic privacy practices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {assessmentData.scoringGuidance.nextSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <Button onClick={() => navigate('/therapeutic-privacy-assessment')} variant="outline" className="flex-1">
            Retake Assessment
          </Button>
          <Button className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>
    </Layout>
  );
}
