import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpenIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LegislationSection {
  number: string;
  title: string;
  content: string;
}

interface Legislation {
  id: string;
  title: string;
  shortTitle: string;
  jurisdiction: string;
  citation: string;
  consolidationPeriod?: string;
  lastAmendment?: string;
  sections: LegislationSection[];
}

interface SectionExplanation {
  plainLanguageExplanation: string;
  keyPoints: string[];
  realWorldExamples: string[];
  therapeuticImplications: string;
  practicalConsiderations: string[];
  relatedSections: string[];
}

interface LegislationViewerProps {
  legislation: Legislation;
}

export function LegislationViewer({ legislation }: LegislationViewerProps) {
  const [explanations, setExplanations] = useState<Record<string, SectionExplanation>>({});
  const [loadingSection, setLoadingSection] = useState<string | null>(null);

  const explainSection = async (section: LegislationSection) => {
    if (explanations[section.number]) {
      setExplanations(prev => {
        const updated = { ...prev };
        delete updated[section.number];
        return updated;
      });
      return;
    }

    setLoadingSection(section.number);

    try {
      const { data, error } = await supabase.functions.invoke('explain-legislation', {
        body: {
          legislationTitle: legislation.title,
          sectionNumber: section.number,
          sectionTitle: section.title,
          sectionContent: section.content
        }
      });

      if (error) throw error;

      setExplanations(prev => ({
        ...prev,
        [section.number]: data
      }));
    } catch (error) {
      console.error('Error explaining section:', error);
      toast.error('Failed to generate explanation. Please try again.');
    } finally {
      setLoadingSection(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-teal/5">
        <div className="flex items-start gap-4">
          <BookOpenIcon className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{legislation.title}</h1>
            <p className="text-muted-foreground mb-2">
              <strong>Citation:</strong> {legislation.citation}
            </p>
            {legislation.consolidationPeriod && (
              <p className="text-sm text-muted-foreground">
                <strong>Consolidation Period:</strong> {legislation.consolidationPeriod}
              </p>
            )}
            {legislation.lastAmendment && (
              <p className="text-sm text-muted-foreground">
                <strong>Last Amendment:</strong> {legislation.lastAmendment}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Instructions */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>How to use:</strong> Click on any section to read the full text. Click the{' '}
          <SparklesIcon className="inline h-4 w-4" /> <strong>Explain with AI</strong> button to get
          a plain-language explanation with real-world examples and therapeutic implications.
        </p>
      </Card>

      {/* Sections */}
      <Accordion type="single" collapsible className="space-y-4">
        {legislation.sections.map((section) => (
          <AccordionItem key={section.number} value={section.number} asChild>
            <Card>
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                <div className="flex items-start gap-3 text-left w-full">
                  <span className="text-lg font-semibold text-primary flex-shrink-0">
                    §{section.number}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold">{section.title}</h3>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <div className="space-y-4">
                  {/* Section Content */}
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-line text-muted-foreground">{section.content}</p>
                  </div>

                  {/* Explain Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => explainSection(section)}
                    disabled={loadingSection === section.number}
                    className="gap-2"
                  >
                    <SparklesIcon className="h-4 w-4" />
                    {loadingSection === section.number
                      ? 'Generating explanation...'
                      : explanations[section.number]
                      ? 'Hide explanation'
                      : 'Explain with AI'}
                  </Button>

                  {/* AI Explanation */}
                  {explanations[section.number] && (
                    <div className="space-y-4 p-4 bg-gradient-to-br from-purple/5 to-teal/5 rounded-lg border border-purple/20">
                      <div>
                        <h4 className="font-semibold text-sm text-purple mb-2">Plain Language Explanation</h4>
                        <p className="text-sm">{explanations[section.number].plainLanguageExplanation}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm text-purple mb-2">Key Points</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {explanations[section.number].keyPoints.map((point, i) => (
                            <li key={i}>{point}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm text-purple mb-2">Real-World Examples</h4>
                        <div className="space-y-2">
                          {explanations[section.number].realWorldExamples.map((example, i) => (
                            <div key={i} className="p-2 bg-white/50 rounded text-sm">
                              {example}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm text-purple mb-2">Therapeutic Implications</h4>
                        <p className="text-sm">{explanations[section.number].therapeuticImplications}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm text-purple mb-2">Practical Considerations</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {explanations[section.number].practicalConsiderations.map((consideration, i) => (
                            <li key={i}>{consideration}</li>
                          ))}
                        </ul>
                      </div>

                      {explanations[section.number].relatedSections.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm text-purple mb-2">Related Sections</h4>
                          <p className="text-sm">{explanations[section.number].relatedSections.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
