import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, Lightbulb, Scale, FileText } from 'lucide-react';
import libraryData from '@/data/educationalLibrary.json';
import { renderContent } from '@/utils/contentRenderer';

export default function EducationalLibrary() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(libraryData.categories[0].id);

  const category = libraryData.categories.find(c => c.id === selectedCategory);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Educational Library
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Comprehensive resources on therapeutic jurisprudence and privacy in healthcare
          </p>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 h-auto">
            {libraryData.categories.map(cat => (
              <TabsTrigger key={cat.id} value={cat.id} className="py-3">
                {cat.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {libraryData.categories.map(cat => (
            <TabsContent key={cat.id} value={cat.id} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{cat.title}</CardTitle>
                  <CardDescription>{cat.description}</CardDescription>
                </CardHeader>
              </Card>

              <div className="grid gap-6">
                {cat.resources.map(resource => (
                  <Card key={resource.id}>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {resource.type === 'article' && <FileText className="w-6 h-6 text-primary" />}
                          {resource.type === 'framework' && <Lightbulb className="w-6 h-6 text-primary" />}
                          {resource.type === 'comparison' && <Scale className="w-6 h-6 text-primary" />}
                          {resource.type === 'case-study' && <BookOpen className="w-6 h-6 text-primary" />}
                          {resource.type === 'guide' && <BookOpen className="w-6 h-6 text-primary" />}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl">{resource.title}</CardTitle>
                          <CardDescription className="mt-2 capitalize">
                            {resource.type.replace('-', ' ')}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-foreground whitespace-pre-line">{renderContent(resource.content)}</p>
                        
                        {resource.keyTakeaways && (
                          <div className="mt-6 p-4 bg-muted rounded-lg">
                            <h4 className="font-semibold mb-2">Key Takeaways:</h4>
                            <ul className="space-y-1">
                              {resource.keyTakeaways.map((takeaway, idx) => (
                                <li key={idx}>{renderContent(takeaway)}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {resource.comparison && (
                          <div className="mt-6 grid md:grid-cols-2 gap-4">
                            <div className="p-4 bg-muted rounded-lg">
                              <h4 className="font-semibold mb-3">Traditional Approach</h4>
                              <dl className="space-y-2 text-sm">
                                {Object.entries(resource.comparison.traditional).map(([key, value]) => (
                                  <div key={key}>
                                    <dt className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</dt>
                                    <dd className="text-muted-foreground">{renderContent(value as string)}</dd>
                                  </div>
                                ))}
                              </dl>
                            </div>
                            <div className="p-4 bg-primary/5 border-2 border-primary/20 rounded-lg">
                              <h4 className="font-semibold mb-3">Therapeutic Approach</h4>
                              <dl className="space-y-2 text-sm">
                                {Object.entries(resource.comparison.therapeutic).map(([key, value]) => (
                                  <div key={key}>
                                    <dt className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</dt>
                                    <dd className="text-muted-foreground">{renderContent(value as string)}</dd>
                                  </div>
                                ))}
                              </dl>
                            </div>
                          </div>
                        )}

                        {resource.dimensions && (
                          <div className="mt-6 space-y-4">
                            {resource.dimensions.map((dim: any, idx: number) => (
                              <div key={idx} className="p-4 border-l-4 border-primary bg-muted/50 rounded-r-lg">
                                <h4 className="font-semibold mb-2">{dim.name}</h4>
                                <p className="text-sm mb-2">{renderContent(dim.description)}</p>
                                {dim.clinicalImpact && (
                                  <p className="text-sm text-muted-foreground italic">
                                    Clinical Impact: {renderContent(dim.clinicalImpact)}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {resource.scenario && (
                          <div className="mt-6 space-y-4">
                            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                              <h4 className="font-semibold mb-2">Scenario:</h4>
                              <p className="text-sm">{renderContent(resource.scenario)}</p>
                            </div>

                            {resource.therapeuticConsiderations && (
                              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <h4 className="font-semibold mb-2">Therapeutic Considerations:</h4>
                                <ul className="text-sm space-y-1 list-disc list-inside">
                                  {resource.therapeuticConsiderations.map((item: string, idx: number) => (
                                    <li key={idx}>{renderContent(item)}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {resource.antiTherapeuticRisks && (
                              <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                                <h4 className="font-semibold mb-2">Anti-Therapeutic Risks:</h4>
                                <ul className="text-sm space-y-1 list-disc list-inside">
                                  {resource.antiTherapeuticRisks.map((item: string, idx: number) => (
                                    <li key={idx}>{renderContent(item)}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {resource.therapeuticApproaches && (
                              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                                <h4 className="font-semibold mb-2">Therapeutic Approaches:</h4>
                                <ul className="text-sm space-y-1 list-disc list-inside">
                                  {resource.therapeuticApproaches.map((item: string, idx: number) => (
                                    <li key={idx}>{renderContent(item)}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {resource.connections && (
                          <div className="mt-6 space-y-3">
                            {resource.connections.map((conn: any, idx: number) => (
                              <div key={idx} className="p-3 bg-muted rounded-lg">
                                <h4 className="font-semibold text-sm mb-1">{conn.principle}</h4>
                                <p className="text-sm text-muted-foreground">{renderContent(conn.connection)}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {resource.examples && (
                          <div className="mt-6 space-y-3">
                            {resource.examples.map((ex: any, idx: number) => (
                              <div key={idx} className="p-4 bg-muted rounded-lg">
                                <h4 className="font-semibold text-sm mb-2">{renderContent(ex.requirement)}</h4>
                                <div className="grid md:grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <span className="font-medium">Compliance:</span>
                                    <p className="text-muted-foreground mt-1">{renderContent(ex.compliance)}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-primary">Therapeutic:</span>
                                    <p className="text-muted-foreground mt-1">{renderContent(ex.therapeutic)}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {resource.steps && (
                          <div className="mt-6 space-y-3">
                            {resource.steps.map((step: any, idx: number) => (
                              <div key={idx} className="p-4 bg-muted rounded-lg">
                                <div className="flex gap-3">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                                    {idx + 1}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-1">{step.step}</h4>
                                    <p className="text-sm text-muted-foreground">{renderContent(step.description)}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {resource.questions && (
                          <div className="mt-6 space-y-2">
                            {resource.questions.map((q: any, idx: number) => (
                              <div key={idx} className="p-3 bg-muted rounded-lg">
                                <span className="font-medium text-sm text-primary">{q.category}:</span>
                                <p className="text-sm mt-1">{q.question}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
}
