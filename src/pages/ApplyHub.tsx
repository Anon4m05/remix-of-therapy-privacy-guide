import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LightBulbIcon, ChatBubbleLeftRightIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function ApplyHub() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Apply Privacy Knowledge</h1>
            <p className="text-lg text-muted-foreground">
              Navigate complex privacy decisions with practical tools and AI-powered guidance.
            </p>
          </div>

          {/* Application Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card
              className="p-6 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate('/decision-tree')}
            >
              <div className="flex flex-col h-full">
                <LightBulbIcon className="h-12 w-12 text-orange mb-4 group-hover:scale-110 transition-transform" />
                <h2 className="text-xl font-semibold mb-2">Example Decision Trees</h2>
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  Pre-built decision trees for common privacy scenarios like capacity assessment,
                  disclosure decisions, and consent challenges.
                </p>
                <Button className="w-full bg-orange hover:bg-orange/90">
                  Browse Examples
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple/10 to-teal/10">
              <div className="flex flex-col h-full">
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-purple mb-4" />
                <h2 className="text-xl font-semibold mb-2">AI Privacy Assistant</h2>
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  Get real-time guidance on privacy questions. The AI assistant is always available
                  in the bottom-right corner of every page.
                </p>
                <Button
                  variant="outline"
                  className="w-full border-purple text-purple hover:bg-purple/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    // The chat button will be in the Layout component
                  }}
                >
                  Located in Bottom-Right Corner
                </Button>
              </div>
            </Card>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card
              className="p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate('/generate-decision-tree')}
            >
              <h3 className="font-semibold mb-2">🌳 Custom Decision Tree</h3>
              <p className="text-sm text-muted-foreground">
                Generate a decision tree for your specific scenario
              </p>
            </Card>

            <Card
              className="p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate('/learn')}
            >
              <h3 className="font-semibold mb-2">📚 Read the Acts</h3>
              <p className="text-sm text-muted-foreground">
                Explore PHIPA, FIPPA, and M/FIPPA with AI explanations
              </p>
            </Card>

            <Card
              className="p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate('/document-analysis')}
            >
              <h3 className="font-semibold mb-2">📄 Analyze Document</h3>
              <p className="text-sm text-muted-foreground">
                Upload healthcare forms to understand privacy implications
              </p>
            </Card>
          </div>

          {/* Application Scenarios */}
          <Card className="p-8 bg-gradient-to-br from-orange/5 to-primary/5">
            <h2 className="text-2xl font-semibold mb-6">Common Application Scenarios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg">
                <h3 className="font-semibold mb-2">Capacity Assessment</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  When a patient's capacity to consent is uncertain, navigate the assessment process
                  and understand disclosure obligations.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/decision-tree/capacity-assessment')}
                >
                  Use Decision Tree
                </Button>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <h3 className="font-semibold mb-2">Third-Party Disclosure</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Someone requests a patient's health information. Determine when and how you can
                  disclose without explicit consent.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/decision-tree/disclosure-request')}
                >
                  Use Decision Tree
                </Button>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <h3 className="font-semibold mb-2">Family Involvement</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Family members want to be involved in care. Navigate the balance between patient
                  privacy and therapeutic family engagement.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/decision-tree/family-involvement')}
                >
                  Use Decision Tree
                </Button>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <h3 className="font-semibold mb-2">Risk of Harm</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  You believe a patient poses a risk to themselves or others. Understand when
                  disclosure without consent is permitted.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/decision-tree/risk-of-harm')}
                >
                  Use Decision Tree
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
