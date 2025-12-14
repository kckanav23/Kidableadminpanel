/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SessionActivityCreateRequest = {
    sequenceOrder: number;
    activity: string;
    antecedent?: string;
    behaviour?: string;
    consequences?: string;
    promptType?: SessionActivityCreateRequest.promptType;
};
export namespace SessionActivityCreateRequest {
    export enum promptType {
        FULL_PHYSICAL = 'full_physical',
        PARTIAL_PHYSICAL = 'partial_physical',
        VERBAL = 'verbal',
        TEXTUAL = 'textual',
        GESTURAL = 'gestural',
        INDEPENDENT = 'independent',
    }
}

