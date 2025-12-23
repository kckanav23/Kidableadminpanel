import { Edit, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ClientProfile as ClientProfileType } from '@/types/api';
import type { ClientUpdateRequest } from '@/types/api';
import { SENSORY_PROFILE_ICONS, type SensoryProfileKey } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormDialog } from '@/components/common/FormDialog';

import { useUpdateClient } from '@/features/clients/hooks/useUpdateClient';

const ALL_SENSORY_KEYS: SensoryProfileKey[] = ['visual', 'auditory', 'tactile', 'vestibular', 'proprioceptive'];

function parseList(text: string): string[] {
  return text
    .split(/[\n,]/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function toOptionalDateInputValue(value?: string): string {
  // backend typically stores ISO dates; the date input expects YYYY-MM-DD
  if (!value) return '';
  // If already YYYY-MM-DD, keep it.
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

type EditSection = 'basic' | 'sensory' | 'prefs' | 'assessment' | null;

export function ProfileTab({ client }: { client: ClientProfileType }) {
  const updateClient = useUpdateClient();
  const isSaving = updateClient.isPending;

  const [editOpen, setEditOpen] = useState<EditSection>(null);

  const [basicFirstName, setBasicFirstName] = useState(client.firstName || '');
  const [basicLastName, setBasicLastName] = useState(client.lastName || '');
  const [basicDob, setBasicDob] = useState(toOptionalDateInputValue(client.dateOfBirth));
  const [basicAge, setBasicAge] = useState(client.age !== undefined ? String(client.age) : '');
  const [basicTherapies, setBasicTherapies] = useState<Array<'ABA' | 'Speech' | 'OT'>>(client.therapies || []);

  const sensoryInitial = useMemo(() => {
    const raw = client.sensoryProfile || {};
    const next: Record<SensoryProfileKey, string> = {
      visual: typeof raw.visual === 'string' ? raw.visual : '',
      auditory: typeof raw.auditory === 'string' ? raw.auditory : '',
      tactile: typeof raw.tactile === 'string' ? raw.tactile : '',
      vestibular: typeof raw.vestibular === 'string' ? raw.vestibular : '',
      proprioceptive: typeof raw.proprioceptive === 'string' ? raw.proprioceptive : '',
    };
    return next;
  }, [client.sensoryProfile]);
  const [sensory, setSensory] = useState<Record<SensoryProfileKey, string>>(sensoryInitial);

  const [prefsText, setPrefsText] = useState((client.preferences || []).join('\n'));
  const [dislikesText, setDislikesText] = useState((client.dislikes || []).join('\n'));

  const [initialAssessment, setInitialAssessment] = useState(client.initialAssessment || '');

  const openEdit = (section: EditSection) => {
    // Reset form state from current client snapshot each time (avoids stale values)
    if (section === 'basic') {
      setBasicFirstName(client.firstName || '');
      setBasicLastName(client.lastName || '');
      setBasicDob(toOptionalDateInputValue(client.dateOfBirth));
      setBasicAge(client.age !== undefined ? String(client.age) : '');
      setBasicTherapies(client.therapies || []);
    }
    if (section === 'sensory') {
      setSensory(sensoryInitial);
    }
    if (section === 'prefs') {
      setPrefsText((client.preferences || []).join('\n'));
      setDislikesText((client.dislikes || []).join('\n'));
    }
    if (section === 'assessment') {
      setInitialAssessment(client.initialAssessment || '');
    }
    setEditOpen(section);
  };

  const saveBasic = async () => {
    const requestBody: ClientUpdateRequest = {
      firstName: basicFirstName.trim() || undefined,
      lastName: basicLastName.trim() || undefined,
      dateOfBirth: basicDob || undefined,
      age: basicAge.trim() ? Number(basicAge) : undefined,
      therapies: basicTherapies,
    };
    await updateClient.mutateAsync({ clientId: client.id, requestBody });
    setEditOpen(null);
  };

  const saveSensory = async () => {
    const requestBody: ClientUpdateRequest = {
      sensoryProfile: ALL_SENSORY_KEYS.reduce<Record<string, any>>((acc, k) => {
        // Use null to explicitly clear values; backend accepts `Record<string, any>`
        acc[k] = sensory[k].trim() ? sensory[k].trim() : null;
        return acc;
      }, {}),
    };
    await updateClient.mutateAsync({ clientId: client.id, requestBody });
    setEditOpen(null);
  };

  const savePrefs = async () => {
    const requestBody: ClientUpdateRequest = {
      preferences: parseList(prefsText),
      dislikes: parseList(dislikesText),
    };
    await updateClient.mutateAsync({ clientId: client.id, requestBody });
    setEditOpen(null);
  };

  const saveAssessment = async () => {
    const requestBody: ClientUpdateRequest = {
      initialAssessment: initialAssessment,
    };
    await updateClient.mutateAsync({ clientId: client.id, requestBody });
    setEditOpen(null);
  };

  const hasAnySensory = useMemo(() => {
    const raw = client.sensoryProfile || {};
    return ALL_SENSORY_KEYS.some((k) => typeof raw[k] === 'string' && raw[k].trim().length > 0);
  }, [client.sensoryProfile]);

  const preferences = client.preferences || [];
  const dislikes = client.dislikes || [];

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Basic Information</CardTitle>
          <Button variant="ghost" size="sm" className="gap-2" onClick={() => openEdit('basic')}>
            <Edit className="size-4" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-600">Full Name</p>
            <p className="font-medium">
              {client.firstName} {client.lastName}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Date of Birth</p>
            <p className="font-medium">{client.dateOfBirth ? formatDate(new Date(client.dateOfBirth)) : 'N/A'}</p>
          </div>
          {client.age !== undefined ? (
            <div>
              <p className="text-sm text-slate-600">Age</p>
              <p className="font-medium">{client.age} years old</p>
            </div>
          ) : null}
          {client.pronouns ? (
            <div>
              <p className="text-sm text-slate-600">Pronouns</p>
              <p className="font-medium">{client.pronouns}</p>
            </div>
          ) : null}
          <div>
            <p className="text-sm text-slate-600">Therapies</p>
            <p className="font-medium">{client.therapies?.length ? client.therapies.join(', ') : 'N/A'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Sensory Profile */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sensory Profile</CardTitle>
          <Button variant="ghost" size="sm" className="gap-2" onClick={() => openEdit('sensory')}>
            {hasAnySensory ? <Edit className="size-4" /> : <Plus className="size-4" />}
            {hasAnySensory ? 'Edit' : 'Add'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {hasAnySensory ? (
            ALL_SENSORY_KEYS.map((key) => {
              const raw = client.sensoryProfile || {};
              const value = raw[key];
              return value ? (
                <div key={key} className="flex gap-3">
                  <span className="text-xl">{SENSORY_PROFILE_ICONS[key]}</span>
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 capitalize">{key}</p>
                    <p>{typeof value === 'string' ? value : JSON.stringify(value)}</p>
                  </div>
                </div>
              ) : null;
            })
          ) : (
            <p className="text-sm text-slate-600">
              No sensory profile added yet. Add brief notes for each sensory system to help therapists plan sessions.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Preferences & Dislikes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Preferences & Dislikes</CardTitle>
          <Button variant="ghost" size="sm" className="gap-2" onClick={() => openEdit('prefs')}>
            {preferences.length || dislikes.length ? <Edit className="size-4" /> : <Plus className="size-4" />}
            {preferences.length || dislikes.length ? 'Edit' : 'Add'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {preferences.length > 0 ? (
            <div>
              <p className="text-sm text-slate-600 mb-2">❤️ Likes</p>
              <div className="flex flex-wrap gap-2">
                {preferences.map((pref, idx) => (
                  <Badge key={idx} variant="secondary">
                    {pref}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
          {dislikes.length > 0 ? (
            <div>
              <p className="text-sm text-slate-600 mb-2">⚠️ Dislikes / Triggers</p>
              <div className="flex flex-wrap gap-2">
                {dislikes.map((dislike, idx) => (
                  <Badge key={idx} variant="outline" className="border-red-300 text-red-700">
                    {dislike}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
          {preferences.length === 0 && dislikes.length === 0 ? (
            <p className="text-sm text-slate-600">No preferences/dislikes added yet. Add a few to personalize sessions.</p>
          ) : null}
        </CardContent>
      </Card>

      {/* Initial Assessment */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Initial Assessment</CardTitle>
          <Button variant="ghost" size="sm" className="gap-2" onClick={() => openEdit('assessment')}>
            {client.initialAssessment ? <Edit className="size-4" /> : <Plus className="size-4" />}
            {client.initialAssessment ? 'Edit' : 'Add'}
          </Button>
        </CardHeader>
        <CardContent>
          {client.initialAssessment ? (
            <p className="text-sm whitespace-pre-wrap">{client.initialAssessment}</p>
          ) : (
            <p className="text-sm text-slate-600">No initial assessment added yet. Add key observations from intake.</p>
          )}
        </CardContent>
      </Card>

      {/* Edit dialogs */}
      <FormDialog
        open={editOpen === 'basic'}
        onOpenChange={(open) => setEditOpen(open ? 'basic' : null)}
        title="Edit basic information"
        description="Update name, date of birth, age, and therapies."
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" value={basicFirstName} onChange={(e) => setBasicFirstName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" value={basicLastName} onChange={(e) => setBasicLastName(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dob">Date of birth</Label>
              <Input id="dob" type="date" value={basicDob} onChange={(e) => setBasicDob(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age (years)</Label>
              <Input id="age" inputMode="numeric" value={basicAge} onChange={(e) => setBasicAge(e.target.value)} placeholder="Optional" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Therapies</Label>
            <Select
              value={basicTherapies.join(',') || 'none'}
              onValueChange={(v: string) => {
                if (v === 'none') setBasicTherapies([]);
                else setBasicTherapies(v.split(',') as Array<'ABA' | 'Speech' | 'OT'>);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select therapies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="ABA">ABA</SelectItem>
                <SelectItem value="Speech">Speech</SelectItem>
                <SelectItem value="OT">OT</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">Backend supports a list; multi-select UI can be added later.</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setEditOpen(null)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="button" className="bg-[#0B5B45] hover:bg-[#0D6953]" onClick={saveBasic} disabled={isSaving}>
              Save
            </Button>
          </div>
        </div>
      </FormDialog>

      <FormDialog
        open={editOpen === 'sensory'}
        onOpenChange={(open) => setEditOpen(open ? 'sensory' : null)}
        title="Edit sensory profile"
        description="Add short notes for each sensory system."
        maxWidth="2xl"
      >
        <div className="space-y-4">
          {ALL_SENSORY_KEYS.map((k) => (
            <div key={k} className="space-y-2">
              <Label htmlFor={`sensory-${k}`} className="flex items-center gap-2">
                <span>{SENSORY_PROFILE_ICONS[k]}</span>
                <span className="capitalize">{k}</span>
              </Label>
              <Textarea
                id={`sensory-${k}`}
                value={sensory[k]}
                onChange={(e) => setSensory((prev) => ({ ...prev, [k]: e.target.value }))}
                rows={2}
                placeholder={`Add ${k} notes…`}
              />
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setEditOpen(null)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="button" className="bg-[#0B5B45] hover:bg-[#0D6953]" onClick={saveSensory} disabled={isSaving}>
              Save
            </Button>
          </div>
        </div>
      </FormDialog>

      <FormDialog
        open={editOpen === 'prefs'}
        onOpenChange={(open) => setEditOpen(open ? 'prefs' : null)}
        title="Edit preferences & dislikes"
        description="Enter one item per line (or comma-separated)."
        maxWidth="2xl"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prefs">Likes</Label>
            <Textarea id="prefs" value={prefsText} onChange={(e) => setPrefsText(e.target.value)} rows={4} placeholder="E.g. bubbles, puzzles, swings…" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dislikes">Dislikes / Triggers</Label>
            <Textarea id="dislikes" value={dislikesText} onChange={(e) => setDislikesText(e.target.value)} rows={4} placeholder="E.g. loud noises, transitions…" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setEditOpen(null)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="button" className="bg-[#0B5B45] hover:bg-[#0D6953]" onClick={savePrefs} disabled={isSaving}>
              Save
            </Button>
          </div>
        </div>
      </FormDialog>

      <FormDialog
        open={editOpen === 'assessment'}
        onOpenChange={(open) => setEditOpen(open ? 'assessment' : null)}
        title="Edit initial assessment"
        description="Record key notes from intake and baseline observations."
        maxWidth="2xl"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assessment">Assessment</Label>
            <Textarea id="assessment" value={initialAssessment} onChange={(e) => setInitialAssessment(e.target.value)} rows={8} placeholder="Write the initial assessment…" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setEditOpen(null)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="button" className="bg-[#0B5B45] hover:bg-[#0D6953]" onClick={saveAssessment} disabled={isSaving}>
              Save
            </Button>
          </div>
        </div>
      </FormDialog>
    </div>
  );
}


