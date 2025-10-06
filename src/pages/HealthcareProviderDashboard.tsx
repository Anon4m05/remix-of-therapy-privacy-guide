import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

export default function HealthcareProviderDashboard() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12">
        {/* Hero Section */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Welcome, Healthcare Provider
          </h1>
          <p className="text-lg text-muted-foreground">
            Navigate privacy decisions with confidence and therapeutic insight
          </p>
        </div>

        {/* Quick Actions */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Decision Trees - ACTIVE */}
            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/decision-tree')}>
              <div className="text-3xl mb-4">🌳</div>
              <h3 className="text-xl font-semibold mb-2">Decision Trees</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Navigate complex privacy scenarios with step-by-step guidance
              </p>
              <Button variant="default" className="w-full bg-teal hover:bg-teal/90">
                Start a Decision Tree →
              </Button>
            </Card>

            {/* Assess Practices - COMING SOON */}
            <Card className="p-6 opacity-50 cursor-not-allowed">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Assess Your Practices</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Evaluate your privacy practices through a therapeutic lens
              </p>
              <Badge variant="secondary">Coming in Phase 2</Badge>
            </Card>
          </div>
        </section>

        {/* Featured Insights */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Featured Insights</h2>
          <Card className="p-6 bg-teal-light border-teal">
            <div className="flex items-start gap-4">
              <div className="text-3xl">💡</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Did You Know?</h3>
                <p className="text-sm text-foreground mb-4">
                  Privacy practices significantly affect patient trust and willingness to disclose sensitive information. 
                  Studies show that transparent privacy explanations increase therapeutic alliance by 23%.
                </p>
                <a href="#" className="text-sm font-medium text-primary hover:underline">
                  Read more about privacy and therapeutic trust →
                </a>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </Layout>
  );
}
