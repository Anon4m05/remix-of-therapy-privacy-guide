import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface SavedInsight {
  id: string;
  category: 'did_you_know' | 'privacy_tip' | 'quick_insight';
  content: string;
  source?: string | null;
  citation?: string | null;
  savedAt: string;
}

const STORAGE_KEY = 'privacy-tool-saved-insights';

export function useSavedInsights() {
  const [savedInsights, setSavedInsights] = useLocalStorage<SavedInsight[]>(STORAGE_KEY, []);
  
  const saveInsight = useCallback((insight: Omit<SavedInsight, 'id' | 'savedAt'>) => {
    let result = { success: false, message: 'Already saved' };
    
    setSavedInsights(prev => {
      // Check for duplicates based on content
      const isDuplicate = prev.some(saved => saved.content === insight.content);
      if (isDuplicate) {
        return prev;
      }

      const newInsight: SavedInsight = {
        ...insight,
        id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        savedAt: new Date().toISOString()
      };

      result = { success: true, message: 'Saved!' };
      return [newInsight, ...prev];
    });
    
    return result;
  }, [setSavedInsights]);

  const removeInsight = useCallback((id: string) => {
    setSavedInsights(prev => prev.filter(insight => insight.id !== id));
  }, [setSavedInsights]);

  const clearAll = useCallback(() => {
    setSavedInsights([]);
  }, [setSavedInsights]);

  return {
    savedInsights,
    saveInsight,
    removeInsight,
    clearAll,
    count: savedInsights.length
  };
}
