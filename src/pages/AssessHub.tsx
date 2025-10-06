import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardDocumentCheckIcon, DocumentTextIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function AssessHub() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Assess Privacy Practices</h1>
            <p className="text-lg text-muted-foreground">
              Evaluate privacy through a therapeutic lens with AI-powered tools and assessments.
            </p>
          </div>

          {/* Assessment Tools */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card
              className="p-6 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate('/generate-decision-tree')}
            >
              <div className="flex flex-col h-full">
                <BeakerIcon className="h-12 w-12 text-teal mb-4 group-hover:scale-110 transition-transform" />
                <h2 className="text-xl font-semibold mb-2">AI Decision Trees</h2>
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  Generate custom decision trees for complex privacy scenarios with real-time legal citations.
                </p>
                <Button className="w-full bg-teal hover:bg-teal/90">
                  Generate Decision Tree
                </Button>
              </div>
            </Card>

            <Card
              className="p-6 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate('/document-analysis')}
            >
              <div className="flex flex-col h-full">
                <DocumentTextIcon className="h-12 w-12 text-purple mb-4 group-hover:scale-110 transition-transform" />
                <h2 className="text-xl font-semibold mb-2">Document Analysis</h2>
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  Upload healthcare documents to understand their privacy implications and consequences.
                </p>
                <Button className="w-full bg-purple hover:bg-purple/90">
                  Analyze Document
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-muted/50">
              <div className="flex flex-col h-full">
                <ClipboardDocumentCheckIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Privacy Impact Assessment</h2>
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  Comprehensive assessment tool for evaluating organizational privacy practices.
                </p>
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              </div>
            </Card>
          </div>

          {/* Why Therapeutic Assessment? */}
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-teal/5">
            <h2 className="text-2xl font-semibold mb-4">Why Assess Privacy Therapeutically?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2 text-teal">Beyond Compliance</h3>
                <p className="text-sm text-muted-foreground">
                  Traditional privacy assessments focus on legal compliance. Therapeutic assessment
                  evaluates how privacy practices impact therapeutic relationships, patient trust,
                  and health outcomes.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-teal">Evidence-Based</h3>
                <p className="text-sm text-muted-foreground">
                  Our tools integrate therapeutic jurisprudence principles with Ontario privacy law,
                  supported by research in institutional ethnography and knowledge translation.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-teal">Context-Aware</h3>
                <p className="text-sm text-muted-foreground">
                  AI-powered assessments understand the nuances of healthcare contexts, providing
                  guidance that considers both legal requirements and therapeutic implications.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-teal">Actionable Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Receive specific, practical recommendations with direct citations to relevant
                  legislation sections and therapeutic considerations.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
