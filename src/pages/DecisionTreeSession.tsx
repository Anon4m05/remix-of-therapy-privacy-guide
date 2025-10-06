import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Layout } from '@/components/layout/Layout';
import { useDecisionTree } from '@/context/DecisionTreeContext';
import decisionTreesData from '@/data/decisionTrees.json';
import type { DecisionTreeData, DecisionTreeNode } from '@/types';

export default function DecisionTreeSession() {
  const { treeId } = useParams<{ treeId: string }>();
  const navigate = useNavigate();
  const { state, startTree, answerQuestion, goBack } = useDecisionTree();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const data = decisionTreesData as DecisionTreeData;
  
  // Check for AI-generated tree in sessionStorage first
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

  useEffect(() => {
    if (tree && !state.currentTreeId) {
      startTree(tree.id, tree.nodes[0].id);
    }
  }, [tree, state.currentTreeId, startTree]);

  if (!tree) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <p>Decision tree not found</p>
        </div>
      </Layout>
    );
  }

  const currentNode = tree.nodes.find(n => n.id === state.currentNodeId);
  
  if (!currentNode) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  // If we've reached a recommendation, navigate to results
  if (currentNode.type === 'recommendation') {
    navigate(`/decision-tree/${treeId}/results`);
    return null;
  }

  const currentIndex = state.history.length;
  const totalNodes = tree.questionCount;
  const progress = (currentIndex / totalNodes) * 100;

  const handleNext = () => {
    if (!selectedOption) return;

    const option = currentNode.options?.find(o => o.id === selectedOption);
    if (option) {
      answerQuestion(currentNode.id, option.id, option.nextNode);
      setSelectedOption(null);
    }
  };

  const isFirstQuestion = state.history.length <= 1;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-6">{tree.title}</h1>
          
          <div className="mb-2">
            <Progress value={progress} className="h-2" />
          </div>
          <p className="text-sm text-muted-foreground">
            Question {currentIndex} of {totalNodes}
          </p>
        </div>

        <Card className="p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">{currentNode.question}</h2>

          <div className="space-y-3">
            {currentNode.options?.map((option) => (
              <label
                key={option.id}
                className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedOption === option.id
                    ? 'border-teal bg-teal-light'
                    : 'border-border hover:border-teal'
                }`}
              >
                <input
                  type="radio"
                  name="question"
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={() => setSelectedOption(option.id)}
                  className="mt-1"
                />
                <span className="text-base">{option.text}</span>
              </label>
            ))}
          </div>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            disabled={isFirstQuestion}
            onClick={goBack}
          >
            ← Previous
          </Button>

          <Button
            variant="default"
            disabled={!selectedOption}
            onClick={handleNext}
            className="bg-teal hover:bg-teal/90"
          >
            Next →
          </Button>
        </div>
      </div>
    </Layout>
  );
}
