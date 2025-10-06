import { createContext, useContext, ReactNode, useState } from 'react';
import type { DecisionTreeState } from '@/types';

interface DecisionTreeContextType {
  state: DecisionTreeState;
  startTree: (treeId: string, firstNodeId: string) => void;
  answerQuestion: (nodeId: string, optionId: string, nextNodeId: string) => void;
  goBack: () => void;
  resetTree: () => void;
}

const DecisionTreeContext = createContext<DecisionTreeContextType | undefined>(undefined);

export function DecisionTreeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DecisionTreeState>({
    currentTreeId: null,
    currentNodeId: null,
    history: [],
    answers: {}
  });

  const startTree = (treeId: string, firstNodeId: string) => {
    setState({
      currentTreeId: treeId,
      currentNodeId: firstNodeId,
      history: [firstNodeId],
      answers: {}
    });
  };

  const answerQuestion = (nodeId: string, optionId: string, nextNodeId: string) => {
    setState(prev => ({
      ...prev,
      currentNodeId: nextNodeId,
      history: [...prev.history, nextNodeId],
      answers: { ...prev.answers, [nodeId]: optionId }
    }));
  };

  const goBack = () => {
    setState(prev => {
      if (prev.history.length <= 1) return prev;
      
      const newHistory = prev.history.slice(0, -1);
      const previousNodeId = newHistory[newHistory.length - 1];
      
      return {
        ...prev,
        currentNodeId: previousNodeId,
        history: newHistory
      };
    });
  };

  const resetTree = () => {
    setState({
      currentTreeId: null,
      currentNodeId: null,
      history: [],
      answers: {}
    });
  };

  return (
    <DecisionTreeContext.Provider value={{ state, startTree, answerQuestion, goBack, resetTree }}>
      {children}
    </DecisionTreeContext.Provider>
  );
}

export function useDecisionTree() {
  const context = useContext(DecisionTreeContext);
  if (context === undefined) {
    throw new Error('useDecisionTree must be used within DecisionTreeProvider');
  }
  return context;
}
