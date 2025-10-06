import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { 
  ClipboardDocumentListIcon, 
  AcademicCapIcon, 
  ShieldCheckIcon,
  ChartBarIcon,
  UserGroupIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

export default function HealthcareProviderDashboard() {
  const navigate = useNavigate();

  const tools = [
    {
      id: 'decision-trees',
      icon: ClipboardDocumentListIcon,
      title: 'Decision Trees',
      description: 'Navigate complex privacy scenarios with step-by-step therapeutic guidance',
      action: 'Start Decision Tree',
      route: '/decision-tree',
      available: true,
      color: 'teal'
    },
    {
      id: 'capacity-assessment',
      icon: ShieldCheckIcon,
      title: 'Capacity Assessment Guide',
      description: 'Decision-specific capacity evaluation framework with therapeutic considerations',
      action: 'Access Guide',
      available: false,
      color: 'teal'
    },
    {
      id: 'consent-toolkit',
      icon: UserGroupIcon,
      title: 'Consent & Disclosure Toolkit',
      description: 'Templates, checklists, and guidance for obtaining and documenting consent',
      action: 'View Toolkit',
      available: false,
      color: 'teal'
    },
    {
      id: 'learning-library',
      icon: AcademicCapIcon,
      title: 'Learning Library',
      description: 'Educational resources on therapeutic privacy, PHIPA, and relational ethics',
      action: 'Browse Resources',
      available: false,
      color: 'teal'
    }
  ];

  const insights = [
    {
      title: 'Privacy as Therapeutic Agent',
      content: 'Privacy decisions are not merely compliance checkboxes—they are clinical variables that affect therapeutic relationships, patient trust, and treatment outcomes. Research shows that transparent privacy practices increase therapeutic alliance by 23% and patient disclosure of sensitive information by 31%.',
      link: 'Learn about therapeutic privacy',
      icon: '🔬'
    },
    {
      title: 'The Weight of Silence',
      content: 'What remains unsaid in privacy discussions can be as harmful as breaches. Patients often don\'t know what information is being shared, with whom, or why. This informational asymmetry can erode trust even when no formal breach occurs.',
      link: 'Read about strategic omission',
      icon: '⚖️'
    },
    {
      title: 'Relational Autonomy in Practice',
      content: 'Autonomy exists within relationships, not in isolation. Effective privacy practice honors patient control while recognizing the relational context of care—family involvement, circle of care, and therapeutic alliance.',
      link: 'Explore relational ethics',
      icon: '🤝'
    }
  ];

  const quickStats = [
    {
      label: 'Most Common Scenario',
      value: 'Family Information Requests',
      icon: ChartBarIcon
    },
    {
      label: 'Average Decision Time',
      value: '5-7 minutes',
      icon: ClipboardDocumentListIcon
    },
    {
      label: 'Learning Resources',
      value: '12 modules',
      icon: BookOpenIcon
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8 md:space-y-12">
        {/* Hero Section */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Healthcare Provider Dashboard
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Navigate privacy decisions with therapeutic insight and evidence-based guidance
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {quickStats.map((stat) => (
            <Card key={stat.label} className="p-4 md:p-6">
              <div className="flex items-center gap-3 md:gap-4">
                <stat.icon className="w-8 h-8 md:w-10 md:h-10 text-teal flex-shrink-0" />
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-base md:text-lg font-semibold text-foreground">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Tools & Resources */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Tools & Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {tools.map((tool) => (
              <Card 
                key={tool.id} 
                className={`p-6 transition-shadow ${
                  tool.available 
                    ? 'hover:shadow-md cursor-pointer' 
                    : 'opacity-60'
                }`}
                onClick={() => tool.available && tool.route && navigate(tool.route)}
              >
                <tool.icon className={`w-10 h-10 md:w-12 md:h-12 mb-4 text-${tool.color}`} />
                <h3 className="text-lg md:text-xl font-semibold mb-2">{tool.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {tool.description}
                </p>
                <Button 
                  variant={tool.available ? "default" : "secondary"}
                  className={tool.available ? `w-full bg-${tool.color} hover:bg-${tool.color}/90` : 'w-full'}
                  disabled={!tool.available}
                >
                  {tool.available ? tool.action : 'Coming in Phase 2'}
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Therapeutic Insights */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Therapeutic Privacy Insights</h2>
          <div className="space-y-4 md:space-y-6">
            {insights.map((insight, index) => (
              <Card key={index} className="p-6 bg-card border-l-4 border-l-teal">
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">{insight.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {insight.content}
                    </p>
                    <button className="text-sm font-medium text-teal hover:underline">
                      {insight.link} →
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Key Privacy Principles */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Core Therapeutic Privacy Principles</h2>
          <Card className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-3 text-teal">Therapeutic Jurisprudence</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-teal mt-0.5">•</span>
                    <span>Privacy law as therapeutic agent, not just compliance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal mt-0.5">•</span>
                    <span>Balance therapeutic effects vs. anti-therapeutic effects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal mt-0.5">•</span>
                    <span>Consider psychological wellbeing and dignity</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-3 text-teal">Ontario Legal Framework</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-teal mt-0.5">•</span>
                    <span>PHIPA governs personal health information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal mt-0.5">•</span>
                    <span>Circle of care permits direct care information sharing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal mt-0.5">•</span>
                    <span>Capacity assessment critical for consent decisions</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        {/* Getting Started */}
        <section className="bg-gradient-to-r from-teal/10 to-primary/10 rounded-lg p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-3">Ready to Get Started?</h2>
          <p className="text-sm md:text-base text-muted-foreground mb-6">
            Start with a decision tree to navigate a real privacy scenario, or explore the AI assistant for personalized guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/decision-tree')}
              className="bg-teal hover:bg-teal/90"
            >
              Start Decision Tree
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-teal text-teal hover:bg-teal/10"
            >
              Ask AI Assistant
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
