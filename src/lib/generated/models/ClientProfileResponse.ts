/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
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
};

