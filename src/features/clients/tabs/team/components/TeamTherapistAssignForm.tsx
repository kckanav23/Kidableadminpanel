import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { TherapistResponse } from '@/types/api';

export interface TeamTherapistAssignData {
  therapistId: string;
  primary: boolean;
}

export function TeamTherapistAssignForm({
  onSubmit,
  onCancel,
  therapists,
  assignedTherapistIds,
  initialData,
  isSubmitting = false,
}: {
  onSubmit: (data: TeamTherapistAssignData) => void;
  onCancel: () => void;
  therapists: TherapistResponse[];
  assignedTherapistIds?: Set<string>;
  initialData?: Partial<TeamTherapistAssignData>;
  isSubmitting?: boolean;
}) {
  const [therapistId, setTherapistId] = useState<string>(initialData?.therapistId || '');
  const [primary, setPrimary] = useState<boolean>(!!initialData?.primary);

  const availableTherapists = useMemo(() => {
    const assigned = assignedTherapistIds ?? new Set<string>();
    return (therapists || []).filter((t) => t.id && !assigned.has(t.id));
  }, [therapists, assignedTherapistIds]);

  const handleSubmit = () => {
    if (!therapistId) return;
    onSubmit({ therapistId, primary });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Therapist <span className="text-red-500">*</span>
        </label>
        <Select value={therapistId || undefined} onValueChange={setTherapistId}>
          <SelectTrigger>
            <SelectValue placeholder="Select therapist" />
          </SelectTrigger>
          <SelectContent>
            {availableTherapists.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-slate-500">No available therapists</div>
            ) : (
              availableTherapists.map((t) => (
                <SelectItem key={t.id!} value={t.id!}>
                  {t.fullName || 'Unknown'}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <p className="text-xs text-slate-500">Already-assigned therapists are hidden.</p>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="team-therapist-primary"
          checked={primary}
          onCheckedChange={(checked: boolean | 'indeterminate') => setPrimary(checked === true)}
        />
        <label htmlFor="team-therapist-primary" className="text-sm cursor-pointer">
          Set as primary therapist
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting || !therapistId}>
          {isSubmitting ? 'Assigning…' : 'Assign'}
        </Button>
      </div>
    </div>
  );
}


