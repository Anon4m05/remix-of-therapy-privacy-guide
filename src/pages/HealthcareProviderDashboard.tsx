import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useState, useEffect } from 'react';
import { 
  ClipboardDocumentListIcon, 
  AcademicCapIcon, 
  ShieldCheckIcon,
  LightBulbIcon,
  SparklesIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

export default function HealthcareProviderDashboard() {
  const navigate = useNavigate();

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

  const privacyFacts = [
    {
      icon: LightBulbIcon,
      title: 'Did You Know?',
      facts: [
        'Therapeutic jurisprudence views privacy law as a clinical intervention that can heal or harm',
        'Patients are 31% more likely to disclose sensitive information when privacy practices are explained transparently',
        'The "circle of care" in PHIPA was designed to balance information flow with patient privacy in healthcare teams',
        'Strategic omission—what you don\'t tell patients—can erode trust as much as disclosure violations',
        'Capacity assessment must be decision-specific under PHIPA, not a blanket determination',
        'In therapeutic privacy, silence can be as harmful as a breach when patients don\'t understand how their data flows'
      ]
    },
    {
      icon: SparklesIcon,
      title: 'Privacy Tip',
      facts: [
        'Always explain WHY you\'re collecting information, not just WHAT you\'re collecting—it builds therapeutic alliance',
        'Document privacy conversations in clinical notes; they\'re part of informed consent and circle of care decisions',
        'When families ask for information, pause to assess: Does disclosure serve the patient\'s therapeutic needs?',
        'Use plain language when explaining privacy rights—legal jargon can be anti-therapeutic',
        'Consider the relational context: autonomy exists within relationships, not in isolation from them',
        'Before denying a privacy request, ask: What therapeutic harm might this refusal cause?'
      ]
    },
    {
      icon: BookOpenIcon,
      title: 'Quick Insight',
      facts: [
        'Privacy decisions shape therapeutic relationships—they\'re clinical variables, not just legal checkboxes',
        'Informational asymmetry (patients not knowing what\'s shared) can damage trust even without formal breaches',
        'Relational autonomy means respecting patient control while honoring the relational context of care',
        'Therapeutic privacy balances patient rights with therapeutic outcomes and family involvement',
        'IPC decisions show patterns: transparency and documentation protect both patients and providers',
        'Privacy law can be therapeutic when applied with clinical wisdom, anti-therapeutic when applied mechanically'
      ]
    }
  ];

  const [currentFacts, setCurrentFacts] = useState(() => 
    privacyFacts.map(category => ({
      ...category,
      currentFact: category.facts[Math.floor(Math.random() * category.facts.length)]
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFacts(prev => 
        prev.map(category => ({
          ...category,
          currentFact: category.facts[Math.floor(Math.random() * category.facts.length)]
        }))
      );
    }, 8000); // Rotate every 8 seconds

    return () => clearInterval(interval);
  }, []);

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

        {/* Privacy Facts & Tips - Rotating */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {currentFacts.map((item, index) => (
            <Card key={index} className="p-4 md:p-6 bg-gradient-to-br from-teal/5 to-teal/10 border-teal/20">
              <div className="flex items-start gap-3 md:gap-4">
                <item.icon className="w-8 h-8 md:w-10 md:h-10 text-teal flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-semibold text-teal mb-2">{item.title}</p>
                  <p className="text-sm leading-relaxed text-foreground">
                    {item.currentFact}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Tools & Resources */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Tools & Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* AI Decision Trees - PRIMARY TOOL */}
            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer border-2 border-teal" onClick={() => navigate('/generate-decision-tree')}>
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">AI Decision Trees</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Generate personalized decision trees with real-time PHIPA citations for your specific scenario
              </p>
              <Button variant="default" className="w-full bg-teal hover:bg-teal/90">
                Generate Custom Tree →
              </Button>
            </Card>

            {/* Example Decision Trees */}
            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/decision-tree')}>
              <div className="text-3xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">Example Decision Trees</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Browse pre-built decision trees for common privacy scenarios
              </p>
              <Button variant="outline" className="w-full border-teal text-teal hover:bg-teal/10">
                View Examples →
              </Button>
            </Card>

            {/* Capacity Assessment - Coming Soon */}
            <Card className="p-6 opacity-60">
              <ShieldCheckIcon className="w-10 h-10 md:w-12 md:h-12 mb-4 text-teal" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">Capacity Assessment Guide</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Decision-specific capacity evaluation framework with therapeutic considerations
              </p>
              <Button variant="secondary" className="w-full" disabled>
                Coming in Phase 2
              </Button>
            </Card>

            {/* Learning Library - Coming Soon */}
            <Card className="p-6 opacity-60">
              <AcademicCapIcon className="w-10 h-10 md:w-12 md:h-12 mb-4 text-teal" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">Learning Library</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Educational resources on therapeutic privacy, PHIPA, and relational ethics
              </p>
              <Button variant="secondary" className="w-full" disabled>
                Coming in Phase 2
              </Button>
            </Card>
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
