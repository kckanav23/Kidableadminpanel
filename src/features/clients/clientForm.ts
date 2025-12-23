import { calculateAge } from '@/lib/utils';

import { ClientCreateRequest } from '@/lib/generated';
import type { ClientCreateRequest as ClientCreateRequestType } from '@/lib/generated/models/ClientCreateRequest';
import type { ClientParentCreateRequest, TherapistAssignRequest } from '@/lib/generated';

export interface ClientFormData {
  // Step 1: Basic Information
  firstName: string;
  lastName: string;
  dateOfBirth: string; // YYYY-MM-DD
  therapyStartDate: string; // YYYY-MM-DD
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

export function getClientFormInitialValues(): ClientFormData {
  return {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    therapyStartDate: '',
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
  };
}

function parseLocalDate(value: string): Date {
  return new Date(`${value}T00:00:00`);
}

function toCsvList(value?: string): string[] | undefined {
  const items = value
    ? value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
    : [];
  return items.length > 0 ? items : undefined;
}

function mapTherapyType(type: ClientFormData['therapyTypes'][number]): ClientCreateRequestType['therapies'][number] {
  if (type === 'aba') return 'ABA';
  if (type === 'speech') return 'Speech';
  if (type === 'ot') return 'OT';
  // Exhaustive guard in case a new type is added without updating the mapper.
  throw new Error(`Unsupported therapy type: ${type satisfies never}`);
}

export type ClientCreateFlowRequests = {
  createClientRequest: ClientCreateRequestType;
  therapistAssignment?: TherapistAssignRequest;
  parentAssignment?: ClientParentCreateRequest;
};

/**
 * Data shaping layer: converts UI-friendly form values into API request DTOs.
 * Keeps API-specific knowledge out of UI components and makes API refactors safer.
 */
export function mapClientFormToCreateRequests(data: ClientFormData): ClientCreateFlowRequests {
  if (!data.firstName?.trim()) throw new Error('First name is required');
  if (!data.lastName?.trim()) throw new Error('Last name is required');
  if (!data.dateOfBirth) throw new Error('Date of birth is required');
  if (!data.therapyStartDate) throw new Error('Therapy start date is required');
  if (!data.therapyTypes || data.therapyTypes.length === 0) throw new Error('Please select at least one therapy type');

  if (data.status !== 'active' && data.status !== 'inactive' && data.status !== 'suspended') {
    throw new Error('Invalid status');
  }

  const dob = parseLocalDate(data.dateOfBirth);

  const createClientRequest: ClientCreateRequestType = {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    dateOfBirth: data.dateOfBirth,
    age: calculateAge(dob),
    photoUrl: data.photoUrl?.trim() ? data.photoUrl.trim() : undefined,
    therapyStartDate: data.therapyStartDate,
    therapies: data.therapyTypes.map(mapTherapyType),
    status:
      data.status === 'active'
        ? ClientCreateRequest.status.ACTIVE
        : data.status === 'inactive'
          ? ClientCreateRequest.status.INACTIVE
          : ClientCreateRequest.status.SUSPENDED,
    sensoryProfile:
      data.visual || data.auditory || data.tactile || data.vestibular || data.proprioceptive
        ? {
            ...(data.visual?.trim() ? { visual: data.visual.trim() } : {}),
            ...(data.auditory?.trim() ? { auditory: data.auditory.trim() } : {}),
            ...(data.tactile?.trim() ? { tactile: data.tactile.trim() } : {}),
            ...(data.vestibular?.trim() ? { vestibular: data.vestibular.trim() } : {}),
            ...(data.proprioceptive?.trim() ? { proprioceptive: data.proprioceptive.trim() } : {}),
          }
        : undefined,
    preferences: toCsvList(data.preferences),
    dislikes: toCsvList(data.dislikes),
    notes: data.communicationStyles?.trim() ? data.communicationStyles.trim() : undefined,
  };

  const therapistAssignment: TherapistAssignRequest | undefined = data.therapistId
    ? { therapistId: data.therapistId, primary: true }
    : undefined;

  if (data.parentAction !== 'existing' && data.parentAction !== 'new' && data.parentAction !== 'skip') {
    throw new Error('Invalid parent action');
  }

  let parentAssignment: ClientParentCreateRequest | undefined;
  if (data.parentAction === 'existing') {
    if (!data.existingParentId) throw new Error('Please select a parent');
    parentAssignment = {
      parentId: data.existingParentId,
      relationship: 'Parent',
      primary: data.isPrimaryParent === true,
    };
  } else if (data.parentAction === 'new') {
    if (!data.newParentFullName?.trim()) throw new Error('Parent name is required');
    if (!data.newParentRelationship?.trim()) throw new Error('Relationship is required');
    parentAssignment = {
      fullName: data.newParentFullName.trim(),
      email: data.newParentEmail?.trim() ? data.newParentEmail.trim() : undefined,
      phone: data.newParentPhone?.trim() ? data.newParentPhone.trim() : undefined,
      relationship: data.newParentRelationship.trim(),
      primary: data.isPrimaryParent === true,
    };
  }

  return { createClientRequest, therapistAssignment, parentAssignment };
}


