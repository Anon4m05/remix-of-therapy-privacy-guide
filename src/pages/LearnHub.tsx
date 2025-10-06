import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpenIcon, ScaleIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function LearnHub() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Learn About Privacy Legislation</h1>
            <p className="text-lg text-muted-foreground">
              Explore Ontario's privacy legislation with AI-powered explanations and therapeutic context.
            </p>
          </div>

          {/* Legislation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              className="p-6 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate('/learn/phipa')}
            >
              <div className="flex flex-col h-full">
                <BookOpenIcon className="h-12 w-12 text-teal mb-4 group-hover:scale-110 transition-transform" />
                <h2 className="text-xl font-semibold mb-2">PHIPA</h2>
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  Personal Health Information Protection Act, 2004 - The primary legislation governing
                  health information privacy in Ontario.
                </p>
                <Button variant="outline" className="w-full">
                  Read PHIPA
                </Button>
              </div>
            </Card>

            <Card
              className="p-6 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate('/learn/fippa')}
            >
              <div className="flex flex-col h-full">
                <ScaleIcon className="h-12 w-12 text-teal mb-4 group-hover:scale-110 transition-transform" />
                <h2 className="text-xl font-semibold mb-2">FIPPA</h2>
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  Freedom of Information and Protection of Privacy Act - Governing access to and
                  protection of information held by provincial institutions.
                </p>
                <Button variant="outline" className="w-full">
                  Read FIPPA
                </Button>
              </div>
            </Card>

            <Card
              className="p-6 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate('/learn/mfippa')}
            >
              <div className="flex flex-col h-full">
                <BuildingLibraryIcon className="h-12 w-12 text-teal mb-4 group-hover:scale-110 transition-transform" />
                <h2 className="text-xl font-semibold mb-2">M/FIPPA</h2>
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  Municipal Freedom of Information and Protection of Privacy Act - Governing access to
                  and protection of information held by municipal institutions.
                </p>
                <Button variant="outline" className="w-full">
                  Read M/FIPPA
                </Button>
              </div>
            </Card>
          </div>

          {/* Feature Highlights */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-gradient-to-br from-purple/5 to-teal/5">
              <h3 className="font-semibold mb-2">📖 Full Text Access</h3>
              <p className="text-sm text-muted-foreground">
                Read the complete, up-to-date text of each Act with sections organized for easy navigation.
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple/5 to-teal/5">
              <h3 className="font-semibold mb-2">✨ AI Explanations</h3>
              <p className="text-sm text-muted-foreground">
                Get plain-language explanations, real-world examples, and therapeutic implications for any section.
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple/5 to-teal/5">
              <h3 className="font-semibold mb-2">🏥 Healthcare Context</h3>
              <p className="text-sm text-muted-foreground">
                Understand how privacy law intersects with therapeutic relationships and patient care.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
