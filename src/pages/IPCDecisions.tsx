import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useState, useMemo } from 'react';
import { MagnifyingGlassIcon, ArrowTopRightOnSquareIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import ipcDecisions from '@/data/ipcDecisions.json';
import { IPCBrowserViewer } from '@/components/legislation/IPCBrowserViewer';

interface IPCDecision {
  title: string;
  url: string;
  date: string;
  document_type: string;
  related_legislation: string[];
  summary: string;
  citation: string;
  therapeuticAnalysis?: string;
}

export default function IPCDecisions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLegislation, setSelectedLegislation] = useState<string>('all');
  const [browserOpen, setBrowserOpen] = useState(false);

  const decisions = ipcDecisions as IPCDecision[];

  const legislationTypes = useMemo(() => {
    const types = new Set<string>();
    decisions.forEach((decision) => {
      decision.related_legislation.forEach((leg) => {
        const mainLeg = leg.split(' - ')[0];
        types.add(mainLeg);
      });
    });
    return ['all', ...Array.from(types).sort()];
  }, []);

  const filteredDecisions = useMemo(() => {
    return decisions.filter((decision) => {
      const matchesSearch = 
        searchQuery === '' ||
        decision.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        decision.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        decision.citation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLegislation =
        selectedLegislation === 'all' ||
        decision.related_legislation.some((leg) => leg.startsWith(selectedLegislation));

      return matchesSearch && matchesLegislation;
    });
  }, [searchQuery, selectedLegislation, decisions]);

  const groupedByYear = useMemo(() => {
    const grouped: Record<string, IPCDecision[]> = {};
    filteredDecisions.forEach((decision) => {
      const year = decision.date.split('-')[0];
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(decision);
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => parseInt(b) - parseInt(a))
      .reduce((acc, [year, decs]) => {
        acc[year] = decs.sort((a, b) => b.date.localeCompare(a.date));
        return acc;
      }, {} as Record<string, IPCDecision[]>);
  }, [filteredDecisions]);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  IPC Ontario Decisions Database
                </h1>
                <p className="text-base md:text-lg text-muted-foreground">
                  Comprehensive database of Information and Privacy Commissioner of Ontario decisions,
                  orders, and reports across PHIPA, FIPPA, MFIPPA, and CYFSA.
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => setBrowserOpen(true)}
                className="gap-2 shrink-0"
              >
                <GlobeAltIcon className="h-5 w-5" />
                Browse IPC Website
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="p-6 mb-8">
            <div className="space-y-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search decisions by title, summary, or citation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Filter by Legislation</label>
                <Tabs value={selectedLegislation} onValueChange={setSelectedLegislation}>
                  <TabsList className="w-full justify-start flex-wrap h-auto">
                    {legislationTypes.map((type) => (
                      <TabsTrigger key={type} value={type} className="capitalize">
                        {type === 'all' ? 'All Legislation' : type}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Showing {filteredDecisions.length} of {decisions.length} decisions
                </span>
              </div>
            </div>
          </Card>

          {/* Results by Year */}
          <div className="space-y-8">
            {Object.entries(groupedByYear).map(([year, yearDecisions]) => (
              <div key={year}>
                <h2 className="text-2xl font-semibold mb-4 sticky top-0 bg-background py-2 z-10">
                  {year}
                </h2>
                <div className="grid gap-4">
                  {yearDecisions.map((decision, index) => (
                    <Card key={`${decision.citation}-${index}`} className="p-6 hover:shadow-md transition-shadow">
                      <div className="space-y-3">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1">{decision.title}</h3>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline">{decision.citation}</Badge>
                              <span>•</span>
                              <span>{new Date(decision.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}</span>
                              <span>•</span>
                              <Badge variant="secondary">{decision.document_type}</Badge>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="shrink-0"
                          >
                            <a
                              href={decision.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              View Decision
                              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {decision.related_legislation.map((leg, idx) => (
                            <Badge key={idx} className="bg-teal/10 text-teal hover:bg-teal/20">
                              {leg}
                            </Badge>
                          ))}
                        </div>

                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {decision.summary}
                        </p>

                        {decision.therapeuticAnalysis && (
                          <Accordion type="single" collapsible>
                            <AccordionItem value="tj-analysis" className="border-t border-b-0">
                              <AccordionTrigger className="py-3 text-sm font-semibold text-primary hover:no-underline">
                                Therapeutic Jurisprudence Analysis
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="p-4 bg-primary/5 rounded-lg text-sm leading-relaxed whitespace-pre-line text-foreground">
                                  {decision.therapeuticAnalysis}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}

            {filteredDecisions.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">
                  No decisions found matching your search criteria.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>

      <IPCBrowserViewer open={browserOpen} onOpenChange={setBrowserOpen} />
    </Layout>
  );
}
