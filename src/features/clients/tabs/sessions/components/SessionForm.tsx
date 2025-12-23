import { useState } from 'react';
import { GripVertical, Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export type SessionFormData = {
  clientId: string;
  sessionNumber: number;
  sessionDate: string;
  therapy: 'ABA' | 'Speech' | 'OT';
  longTermObjective?: string;
  shortTermObjective?: string;
  zone?: 'green' | 'yellow' | 'orange' | 'red' | 'blue';
  sessionTags?: string[];
  successes?: string[];
  struggles?: string[];
  interventionsUsed?: string[];
  strategiesUsed?: string[];
  reinforcementTypes?: string[];
  dataCollectionMethod?: string;
  discussionStatus?: string[];
  additionalNotes?: string;
  sessionActivities?: SessionActivity[];
};

export type SessionActivity = {
  sequenceOrder: number;
  activity: string;
  antecedent?: string;
  behaviour?: string;
  consequences?: string;
  promptType?: string;
};

const THERAPY_OPTIONS = [
  { value: 'ABA', label: 'ABA Therapy' },
  { value: 'Speech', label: 'Speech Therapy' },
  { value: 'OT', label: 'Occupational Therapy' },
] as const;

const ZONE_OPTIONS = [
  { value: 'green', label: 'Green', color: 'bg-green-500' },
  { value: 'yellow', label: 'Yellow', color: 'bg-yellow-500' },
  { value: 'orange', label: 'Orange', color: 'bg-orange-500' },
  { value: 'red', label: 'Red', color: 'bg-red-500' },
  { value: 'blue', label: 'Blue', color: 'bg-blue-500' },
] as const;

const PROMPT_TYPE_OPTIONS = [
  { label: 'Full Physical', value: 'full_physical' },
  { label: 'Partial Physical', value: 'partial_physical' },
  { label: 'Verbal', value: 'verbal' },
  { label: 'Textual', value: 'textual' },
  { label: 'Gestural', value: 'gestural' },
  { label: 'Independent', value: 'independent' },
] as const;

function isTherapy(value: string): value is SessionFormData['therapy'] {
  return THERAPY_OPTIONS.some((t) => t.value === value);
}

function isZone(value: string): value is NonNullable<SessionFormData['zone']> {
  return ZONE_OPTIONS.some((z) => z.value === value);
}

export function SessionForm({
  onSubmit,
  onCancel,
  initialData,
  clientId,
  sessionNumber = 1,
}: {
  onSubmit: (data: SessionFormData) => void;
  onCancel: () => void;
  initialData?: Partial<SessionFormData>;
  clientId: string;
  sessionNumber?: number;
}) {
  const [formData, setFormData] = useState<SessionFormData>({
    clientId,
    sessionNumber: initialData?.sessionNumber || sessionNumber,
    sessionDate: initialData?.sessionDate || new Date().toISOString().split('T')[0],
    therapy: initialData?.therapy || 'ABA',
    longTermObjective: initialData?.longTermObjective || '',
    shortTermObjective: initialData?.shortTermObjective || '',
    zone: initialData?.zone,
    sessionTags: initialData?.sessionTags || [],
    successes: initialData?.successes || [],
    struggles: initialData?.struggles || [],
    interventionsUsed: initialData?.interventionsUsed || [],
    strategiesUsed: initialData?.strategiesUsed || [],
    reinforcementTypes: initialData?.reinforcementTypes || [],
    dataCollectionMethod: initialData?.dataCollectionMethod || '',
    discussionStatus: initialData?.discussionStatus || [],
    additionalNotes: initialData?.additionalNotes || '',
    sessionActivities: initialData?.sessionActivities || [],
  });

  const [newTag, setNewTag] = useState('');
  const [newSuccess, setNewSuccess] = useState('');
  const [newStruggle, setNewStruggle] = useState('');
  const [newIntervention, setNewIntervention] = useState('');
  const [newStrategy, setNewStrategy] = useState('');
  const [newReinforcement, setNewReinforcement] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.therapy) {
      toast.error('Please select a therapy type');
      return;
    }

    onSubmit(formData);
  };

  const addToList = (field: keyof SessionFormData, value: string, setter: (v: string) => void) => {
    if (!value.trim()) return;
    const currentList = (formData[field] as string[]) || [];
    setFormData({ ...formData, [field]: [...currentList, value.trim()] });
    setter('');
  };

  const removeFromList = (field: keyof SessionFormData, index: number) => {
    const currentList = (formData[field] as string[]) || [];
    setFormData({ ...formData, [field]: currentList.filter((_, i) => i !== index) });
  };

  const addActivity = () => {
    const newActivity: SessionActivity = {
      sequenceOrder: (formData.sessionActivities?.length || 0) + 1,
      activity: '',
      antecedent: '',
      behaviour: '',
      consequences: '',
      promptType: '',
    };
    setFormData({ ...formData, sessionActivities: [...(formData.sessionActivities || []), newActivity] });
  };

  const updateActivity = (index: number, field: keyof SessionActivity, value: string | number) => {
    const activities = [...(formData.sessionActivities || [])];
    activities[index] = { ...activities[index], [field]: value };
    setFormData({ ...formData, sessionActivities: activities });
  };

  const removeActivity = (index: number) => {
    const activities = (formData.sessionActivities || []).filter((_, i) => i !== index);
    const reordered = activities.map((act, idx) => ({ ...act, sequenceOrder: idx + 1 }));
    setFormData({ ...formData, sessionActivities: reordered });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Accordion type="multiple" defaultValue={['basic', 'activities']} className="w-full">
        <AccordionItem value="basic">
          <AccordionTrigger>Basic Information</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="sessionNumber">Session #</Label>
                <Input
                  id="sessionNumber"
                  type="number"
                  min="1"
                  value={formData.sessionNumber}
                  onChange={(e) => setFormData({ ...formData, sessionNumber: parseInt(e.target.value, 10) || 1 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionDate">Session Date</Label>
                <Input
                  id="sessionDate"
                  type="date"
                  value={formData.sessionDate}
                  onChange={(e) => setFormData({ ...formData, sessionDate: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="therapy">Therapy Type *</Label>
                <Select
                  value={formData.therapy}
                  onValueChange={(value: string) => {
                    if (isTherapy(value)) setFormData({ ...formData, therapy: value });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {THERAPY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zone">
                Zone <span className="text-slate-400">(Optional)</span>
              </Label>
              <Select
                value={formData.zone || ''}
                onValueChange={(value: string) => {
                  if (!value) setFormData({ ...formData, zone: undefined });
                  else if (isZone(value)) setFormData({ ...formData, zone: value });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select zone..." />
                </SelectTrigger>
                <SelectContent>
                  {ZONE_OPTIONS.map((zone) => (
                    <SelectItem key={zone.value} value={zone.value}>
                      <div className="flex items-center gap-2">
                        <div className={cn('size-3 rounded-full', zone.color)} />
                        <span>{zone.label} Zone</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="longTermObjective">
                Long-Term Objective <span className="text-slate-400">(Optional)</span>
              </Label>
              <Textarea
                id="longTermObjective"
                value={formData.longTermObjective}
                onChange={(e) => setFormData({ ...formData, longTermObjective: e.target.value })}
                placeholder="Overall goal for this client..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortTermObjective">
                Short-Term Objective <span className="text-slate-400">(Optional)</span>
              </Label>
              <Textarea
                id="shortTermObjective"
                value={formData.shortTermObjective}
                onChange={(e) => setFormData({ ...formData, shortTermObjective: e.target.value })}
                placeholder="Focus for this session..."
                rows={2}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="activities">
          <AccordionTrigger>Session Activities (ABC Data)</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            {formData.sessionActivities && formData.sessionActivities.length > 0 ? (
              <div className="space-y-3">
                {formData.sessionActivities.map((activity, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-card space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="size-4 text-slate-400" />
                        <span className="text-sm font-medium">Activity {activity.sequenceOrder}</span>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeActivity(index)}>
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>Activity Name</Label>
                      <Input value={activity.activity} onChange={(e) => updateActivity(index, 'activity', e.target.value)} placeholder="e.g., Building blocks" />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Antecedent (A)</Label>
                        <Textarea value={activity.antecedent} onChange={(e) => updateActivity(index, 'antecedent', e.target.value)} placeholder="What happened before?" rows={2} />
                      </div>
                      <div className="space-y-2">
                        <Label>Behaviour (B)</Label>
                        <Textarea value={activity.behaviour} onChange={(e) => updateActivity(index, 'behaviour', e.target.value)} placeholder="What was the behavior?" rows={2} />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Consequences (C)</Label>
                        <Textarea value={activity.consequences} onChange={(e) => updateActivity(index, 'consequences', e.target.value)} placeholder="What happened after?" rows={2} />
                      </div>
                      <div className="space-y-2">
                        <Label>Prompt Type</Label>
                        <Select value={activity.promptType || ''} onValueChange={(value: string) => updateActivity(index, 'promptType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {PROMPT_TYPE_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600 text-center py-4">No activities added yet</p>
            )}

            <Button type="button" onClick={addActivity} variant="outline" className="w-full gap-2">
              <Plus className="size-4" />
              Add Activity
            </Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="observations">
          <AccordionTrigger>Session Observations</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Successes</Label>
              <div className="flex gap-2">
                <Input
                  value={newSuccess}
                  onChange={(e) => setNewSuccess(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToList('successes', newSuccess, setNewSuccess);
                    }
                  }}
                  placeholder="Add a success..."
                />
                <Button type="button" onClick={() => addToList('successes', newSuccess, setNewSuccess)} variant="outline" size="icon">
                  <Plus className="size-4" />
                </Button>
              </div>
              {formData.successes && formData.successes.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.successes.map((item, index) => (
                    <Badge key={index} variant="secondary" className="gap-1 bg-green-50 text-green-700">
                      {item}
                      <button type="button" onClick={() => removeFromList('successes', index)} className="ml-1 hover:text-destructive">
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>Struggles</Label>
              <div className="flex gap-2">
                <Input
                  value={newStruggle}
                  onChange={(e) => setNewStruggle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToList('struggles', newStruggle, setNewStruggle);
                    }
                  }}
                  placeholder="Add a struggle..."
                />
                <Button type="button" onClick={() => addToList('struggles', newStruggle, setNewStruggle)} variant="outline" size="icon">
                  <Plus className="size-4" />
                </Button>
              </div>
              {formData.struggles && formData.struggles.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.struggles.map((item, index) => (
                    <Badge key={index} variant="secondary" className="gap-1 bg-orange-50 text-orange-700">
                      {item}
                      <button type="button" onClick={() => removeFromList('struggles', index)} className="ml-1 hover:text-destructive">
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>Interventions Used</Label>
              <div className="flex gap-2">
                <Input
                  value={newIntervention}
                  onChange={(e) => setNewIntervention(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToList('interventionsUsed', newIntervention, setNewIntervention);
                    }
                  }}
                  placeholder="Add intervention..."
                />
                <Button type="button" onClick={() => addToList('interventionsUsed', newIntervention, setNewIntervention)} variant="outline" size="icon">
                  <Plus className="size-4" />
                </Button>
              </div>
              {formData.interventionsUsed && formData.interventionsUsed.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.interventionsUsed.map((item, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {item}
                      <button type="button" onClick={() => removeFromList('interventionsUsed', index)} className="ml-1 hover:text-destructive">
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>Strategies Used</Label>
              <div className="flex gap-2">
                <Input
                  value={newStrategy}
                  onChange={(e) => setNewStrategy(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToList('strategiesUsed', newStrategy, setNewStrategy);
                    }
                  }}
                  placeholder="Add strategy..."
                />
                <Button type="button" onClick={() => addToList('strategiesUsed', newStrategy, setNewStrategy)} variant="outline" size="icon">
                  <Plus className="size-4" />
                </Button>
              </div>
              {formData.strategiesUsed && formData.strategiesUsed.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.strategiesUsed.map((item, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {item}
                      <button type="button" onClick={() => removeFromList('strategiesUsed', index)} className="ml-1 hover:text-destructive">
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>Reinforcement Types</Label>
              <div className="flex gap-2">
                <Input
                  value={newReinforcement}
                  onChange={(e) => setNewReinforcement(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToList('reinforcementTypes', newReinforcement, setNewReinforcement);
                    }
                  }}
                  placeholder="Add reinforcement..."
                />
                <Button type="button" onClick={() => addToList('reinforcementTypes', newReinforcement, setNewReinforcement)} variant="outline" size="icon">
                  <Plus className="size-4" />
                </Button>
              </div>
              {formData.reinforcementTypes && formData.reinforcementTypes.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.reinforcementTypes.map((item, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {item}
                      <button type="button" onClick={() => removeFromList('reinforcementTypes', index)} className="ml-1 hover:text-destructive">
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="notes">
          <AccordionTrigger>Additional Notes</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="dataCollectionMethod">Data Collection Method</Label>
              <Input
                id="dataCollectionMethod"
                value={formData.dataCollectionMethod}
                onChange={(e) => setFormData({ ...formData, dataCollectionMethod: e.target.value })}
                placeholder="e.g., Frequency count, Duration recording..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                placeholder="Any other observations or notes from this session..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Session Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToList('sessionTags', newTag, setNewTag);
                    }
                  }}
                  placeholder="Add tag..."
                />
                <Button type="button" onClick={() => addToList('sessionTags', newTag, setNewTag)} variant="outline" size="icon">
                  <Plus className="size-4" />
                </Button>
              </div>
              {formData.sessionTags && formData.sessionTags.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.sessionTags.map((item, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {item}
                      <button type="button" onClick={() => removeFromList('sessionTags', index)} className="ml-1 hover:text-destructive">
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-background pb-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1 bg-[#0B5B45] hover:bg-[#0D6953]">
          Save Session
        </Button>
      </div>
    </form>
  );
}


