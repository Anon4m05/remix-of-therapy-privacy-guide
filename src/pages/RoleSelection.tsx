import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRole } from '@/context/RoleContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function RoleSelection() {
  const { setRole } = useRole();
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'healthcare_provider' | 'patient_family' | 'privacy_professional') => {
    setRole(role);
    navigate(`/dashboard/${role}`);
  };

  return (
    <div className="min-h-screen bg-muted py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Select Your Role
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose your role to access tools and guidance tailored to your needs
          </p>
        </div>

        <div className="space-y-4">
          {/* Healthcare Provider - ACTIVE */}
          <Card className="p-6 hover:shadow-md transition-all cursor-pointer border-2 hover:border-teal" onClick={() => handleRoleSelect('healthcare_provider')}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-2xl mb-2">🏥</div>
                <h2 className="text-xl font-semibold mb-2">Healthcare Provider</h2>
                <p className="text-sm text-muted-foreground mb-2">
                  Clinicians, nurses, administrators, care coordinators
                </p>
              </div>
              <Button variant="default" className="bg-teal hover:bg-teal/90">
                Select →
              </Button>
            </div>
          </Card>

          {/* Patient & Family - ACTIVE */}
          <Card className="p-6 hover:shadow-md transition-all cursor-pointer border-2 hover:border-purple" onClick={() => handleRoleSelect('patient_family')}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-2xl mb-2">👤</div>
                <h2 className="text-xl font-semibold mb-2">Patient & Family</h2>
                <p className="text-sm text-muted-foreground mb-2">
                  Patients, family members, caregivers
                </p>
              </div>
              <Button variant="default" className="bg-purple hover:bg-purple/90">
                Select →
              </Button>
            </div>
          </Card>

          {/* Other - COMING SOON */}
          <Card className="p-6 opacity-50 cursor-not-allowed border-2">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-2xl mb-2">🔒</div>
                <h2 className="text-xl font-semibold mb-2">Other</h2>
                <p className="text-sm text-muted-foreground mb-2">
                  Privacy professionals, researchers, administrators, legal counsel
                </p>
                <Badge variant="secondary" className="text-xs">
                  Coming in Phase 2
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
