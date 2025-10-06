import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ClipboardDocumentCheckIcon, AcademicCapIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-primary via-teal to-primary px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Navigate Privacy as Therapeutic Intervention, Not Just Compliance
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            A tool for healthcare professionals, patients, and privacy officers to assess privacy through a therapeutic lens.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/select-role')}
            className="bg-white text-primary hover:bg-white/90 shadow-lg text-lg px-8 py-6 h-auto font-semibold"
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-md transition-shadow">
              <ClipboardDocumentCheckIcon className="w-12 h-12 text-teal mb-4" />
              <h3 className="text-lg font-semibold mb-2">Assess</h3>
              <p className="text-sm text-muted-foreground">
                Evaluate privacy practices through therapeutic outcomes
              </p>
            </Card>

            <Card className="p-6 hover:shadow-md transition-shadow">
              <AcademicCapIcon className="w-12 h-12 text-teal mb-4" />
              <h3 className="text-lg font-semibold mb-2">Learn</h3>
              <p className="text-sm text-muted-foreground">
                Understand privacy's impact on therapeutic relationships
              </p>
            </Card>

            <Card className="p-6 hover:shadow-md transition-shadow">
              <LightBulbIcon className="w-12 h-12 text-teal mb-4" />
              <h3 className="text-lg font-semibold mb-2">Apply</h3>
              <p className="text-sm text-muted-foreground">
                Navigate complex privacy decisions with confidence
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
