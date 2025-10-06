import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { 
  ShieldCheckIcon, 
  DocumentTextIcon, 
  UserGroupIcon,
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

export default function PatientFamilyDashboard() {
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
        <Card className="p-6 bg-purple-light border-l-4 border-l-purple">
          <div className="flex items-start gap-4">
            <ExclamationTriangleIcon className="w-8 h-8 text-purple flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Privacy, Your Control</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Privacy in healthcare isn't just about rules—it's about protecting your dignity, autonomy, and trust in your care team. 
                You have the right to control your health information, and your healthcare providers want to respect your wishes while providing excellent care.
              </p>
            </div>
          </div>
        </Card>

        {/* Your Privacy Rights */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Your Privacy Rights</h2>
          <div className="space-y-4 md:space-y-6">
            {yourRights.map((right, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <right.icon className="w-10 h-10 text-purple flex-shrink-0" />
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
                        <span className="text-purple mt-0.5">•</span>
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
                <h3 className="text-lg font-semibold mb-3 text-purple">{scenario.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {scenario.description}
                </p>
                <div className="space-y-2">
                  {scenario.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-purple mt-0.5">✓</span>
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
                <h3 className="text-base font-semibold mb-2 text-purple">Circle of Care</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your healthcare team who need your information to provide direct care (doctors, nurses, pharmacists, etc.)
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold mb-2 text-purple">Substitute Decision Maker (SDM)</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Someone who makes healthcare decisions on your behalf if you're unable to (usually a family member)
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold mb-2 text-purple">Capacity</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your ability to understand information about a decision and appreciate the consequences
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold mb-2 text-purple">PHIPA</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Personal Health Information Protection Act—Ontario law that protects your health information privacy
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Getting Help */}
        <section className="bg-gradient-to-r from-purple/10 to-primary/10 rounded-lg p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-3">Need More Help?</h2>
          <p className="text-sm md:text-base text-muted-foreground mb-6">
            Use our AI assistant to ask specific questions about your privacy rights, or contact your hospital's patient representative for personalized support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg"
              className="bg-purple hover:bg-purple/90"
            >
              Ask AI Assistant
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-purple text-purple hover:bg-purple/10"
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
