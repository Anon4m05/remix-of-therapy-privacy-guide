import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ScenarioInput } from '@/components/ai/ScenarioInput';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function GenerateDecisionTree() {
  const navigate = useNavigate();
  const [generatedTree, setGeneratedTree] = useState<any>(null);

  const handleTreeGenerated = (treeData: any) => {
    setGeneratedTree(treeData);
    // Store the tree temporarily and navigate to the session
    sessionStorage.setItem('current-ai-tree', JSON.stringify(treeData));
    navigate(`/decision-tree/${treeData.id}`);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Generate Personalized Decision Tree
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Describe your privacy scenario and we'll create a custom decision tree with real-time legal guidance
          </p>
        </div>

        <ScenarioInput onTreeGenerated={handleTreeGenerated} />
      </div>
    </Layout>
  );
}
