import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AssessmentQuestion } from '@/components/assessment/AssessmentQuestion';
import assessmentData from '@/data/therapeuticPrivacyAssessment.json';

export default function TherapeuticPrivacyAssessment() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});

  const section = assessmentData.sections[currentSection];
  const question = section.questions[currentQuestion];
  const isLastQuestion = currentQuestion === section.questions.length - 1;
  const isLastSection = currentSection === assessmentData.sections.length - 1;
  const isFirstQuestion = currentQuestion === 0;
  const isFirstSection = currentSection === 0;

  const handleNext = () => {
    if (isLastQuestion) {
      if (isLastSection) {
        // Save to localStorage and navigate to results
        localStorage.setItem('assessment-responses', JSON.stringify(responses));
        navigate('/assessment-results');
      } else {
        setCurrentSection(prev => prev + 1);
        setCurrentQuestion(0);
      }
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (isFirstQuestion) {
      if (!isFirstSection) {
        setCurrentSection(prev => prev - 1);
        setCurrentQuestion(assessmentData.sections[currentSection - 1].questions.length - 1);
      }
    } else {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleValueChange = (value: any) => {
    setResponses(prev => ({
      ...prev,
      [question.id]: value
    }));
  };

  const totalQuestions = assessmentData.sections.reduce((sum, s) => sum + s.questions.length, 0);
  const answeredQuestions = Object.keys(responses).length;
  const progressPercent = (answeredQuestions / totalQuestions) * 100;

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
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Section {currentSection + 1} of {assessmentData.sections.length}</span>
              <span>{answeredQuestions} of {totalQuestions} questions answered</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
            <CardDescription>{section.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {section.therapeuticLens && currentQuestion === 0 && (
              <div className="bg-muted p-4 rounded-lg mb-6">
                <h4 className="font-semibold mb-2">Therapeutic Lens:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {section.therapeuticLens.map((lens, idx) => (
                    <li key={idx}>{lens}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-6">
              <div className="mb-2 text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {section.questions.length}
              </div>

              <AssessmentQuestion
                question={question}
                value={responses[question.id]}
                onChange={handleValueChange}
              />

              <div className="flex gap-4 pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={isFirstSection && isFirstQuestion}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button onClick={handleNext} className="flex-1">
                  {isLastSection && isLastQuestion ? 'Complete Assessment' : 'Next'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
