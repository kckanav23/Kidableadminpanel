import React, { useEffect, useMemo, useState } from 'react';
import { useForm, useFormState, useWatch } from 'react-hook-form';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

import { THERAPY_LABELS } from '@/lib/constants';
import { calculateAge } from '@/lib/utils';

import type { ParentResponse, TherapistResponse } from '@/types/api';
import type { ClientFormData } from '@/features/clients/clientForm';
import { getClientFormInitialValues } from '@/features/clients/clientForm';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export interface ClientFormProps {
  onSubmit: (data: ClientFormData) => void | Promise<void>;
  onCancel: () => void;
  therapists: TherapistResponse[];
  parents: ParentResponse[];
  isSubmitting?: boolean;
  defaultValues?: Partial<ClientFormData>;
  submitLabel?: string;
}

const SELECT_NONE_VALUE = '__none__';

type StepFields = Array<keyof ClientFormData>;
type StepConfig = {
  id: string;
  title: string;
  /**
   * Fields to validate when user clicks "Next" on this step.
   * Use a function when validation depends on other form values (e.g. parentAction).
   */
  fields: StepFields | ((values: ClientFormData) => StepFields);
  render: () => React.ReactNode;
};

function StepBasicInformation() {
  const dateOfBirth = useWatch<ClientFormData>({ name: 'dateOfBirth' });

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-900">Basic Information</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          name="firstName"
          rules={{ required: 'First name is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                First Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Alex" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="lastName"
          rules={{ required: 'Last name is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Last Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Johnson" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          name="dateOfBirth"
          rules={{ required: 'Date of birth is required' }}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Date of Birth <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </FormControl>
              {dateOfBirth ? <FormDescription>Age: {calculateAge(new Date(`${dateOfBirth}T00:00:00`))} years old</FormDescription> : null}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="therapyStartDate"
          rules={{ required: 'Therapy start date is required' }}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Therapy Start Date <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          name="status"
          rules={{ required: 'Status is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Status <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="photoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/photo.jpg" {...field} />
              </FormControl>
              <FormDescription>URL to the client&apos;s profile photo</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function StepTherapyTypes() {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-900">
        Therapy Types <span className="text-red-500">*</span>
      </h3>
      <p className="text-sm text-slate-600">Select all therapy types this client will receive</p>

      <FormField
        name="therapyTypes"
        rules={{
          validate: (value) => (value && value.length > 0 ? true : 'Please select at least one therapy type'),
        }}
        render={({ field }) => {
          const current = (field.value || []) as ClientFormData['therapyTypes'];
          const toggle = (type: ClientFormData['therapyTypes'][number], checked: boolean) => {
            const next = checked ? Array.from(new Set([...current, type])) : current.filter((t) => t !== type);
            field.onChange(next);
          };

          return (
            <FormItem>
              <div className="flex flex-wrap gap-4">
                {(['aba', 'speech', 'ot'] as const).map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`therapy-${type}`}
                      checked={current.includes(type)}
                      onCheckedChange={(v: boolean | 'indeterminate') => toggle(type, v === true)}
                    />
                    <label htmlFor={`therapy-${type}`} className="text-sm font-medium leading-none cursor-pointer">
                      {THERAPY_LABELS[type]}
                    </label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
}

function StepTherapistAssignment({ therapists }: { therapists: TherapistResponse[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-900">Therapist Assignment</h3>
      <p className="text-sm text-slate-600">Assign a primary therapist, or skip for now</p>

      <FormField
        name="therapistId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Primary Therapist</FormLabel>
            <Select
              value={field.value ? field.value : SELECT_NONE_VALUE}
              onValueChange={(value: string) => field.onChange(value === SELECT_NONE_VALUE ? '' : value)}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select therapist" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={SELECT_NONE_VALUE} className="text-slate-500">
                  Skip for now
                </SelectItem>
                {therapists.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-slate-500">No therapists available</div>
                ) : (
                  therapists.map(
                    (t) =>
                      t.id && (
                        <SelectItem key={t.id} value={t.id}>
                          {t.fullName || 'Unknown'}
                        </SelectItem>
                      )
                  )
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function StepParentCaregiver({ parents }: { parents: ParentResponse[] }) {
  const parentAction = useWatch<ClientFormData>({ name: 'parentAction' });

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-900">Parent/Caregiver</h3>
      <p className="text-sm text-slate-600">Assign an existing parent or create a new one</p>

      <FormField
        name="parentAction"
        rules={{ required: 'Please choose an action' }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Action</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="new">Create New Parent</SelectItem>
                <SelectItem value="existing">Use Existing Parent</SelectItem>
                <SelectItem value="skip">Skip for Now</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {parentAction === 'existing' ? (
        <FormField
          name="existingParentId"
          rules={{
            validate: (value) => (parentAction !== 'existing' || !!value ? true : 'Please select a parent'),
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Parent</FormLabel>
              <Select
                value={field.value ? field.value : SELECT_NONE_VALUE}
                onValueChange={(value: string) => field.onChange(value === SELECT_NONE_VALUE ? '' : value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={SELECT_NONE_VALUE} className="text-slate-500">
                    Select parent
                  </SelectItem>
                  {parents.length === 0 ? (
                    <div className="px-2 py-1.5 text-sm text-slate-500">No parents available</div>
                  ) : (
                    parents.map(
                      (p) =>
                        p.id && (
                          <SelectItem key={p.id} value={p.id}>
                            {p.fullName || 'Unknown'}
                          </SelectItem>
                        )
                    )
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : null}

      {parentAction === 'new' ? (
        <>
          <FormField
            name="newParentFullName"
            rules={{
              validate: (value) => (parentAction !== 'new' || !!value?.trim() ? true : 'Parent name is required'),
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Full Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              name="newParentEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="newParentPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              name="newParentRelationship"
              rules={{
                validate: (value) => (parentAction !== 'new' || !!value?.trim() ? true : 'Relationship is required'),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Relationship <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Parent">Parent</SelectItem>
                      <SelectItem value="Guardian">Guardian</SelectItem>
                      <SelectItem value="Caregiver">Caregiver</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="isPrimaryParent"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-end">
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="isPrimaryParent"
                      checked={field.value === true}
                      onCheckedChange={(v: boolean | 'indeterminate') => field.onChange(v === true)}
                    />
                    <label htmlFor="isPrimaryParent" className="text-sm font-medium cursor-pointer">
                      Set as primary caregiver
                    </label>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </>
      ) : null}

      {parentAction === 'skip' ? <p className="text-sm text-slate-500 italic">You can add parents/caregivers later from the client profile page.</p> : null}
    </div>
  );
}

function StepSensoryProfile() {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-900">Sensory Profile (Optional)</h3>
      <p className="text-sm text-slate-600">Enter sensory preferences and sensitivities</p>
      <div className="grid gap-4 md:grid-cols-2">
        {(['visual', 'auditory', 'tactile', 'vestibular', 'proprioceptive'] as const).map((key) => (
          <FormField
            key={key}
            name={key}
            render={({ field }) => (
              <FormItem className={key === 'proprioceptive' ? 'md:col-span-2' : ''}>
                <FormLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
}

function StepPreferencesDislikes() {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-900">Preferences & Dislikes (Optional)</h3>
      <p className="text-sm text-slate-600">Enter items separated by commas</p>

      <FormField
        name="preferences"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferences</FormLabel>
            <FormControl>
              <Textarea {...field} rows={3} />
            </FormControl>
            <FormDescription>Comma-separated</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="dislikes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dislikes / Triggers</FormLabel>
            <FormControl>
              <Textarea {...field} rows={3} />
            </FormControl>
            <FormDescription>Comma-separated</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function StepCommunicationStyles() {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-900">Communication Styles (Optional)</h3>
      <p className="text-sm text-slate-600">You can add more details later.</p>
      <FormField
        name="communicationStyles"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Communication Notes</FormLabel>
            <FormControl>
              <Textarea {...field} rows={4} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export function ClientForm({
  onSubmit,
  onCancel,
  therapists,
  parents,
  isSubmitting = false,
  defaultValues,
  submitLabel = 'Create Client',
}: ClientFormProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const initialDefaults = useMemo(() => getClientFormInitialValues(), []);

  const form = useForm<ClientFormData>({
    // Multi-step form: steps unmount/remount as user navigates.
    // Keep values in RHF state even when a step is not currently rendered.
    shouldUnregister: false,
    defaultValues: { ...initialDefaults, ...defaultValues },
  });

  const { isDirty } = useFormState({ control: form.control });

  useEffect(() => {
    // IMPORTANT: Only apply `defaultValues` when the form is still pristine.
    // Many parents pass a new object each render; blindly resetting here will wipe user input
    // when navigating between steps.
    if (!defaultValues) return;
    if (isDirty) return;
    form.reset({ ...initialDefaults, ...defaultValues });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  const steps: StepConfig[] = useMemo(
    () => [
      {
        id: 'basic',
        title: 'Basic Information',
        fields: ['firstName', 'lastName', 'dateOfBirth', 'therapyStartDate', 'status', 'photoUrl'],
        render: () => <StepBasicInformation />,
      },
      {
        id: 'therapy',
        title: 'Therapy Types',
        fields: ['therapyTypes'],
        render: () => <StepTherapyTypes />,
      },
      {
        id: 'therapist',
        title: 'Therapist Assignment',
        fields: ['therapistId'],
        render: () => <StepTherapistAssignment therapists={therapists} />,
      },
      {
        id: 'parent',
        title: 'Parent/Caregiver',
        fields: (values: ClientFormData) => {
          if (values.parentAction === 'existing') return ['parentAction', 'existingParentId'];
          if (values.parentAction === 'new') return ['parentAction', 'newParentFullName', 'newParentRelationship', 'newParentEmail', 'newParentPhone'];
          return ['parentAction'];
        },
        render: () => <StepParentCaregiver parents={parents} />,
      },
      {
        id: 'sensory',
        title: 'Sensory Profile',
        fields: ['visual', 'auditory', 'tactile', 'vestibular', 'proprioceptive'],
        render: () => <StepSensoryProfile />,
      },
      {
        id: 'prefs',
        title: 'Preferences & Dislikes',
        fields: ['preferences', 'dislikes'],
        render: () => <StepPreferencesDislikes />,
      },
      {
        id: 'communication',
        title: 'Communication Styles',
        fields: ['communicationStyles'],
        render: () => <StepCommunicationStyles />,
      },
    ],
    [parents, therapists]
  );

  const totalSteps = steps.length;
  const isLastStep = stepIndex === totalSteps - 1;

  const goNext = async () => {
    const step = steps[stepIndex];
    const values = form.getValues();
    const fields = typeof step.fields === 'function' ? step.fields(values) : step.fields;
    const isValid = await form.trigger(fields as any, { shouldFocus: true });
    if (!isValid) return;
    if (!isLastStep) setStepIndex((s) => Math.min(s + 1, totalSteps - 1));
  };

  const goPrev = () => {
    setStepIndex((s) => Math.max(s - 1, 0));
  };

  const handleFinalSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={handleFinalSubmit}>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div key={idx} className={`flex-1 h-2 rounded-full ${idx <= stepIndex ? 'bg-teal-600' : 'bg-slate-200'}`} />
          ))}
        </div>

        <div className="text-sm text-slate-600">
          Step {stepIndex + 1} of {totalSteps}
        </div>

        {steps[stepIndex]?.render()}

        <div className="flex items-center justify-between gap-2 pt-2">
          <Button type="button" variant="outline" onClick={stepIndex === 0 ? onCancel : goPrev} disabled={isSubmitting}>
            {stepIndex === 0 ? (
              'Cancel'
            ) : (
              <>
                <ChevronLeft className="size-4 mr-1" />
                Previous
              </>
            )}
          </Button>

          {!isLastStep ? (
            <Button type="button" onClick={goNext} className="bg-teal-600 hover:bg-teal-700" disabled={isSubmitting}>
              Next <ChevronRight className="size-4 ml-1" />
            </Button>
          ) : (
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Saving…
                </>
              ) : (
                submitLabel
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}