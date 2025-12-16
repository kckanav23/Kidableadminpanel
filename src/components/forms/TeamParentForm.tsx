import React, { useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import type { ParentResponse } from '../../types/api';

interface TeamParentFormProps {
  onSubmit: (data: TeamParentData) => void;
  onCancel: () => void;
  parents: ParentResponse[];
  assignedParentIds?: Set<string>;
  initialData?: Partial<TeamParentData>;
  isSubmitting?: boolean;
}

export interface TeamParentData {
  mode: 'existing' | 'new';
  parentId?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  relationship: string;
  primary: boolean;
}

export function TeamParentForm({
  onSubmit,
  onCancel,
  parents,
  assignedParentIds,
  initialData,
  isSubmitting = false,
}: TeamParentFormProps) {
  const [mode, setMode] = useState<'existing' | 'new'>(initialData?.mode || 'existing');
  const [parentId, setParentId] = useState<string>(initialData?.parentId || '');
  const [fullName, setFullName] = useState<string>(initialData?.fullName || '');
  const [email, setEmail] = useState<string>(initialData?.email || '');
  const [phone, setPhone] = useState<string>(initialData?.phone || '');
  const [relationship, setRelationship] = useState<string>(initialData?.relationship || 'Parent');
  const [primary, setPrimary] = useState<boolean>(initialData?.primary ?? true);

  const availableParents = useMemo(() => {
    const assigned = assignedParentIds ?? new Set<string>();
    return (parents || []).filter((p) => p.id && !assigned.has(p.id));
  }, [parents, assignedParentIds]);

  const canSubmit =
    relationship.trim().length > 0 &&
    ((mode === 'existing' && !!parentId) || (mode === 'new' && fullName.trim().length > 0));

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      mode,
      parentId: mode === 'existing' ? parentId : undefined,
      fullName: mode === 'new' ? fullName.trim() : undefined,
      email: mode === 'new' ? email.trim() || undefined : undefined,
      phone: mode === 'new' ? phone.trim() || undefined : undefined,
      relationship: relationship.trim(),
      primary,
    });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium">Mode</label>
        <Select value={mode} onValueChange={(v) => setMode(v as 'existing' | 'new')}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="existing">Link existing</SelectItem>
            <SelectItem value="new">Create new</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {mode === 'existing' ? (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Parent <span className="text-red-500">*</span>
          </label>
          <Select value={parentId || undefined} onValueChange={setParentId}>
            <SelectTrigger>
              <SelectValue placeholder="Select parent" />
            </SelectTrigger>
            <SelectContent>
              {availableParents.length === 0 ? (
                <div className="px-2 py-1.5 text-sm text-slate-500">No available parents</div>
              ) : (
                availableParents.map((p) => (
                  <SelectItem key={p.id!} value={p.id!}>
                    {p.fullName || 'Unknown'}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500">Already-linked parents are hidden.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Full name <span className="text-red-500">*</span>
            </label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Relationship <span className="text-red-500">*</span>
          </label>
          <Input value={relationship} onChange={(e) => setRelationship(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 pt-7">
          <Checkbox
            id="team-parent-primary"
            checked={primary}
            onCheckedChange={(checked) => setPrimary(!!checked)}
          />
          <label htmlFor="team-parent-primary" className="text-sm cursor-pointer">
            Set as primary caregiver
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting || !canSubmit}>
          {isSubmitting ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </div>
  );
}


