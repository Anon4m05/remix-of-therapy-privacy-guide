import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSavedInsights, SavedInsight } from '@/hooks/useSavedInsights';
import { useToast } from '@/hooks/use-toast';
import { 
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  LightBulbIcon,
  SparklesIcon,
  BookOpenIcon,
  ArrowLeftIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const categoryConfig = {
  did_you_know: { 
    icon: LightBulbIcon, 
    title: 'Did You Know?',
    color: 'text-warning'
  },
  privacy_tip: { 
    icon: SparklesIcon, 
    title: 'Privacy Tip',
    color: 'text-primary'
  },
  quick_insight: { 
    icon: BookOpenIcon, 
    title: 'Quick Insight',
    color: 'text-success'
  }
};

type SortOption = 'newest' | 'oldest' | 'alphabetical';
type CategoryFilter = 'all' | 'did_you_know' | 'privacy_tip' | 'quick_insight';

export default function SavedInsights() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { savedInsights, removeInsight, clearAll } = useSavedInsights();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const filteredAndSortedInsights = useMemo(() => {
    let result = [...savedInsights];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(insight => 
        insight.content.toLowerCase().includes(query) ||
        insight.source?.toLowerCase().includes(query) ||
        insight.citation?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(insight => insight.category === categoryFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime());
        break;
      case 'alphabetical':
        result.sort((a, b) => a.content.localeCompare(b.content));
        break;
    }

    return result;
  }, [savedInsights, searchQuery, categoryFilter, sortBy]);

  const handleCopyInsight = async (insight: SavedInsight) => {
    const text = `${categoryConfig[insight.category].title}\n\n${insight.content}${insight.source ? `\n\nSource: ${insight.source}` : ''}${insight.citation ? ` (${insight.citation})` : ''}`;
    
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Insight copied successfully",
    });
  };

  const handleCopyAll = async () => {
    if (filteredAndSortedInsights.length === 0) return;
    
    const text = filteredAndSortedInsights.map(insight => {
      return `${categoryConfig[insight.category].title}\n${insight.content}${insight.source ? `\nSource: ${insight.source}` : ''}${insight.citation ? ` (${insight.citation})` : ''}`;
    }).join('\n\n---\n\n');
    
    await navigator.clipboard.writeText(text);
    toast({
      title: "All insights copied",
      description: `${filteredAndSortedInsights.length} insights copied to clipboard`,
    });
  };

  const handleExportJSON = () => {
    if (filteredAndSortedInsights.length === 0) return;
    
    const dataStr = JSON.stringify(filteredAndSortedInsights, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `saved-insights-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export complete",
      description: `Exported ${filteredAndSortedInsights.length} insights as JSON`,
    });
  };

  const handleDelete = (id: string) => {
    removeInsight(id);
    toast({
      title: "Insight removed",
      description: "The insight has been deleted",
    });
  };

  const handleClearAll = () => {
    clearAll();
    toast({
      title: "All insights cleared",
      description: "Your saved insights have been removed",
    });
  };

  const categoryCounts = useMemo(() => {
    return {
      all: savedInsights.length,
      did_you_know: savedInsights.filter(i => i.category === 'did_you_know').length,
      privacy_tip: savedInsights.filter(i => i.category === 'privacy_tip').length,
      quick_insight: savedInsights.filter(i => i.category === 'quick_insight').length,
    };
  }, [savedInsights]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-6 md:space-y-8">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 -ml-2"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Saved Insights
              </h1>
              <p className="text-muted-foreground mt-1">
                {savedInsights.length} insight{savedInsights.length !== 1 ? 's' : ''} saved
              </p>
            </div>
            
            {savedInsights.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleCopyAll}>
                    <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
                    Copy all to clipboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportJSON}>
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                    Export as JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleClearAll}
                    className="text-error focus:text-error"
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Clear all insights
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {savedInsights.length > 0 ? (
          <>
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search insights..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <div className="flex gap-3">
                <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as CategoryFilter)}>
                  <SelectTrigger className="w-[160px]">
                    <FunnelIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All ({categoryCounts.all})</SelectItem>
                    <SelectItem value="did_you_know">Did You Know ({categoryCounts.did_you_know})</SelectItem>
                    <SelectItem value="privacy_tip">Privacy Tip ({categoryCounts.privacy_tip})</SelectItem>
                    <SelectItem value="quick_insight">Quick Insight ({categoryCounts.quick_insight})</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                    <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results count */}
            {searchQuery || categoryFilter !== 'all' ? (
              <p className="text-sm text-muted-foreground">
                Showing {filteredAndSortedInsights.length} of {savedInsights.length} insights
              </p>
            ) : null}

            {/* Insights List */}
            {filteredAndSortedInsights.length > 0 ? (
              <div className="space-y-4">
                {filteredAndSortedInsights.map((insight) => {
                  const config = categoryConfig[insight.category];
                  const Icon = config.icon;
                  
                  return (
                    <Card key={insight.id} className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg bg-muted ${config.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium">{config.title}</span>
                            <span className="text-xs text-muted-foreground">
                              • {format(new Date(insight.savedAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                          
                          <p className="text-sm text-foreground leading-relaxed mb-2">
                            {insight.content}
                          </p>
                          
                          {(insight.source || insight.citation) && (
                            <p className="text-xs text-muted-foreground">
                              {insight.source && <span>Source: {insight.source}</span>}
                              {insight.citation && <span className="ml-1">({insight.citation})</span>}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopyInsight(insight)}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            aria-label="Copy insight"
                          >
                            <DocumentDuplicateIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(insight.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-error"
                            aria-label="Delete insight"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <MagnifyingGlassIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No matches found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                  }}
                >
                  Clear filters
                </Button>
              </Card>
            )}
          </>
        ) : (
          /* Empty State */
          <Card className="p-8 md:p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <BookOpenIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No saved insights yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              When you find helpful privacy insights on your dashboard, click the save button to collect them here for easy reference.
            </p>
            <Button onClick={() => navigate(-1)}>
              Go to Dashboard
            </Button>
          </Card>
        )}
      </div>
    </Layout>
  );
}
