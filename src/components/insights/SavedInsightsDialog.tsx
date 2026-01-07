import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookmarkIcon, 
  TrashIcon, 
  ClipboardDocumentIcon,
  CheckIcon,
  LightBulbIcon,
  SparklesIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import { useSavedInsights, SavedInsight } from '@/hooks/useSavedInsights';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const categoryIcons = {
  did_you_know: LightBulbIcon,
  privacy_tip: SparklesIcon,
  quick_insight: BookOpenIcon
};

const categoryTitles = {
  did_you_know: 'Did You Know?',
  privacy_tip: 'Privacy Tip',
  quick_insight: 'Quick Insight'
};

interface SavedInsightItemProps {
  insight: SavedInsight;
  onRemove: (id: string) => void;
}

function SavedInsightItem({ insight, onRemove }: SavedInsightItemProps) {
  const [copied, setCopied] = useState(false);
  const Icon = categoryIcons[insight.category];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(insight.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date(insight.savedAt).toLocaleDateString('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Card className="p-4 border-l-4 border-l-teal">
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-medium text-teal">
              {categoryTitles[insight.category]}
            </span>
            <span className="text-xs text-muted-foreground">
              {formattedDate}
            </span>
          </div>
          <p className="text-sm text-foreground leading-relaxed mb-2">
            {insight.content}
          </p>
          {(insight.source || insight.citation) && (
            <p className="text-xs text-muted-foreground mb-3">
              {insight.source && <span className="font-medium">{insight.source}</span>}
              {insight.source && insight.citation && ' • '}
              {insight.citation && <span className="italic">{insight.citation}</span>}
            </p>
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              {copied ? (
                <>
                  <CheckIcon className="w-3.5 h-3.5 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <ClipboardDocumentIcon className="w-3.5 h-3.5 mr-1" />
                  Copy
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(insight.id)}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
            >
              <TrashIcon className="w-3.5 h-3.5 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function SavedInsightsDialog() {
  const { savedInsights, removeInsight, clearAll, count } = useSavedInsights();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleClearAll = () => {
    clearAll();
    toast({
      title: "All insights cleared",
      description: "Your saved insights have been removed."
    });
  };

  const handleRemove = (id: string) => {
    removeInsight(id);
    toast({
      title: "Insight removed",
      description: "The insight has been removed from your saved list."
    });
  };

  // Group insights by category
  const groupedInsights = savedInsights.reduce((acc, insight) => {
    if (!acc[insight.category]) {
      acc[insight.category] = [];
    }
    acc[insight.category].push(insight);
    return acc;
  }, {} as Record<string, SavedInsight[]>);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 border-teal/30 text-teal hover:bg-teal/10"
        >
          <BookmarkIcon className="w-4 h-4" />
          <span>Saved</span>
          {count > 0 && (
            <span className="bg-teal text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center">
              {count}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookmarkIcon className="w-5 h-5 text-teal" />
            Saved Insights
          </DialogTitle>
          <DialogDescription>
            Quick reference to privacy insights you've saved for later
          </DialogDescription>
        </DialogHeader>

        {count === 0 ? (
          <div className="py-12 text-center">
            <BookmarkIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No saved insights yet</p>
            <p className="text-sm text-muted-foreground/70">
              Hover over any insight card and click "Save" to save it here
            </p>
          </div>
        ) : (
          <>
            <ScrollArea className="max-h-[50vh] pr-4">
              <div className="space-y-6">
                {(['did_you_know', 'privacy_tip', 'quick_insight'] as const).map(category => {
                  const insights = groupedInsights[category];
                  if (!insights?.length) return null;
                  
                  return (
                    <div key={category}>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                        {categoryTitles[category]} ({insights.length})
                      </h3>
                      <div className="space-y-3">
                        {insights.map(insight => (
                          <SavedInsightItem 
                            key={insight.id} 
                            insight={insight} 
                            onRemove={handleRemove}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="flex justify-end pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
