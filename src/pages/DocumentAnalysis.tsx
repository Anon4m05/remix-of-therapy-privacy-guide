import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { DocumentUploadAnalysis } from '@/components/ai/DocumentUploadAnalysis';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function DocumentAnalysis() {
  const navigate = useNavigate();

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
            Document Privacy Analysis
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Upload healthcare forms and documents to understand their privacy implications in plain language
          </p>
        </div>

        <DocumentUploadAnalysis />
      </div>
    </Layout>
  );
}
