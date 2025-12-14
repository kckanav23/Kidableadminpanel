import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { calculateAge } from '../../lib/utils';
import { getApiClient, handleApiError } from '../../lib/api-client';
import type { TherapistResponse, ParentResponse } from '../../types/api';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
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
import { formatDate } from '../../lib/utils';
import { THERAPY_LABELS } from '../../lib/constants';

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface ClientFormData {
  // Step 1: Basic Information
  firstName: string;
  lastName: string;
  dateOfBirth: Date | undefined;
  therapyStartDate: Date | undefined;
  status: 'active' | 'inactive' | 'suspended';
  photoUrl?: string;
  
  // Step 2: Therapy Types
  therapyTypes: Array<'aba' | 'speech' | 'ot'>;
  
  // Step 3: Therapist Assignment
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

export function AddClientDialog({ open, onOpenChange, onSuccess }: AddClientDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [dobOpen, setDobOpen] = useState(false);
  const [therapyStartOpen, setTherapyStartOpen] = useState(false);
  const [therapists, setTherapists] = useState<TherapistResponse[]>([]);
  const [parents, setParents] = useState<ParentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ClientFormData>({
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
    },
  });

  const therapyTypes = form.watch('therapyTypes');
  const dateOfBirth = form.watch('dateOfBirth');
  const parentAction = form.watch('parentAction');

  // Fetch therapists and parents when dialog opens
  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const api = getApiClient();
          const [therapistsData, parentsData] = await Promise.all([
            api.adminTherapists.list({ size: 100 }),
            api.adminParents.list6({ size: 100 }),
          ]);
          setTherapists(therapistsData.items || []);
          setParents(parentsData.items || []);
        } catch (error) {
          console.error('Error fetching therapists/parents:', error);
          toast.error('Failed to load therapists and parents');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      // Reset form and step when dialog closes
      form.reset();
      setCurrentStep(1);
    }
  }, [open, form]);

  const nextStep = async () => {
    // Validate current step before proceeding
    const isValid = await validateCurrentStep();
    if (!isValid) return;

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateCurrentStep = async (): Promise<boolean> => {
    const values = form.getValues();

    switch (currentStep) {
      case 1: // Basic Information
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
          form.setError('therapyStartDate', { type: 'manual', message: 'Therapy start date is required' });
          return false;
        }
        return true;

      case 2: // Therapy Types
        if (!values.therapyTypes || values.therapyTypes.length === 0) {
          toast.error('Please select at least one therapy type');
          return false;
        }
        return true;

      case 3: // Therapist (optional, can skip)
        return true;

      case 4: // Parent
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

  const onSubmit = async () => {
    if (isSubmitting) return;

    const isValid = await validateCurrentStep();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const data = form.getValues();
      
      if (!data.dateOfBirth || !data.therapyStartDate) {
        toast.error('Date of birth and therapy start date are required');
        setIsSubmitting(false);
        return;
      }

      if (!data.therapyTypes || data.therapyTypes.length === 0) {
        toast.error('Please select at least one therapy type');
        setIsSubmitting(false);
        return;
      }

      const api = getApiClient();

      // Step 1: Create the client
      const clientResponse = await api.adminClients.createClient({
        requestBody: {
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth.toISOString().split('T')[0],
          age: calculateAge(data.dateOfBirth),
          photoUrl: data.photoUrl || undefined,
          therapyStartDate: data.therapyStartDate.toISOString().split('T')[0],
          therapies: data.therapyTypes.map((t): 'ABA' | 'Speech' | 'OT' => {
            // Map lowercase to proper API format
            if (t === 'aba') return 'ABA';
            if (t === 'speech') return 'Speech';
            if (t === 'ot') return 'OT';
            return 'ABA'; // fallback
          }),
          status: data.status as 'active' | 'inactive' | 'suspended' as any,
          sensoryProfile: (data.visual || data.auditory || data.tactile || data.vestibular || data.proprioceptive)
            ? {
                ...(data.visual && { visual: data.visual }),
                ...(data.auditory && { auditory: data.auditory }),
                ...(data.tactile && { tactile: data.tactile }),
                ...(data.vestibular && { vestibular: data.vestibular }),
                ...(data.proprioceptive && { proprioceptive: data.proprioceptive }),
              }
            : undefined,
          preferences: data.preferences
            ? data.preferences.split(',').map(p => p.trim()).filter(Boolean)
            : undefined,
          dislikes: data.dislikes
            ? data.dislikes.split(',').map(d => d.trim()).filter(Boolean)
            : undefined,
          notes: data.communicationStyles || undefined,
        },
      });

      const clientId = clientResponse.id;
      if (!clientId) {
        throw new Error('Client ID not returned from API');
      }

      // Step 2: Assign therapist if selected
      if (data.therapistId) {
        try {
          await api.adminClientTherapists.assign({
            clientId,
            requestBody: {
              therapistId: data.therapistId,
              primary: true,
            },
          });
        } catch (error) {
          console.error('Error assigning therapist:', error);
          // Don't fail the whole operation if therapist assignment fails
          toast.warning('Client created but therapist assignment failed');
        }
      }

      // Step 3: Assign/Create parent
      if (data.parentAction !== 'skip') {
        try {
          if (data.parentAction === 'existing' && data.existingParentId) {
            // Link existing parent
            await api.adminClientParents.create4({
              clientId,
              requestBody: {
                parentId: data.existingParentId,
                relationship: 'Parent', // Default, can be updated later
                primary: data.isPrimaryParent,
              },
            });
          } else if (data.parentAction === 'new') {
            // Create new parent
            await api.adminClientParents.create4({
              clientId,
              requestBody: {
                fullName: data.newParentFullName,
                email: data.newParentEmail || undefined,
                phone: data.newParentPhone || undefined,
                relationship: data.newParentRelationship,
                primary: data.isPrimaryParent,
              },
            });
          }
        } catch (error) {
          console.error('Error assigning/creating parent:', error);
          // Don't fail the whole operation if parent assignment fails
          toast.warning('Client created but parent assignment failed');
        }
      }

      toast.success('Client created successfully!');
      form.reset();
      setCurrentStep(1);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to create client');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTherapyType = (type: 'aba' | 'speech' | 'ot') => {
    const current = therapyTypes || [];
    if (current.includes(type)) {
      form.setValue('therapyTypes', current.filter(t => t !== type));
    } else {
      form.setValue('therapyTypes', [...current, type]);
    }
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
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
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
                      <FormDescription>
                        Age: {calculateAge(dateOfBirth)} years old
                      </FormDescription>
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
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
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
                    <FormDescription>
                      URL to the client&apos;s profile photo
                    </FormDescription>
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
              {(['aba', 'speech', 'ot'] as const).map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={therapyTypes?.includes(type)}
                    onCheckedChange={() => toggleTherapyType(type)}
                  />
                  <label
                    htmlFor={type}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {THERAPY_LABELS[type]}
                  </label>
                </div>
              ))}
            </div>
            {therapyTypes.length === 0 && (
              <p className="text-sm text-red-500">Please select at least one therapy type</p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Therapist Assignment</h3>
            <p className="text-sm text-slate-600">Assign a primary therapist (optional - can be done later)</p>
            <FormField
              control={form.control}
              name="therapistId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Therapist</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(value === 'skip' ? '' : value)} 
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select therapist (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loading ? (
                        <div className="px-2 py-1.5 text-sm text-slate-500">Loading...</div>
                      ) : therapists.length === 0 ? (
                        <div className="px-2 py-1.5 text-sm text-slate-500">No therapists available</div>
                      ) : (
                        <>
                          {therapists.map(therapist => (
                            therapist.id && (
                              <SelectItem key={therapist.id} value={therapist.id}>
                                {therapist.fullName || 'Unknown'}
                              </SelectItem>
                            )
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    You can assign a therapist later if needed. Leave empty to skip.
                  </FormDescription>
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
                        {loading ? (
                          <div className="px-2 py-1.5 text-sm text-slate-500">Loading...</div>
                        ) : parents.length === 0 ? (
                          <div className="px-2 py-1.5 text-sm text-slate-500">No parents available</div>
                        ) : (
                          parents.map(parent => (
                            parent.id && (
                              <SelectItem key={parent.id} value={parent.id}>
                                {parent.fullName || 'Unknown'} {parent.relationship ? `(${parent.relationship})` : ''}
                              </SelectItem>
                            )
                          ))
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
                            id="isPrimary"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <label
                            htmlFor="isPrimary"
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
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
              <FormField
                control={form.control}
                name="visual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visual</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Prefers dim lighting, avoids fluorescent"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="auditory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Auditory</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Sensitive to sudden loud noises"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tactile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tactile</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Enjoys deep pressure, dislikes light touch"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vestibular"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vestibular</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Seeks movement, loves swinging"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="proprioceptive"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Proprioceptive</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Needs heavy work activities"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Preferences & Dislikes (Optional)</h3>
            <p className="text-sm text-slate-600">Enter preferences and dislikes separated by commas</p>
            
            <FormField
              control={form.control}
              name="preferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferences</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Dinosaurs, Building blocks, Drawing, Music"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter preferences separated by commas
                  </FormDescription>
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
                    <Textarea
                      placeholder="e.g., Loud music, Crowded spaces, Unexpected transitions"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter dislikes or triggers separated by commas
                  </FormDescription>
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
            <p className="text-sm text-slate-600">You can add detailed communication styles later from the client profile</p>
            
            <FormField
              control={form.control}
              name="communicationStyles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Communication Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Verbal (2-3 word phrases), Uses gestures, Picture cards for requests"
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter communication styles or notes. This will be saved in the client notes.
                  </FormDescription>
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Client - Step {currentStep} of {TOTAL_STEPS}</DialogTitle>
          <DialogDescription>
            {currentStep === 1 && 'Enter basic client information'}
            {currentStep === 2 && 'Select therapy types'}
            {currentStep === 3 && 'Assign a therapist (optional)'}
            {currentStep === 4 && 'Add parent/caregiver information'}
            {currentStep === 5 && 'Enter sensory profile (optional)'}
            {currentStep === 6 && 'Enter preferences and dislikes (optional)'}
            {currentStep === 7 && 'Add communication styles (optional)'}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 py-4">
          {Array.from({ length: TOTAL_STEPS }).map((_, idx) => (
            <div
              key={idx}
              className={`flex-1 h-2 rounded-full ${
                idx + 1 <= currentStep
                  ? 'bg-teal-600'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        <Form {...form}>
          <form className="space-y-6">
            {renderStepContent()}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={currentStep === 1 ? () => onOpenChange(false) : prevStep}
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
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-teal-600 hover:bg-teal-700"
                  disabled={isSubmitting}
                >
                  Next
                  <ChevronRight className="size-4 ml-1" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={onSubmit}
                  className="bg-teal-600 hover:bg-teal-700"
                  disabled={isSubmitting || therapyTypes.length === 0}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Client'
                  )}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
