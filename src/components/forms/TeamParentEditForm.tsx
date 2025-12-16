import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';

interface TeamParentEditFormProps {
  onSubmit: (data: TeamParentEditData) => void;
  onCancel: () => void;
  initialData: TeamParentEditData;
  isSubmitting?: boolean;
}

export interface TeamParentEditData {
  fullName?: string;
  email?: string;
  phone?: string;
  relationship: string;
  primary: boolean;
}

export function TeamParentEditForm({
  onSubmit,
  onCancel,
  initialData,
  isSubmitting = false,
}: TeamParentEditFormProps) {
  const [fullName, setFullName] = useState<string>(initialData.fullName || '');
  const [email, setEmail] = useState<string>(initialData.email || '');
  const [phone, setPhone] = useState<string>(initialData.phone || '');
  const [relationship, setRelationship] = useState<string>(initialData.relationship || 'Parent');
  const [primary, setPrimary] = useState<boolean>(!!initialData.primary);

  const canSubmit = relationship.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      fullName: fullName.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      relationship: relationship.trim(),
      primary,
    });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium">Full name</label>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Relationship <span className="text-red-500">*</span>
          </label>
          <Input value={relationship} onChange={(e) => setRelationship(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 pt-7">
          <Checkbox
            id="team-parent-edit-primary"
            checked={primary}
            onCheckedChange={(checked) => setPrimary(!!checked)}
          />
          <label htmlFor="team-parent-edit-primary" className="text-sm cursor-pointer">
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


