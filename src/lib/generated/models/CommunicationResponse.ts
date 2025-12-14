/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Communication style entry
 */
export type CommunicationResponse = {
    id?: string;
    method?: CommunicationResponse.method;
    proficiency?: CommunicationResponse.proficiency;
    notes?: string;
    createdAt?: string;
};
export namespace CommunicationResponse {
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

