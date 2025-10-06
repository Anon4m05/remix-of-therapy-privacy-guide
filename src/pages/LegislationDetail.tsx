import { Layout } from '@/components/layout/Layout';
import { LegislationViewer } from '@/components/legislation/LegislationViewer';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate, useParams } from 'react-router-dom';
import phipaData from '@/data/legislation/phipa.json';
import fippaData from '@/data/legislation/fippa.json';
import mfippaData from '@/data/legislation/mfippa.json';

export default function LegislationDetail() {
  const navigate = useNavigate();
  const { legislationId } = useParams<{ legislationId: string }>();

  const legislationMap: Record<string, any> = {
    phipa: phipaData,
    fippa: fippaData,
    mfippa: mfippaData,
  };

  const legislation = legislationMap[legislationId || ''];

  if (!legislation) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Legislation Not Found</h1>
            <Button onClick={() => navigate('/learn')}>Back to Learn Hub</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/learn')}
            className="mb-6"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Learn Hub
          </Button>

          <LegislationViewer legislation={legislation} />
        </div>
      </div>
    </Layout>
  );
}
