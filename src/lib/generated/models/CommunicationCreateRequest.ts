/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request to create a communication style entry
 */
export type CommunicationCreateRequest = {
    method: CommunicationCreateRequest.method;
    proficiency: CommunicationCreateRequest.proficiency;
    notes?: string;
};
export namespace CommunicationCreateRequest {
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

