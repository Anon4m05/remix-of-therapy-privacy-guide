import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ClipboardDocumentCheckIcon, AcademicCapIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
export default function Landing() {
  const navigate = useNavigate();
  return <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-[#2E5C8A] via-[#1B998B] to-[#2E5C8A] px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
           <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
             PriviCare

Understand the Therapeutic Impacts of Health Privacy decisions
           </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            A tool for healthcare professionals, patients, and privacy officers to assess privacy through a therapeutic lens.
          </p>
          <Button size="lg" onClick={() => navigate('/select-role')} className="bg-white text-primary hover:bg-white/90 shadow-lg text-lg px-8 py-6 h-auto font-semibold">
            Get Started
          </Button>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate('/assess')}>
              <ClipboardDocumentCheckIcon className="w-12 h-12 text-teal mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold mb-2">Assess</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Evaluate privacy practices through therapeutic outcomes
              </p>
              <Button variant="outline" className="w-full">Explore Tools</Button>
            </Card>

            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate('/learn')}>
              <AcademicCapIcon className="w-12 h-12 text-teal mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold mb-2">Learn</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Understand privacy's impact on therapeutic relationships
              </p>
              <Button variant="outline" className="w-full">Read Legislation</Button>
            </Card>

            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate('/apply')}>
              <LightBulbIcon className="w-12 h-12 text-teal mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold mb-2">Apply</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Navigate complex privacy decisions with confidence
              </p>
              <Button variant="outline" className="w-full">Get Started</Button>
            </Card>
          </div>
        </div>
      </section>
    </div>;
}