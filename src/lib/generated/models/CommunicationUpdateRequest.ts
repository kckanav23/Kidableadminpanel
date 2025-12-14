/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request to update a communication style entry
 */
export type CommunicationUpdateRequest = {
    method?: CommunicationUpdateRequest.method;
    proficiency?: CommunicationUpdateRequest.proficiency;
    notes?: string;
};
export namespace CommunicationUpdateRequest {
    export enum method {
        VOCAL_SPEECH = 'vocal_speech',
        GESTURES = 'gestures',
        PICTURES = 'pictures',
        SIGN_LANGUAGE = 'sign_language',
        BODY_LANGUAGE = 'body_language',
        AAC = 'aac',
    }
    export enum proficiency {
        PRIMARY = 'primary',
        EMERGING = 'emerging',
        NOT_USED = 'not_used',
    }
}

