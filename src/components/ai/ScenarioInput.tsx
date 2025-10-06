import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useRole } from '@/context/RoleContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ScenarioInputProps {
  onTreeGenerated: (treeData: any) => void;
}

export function ScenarioInput({ onTreeGenerated }: ScenarioInputProps) {
  const { role } = useRole();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [scenario, setScenario] = useState('');
  const [scenarioType, setScenarioType] = useState('');
  const [setting, setSetting] = useState('');
  const [urgency, setUrgency] = useState('');

  const scenarioTypes = {
    healthcare_provider: [
      'Information sharing with family',
      'Consent and capacity assessment',
      'Circle of care disclosure',
      'Substitute decision maker involvement',
      'Privacy breach response',
      'Research and consent',
      'Third-party access requests',
      'Employee/student access to records'
    ],
    patient_family: [
      'Understanding my privacy rights',
      'Family access to information',
      'Consent and decision-making',
      'Substitute decision makers',
      'Privacy concerns or violations',
      'Accessing my health records',
      'Correcting health information',
      'Filing a privacy complaint'
    ]
  };

  const settings = [
    'Emergency Department',
    'Inpatient Unit',
    'Intensive Care Unit',
    'Palliative Care',
    'Outpatient Clinic',
    'Mental Health Unit',
    'Pediatric Ward',
    'General Hospital Setting'
  ];

  const urgencyLevels = [
    'Emergency - immediate decision needed',
    'Urgent - decision needed within 24 hours',
    'Standard - can take time to consider',
    'Non-urgent - planning ahead'
  ];

  const handleGenerate = async () => {
    if (!scenario.trim() || !scenarioType || !setting || !urgency) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields before generating',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-decision-tree', {
        body: {
          scenario,
          scenarioType,
          setting,
          urgency,
          role
        }
      });

      if (error) throw error;

      toast({
        title: 'Decision Tree Generated',
        description: 'Your personalized decision tree is ready',
      });

      onTreeGenerated(data);
    } catch (error) {
      console.error('Error generating tree:', error);
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Failed to generate decision tree',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const currentScenarioTypes = role ? scenarioTypes[role as keyof typeof scenarioTypes] || [] : [];

  return (
    <Card className="p-6 md:p-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Describe Your Scenario</h2>
          <p className="text-sm text-muted-foreground">
            {role === 'healthcare_provider' 
              ? 'Provide details about the privacy decision you need to navigate. Do NOT include patient identifying information (PHI).'
              : 'Describe your privacy question or concern. Do NOT include any personal health information.'
            }
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="scenarioType">Type of Scenario *</Label>
            <Select value={scenarioType} onValueChange={setScenarioType}>
              <SelectTrigger id="scenarioType" className="mt-2">
                <SelectValue placeholder="Select scenario type" />
              </SelectTrigger>
              <SelectContent>
                {currentScenarioTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="setting">Healthcare Setting *</Label>
            <Select value={setting} onValueChange={setSetting}>
              <SelectTrigger id="setting" className="mt-2">
                <SelectValue placeholder="Select setting" />
              </SelectTrigger>
              <SelectContent>
                {settings.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="urgency">Urgency Level *</Label>
            <Select value={urgency} onValueChange={setUrgency}>
              <SelectTrigger id="urgency" className="mt-2">
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                {urgencyLevels.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="scenario">Scenario Description *</Label>
            <Textarea
              id="scenario"
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              placeholder={
                role === 'healthcare_provider'
                  ? 'Example: A family member is requesting updates about a patient who has not given consent. The patient is capable of making decisions. The family member is concerned about the patient\'s welfare...'
                  : 'Example: My doctor shared information with my family without asking me first. I\'m not sure if this was appropriate or what my rights are...'
              }
              className="mt-2 min-h-32"
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {scenario.length}/1000 characters
            </p>
          </div>
        </div>

        <div className="bg-warning/10 border border-warning rounded-lg p-4">
          <p className="text-sm font-semibold text-warning-foreground mb-1">
            ⚠️ Privacy Reminder
          </p>
          <p className="text-xs text-muted-foreground">
            Do NOT include any patient names, dates of birth, health card numbers, or other identifying information. 
            Use general descriptions only.
          </p>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !scenario.trim() || !scenarioType || !setting || !urgency}
          className="w-full bg-teal hover:bg-teal/90"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Your Decision Tree...
            </>
          ) : (
            'Generate Personalized Decision Tree'
          )}
        </Button>
      </div>
    </Card>
  );
}
