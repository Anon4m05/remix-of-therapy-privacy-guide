export type Role = 'healthcare_provider' | 'patient_family' | 'privacy_professional' | null;

export interface DecisionTreeNode {
  id: string;
  type: 'question' | 'recommendation';
  question?: string;
  title?: string;
  content?: string;
  legalReferences?: string[];
  relatedResources?: string[];
  options?: DecisionTreeOption[];
}

export interface DecisionTreeOption {
  id: string;
  text: string;
  nextNode: string;
}

export interface DecisionTree {
  id: string;
  title: string;
  description: string;
  role: string;
  estimatedTime: string;
  questionCount: number;
  available: boolean;
  nodes: DecisionTreeNode[];
  scenarioDetails?: {
    type: string;
    setting: string;
    urgency: string;
  };
  generatedAt?: string;
}

export interface DecisionTreeData {
  trees: DecisionTree[];
}

export interface DecisionTreeState {
  currentTreeId: string | null;
  currentNodeId: string | null;
  history: string[];
  answers: Record<string, string>;
}
