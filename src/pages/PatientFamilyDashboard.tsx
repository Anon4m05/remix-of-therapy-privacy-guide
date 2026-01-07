import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { InsightCard } from '@/components/insights/InsightCard';
import { SavedInsightsDialog } from '@/components/insights/SavedInsightsDialog';
import { useSavedInsights } from '@/hooks/useSavedInsights';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  ShieldCheckIcon, 
  DocumentTextIcon, 
  UserGroupIcon,
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon,
  BookOpenIcon,
  LightBulbIcon,
  SparklesIcon,
  ArrowPathIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';

interface Insight {
  category: 'did_you_know' | 'privacy_tip' | 'quick_insight';
  content: string;
  source?: string | null;
  citation?: string | null;
  isLoading?: boolean;
}

// Fallback insights for patients when AI generation fails
const fallbackInsights: Record<string, string[]> = {
  did_you_know: [
    'You have the right to access your health records within 30 days of requesting them under PHIPA—healthcare providers must respond, even if they need more time.',
    'Under Ontario law, you can place a "lockbox" on parts of your health record, restricting access even from your own healthcare team if you choose.',
    'Your family cannot access your health information without your permission if you are capable of making decisions—even in hospital settings.',
    'You can request a list of everyone who has accessed your electronic health records—this is called an audit log.',
    'If you believe your privacy was breached, you can file a complaint with Ontario\'s Information and Privacy Commissioner at no cost.',
    'You have the right to request corrections to factual errors in your health records, and the provider must respond within 30 days.',
  ],
  privacy_tip: [
    'When signing consent forms, don\'t hesitate to ask questions about who will see your information and for what purpose before you sign.',
    'Tell your healthcare team specifically who you want involved in your care—your preferences should be documented in your health record.',
    'If you\'re concerned about sensitive information, ask your doctor what will be recorded and who can see it.',
    'You can change your mind about information sharing at any time—just let your healthcare team know your updated preferences.',
    'Keep copies of any privacy-related requests you make (like access requests) so you have a record of what you asked for and when.',
    'Ask your healthcare provider about your "circle of care"—this is the team who can see your information without separate consent.',
  ],
  quick_insight: [
    'Privacy in healthcare isn\'t just about rules—it\'s about protecting your dignity and building trust with your care team.',
    'Healthcare providers want to protect your privacy because it helps you feel safe sharing important health information.',
    'You are the expert on your own privacy needs—don\'t be afraid to speak up about your preferences.',
    'Good privacy practices strengthen the relationship between you and your healthcare team.',
    'Your privacy rights exist to empower you, not to create barriers to getting good care.',
    'When you trust that your information is protected, you can be more open with your healthcare team, which leads to better care.',
  ]
};

const categoryConfig = {
  did_you_know: { icon: LightBulbIcon, title: 'Did You Know?' },
  privacy_tip: { icon: SparklesIcon, title: 'Privacy Tip' },
  quick_insight: { icon: BookOpenIcon, title: 'Quick Insight' }
};

export default function PatientFamilyDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { saveInsight, savedInsights } = useSavedInsights();

  const [insights, setInsights] = useState<Insight[]>([
    { category: 'did_you_know', content: '', isLoading: true },
    { category: 'privacy_tip', content: '', isLoading: true },
    { category: 'quick_insight', content: '', isLoading: true }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [countdown, setCountdown] = useState(15);

  const getRandomFallback = (category: string): string => {
    const pool = fallbackInsights[category] || fallbackInsights.did_you_know;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const fetchInsight = useCallback(async (category: 'did_you_know' | 'privacy_tip' | 'quick_insight'): Promise<Insight> => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-insights', {
        body: { category, role: 'patient_family' }
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
    setCountdown(15);
  }, [fetchAllInsights]);

  // Initial fetch
  useEffect(() => {
    fetchAllInsights();
  }, [fetchAllInsights]);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * 3);
      refreshSingleInsight(randomIndex);
      setCountdown(15);
    }, 15000);

    return () => clearInterval(interval);
  }, [refreshSingleInsight, isPaused]);

  // Countdown timer
  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => (prev <= 1 ? 15 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handleSaveInsight = (insight: Insight) => {
    const result = saveInsight({
      category: insight.category,
      content: insight.content,
      source: insight.source,
      citation: insight.citation
    });
    
    if (result.success) {
      toast({
        title: "Insight saved!",
        description: "You can view your saved insights anytime.",
      });
    }
    
    return result;
  };

  const isInsightSaved = (content: string) => {
    return savedInsights.some(saved => saved.content === content);
  };

  const yourRights = [
    {
      icon: ShieldCheckIcon,
      title: 'Right to Privacy',
      description: 'Your health information should only be shared within your circle of care—your healthcare team.',
      details: [
        'Healthcare providers need your consent before sharing information outside your care team',
        'You can limit what information is shared and with whom',
        'You can ask who has accessed your health records'
      ]
    },
    {
      icon: DocumentTextIcon,
      title: 'Right to Access',
      description: 'You have the right to see your own health records and medical information.',
      details: [
        'Request copies of your health records from your healthcare provider',
        'You may need to pay a reasonable copying fee',
        'Records should be provided within 30 days of request'
      ]
    },
    {
      icon: UserGroupIcon,
      title: 'Right to Control Disclosure',
      description: 'You decide what family members or friends can know about your care.',
      details: [
        'Tell your healthcare team who you want involved in your care',
        'You can change your mind about information sharing at any time',
        'Your wishes should be documented in your health record'
      ]
    }
  ];

  const commonQuestions = [
    {
      question: 'What if I can\'t make my own decisions?',
      answer: 'If you\'re unable to make healthcare decisions (called "incapable"), a Substitute Decision Maker (SDM) can make decisions on your behalf. This is usually a family member, following a legal hierarchy. You can appoint someone in advance using a Power of Attorney for Personal Care.',
      icon: '👥'
    },
    {
      question: 'Can my family access my information without asking me?',
      answer: 'Not if you\'re capable of making decisions. Healthcare providers must ask your permission before sharing information with family. However, in emergencies where you can\'t consent, providers may share information necessary for your immediate care.',
      icon: '🔐'
    },
    {
      question: 'What if my privacy was violated?',
      answer: 'You can file a complaint with the hospital\'s privacy officer or patient representative. For serious breaches, you can contact Ontario\'s Information and Privacy Commissioner (IPC). Healthcare organizations must investigate privacy complaints.',
      icon: '⚖️'
    },
    {
      question: 'How do I designate who can know my information?',
      answer: 'Talk to your healthcare team about your preferences. You can provide written or verbal consent (which should be documented). Consider creating a Power of Attorney for Personal Care to formalize your wishes in case you become unable to consent.',
      icon: '📝'
    }
  ];

  const scenarios = [
    {
      title: 'Family Wants Information',
      description: 'Your family is asking the doctor about your condition. What should you know?',
      tips: [
        'You have the right to decide what they\'re told',
        'The doctor should ask your permission first',
        'You can consent to some information but not all',
        'Your decision should be respected and documented'
      ]
    },
    {
      title: 'You\'re Worried About Privacy',
      description: 'You\'re concerned about sensitive information in your health record.',
      tips: [
        'Ask your doctor what\'s in your record',
        'Discuss your privacy concerns openly',
        'Information stays within your circle of care unless you consent',
        'You can request corrections to errors in your record'
      ]
    },
    {
      title: 'Someone Else Makes Decisions',
      description: 'You can\'t make healthcare decisions right now.',
      tips: [
        'A Substitute Decision Maker acts on your behalf',
        'They should follow your known wishes',
        'The SDM has access to your health information',
        'You can appoint someone in advance with a Power of Attorney'
      ]
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8 md:space-y-12">
        {/* Hero Section */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Patient & Family Guide
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Understanding your privacy rights in healthcare settings
          </p>
        </div>

        {/* Important Notice */}
        <Card className="p-6 bg-patient-green-light border-l-4 border-l-patient-green">
          <div className="flex items-start gap-4">
            <ExclamationTriangleIcon className="w-8 h-8 text-patient-green flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Privacy, Your Control</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Privacy in healthcare isn't just about rules—it's about protecting your dignity, autonomy, and trust in your care team. 
                You have the right to control your health information, and your healthcare providers want to respect your wishes while providing excellent care.
              </p>
            </div>
          </div>
        </Card>

        {/* Privacy Insights - AI Generated */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-muted-foreground">
              Privacy Insights for Patients
            </h2>
            <div className="flex items-center gap-3">
              {/* Countdown indicator */}
              {!isPaused && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <div className="relative w-5 h-5">
                    <svg className="w-5 h-5 -rotate-90" viewBox="0 0 24 24">
                      <circle
                        cx="12" cy="12" r="10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        opacity="0.2"
                      />
                      <circle
                        cx="12" cy="12" r="10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray={62.83}
                        strokeDashoffset={62.83 * (1 - countdown / 15)}
                        className="transition-all duration-1000 text-patient-green"
                      />
                    </svg>
                  </div>
                  <span className="text-xs tabular-nums w-4">{countdown}s</span>
                </div>
              )}
              
              <SavedInsightsDialog />
              
              {/* Pause/Resume button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
                className="gap-1.5 text-muted-foreground hover:text-patient-green"
                aria-label={isPaused ? "Resume auto-refresh" : "Pause auto-refresh"}
              >
                {isPaused ? (
                  <PlayIcon className="w-4 h-4" />
                ) : (
                  <PauseIcon className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Pause'}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshAllInsights}
                disabled={isRefreshing}
                className="gap-1.5 text-muted-foreground hover:text-patient-green"
                aria-label="Refresh all insights"
              >
                <ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {insights.map((insight) => (
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

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Tools & Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer border-2 border-patient-green" onClick={() => navigate('/generate-decision-tree')}>
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">AI Privacy Navigator</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get personalized guidance for your privacy questions and concerns
              </p>
              <Button variant="default" className="w-full bg-patient-green hover:bg-patient-green/90">
                Start Navigation →
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer border-2 border-patient-green" onClick={() => navigate('/document-analysis')}>
              <div className="text-3xl mb-4">📄</div>
              <h3 className="text-xl font-semibold mb-2">Document Analysis</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload consent forms to understand their privacy implications in plain language
              </p>
              <Button variant="default" className="w-full bg-patient-green hover:bg-patient-green/90">
                Analyze Document →
              </Button>
            </Card>
          </div>
        </section>

        {/* Your Privacy Rights */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Your Privacy Rights</h2>
          <div className="space-y-4 md:space-y-6">
            {yourRights.map((right, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <right.icon className="w-10 h-10 text-patient-green flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{right.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {right.description}
                    </p>
                  </div>
                </div>
                <div className="pl-14">
                  <ul className="space-y-2">
                    {right.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-patient-green mt-0.5">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Common Questions */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Common Questions</h2>
          <div className="space-y-4">
            {commonQuestions.map((item, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="text-base md:text-lg font-semibold mb-3">{item.question}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Common Scenarios */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Common Scenarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {scenarios.map((scenario, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-lg font-semibold mb-3 text-patient-green">{scenario.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {scenario.description}
                </p>
                <div className="space-y-2">
                  {scenario.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-patient-green mt-0.5">✓</span>
                      <span className="text-muted-foreground">{tip}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Key Terms */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Key Terms to Know</h2>
          <Card className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <h3 className="text-base font-semibold mb-2 text-patient-green">Circle of Care</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your healthcare team who need your information to provide direct care (doctors, nurses, pharmacists, etc.)
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold mb-2 text-patient-green">Substitute Decision Maker (SDM)</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Someone who makes healthcare decisions on your behalf if you're unable to (usually a family member)
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold mb-2 text-patient-green">Capacity</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your ability to understand information about a decision and appreciate the consequences
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold mb-2 text-patient-green">PHIPA</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Personal Health Information Protection Act—Ontario law that protects your health information privacy
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Getting Help */}
        <section className="bg-gradient-to-r from-patient-green/10 to-primary/10 rounded-lg p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-3">Need More Help?</h2>
          <p className="text-sm md:text-base text-muted-foreground mb-6">
            Use our AI assistant to ask specific questions about your privacy rights, or contact your hospital's patient representative for personalized support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg"
              className="bg-patient-green hover:bg-patient-green/90"
              onClick={() => navigate('/generate-decision-tree')}
            >
              Ask AI Assistant
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-patient-green text-patient-green hover:bg-patient-green/10"
            >
              Contact Patient Representative
            </Button>
          </div>
        </section>

        {/* Disclaimer */}
        <Card className="p-6 bg-muted">
          <div className="flex items-start gap-3">
            <BookOpenIcon className="w-6 h-6 text-info flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>Important:</strong> This information is educational and does not constitute legal or medical advice. 
              For specific questions about your rights or situation, please speak with your healthcare team, hospital privacy officer, 
              or consult a health law attorney.
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
