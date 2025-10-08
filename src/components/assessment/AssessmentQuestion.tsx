import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface QuestionProps {
  question: {
    id: string;
    text: string;
    type: string;
    guidance?: string;
    scale?: {
      min: number;
      max: number;
      minLabel: string;
      maxLabel: string;
    };
    options?: string[];
  };
  value: any;
  onChange: (value: any) => void;
}

export function AssessmentQuestion({ question, value, onChange }: QuestionProps) {
  if (question.type === 'scale') {
    return (
      <div className="space-y-4">
        <Label className="text-base font-semibold">{question.text}</Label>
        
        {question.guidance && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">{question.guidance}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4 pt-2">
          <Slider
            value={[value || question.scale?.min || 1]}
            onValueChange={(vals) => onChange(vals[0])}
            min={question.scale?.min || 1}
            max={question.scale?.max || 5}
            step={1}
            className="w-full"
          />
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{question.scale?.minLabel}</span>
            <span className="font-semibold text-lg text-foreground">
              {value || question.scale?.min || 1}
            </span>
            <span>{question.scale?.maxLabel}</span>
          </div>
        </div>
      </div>
    );
  }
  
  if (question.type === 'select') {
    return (
      <div className="space-y-4">
        <Label className="text-base font-semibold">{question.text}</Label>
        
        {question.guidance && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">{question.guidance}</AlertDescription>
          </Alert>
        )}
        
        <RadioGroup value={value} onValueChange={onChange}>
          {question.options?.map((option, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`${question.id}-${idx}`} />
              <Label htmlFor={`${question.id}-${idx}`} className="font-normal cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }
  
  if (question.type === 'textarea') {
    return (
      <div className="space-y-4">
        <Label className="text-base font-semibold">{question.text}</Label>
        
        {question.guidance && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">{question.guidance}</AlertDescription>
          </Alert>
        )}
        
        <Textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe in detail..."
          rows={5}
          className="resize-none"
        />
      </div>
    );
  }
  
  return null;
}
