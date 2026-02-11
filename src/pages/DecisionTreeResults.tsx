import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { DecisionTreePrint } from '@/components/decision-tree/DecisionTreePrint';
import { useDecisionTree } from '@/context/DecisionTreeContext';
import decisionTreesData from '@/data/decisionTrees.json';
import type { DecisionTreeData } from '@/types';
import { renderContent, renderLegalReference } from '@/utils/contentRenderer';

export default function DecisionTreeResults() {
  const { treeId } = useParams<{ treeId: string }>();
  const navigate = useNavigate();
  const { state, resetTree } = useDecisionTree();

  const data = decisionTreesData as DecisionTreeData;
  
  const [aiTree, setAiTree] = useState<any>(null);
  
  useEffect(() => {
    const storedTree = sessionStorage.getItem('current-ai-tree');
    if (storedTree) {
      try {
        const parsed = JSON.parse(storedTree);
        if (parsed.id === treeId) {
          setAiTree(parsed);
        }
      } catch (error) {
        console.error('Error parsing stored tree:', error);
      }
    }
  }, [treeId]);

  const tree = aiTree || data.trees.find(t => t.id === treeId);
  const recommendation = tree?.nodes.find(n => n.id === state.currentNodeId);

  if (!tree || !recommendation || recommendation.type !== 'recommendation') {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <p>Results not found</p>
        </div>
      </Layout>
    );
  }

  // Build path summary
  const pathSummary = state.history.slice(0, -1).map((nodeId, index) => {
    const node = tree.nodes.find(n => n.id === nodeId);
    const answerId = state.answers[nodeId];
    const answer = node?.options?.find(o => o.id === answerId);
    
    return {
      question: node?.question || '',
      answer: answer?.text || ''
    };
  });

  const handleStartAnother = () => {
    resetTree();
    sessionStorage.removeItem('current-ai-tree');
    navigate('/generate-decision-tree');
  };

  const handleReturnDashboard = () => {
    resetTree();
    sessionStorage.removeItem('current-ai-tree');
    navigate(-2); // Go back 2 pages to dashboard
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-8 text-center">
          <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-success mb-6">
            Decision Tree Complete
          </h1>
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {recommendation.title}
            </h2>
            {tree && <DecisionTreePrint tree={tree} answers={state.answers} />}
          </div>
        </div>

        <Card className="p-8 bg-teal-light border-teal mb-8">
          <h3 className="text-lg font-semibold mb-4">Based on your responses:</h3>
          
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-line text-sm text-foreground">
              {renderContent(recommendation.content || '')}
            </div>
          </div>

          {recommendation.legalReferences && recommendation.legalReferences.length > 0 && (
            <div className="mt-6 pt-6 border-t border-accent">
              <h4 className="text-sm font-semibold text-foreground mb-2">
                Legal References:
              </h4>
              <div className="text-sm text-muted-foreground flex flex-wrap gap-x-1">
                {recommendation.legalReferences.map((ref, idx) => (
                  <span key={idx}>
                    {renderLegalReference(ref)}
                    {idx < recommendation.legalReferences!.length - 1 && ', '}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Path</h2>
          
          <Card className="p-6">
            <div className="space-y-4">
              {pathSummary.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal text-white flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{step.question}</p>
                    <p className="text-sm text-muted-foreground">{step.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            onClick={handleStartAnother}
            className="flex-1"
          >
            Generate Another Tree
          </Button>
          
          <Button
            variant="default"
            onClick={handleReturnDashboard}
            className="flex-1 bg-teal hover:bg-teal/90"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </Layout>
  );
}
