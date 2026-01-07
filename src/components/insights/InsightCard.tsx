import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookmarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  content: string;
  source?: string | null;
  citation?: string | null;
  isLoading?: boolean;
  onSave?: () => { success: boolean; message: string };
  isSaved?: boolean;
}

export function InsightCard({
  icon: Icon,
  title,
  content,
  source,
  citation,
  isLoading = false,
  onSave,
  isSaved = false
}: InsightCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = () => {
    if (onSave && !isSaved) {
      const result = onSave();
      setSaveMessage(result.message);
      if (result.success) {
        setJustSaved(true);
        setTimeout(() => {
          setJustSaved(false);
          setSaveMessage('');
        }, 2000);
      } else {
        setTimeout(() => setSaveMessage(''), 2000);
      }
    }
  };

  return (
    <Card 
      className={cn(
        "p-4 md:p-6 bg-gradient-to-br from-teal/5 to-teal/10 border-teal/20 relative transition-all duration-200",
        isHovered && "shadow-md border-teal/40"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Save button - appears on hover */}
      {onSave && (
        <div 
          className={cn(
            "absolute top-3 right-3 transition-opacity duration-200",
            isHovered || isSaved || justSaved ? "opacity-100" : "opacity-0"
          )}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={isSaved || justSaved}
            className={cn(
              "h-8 px-2 gap-1 text-xs",
              isSaved || justSaved 
                ? "text-teal bg-teal/10" 
                : "text-muted-foreground hover:text-teal hover:bg-teal/10"
            )}
            aria-label={isSaved ? "Already saved" : "Save for later"}
          >
            {justSaved ? (
              <>
                <CheckIcon className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : isSaved ? (
              <>
                <BookmarkSolidIcon className="w-4 h-4" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <BookmarkIcon className="w-4 h-4" />
                <span>Save</span>
              </>
            )}
          </Button>
        </div>
      )}

      <div className="flex items-start gap-3 md:gap-4">
        <Icon className="w-8 h-8 md:w-10 md:h-10 text-teal flex-shrink-0 mt-1" />
        <div className="flex-1 min-w-0 pr-16">
          <p className="text-xs md:text-sm font-semibold text-teal mb-2">{title}</p>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 bg-teal/20 rounded animate-pulse w-full" />
              <div className="h-4 bg-teal/20 rounded animate-pulse w-3/4" />
            </div>
          ) : (
            <>
              <p className="text-sm leading-relaxed text-foreground">
                {content}
              </p>
              {(source || citation) && (
                <p className="text-xs text-muted-foreground mt-2">
                  {source && <span className="font-medium">{source}</span>}
                  {source && citation && ' • '}
                  {citation && <span className="italic">{citation}</span>}
                </p>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Save feedback message */}
      {saveMessage && !justSaved && (
        <div className="absolute bottom-2 right-3 text-xs text-muted-foreground">
          {saveMessage}
        </div>
      )}
    </Card>
  );
}
