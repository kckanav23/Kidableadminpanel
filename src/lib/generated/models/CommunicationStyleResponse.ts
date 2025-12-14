/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Communication style entry
 */
export type CommunicationStyleResponse = {
    /**
     * Communication method
     */
    method: CommunicationStyleResponse.method;
    /**
     * Proficiency
     */
    proficiency: CommunicationStyleResponse.proficiency;
    /**
     * Notes
     */
    notes?: string;
};
export namespace CommunicationStyleResponse {
    /**
     * Communication method
     */
    export enum method {
        VOCAL_SPEECH = 'vocal_speech',
        GESTURES = 'gestures',
        PICTURES = 'pictures',
        SIGN_LANGUAGE = 'sign_language',
        BODY_LANGUAGE = 'body_language',
        AAC = 'aac',
    }
    /**
     * Proficiency
     */
    export enum proficiency {
        PRIMARY = 'primary',
        EMERGING = 'emerging',
        NOT_USED = 'not_used',
    }
}

