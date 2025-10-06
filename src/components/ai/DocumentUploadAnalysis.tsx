import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Loader2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DocumentAnalysisResult {
  summary: string;
  privacyImplications: string[];
  keyTerms: string[];
  recommendations: string[];
  legalReferences: string[];
}

export function DocumentUploadAnalysis() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<DocumentAnalysisResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: 'Please select a file smaller than 10MB',
          variant: 'destructive'
        });
        return;
      }

      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: 'Invalid File Type',
          description: 'Please upload a PDF, Word document, or text file',
          variant: 'destructive'
        });
        return;
      }

      setFile(selectedFile);
      setAnalysis(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      const fileData = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const { data, error } = await supabase.functions.invoke('analyze-privacy-document', {
        body: {
          fileName: file.name,
          fileType: file.type,
          fileData: fileData.split(',')[1] // Remove data URL prefix
        }
      });

      if (error) throw error;

      setAnalysis(data);
      toast({
        title: 'Analysis Complete',
        description: 'Your document has been analyzed for privacy implications',
      });
    } catch (error) {
      console.error('Error analyzing document:', error);
      toast({
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'Failed to analyze document',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setAnalysis(null);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 md:p-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Upload Document for Analysis</h2>
            <p className="text-sm text-muted-foreground">
              Upload consent forms, privacy notices, or healthcare documents to understand their privacy implications. 
              Do NOT upload documents containing your personal health information.
            </p>
          </div>

          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            {!file ? (
              <div>
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-sm font-medium mb-1">Click to upload</div>
                  <div className="text-xs text-muted-foreground">
                    PDF, Word, or text files (max 10MB)
                  </div>
                </Label>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between bg-muted rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-purple" />
                  <div className="text-left">
                    <div className="text-sm font-medium">{file.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  disabled={isAnalyzing}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="bg-warning/10 border border-warning rounded-lg p-4">
            <p className="text-sm font-semibold text-warning-foreground mb-1">
              ⚠️ Privacy Reminder
            </p>
            <p className="text-xs text-muted-foreground">
              Do NOT upload documents containing your name, health card number, diagnosis, or other personal health information. 
              Upload only blank forms or general privacy policies.
            </p>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!file || isAnalyzing}
            className="w-full bg-purple hover:bg-purple/90"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Document...
              </>
            ) : (
              'Analyze Privacy Implications'
            )}
          </Button>
        </div>
      </Card>

      {analysis && (
        <Card className="p-6 md:p-8">
          <h3 className="text-xl font-bold mb-6">Privacy Analysis Results</h3>

          <div className="space-y-6">
            <div>
              <h4 className="text-base font-semibold mb-2 text-purple">Document Summary</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{analysis.summary}</p>
            </div>

            <div>
              <h4 className="text-base font-semibold mb-3 text-purple">Privacy Implications</h4>
              <ul className="space-y-2">
                {analysis.privacyImplications.map((implication, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-purple mt-0.5">•</span>
                    <span className="text-muted-foreground">{implication}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-base font-semibold mb-3 text-purple">Key Terms Explained</h4>
              <div className="space-y-3">
                {analysis.keyTerms.map((term, idx) => (
                  <div key={idx} className="bg-muted rounded-lg p-3">
                    <p className="text-sm text-foreground">{term}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-base font-semibold mb-3 text-purple">Recommendations</h4>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-success mt-0.5">✓</span>
                    <span className="text-muted-foreground">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {analysis.legalReferences.length > 0 && (
              <div>
                <h4 className="text-base font-semibold mb-3 text-purple">Legal References</h4>
                <div className="space-y-2">
                  {analysis.legalReferences.map((ref, idx) => (
                    <div key={idx} className="text-sm text-muted-foreground font-mono bg-muted rounded px-3 py-2">
                      {ref}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
