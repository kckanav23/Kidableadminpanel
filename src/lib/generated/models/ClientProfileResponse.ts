/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClientParentResponse } from './ClientParentResponse';
import type { CommunicationStyleResponse } from './CommunicationStyleResponse';
import type { InitialGoalResponse } from './InitialGoalResponse';
import type { SupportNetworkResponse } from './SupportNetworkResponse';
/**
 * Client profile with relationships
 */
export type ClientProfileResponse = {
    /**
     * Client identifier
     */
    id: string;
    /**
     * First name
     */
    firstName: string;
    /**
     * Last name
     */
    lastName: string;
    /**
     * Date of birth
     */
    dateOfBirth: string;
    /**
     * Age in years
     */
    age?: number;
    /**
     * Avatar/photo URL
     */
    photoUrl?: string;
    /**
     * Pronouns
     */
    pronouns?: string;
    /**
     * Therapies the client receives
     */
    therapies: Array<'ABA' | 'Speech' | 'OT'>;
    /**
     * Sensory profile as key/value map
     */
    sensoryProfile?: Record<string, any>;
    /**
     * Client preferences
     */
    preferences?: Array<string>;
    /**
     * Client dislikes
     */
    dislikes?: Array<string>;
    /**
     * Initial assessment notes
     */
    initialAssessment?: string;
    /**
     * Communication styles
     */
    communicationStyles?: Array<CommunicationStyleResponse>;
    /**
     * Support network contacts
     */
    supportNetwork?: Array<SupportNetworkResponse>;
    /**
     * Initial goals from intake
     */
    initialGoals?: Array<InitialGoalResponse>;
    /**
     * Parent relationships
     */
    clientParents?: Array<ClientParentResponse>;
};

