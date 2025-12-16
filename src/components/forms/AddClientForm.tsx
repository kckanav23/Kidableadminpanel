import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { calculateAge, formatDate } from '../../lib/utils';
import type { TherapistResponse, ParentResponse } from '../../types/api';
import { toast } from 'sonner';
import { THERAPY_LABELS } from '../../lib/constants';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface AddClientFormProps {
  onSubmit: (data: AddClientFormData) => void | Promise<void>;
  onCancel: () => void;
  therapists: TherapistResponse[];
  parents: ParentResponse[];
  isSubmitting?: boolean;
  initialData?: Partial<AddClientFormData>;
}

export interface AddClientFormData {
  // Step 1: Basic Information
  firstName: string;
  lastName: string;
  dateOfBirth: Date | undefined;
  therapyStartDate: Date | undefined;
  status: 'active' | 'inactive' | 'suspended';
  photoUrl?: string;

  // Step 2: Therapy Types
  therapyTypes: Array<'aba' | 'speech' | 'ot'>;

  // Step 3: Therapist Assignment (optional)
  therapistId: string;

  // Step 4: Parent Assignment/Creation
  parentAction: 'existing' | 'new' | 'skip';
  existingParentId: string;
  newParentFullName: string;
  newParentEmail: string;
  newParentPhone: string;
  newParentRelationship: string;
  isPrimaryParent: boolean;

  // Step 5: Sensory Profile
  visual?: string;
  auditory?: string;
  tactile?: string;
  vestibular?: string;
  proprioceptive?: string;

  // Step 6: Preferences & Dislikes
  preferences?: string;
  dislikes?: string;

  // Step 7: Communication Styles (optional)
  communicationStyles?: string;
}

const TOTAL_STEPS = 7;

export function AddClientForm({
  onSubmit,
  onCancel,
  therapists,
  parents,
  isSubmitting = false,
  initialData,
}: AddClientFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [dobOpen, setDobOpen] = useState(false);
  const [therapyStartOpen, setTherapyStartOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  const form = useForm<AddClientFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: undefined,
      therapyStartDate: undefined,
      status: 'active',
      photoUrl: '',
      therapyTypes: [],
      therapistId: '',
      parentAction: 'new',
      existingParentId: '',
      newParentFullName: '',
      newParentEmail: '',
      newParentPhone: '',
      newParentRelationship: 'Parent',
      isPrimaryParent: true,
      visual: '',
      auditory: '',
      tactile: '',
      vestibular: '',
      proprioceptive: '',
      preferences: '',
      dislikes: '',
      communicationStyles: '',
      ...initialData,
    },
  });

  const therapyTypesValue = form.watch('therapyTypes');
  const dateOfBirth = form.watch('dateOfBirth');
  const parentAction = form.watch('parentAction');

  useEffect(() => {
    // When using inside FormDialog, we reset whenever the component remounts / initialData changes
    if (initialData) {
      form.reset({ ...form.getValues(), ...initialData });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const toggleTherapyType = (type: 'aba' | 'speech' | 'ot') => {
    const current = therapyTypesValue || [];
    if (current.includes(type)) {
      form.setValue('therapyTypes', current.filter((t) => t !== type));
    } else {
      form.setValue('therapyTypes', [...current, type]);
    }
  };

  const validateCurrentStep = async (): Promise<boolean> => {
    const values = form.getValues();

    switch (currentStep) {
      case 1:
        if (!values.firstName.trim()) {
          form.setError('firstName', { type: 'manual', message: 'First name is required' });
          return false;
        }
        if (!values.lastName.trim()) {
          form.setError('lastName', { type: 'manual', message: 'Last name is required' });
          return false;
        }
        if (!values.dateOfBirth) {
          form.setError('dateOfBirth', { type: 'manual', message: 'Date of birth is required' });
          return false;
        }
        if (!values.therapyStartDate) {
          form.setError('therapyStartDate', {
            type: 'manual',
            message: 'Therapy start date is required',
          });
          return false;
        }
        return true;

      case 2:
        if (!values.therapyTypes || values.therapyTypes.length === 0) {
          toast.error('Please select at least one therapy type');
          return false;
        }
        return true;

      case 3:
        return true;

      case 4:
        if (values.parentAction === 'existing' && !values.existingParentId) {
          toast.error('Please select a parent');
          return false;
        }
        if (values.parentAction === 'new') {
          if (!values.newParentFullName.trim()) {
            form.setError('newParentFullName', { type: 'manual', message: 'Parent name is required' });
            return false;
          }
          if (!values.newParentRelationship.trim()) {
            form.setError('newParentRelationship', { type: 'manual', message: 'Relationship is required' });
            return false;
          }
        }
        return true;

      default:
        return true;
    }
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) return;
    if (currentStep < TOTAL_STEPS) setCurrentStep((s) => s + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const submitFinal = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) return;

    const values = form.getValues();
    if (!values.therapyTypes || values.therapyTypes.length === 0) {
      toast.error('Please select at least one therapy type');
      return;
    }
    await onSubmit(values);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Basic Information</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
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
                control={form.control}
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
                control={form.control}
                name="dateOfBirth"
                rules={{ required: 'Date of birth is required' }}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Date of Birth <span className="text-red-500">*</span>
                    </FormLabel>
                    <Popover open={dobOpen} onOpenChange={setDobOpen}>
                      <FormControl>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            {field.value ? (
                              formatDate(field.value)
                            ) : (
                              <span className="text-slate-500">Select date of birth</span>
                            )}
                            <CalendarIcon className="ml-auto size-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                      </FormControl>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          captionLayout="dropdown"
                          fromYear={currentYear - 30}
                          toYear={currentYear}
                          defaultMonth={field.value ?? new Date(currentYear - 5, 0, 1)}
                          onSelect={(date) => {
                            field.onChange(date);
                            setDobOpen(false);
                          }}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {dateOfBirth && (
                      <FormDescription>Age: {calculateAge(dateOfBirth)} years old</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="therapyStartDate"
                rules={{ required: 'Therapy start date is required' }}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Therapy Start Date <span className="text-red-500">*</span>
                    </FormLabel>
                    <Popover open={therapyStartOpen} onOpenChange={setTherapyStartOpen}>
                      <FormControl>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            {field.value ? (
                              formatDate(field.value)
                            ) : (
                              <span className="text-slate-500">Select start date</span>
                            )}
                            <CalendarIcon className="ml-auto size-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                      </FormControl>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          captionLayout="dropdown"
                          fromYear={currentYear - 10}
                          toYear={currentYear + 1}
                          defaultMonth={field.value ?? new Date()}
                          onSelect={(date) => {
                            field.onChange(date);
                            setTherapyStartOpen(false);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Status <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
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
                control={form.control}
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

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Therapy Types <span className="text-red-500">*</span>
            </h3>
            <p className="text-sm text-slate-600">Select all therapy types this client will receive</p>
            <div className="flex flex-wrap gap-4">
              {(['aba', 'speech', 'ot'] as const).map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`therapy-${type}`}
                    checked={therapyTypesValue?.includes(type)}
                    onCheckedChange={() => toggleTherapyType(type)}
                  />
                  <label
                    htmlFor={`therapy-${type}`}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {THERAPY_LABELS[type]}
                  </label>
                </div>
              ))}
            </div>
            {therapyTypesValue.length === 0 && (
              <p className="text-sm text-red-500">Please select at least one therapy type</p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Therapist Assignment</h3>
            <p className="text-sm text-slate-600">Assign a primary therapist (optional)</p>
            <FormField
              control={form.control}
              name="therapistId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Therapist</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select therapist (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {therapists.length === 0 ? (
                        <div className="px-2 py-1.5 text-sm text-slate-500">No therapists available</div>
                      ) : (
                        therapists.map(
                          (t) =>
                            t.id && (
                              <SelectItem key={t.id} value={t.id}>
                                {t.fullName || 'Unknown'}
                              </SelectItem>
                            ),
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>Leave empty to assign later.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Parent/Caregiver</h3>
            <p className="text-sm text-slate-600">Assign an existing parent or create a new one</p>

            <FormField
              control={form.control}
              name="parentAction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Action</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
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

            {parentAction === 'existing' && (
              <FormField
                control={form.control}
                name="existingParentId"
                rules={{ required: parentAction === 'existing' ? 'Please select a parent' : false }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Parent</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {parents.length === 0 ? (
                          <div className="px-2 py-1.5 text-sm text-slate-500">No parents available</div>
                        ) : (
                          parents.map(
                            (p) =>
                              p.id && (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.fullName || 'Unknown'}
                                </SelectItem>
                              ),
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {parentAction === 'new' && (
              <>
                <FormField
                  control={form.control}
                  name="newParentFullName"
                  rules={{ required: parentAction === 'new' ? 'Parent name is required' : false }}
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
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
                    name="newParentRelationship"
                    rules={{ required: parentAction === 'new' ? 'Relationship is required' : false }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Relationship <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
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
                    control={form.control}
                    name="isPrimaryParent"
                    render={({ field }) => (
                      <FormItem className="flex flex-col justify-end">
                        <div className="flex items-center space-x-2 pt-2">
                          <Checkbox
                            id="isPrimaryParent"
                            checked={field.value}
                            onCheckedChange={field.onChange}
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
            )}

            {parentAction === 'skip' && (
              <p className="text-sm text-slate-500 italic">
                You can add parents/caregivers later from the client profile page.
              </p>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Sensory Profile (Optional)</h3>
            <p className="text-sm text-slate-600">Enter sensory preferences and sensitivities</p>
            <div className="grid gap-4 md:grid-cols-2">
              {(['visual', 'auditory', 'tactile', 'vestibular', 'proprioceptive'] as const).map((key) => (
                <FormField
                  key={key}
                  control={form.control}
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

      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Preferences & Dislikes (Optional)</h3>
            <p className="text-sm text-slate-600">Enter items separated by commas</p>

            <FormField
              control={form.control}
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
              control={form.control}
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

      case 7:
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Communication Styles (Optional)</h3>
            <p className="text-sm text-slate-600">You can add more details later.</p>
            <FormField
              control={form.control}
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

      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        {/* Progress Indicator */}
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, idx) => (
            <div
              key={idx}
              className={`flex-1 h-2 rounded-full ${idx + 1 <= currentStep ? 'bg-teal-600' : 'bg-slate-200'}`}
            />
          ))}
        </div>

        <div className="text-sm text-slate-600">
          Step {currentStep} of {TOTAL_STEPS}
        </div>

        {renderStepContent()}

        <div className="flex items-center justify-between gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={currentStep === 1 ? onCancel : prevStep}
            disabled={isSubmitting}
          >
            {currentStep === 1 ? 'Cancel' : (
              <>
                <ChevronLeft className="size-4 mr-1" />
                Previous
              </>
            )}
          </Button>

          {currentStep < TOTAL_STEPS ? (
            <Button type="button" onClick={nextStep} className="bg-teal-600 hover:bg-teal-700" disabled={isSubmitting}>
              Next <ChevronRight className="size-4 ml-1" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={submitFinal}
              className="bg-teal-600 hover:bg-teal-700"
              disabled={isSubmitting || therapyTypesValue.length === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Creating…
                </>
              ) : (
                'Create Client'
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}


