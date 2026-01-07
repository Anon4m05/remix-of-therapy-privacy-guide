import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useState, useEffect, useCallback } from 'react';
import { 
  AcademicCapIcon, 
  ShieldCheckIcon,
  LightBulbIcon,
  SparklesIcon,
  BookOpenIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { InsightCard } from '@/components/insights/InsightCard';
import { SavedInsightsDialog } from '@/components/insights/SavedInsightsDialog';
import { useSavedInsights } from '@/hooks/useSavedInsights';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Insight {
  category: 'did_you_know' | 'privacy_tip' | 'quick_insight';
  content: string;
  source?: string | null;
  citation?: string | null;
  isLoading?: boolean;
}

// Fallback insights when AI generation fails
const fallbackInsights: Record<string, string[]> = {
  did_you_know: [
    'In PHIPA Decision 298, the IPC imposed $12,500 in AMPs after a physician used hospital EHR access to target parents of newborns for private clinic marketing—demonstrating how breaches can occur through abuse of legitimate access.',
    'PHIPA s.17 allows patients to place "lockbox" consent directives on their records, restricting access even within the circle of care—a powerful but underutilized patient right.',
    'Therapeutic jurisprudence views privacy law as a clinical intervention that can heal or harm—making privacy decisions clinical variables, not just compliance checkboxes.',
    'IPC decisions show that 30-day access request timelines are strictly enforced; failure to respond results in "deemed refusal" under s.54(7), triggering complaint rights.',
    'The "circle of care" exception in PHIPA only applies to direct healthcare—using patient data for fundraising (as in Decision 281) requires explicit consent.',
    'Under PHIPA s.55(9)(b), custodians cannot refuse corrections to factual errors, but can refuse changes to professional opinions made in good faith.',
  ],
  privacy_tip: [
    'Document your privacy conversations in clinical notes—under therapeutic jurisprudence, how you explain privacy rights is as important as the rights themselves.',
    'Before sharing PHI within the circle of care, pause to ask: Is this truly for the patient\'s direct care, or am I assuming authorization that doesn\'t exist?',
    'When patients place lockbox restrictions, view it therapeutically—they\'re exercising autonomy, not being "difficult." Honor it as part of relational care.',
    'Always explain WHY you\'re collecting information, not just WHAT—research shows this builds therapeutic alliance and increases patient disclosure.',
    'Capacity for consent is decision-specific under PHIPA—a patient may lack capacity for one decision while retaining it for others.',
    'If you must deny a privacy request, explain the reasoning therapeutically—silence or legalistic responses can damage trust more than the denial itself.',
  ],
  quick_insight: [
    'Privacy breaches often stem not from malice but from "normalized deviance"—gradually accepting shortcuts that erode protection until a serious breach occurs.',
    'Relational autonomy recognizes that patients exercise privacy rights within relationships—respecting autonomy means honoring both independence and connection.',
    'Informational asymmetry—when patients don\'t know what\'s shared—erodes trust even without formal breaches. Transparency is therapeutic.',
    'IPC patterns show that custodians who document privacy practices and respond promptly to complaints fare better than those who delay or dismiss concerns.',
    'Strategic omission—what remains unsaid in privacy discussions—can be as anti-therapeutic as explicit breaches when it leaves patients uncertain.',
    'The therapeutic effects of privacy extend beyond compliance: patients who trust their privacy is protected disclose more, enabling better care.',
  ]
};

const categoryConfig = {
  did_you_know: { icon: LightBulbIcon, title: 'Did You Know?' },
  privacy_tip: { icon: SparklesIcon, title: 'Privacy Tip' },
  quick_insight: { icon: BookOpenIcon, title: 'Quick Insight' }
};

export default function HealthcareProviderDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { saveInsight, savedInsights } = useSavedInsights();

  const [insights, setInsights] = useState<Insight[]>([
    { category: 'did_you_know', content: '', isLoading: true },
    { category: 'privacy_tip', content: '', isLoading: true },
    { category: 'quick_insight', content: '', isLoading: true }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const getRandomFallback = (category: string): string => {
    const pool = fallbackInsights[category] || fallbackInsights.did_you_know;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const fetchInsight = useCallback(async (category: 'did_you_know' | 'privacy_tip' | 'quick_insight'): Promise<Insight> => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-insights', {
        body: { category }
      });

      if (error) {
        console.error('Error fetching insight:', error);
        return { category, content: getRandomFallback(category) };
      }

      return {
        category,
        content: data.content,
        source: data.source,
        citation: data.citation
      };
    } catch (err) {
      console.error('Failed to fetch insight:', err);
      return { category, content: getRandomFallback(category) };
    }
  }, []);

  const fetchAllInsights = useCallback(async () => {
    const categories: Array<'did_you_know' | 'privacy_tip' | 'quick_insight'> = [
      'did_you_know', 'privacy_tip', 'quick_insight'
    ];
    
    const results = await Promise.all(categories.map(fetchInsight));
    setInsights(results);
  }, [fetchInsight]);

  const refreshSingleInsight = useCallback(async (index: number) => {
    const category = insights[index].category;
    setInsights(prev => prev.map((insight, i) => 
      i === index ? { ...insight, isLoading: true } : insight
    ));

    const newInsight = await fetchInsight(category);
    setInsights(prev => prev.map((insight, i) => 
      i === index ? newInsight : insight
    ));
  }, [insights, fetchInsight]);

  const refreshAllInsights = useCallback(async () => {
    setIsRefreshing(true);
    setInsights(prev => prev.map(insight => ({ ...insight, isLoading: true })));
    await fetchAllInsights();
    setIsRefreshing(false);
  }, [fetchAllInsights]);

  // Initial fetch
  useEffect(() => {
    fetchAllInsights();
  }, [fetchAllInsights]);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly refresh one insight at a time for smoother experience
      const randomIndex = Math.floor(Math.random() * 3);
      refreshSingleInsight(randomIndex);
    }, 15000);

    return () => clearInterval(interval);
  }, [refreshSingleInsight]);

  const handleSaveInsight = (insight: Insight) => {
    return saveInsight({
      category: insight.category,
      content: insight.content,
      source: insight.source,
      citation: insight.citation
    });
  };

  const isInsightSaved = (content: string) => {
    return savedInsights.some(saved => saved.content === content);
  };

  const therapeuticInsights = [
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

        {/* Privacy Facts & Tips - AI Generated */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-muted-foreground">
              Privacy Insights
            </h2>
            <div className="flex items-center gap-2">
              <SavedInsightsDialog />
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshAllInsights}
                disabled={isRefreshing}
                className="gap-2 text-muted-foreground hover:text-teal"
                aria-label="Refresh all insights"
              >
                <ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {insights.map((insight, index) => (
              <InsightCard
                key={insight.category}
                icon={categoryConfig[insight.category].icon}
                title={categoryConfig[insight.category].title}
                content={insight.content}
                source={insight.source}
                citation={insight.citation}
                isLoading={insight.isLoading}
                onSave={() => handleSaveInsight(insight)}
                isSaved={isInsightSaved(insight.content)}
              />
            ))}
          </div>
        </section>

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
            {therapeuticInsights.map((insight, index) => (
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
