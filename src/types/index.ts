// Core Types
export type UserRole = 'therapist' | 'admin';
export type TherapyType = 'aba' | 'speech' | 'ot';
export type Zone = 'green' | 'yellow' | 'orange' | 'red' | 'blue';
export type Status = 'active' | 'inactive' | 'on-hold' | 'suspended';
export type GoalStatus = 'active' | 'achieved' | 'on-hold' | 'discontinued';
export type HomeworkStatus = 'worked' | 'not-worked' | 'yet-to-try' | 'not-started';
export type StrategyType = 'antecedent' | 'reinforcement' | 'regulation';
export type ResourceType = 'pdf' | 'video' | 'article' | 'worksheet' | 'link';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  specializations?: TherapyType[];
  status: Status;
  lastLogin?: Date;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  age: number;
  therapyStartDate: Date;
  therapyTypes: TherapyType[];
  status: Status;
  primaryTherapistId: string;
  primaryCaregiverId: string;
  photoUrl?: string;
  sensoryProfile?: SensoryProfile;
  preferences?: string[];
  dislikes?: string[];
  communicationStyles?: string[];
}

export interface SensoryProfile {
  visual?: string;
  auditory?: string;
  tactile?: string;
  vestibular?: string;
  proprioceptive?: string;
}

export interface Goal {
  id: string;
  clientId: string;
  title: string;
  description: string;
  therapyType: TherapyType;
  baseline: number;
  target: number;
  current: number;
  status: GoalStatus;
  dueDate?: Date;
  createdDate: Date;
}

export interface Session {
  id: string;
  clientId: string;
  sessionNumber: number;
  date: Date;
  therapyType: TherapyType;
  zone: Zone;
  therapistId: string;
  longTermObjective: string;
  shortTermObjective: string;
  activities: Activity[];
  successes: string[];
  struggles: string[];
  interventions: string[];
  strategies: string[];
  reinforcements: string[];
  notes?: string;
  discussedWithParent: boolean;
}

export interface Activity {
  id: string;
  name: string;
  antecedent: string;
  behavior: string;
  consequence: string;
  promptType?: string;
}

export interface Homework {
  id: string;
  clientId: string;
  title: string;
  description: string;
  purpose: string;
  instructions?: string;
  therapyType: TherapyType;
  status: HomeworkStatus;
  assignedDate: Date;
  assignedById: string;
  goalId?: string;
  completionCount: number;
}

export interface HomeworkCompletion {
  id: string;
  homeworkId: string;
  completionDate: Date;
  frequencyCount?: number;
  durationMinutes?: number;
  status: HomeworkStatus;
  notes?: string;
  loggedByParent?: string;
}

export interface Strategy {
  id: string;
  title: string;
  description: string;
  type: StrategyType;
  targetZone?: Zone;
  whenToUse: string;
  howToUse: string;
  examples?: string[];
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  category: string;
  url: string;
  fileSize?: string;
}

export interface JournalEntry {
  id: string;
  clientId: string;
  date: Date;
  zone: Zone;
  energyGivers: string[];
  energyDrainers: string[];
  relaxingActivity?: string;
  notes?: string;
  tags: string[];
  loggedBy: string;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
  status: Status;
  childrenIds: string[];
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details: string;
}