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
    // Check for duplicates based on content
    const isDuplicate = savedInsights.some(saved => saved.content === insight.content);
    if (isDuplicate) {
      return { success: false, message: 'Already saved' };
    }

    const newInsight: SavedInsight = {
      ...insight,
      id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      savedAt: new Date().toISOString()
    };

    setSavedInsights([newInsight, ...savedInsights]);
    return { success: true, message: 'Saved!' };
  }, [savedInsights, setSavedInsights]);

  const removeInsight = useCallback((id: string) => {
    setSavedInsights(savedInsights.filter(insight => insight.id !== id));
  }, [savedInsights, setSavedInsights]);

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
