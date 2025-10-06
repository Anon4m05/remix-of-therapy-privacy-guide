import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import decisionTreesData from '@/data/decisionTrees.json';
import type { DecisionTreeData } from '@/types';

export default function DecisionTreeHub() {
  const navigate = useNavigate();
  const data = decisionTreesData as DecisionTreeData;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Decision Trees
          </h1>
          <p className="text-lg text-muted-foreground">
            Select a scenario to navigate
          </p>
        </div>

        <div className="space-y-6">
          {data.trees.map((tree) => (
            <Card
              key={tree.id}
              className={`p-6 transition-shadow ${
                tree.available ? 'hover:shadow-md cursor-pointer' : 'opacity-50'
              }`}
              onClick={() => tree.available && navigate(`/decision-tree/${tree.id}`)}
            >
              <h3 className="text-xl font-semibold mb-3">{tree.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{tree.description}</p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {tree.estimatedTime}
                </span>
                <span>•</span>
                <span>{tree.questionCount} questions</span>
              </div>

              <Button
                variant={tree.available ? 'default' : 'secondary'}
                className={tree.available ? 'w-full bg-teal hover:bg-teal/90' : 'w-full'}
                disabled={!tree.available}
              >
                {tree.available ? 'Start Decision Tree →' : 'Coming Soon'}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
